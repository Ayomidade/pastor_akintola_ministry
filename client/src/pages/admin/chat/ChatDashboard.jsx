// src/pages/admin/chat/ChatDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../../../services/chat.service.js";
import { useSocket } from "../../../context/SocketContext.jsx";
import { MessageCircle, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function ChatDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();

  const fetch = () => {
    chatService
      .getAllSessions()
      .then((res) => setSessions(res.data.sessions || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("new_visitor_message", fetch);
    socket.on("unread_count_changed", fetch);
    return () => {
      socket.off("new_visitor_message", fetch);
      socket.off("unread_count_changed", fetch);
    };
  }, [socket]);

  const statusColor = {
    open: "#f59e0b",
    active: "#22c55e",
    closed: "var(--border)",
  };

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Counselling Chat</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {
            sessions.filter((s) => !s.isReadByAdmin && s.status !== "closed")
              .length
          }{" "}
          unread sessions
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid var(--border)",
              borderTopColor: "var(--gold)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : sessions.length === 0 ? (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: 64,
            textAlign: "center",
          }}
        >
          <MessageCircle
            size={48}
            color="var(--border)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--text-muted)" }}>No chat sessions yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/admin/chat/${s._id}`)}
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
                border: `1px solid ${!s.isReadByAdmin && s.status !== "closed" ? "var(--gold)" : "var(--border)"}`,
                cursor: "pointer",
                transition: "var(--transition)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-md)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "var(--navy)",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {s.visitorName?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 15 }}>
                    {s.visitorName}
                  </p>
                  {!s.isReadByAdmin && s.status !== "closed" && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--gold)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Clock size={11} />{" "}
                  {formatDistanceToNow(new Date(s.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusColor[s.status] || "var(--border)",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "var(--text-muted)",
                  }}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
