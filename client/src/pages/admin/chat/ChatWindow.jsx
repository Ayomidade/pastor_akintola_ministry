// src/pages/admin/chat/ChatWindow.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { chatService } from "../../../services/chat.service.js";
import { useSocket } from "../../../context/SocketContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { Send, ArrowLeft, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function ChatWindow() {
  const { sessionId } = useParams();
  const { admin } = useAuth();
  const { socket } = useSocket();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [visitorTyping, setVisitorTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    chatService
      .getAdminSessionMessages(sessionId)
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => toast.error("Could not load messages."));

    chatService.getAllSessions().then((res) => {
      const s = res.data.sessions?.find((x) => x._id === sessionId);
      setSession(s || null);
    });
  }, [sessionId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_session", { sessionId, role: "admin" });
    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg]),
    );
    socket.on("typing", ({ sender }) => {
      if (sender === "visitor") setVisitorTyping(true);
    });
    socket.on("stop_typing", ({ sender }) => {
      if (sender === "visitor") setVisitorTyping(false);
    });
    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, visitorTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit("send_message", {
      sessionId,
      sender: "admin",
      senderName: admin?.name || "Pastor Daniel Akintola",
      message: text.trim(),
    });
    socket.emit("stop_typing", { sessionId, sender: "admin" });
    setText("");
  };

  const handleTyping = (val) => {
    setText(val);
    if (!socket) return;
    socket.emit("typing", { sessionId, sender: "admin" });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socket.emit("stop_typing", { sessionId, sender: "admin" }),
      2000,
    );
  };

  const handleClose = async () => {
    try {
      await chatService.closeSession(sessionId);
      toast.success("Session closed.");
      setSession((s) => ({ ...s, status: "closed" }));
    } catch {
      toast.error("Could not close session.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--white)",
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/admin/chat"
            style={{ color: "var(--text-muted)", display: "flex" }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "var(--navy)",
              fontSize: 15,
            }}
          >
            {session?.visitorName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>
              {session?.visitorName || "Visitor"}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "capitalize",
              }}
            >
              {session?.status || "..."}
            </p>
          </div>
        </div>
        {session?.status !== "closed" && (
          <button
            onClick={handleClose}
            className="btn btn-outline btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <X size={12} /> Close Session
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "var(--cream)",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "40px 0",
            }}
          >
            <p style={{ fontSize: 14 }}>
              No messages yet. The visitor will begin shortly.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "admin" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "65%",
                padding: "12px 16px",
                background:
                  msg.sender === "admin" ? "var(--navy)" : "var(--white)",
                color:
                  msg.sender === "admin"
                    ? "var(--cream)"
                    : "var(--text-primary)",
                borderRadius:
                  msg.sender === "admin"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>{msg.message}</p>
              <p
                style={{
                  fontSize: 10,
                  opacity: 0.5,
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {format(new Date(msg.createdAt), "h:mm a")}
              </p>
            </div>
          </div>
        ))}
        {visitorTyping && (
          <div style={{ display: "flex" }}>
            <div
              style={{
                background: "var(--white)",
                padding: "10px 16px",
                borderRadius: "16px 16px 16px 4px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      animation: `bounce 1s infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {session?.status !== "closed" ? (
        <form
          onSubmit={handleSend}
          style={{
            padding: "16px 20px",
            background: "var(--white)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <input
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: 24,
              fontSize: 14,
              outline: "none",
              background: "var(--cream)",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: 24, padding: "12px 20px" }}
            disabled={!text.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      ) : (
        <div
          style={{
            padding: "16px 20px",
            background: "var(--cream-dark)",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            This session has been closed.
          </p>
        </div>
      )}

      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
