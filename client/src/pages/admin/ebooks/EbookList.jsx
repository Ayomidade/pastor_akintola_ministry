// src/pages/admin/ebooks/EbookList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ebookService } from "../../../services/ebook.service.js";
import ConfirmModal from "../../../components/shared/ConfirmModal.jsx";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EbookList() {
  const [ebooks, setEbooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  // const [publishing, setPublishing] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const fetch = () => {
    setLoading(true);
    ebookService
      .getAll({ limit: 50 })
      .then((res) => {
        setEbooks(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async () => {
    try {
      await ebookService.delete(deleting);
      toast.success("Ebook deleted.");
      setDeleting(null);
      fetch();
    } catch {
      toast.error("Could not delete ebook.");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    // console.log(isPublished)
    try {
      await ebookService.update(id, { isPublished: updatedStatus });
      toast.success(updatedStatus ? "Ebook published." : "Ebook unpublished.");
      fetch();
    } catch {
      toast.error("Could not update ebook.");
    }
  };

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
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Ebooks</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {total} total ebooks
          </p>
        </div>
        <Link
          to="/admin/ebooks/upload"
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={16} /> Upload Ebook
        </Link>
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
      ) : ebooks.length === 0 ? (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: 64,
            textAlign: "center",
          }}
        >
          <BookOpen
            size={40}
            color="var(--border)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
            No ebooks yet.
          </p>
          <Link to="/admin/ebooks/upload" className="btn btn-primary btn-sm">
            Upload first ebook
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {ebooks.map((eb) => (
            <div key={eb._id} className="card">
              <img
                src={
                  eb.coverImage?.url ||
                  "https://placehold.co/300x200/0D1B2A/C9A84C?text=Ebook"
                }
                alt={eb.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span className="tag" style={{ fontSize: 9 }}>
                    {eb.category}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "var(--radius)",
                      background: eb.isPublished ? "#f0fdf4" : "#fef9c3",
                      color: eb.isPublished ? "#16a34a" : "#a16207",
                    }}
                  >
                    {eb.isPublished ? "Live" : "Draft"}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>
                  {eb.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginBottom: 12,
                  }}
                >
                  By {eb.author}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Download size={12} /> {eb.downloadCount}
                  </span>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      // onClick={() => handleToggle(eb._id, eb.isPublished)}
                      style={{
                        background: "none",
                        border: "none",
                        color: eb.isPublished
                          ? "var(--gold)"
                          : "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      {eb.isPublished ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                    <Link
                      to={`/admin/ebooks/edit/${eb._id}`}
                      style={{ color: "var(--text-muted)", display: "flex" }}
                    >
                      <Edit size={15} />
                    </Link>
                    <button
                      onClick={() => setDeleting(eb._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e53e3e",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Ebook"
        message="This will permanently delete the ebook and PDF file."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
