// src/pages/admin/media/MediaLibrary.jsx
import { useState, useEffect, useRef } from "react";
import { mediaService } from "../../../services/media.service.js";
import ConfirmModal from "../../../components/shared/ConfirmModal.jsx";
import { Upload, Trash2, Image } from "lucide-react";
import toast from "react-hot-toast";

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const fileRef = useRef();

  const fetch = () => {
    setLoading(true);
    mediaService
      .getAll()
      .then((res) => setMedia(res.data.media || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      fd.append("type", "image");
      await mediaService.upload(fd);
      toast.success(`${files.length} file(s) uploaded.`);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      await mediaService.delete(deleting);
      toast.success("Deleted.");
      setDeleting(null);
      fetch();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await mediaService.deleteBulk(selected);
      toast.success(`${selected.length} item(s) deleted.`);
      setSelected([]);
      setBulkConfirm(false);
      fetch();
    } catch {
      toast.error("Bulk delete failed.");
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Media Library</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {media.length} files
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {selected.length > 0 && (
            <button
              onClick={() => setBulkConfirm(true)}
              className="btn btn-danger btn-sm"
            >
              <Trash2 size={14} /> Delete {selected.length} selected
            </button>
          )}
          <button
            onClick={() => fileRef.current.click()}
            className="btn btn-primary"
            disabled={uploading}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Upload size={16} /> {uploading ? "Uploading..." : "Upload Images"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)" }}
              />
            ))}
        </div>
      ) : media.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
          }}
        >
          <Image
            size={48}
            color="var(--border)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            No media yet.
          </p>
          <button
            onClick={() => fileRef.current.click()}
            className="btn btn-primary btn-sm"
          >
            Upload your first images
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {media.map((item) => (
            <div
              key={item._id}
              style={{
                position: "relative",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                aspectRatio: "1",
                border: selected.includes(item._id)
                  ? "3px solid var(--gold)"
                  : "3px solid transparent",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <img
                src={item.url}
                alt={item.caption || ""}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onClick={() => setLightbox(item)}
              />
              <div style={{ position: "absolute", top: 8, left: 8 }}>
                <input
                  type="checkbox"
                  checked={selected.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--gold)",
                    cursor: "pointer",
                  }}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleting(item._id);
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(229,62,62,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <Trash2 size={12} />
              </button>
              {item.caption && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    padding: "16px 8px 6px",
                    fontSize: 11,
                    color: "white",
                  }}
                >
                  {item.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,27,42,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox.url}
            alt=""
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "var(--radius-lg)",
            }}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Media"
        message="This will permanently delete this file from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <ConfirmModal
        isOpen={bulkConfirm}
        title={`Delete ${selected.length} Files`}
        message="This will permanently delete all selected files. This cannot be undone."
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkConfirm(false)}
        confirmLabel="Delete All"
      />
    </div>
  );
}
