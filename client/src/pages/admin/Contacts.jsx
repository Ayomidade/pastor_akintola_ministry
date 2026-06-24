// src/pages/admin/Contacts.jsx
import { useState, useEffect } from "react";
import { contactService } from "../../services/contact.service.js";
import ConfirmModal from "../../components/shared/ConfirmModal.jsx";
import { Trash2, CheckCircle, Mail } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetch = () => {
    setLoading(true);
    contactService
      .getAll(type !== "all" ? { type } : {})
      .then((res) => setContacts(res.data.contacts || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, [type]);

  const handleRead = async (id) => {
    try {
      await contactService.markRead(id);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isRead: true } : c)),
      );
    } catch {
      toast.error("Could not mark as read.");
    }
  };

  const handleDelete = async () => {
    try {
      await contactService.delete(deleting);
      toast.success("Deleted.");
      setDeleting(null);
      fetch();
    } catch {
      toast.error("Could not delete.");
    }
  };

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>
          Messages & Prayer Requests
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {contacts.filter((c) => !c.isRead).length} unread
        </p>
      </div>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}
      >
        {[
          ["all", "All"],
          ["contact", "Messages"],
          ["prayer", "Prayer Requests"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setType(v)}
            style={{
              padding: "8px 20px",
              border: "2px solid",
              borderRadius: "var(--radius)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
              background: type === v ? "var(--accent)" : "transparent",
              borderColor: type === v ? "var(--accent)" : "var(--border)",
              color: type === v ? "var(--primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid var(--border)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : contacts.length === 0 ? (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: 64,
            textAlign: "center",
          }}
        >
          <Mail
            size={40}
            color="var(--border)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--text-muted)" }}>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {contacts.map((c) => (
            <div
              key={c._id}
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${!c.isRead ? "var(--accent)" : "var(--border)"}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  flexWrap: "wrap",
                  gap: 8,
                }}
                onClick={() => {
                  setExpanded(expanded === c._id ? null : c._id);
                  if (!c.isRead) handleRead(c._id);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!c.isRead && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {c.subject || c.type} •{" "}
                      {format(new Date(c.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "var(--radius)",
                      background:
                        c.type === "prayer"
                          ? "rgba(201,168,76,0.15)"
                          : "rgba(59,130,246,0.1)",
                      color:
                        c.type === "prayer" ? "var(--accent-dark)" : "#3b82f6",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.type === "prayer" ? "Prayer" : "Message"}
                  </span>
                  {c.isRead && <CheckCircle size={14} color="#16a34a" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleting(c._id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e53e3e",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {expanded === c._id && (
                <div
                  style={{
                    padding: "16px 20px",
                    borderTop: "1px solid var(--border)",
                    background: "var(--cream)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    {[
                      ["Email", c.email],
                      ["Phone", c.phone || "—"],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <p
                          style={{
                            fontSize: 10,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            marginBottom: 2,
                          }}
                        >
                          {l}
                        </p>
                        <p style={{ fontSize: 13 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {c.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
