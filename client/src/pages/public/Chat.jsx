// src/pages/public/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useVisitorAuth } from "../../context/VisitorAuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { chatService } from "../../services/chat.service.js";
import { Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Chat() {
  const { visitor } = useVisitorAuth();
  const { socket } = useSocket();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatService
      .startSession()
      .then((res) => {
        setSession(res.data.session);
        return chatService.getSessionMessages(res.data.session._id);
      })
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Could not start session."),
      );
  }, []);

  useEffect(() => {
    if (!socket || !session) return;
    socket.emit("join_session", { sessionId: session._id, role: "visitor" });
    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg]),
    );
    socket.on("typing", ({ sender }) => {
      if (sender === "admin") setAdminTyping(true);
    });
    socket.on("stop_typing", ({ sender }) => {
      if (sender === "admin") setAdminTyping(false);
    });
    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, session]);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || !session) return;
    socket.emit("send_message", {
      sessionId: session._id,
      sender: "visitor",
      senderName: visitor.name,
      message: text.trim(),
    });
    socket.emit("stop_typing", { sessionId: session._id, sender: "visitor" });
    setText("");
  };

  const handleTyping = (val) => {
    setText(val);
    if (!socket || !session) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { sessionId: session._id, sender: "visitor" });
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      socket.emit("stop_typing", { sessionId: session._id, sender: "visitor" });
    }, 2000);
  };

  return (
    <div
      style={{
        paddingTop: 80,
        background: "var(--cream)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "var(--navy)",
          padding: "20px 0",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid var(--gold)",
              }}
            >
              <img
                src="/pastor_image_1.jpg"
                alt="Pastor"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Pastor Daniel Akintola
              </p>
              <p
                style={{
                  fontSize: 12,
                  color:
                    session?.status === "active"
                      ? "#22c55e"
                      : "rgba(248,245,239,0.5)",
                }}
              >
                {session?.status === "active"
                  ? "● Online"
                  : "● Waiting for Pastor..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          maxWidth: 760,
        }}
      >
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingBottom: 16,
            minHeight: 400,
            maxHeight: "60vh",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--text-muted)",
              }}
            >
              <MessageCircle
                size={40}
                style={{ margin: "0 auto 12px", opacity: 0.3 }}
              />
              <p style={{ fontSize: 14 }}>
                Your conversation will appear here.
                <br />
                The pastor will respond shortly.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "visitor" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  background:
                    msg.sender === "visitor" ? "var(--gold)" : "var(--white)",
                  color:
                    msg.sender === "visitor"
                      ? "var(--navy)"
                      : "var(--text-primary)",
                  borderRadius:
                    msg.sender === "visitor"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{msg.message}</p>
                <p
                  style={{
                    fontSize: 10,
                    opacity: 0.6,
                    marginTop: 4,
                    textAlign: "right",
                  }}
                >
                  {format(new Date(msg.createdAt), "h:mm a")}
                </p>
              </div>
            </div>
          ))}
          {adminTyping && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

        <form
          onSubmit={handleSend}
          style={{
            display: "flex",
            gap: 12,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <input
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "14px 18px",
              border: "1px solid var(--border)",
              borderRadius: 24,
              fontSize: 14,
              background: "var(--white)",
              outline: "none",
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
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
