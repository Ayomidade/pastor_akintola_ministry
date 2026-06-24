// src/pages/admin/sermons/SermonList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sermonService } from "../../../services/sermon.service.js";
import ConfirmModal from "../../../components/shared/ConfirmModal.jsx";
import { Plus, Edit, Trash2, Eye, EyeOff, Headphones } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function SermonList() {
  const [sermons, setSermons] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetch = () => {
    setLoading(true);
    sermonService
      .getAll({ page, limit: 10 })
      .then((res) => {
        setSermons(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, [page]);

  const handleDelete = async () => {
    try {
      await sermonService.delete(deleting);
      toast.success("Sermon deleted.");
      setDeleting(null);
      fetch();
    } catch {
      toast.error("Could not delete sermon.");
    }
  };

  const handleToggle = async (id) => {
    try {
      await sermonService.togglePublish(id);
      toast.success("Sermon updated.");
      fetch();
    } catch {
      toast.error("Could not update sermon.");
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
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Sermons</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {total} total sermons
          </p>
        </div>
        <Link
          to="/admin/sermons/create"
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={16} /> Upload Sermon
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
        ) : sermons.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <Headphones
              size={40}
              color="var(--border)"
              style={{ margin: "0 auto 16px" }}
            />
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              No sermons yet.
            </p>
            <Link to="/admin/sermons/create" className="btn btn-primary btn-sm">
              Upload first sermon
            </Link>
          </div>
        ) : (
          <>
            <div className="desktop-table">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--border)",
                      background: "var(--cream)",
                    }}
                  >
                    {[
                      "Title",
                      "Series",
                      "Stats",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
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
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sermons.map((s, i) => (
                    <tr
                      key={s._id}
                      style={{
                        borderBottom:
                          i < sermons.length - 1
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
                              s.thumbnail?.url ||
                              "https://placehold.co/40x40/0D1B2A/C9A84C?text=S"
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
                            <p style={{ fontWeight: 600, fontSize: 14 }}>
                              {s.title}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                              }}
                            >
                              {s.preacher}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {s.series ? (
                          <span className="tag" style={{ fontSize: 10 }}>
                            {s.series}
                          </span>
                        ) : (
                          <span
                            style={{ color: "var(--border)", fontSize: 12 }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        <div>▶ {s.listenCount}</div>
                        <div>↓ {s.downloadCount}</div>
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
                            background: s.isPublished ? "#f0fdf4" : "#fef9c3",
                            color: s.isPublished ? "#16a34a" : "#a16207",
                          }}
                        >
                          {s.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "var(--text-muted)",
                        }}
                      >
                        {format(new Date(s.date), "MMM d, yyyy")}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleToggle(s._id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: s.isPublished
                                ? "var(--accent)"
                                : "var(--text-muted)",
                              cursor: "pointer",
                              padding: 4,
                            }}
                          >
                            {s.isPublished ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <Link
                            to={`/admin/sermons/edit/${s._id}`}
                            style={{
                              color: "var(--text-muted)",
                              padding: 4,
                              display: "flex",
                            }}
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleting(s._id)}
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

            <div
              className="mobile-cards"
              style={{
                display: "none",
                flexDirection: "column",
                gap: 12,
                padding: 16,
              }}
            >
              {sermons.map((s) => (
                <div
                  key={s._id}
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
                        s.thumbnail?.url ||
                        "https://placehold.co/48x48/0D1B2A/C9A84C?text=S"
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
                          marginBottom: 2,
                        }}
                      >
                        {s.title}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginBottom: 4,
                        }}
                      >
                        {s.preacher}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "var(--radius)",
                            background: s.isPublished ? "#f0fdf4" : "#fef9c3",
                            color: s.isPublished ? "#16a34a" : "#a16207",
                          }}
                        >
                          {s.isPublished ? "Published" : "Draft"}
                        </span>
                        {s.series && (
                          <span className="tag" style={{ fontSize: 9 }}>
                            {s.series}
                          </span>
                        )}
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
                      ▶ {s.listenCount} • ↓ {s.downloadCount}
                    </span>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={() => handleToggle(s._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: s.isPublished
                            ? "var(--accent)"
                            : "var(--text-muted)",
                          cursor: "pointer",
                        }}
                      >
                        {s.isPublished ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <Link
                        to={`/admin/sermons/edit/${s._id}`}
                        style={{ color: "var(--text-muted)", display: "flex" }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleting(s._id)}
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
        title="Delete Sermon"
        message="This will permanently delete the sermon and its audio file from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <style>{`@media(max-width:768px){.desktop-table{display:none!important}.mobile-cards{display:flex!important}}`}</style>
    </div>
  );
}
