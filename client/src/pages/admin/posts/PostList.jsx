// src/pages/admin/posts/PostList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postService } from "../../../services/post.service.js";
import ConfirmModal from "../../../components/shared/ConfirmModal.jsx";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchPosts = () => {
    setLoading(true);
    postService
      .getAll({ page, limit: 10 })
      .then((res) => {
        setPosts(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleDelete = async () => {
    try {
      await postService.delete(deleting);
      toast.success("Post deleted.");
      setDeleting(null);
      fetchPosts();
    } catch {
      toast.error("Could not delete post.");
    }
  };

  const handleToggle = async (id) => {
    try {
      await postService.togglePublish(id);
      toast.success("Post updated.");
      fetchPosts();
    } catch {
      toast.error("Could not update post.");
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div style={{ padding: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Posts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {total} total posts
          </p>
        </div>
        <Link
          to="/admin/posts/create"
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
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
        ) : posts.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              No posts yet.
            </p>
            <Link to="/admin/posts/create" className="btn btn-primary btn-sm">
              Create your first post
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="desktop-table">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--border)",
                      background: "var(--cream)",
                    }}
                  >
                    {["Title", "Category", "Status", "Date", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p, i) => (
                    <tr
                      key={p._id}
                      style={{
                        borderBottom:
                          i < posts.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <img
                            src={
                              p.featuredImage?.url ||
                              "https://placehold.co/40x40/0D1B2A/C9A84C?text=P"
                            }
                            alt=""
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "var(--radius)",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <p
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: "var(--primary)",
                              }}
                            >
                              {p.title}
                            </p>
                            {p.scripture && (
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "var(--accent)",
                                  fontStyle: "italic",
                                }}
                              >
                                {p.scripture}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className="tag">{p.category}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: "var(--radius)",
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            background: p.isPublished ? "#f0fdf4" : "#fef9c3",
                            color: p.isPublished ? "#16a34a" : "#a16207",
                          }}
                        >
                          {p.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "var(--text-muted)",
                        }}
                      >
                        {format(new Date(p.createdAt), "MMM d, yyyy")}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleToggle(p._id)}
                            title={p.isPublished ? "Unpublish" : "Publish"}
                            style={{
                              background: "none",
                              border: "none",
                              color: p.isPublished
                                ? "var(--accent)"
                                : "var(--text-muted)",
                              cursor: "pointer",
                              padding: 4,
                            }}
                          >
                            {p.isPublished ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <Link
                            to={`/admin/posts/edit/${p._id}`}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--text-muted)",
                              cursor: "pointer",
                              padding: 4,
                              display: "flex",
                            }}
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleting(p._id)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div
              className="mobile-cards"
              style={{
                display: "none",
                flexDirection: "column",
                gap: 12,
                padding: 16,
              }}
            >
              {posts.map((p) => (
                <div
                  key={p._id}
                  style={{
                    background: "var(--cream)",
                    borderRadius: "var(--radius-lg)",
                    padding: 16,
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <img
                      src={
                        p.featuredImage?.url ||
                        "https://placehold.co/48x48/0D1B2A/C9A84C?text=P"
                      }
                      alt=""
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "var(--radius)",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        {p.title}
                      </p>
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <span className="tag" style={{ fontSize: 9 }}>
                          {p.category}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "var(--radius)",
                            background: p.isPublished ? "#f0fdf4" : "#fef9c3",
                            color: p.isPublished ? "#16a34a" : "#a16207",
                          }}
                        >
                          {p.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {format(new Date(p.createdAt), "MMM d, yyyy")}
                    </span>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={() => handleToggle(p._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: p.isPublished
                            ? "var(--accent)"
                            : "var(--text-muted)",
                          cursor: "pointer",
                        }}
                      >
                        {p.isPublished ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <Link
                        to={`/admin/posts/edit/${p._id}`}
                        style={{ color: "var(--text-muted)", display: "flex" }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleting(p._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#e53e3e",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  width: 36,
                  height: 36,
                  border: "2px solid",
                  borderColor:
                    page === i + 1 ? "var(--accent)" : "var(--border)",
                  background: page === i + 1 ? "var(--accent)" : "transparent",
                  color:
                    page === i + 1 ? "var(--primary)" : "var(--text-secondary)",
                  borderRadius: "var(--radius)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Post"
        message="This will permanently delete the post and its featured image. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />

      <style>{`
        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-cards { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
