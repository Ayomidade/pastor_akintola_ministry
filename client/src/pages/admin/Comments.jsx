// src/pages/admin/Comments.jsx
import { useState, useEffect } from "react";
import { commentService } from "../../services/comment.service.js";
import ConfirmModal from "../../components/shared/ConfirmModal.jsx";
import { Check, Trash2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);

  const fetch = () => {
    setLoading(true);
    commentService
      .getAllAdmin()
      .then((res) => setComments(res.data.comments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleApprove = async (id) => {
    try {
      await commentService.approve(id);
      toast.success("Comment approved.");
      fetch();
    } catch {
      toast.error("Could not approve comment.");
    }
  };

  const handleDelete = async () => {
    try {
      await commentService.delete(deleting);
      toast.success("Comment deleted.");
      setDeleting(null);
      fetch();
    } catch {
      toast.error("Could not delete comment.");
    }
  };

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.isApproved;
    if (filter === "approved") return c.isApproved;
    return true;
  });

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Comments</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {comments.filter((c) => !c.isApproved).length} pending approval
        </p>
      </div>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}
      >
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 20px",
              border: "2px solid",
              borderRadius: "var(--radius)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
              background: filter === f ? "var(--accent)" : "transparent",
              borderColor: filter === f ? "var(--accent)" : "var(--border)",
              color: filter === f ? "var(--primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}{" "}
            {f === "pending"
              ? `(${comments.filter((c) => !c.isApproved).length})`
              : ""}
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
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: 64,
            textAlign: "center",
          }}
        >
          <MessageSquare
            size={40}
            color="var(--border)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--text-muted)" }}>No comments found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((c) => (
            <div
              key={c._id}
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                border: `1px solid ${!c.isApproved ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "var(--primary)",
                        fontSize: 13,
                      }}
                    >
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginLeft: 42,
                    }}
                  >
                    {format(new Date(c.createdAt), "MMM d, yyyy • h:mm a")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "var(--radius)",
                      background: c.isApproved ? "#f0fdf4" : "#fef9c3",
                      color: c.isApproved ? "#16a34a" : "#a16207",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.isApproved ? "Approved" : "Pending"}
                  </span>
                  {!c.isApproved && (
                    <button
                      onClick={() => handleApprove(c._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "6px 12px",
                        background: "var(--accent)",
                        border: "none",
                        borderRadius: "var(--radius)",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        color: "var(--primary)",
                      }}
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => setDeleting(c._id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e53e3e",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  paddingLeft: 42,
                }}
              >
                {c.body}
              </p>
              {c.parentId && (
                <div style={{ marginTop: 8, paddingLeft: 42 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    ↩ Reply
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Comment"
        message="This will also delete all replies to this comment."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
