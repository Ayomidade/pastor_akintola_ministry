// src/pages/admin/posts/CreatePost.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postService } from "../../../services/post.service.js";
import { ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CATEGORIES = [
  "Faith",
  "Prayer",
  "Devotional",
  "Announcements",
  "General",
];
const POST_TYPES = ["article", "devotional", "announcement"];

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "General",
    postType: "article",
    scripture: "",
    tags: "",
  });
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Content is required.");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      fd.append("content", content);
      if (image) fd.append("image", image);
      if (form.tags)
        fd.append(
          "tags",
          JSON.stringify(
            form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        );
      await postService.create(fd);
      toast.success("Post created!");
      navigate("/admin/posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 900, margin: "0 auto" }}>
      <Link
        to="/admin/posts"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 28,
        }}
      >
        <ArrowLeft size={14} /> Back to Posts
      </Link>
      <h1 style={{ fontSize: 26, marginBottom: 32 }}>Create New Post</h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Main */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                border: "1px solid var(--border)",
              }}
            >
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  style={{ fontSize: 18, fontFamily: "var(--font-display)" }}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  placeholder="Post title..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Scripture Reference</label>
                <input
                  className="form-input"
                  value={form.scripture}
                  onChange={(e) => set("scripture", e.target.value)}
                  placeholder="e.g. John 3:16"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content *</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  style={{ background: "var(--white)" }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                border: "1px solid var(--border)",
              }}
            >
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Post Settings</h3>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Post Type</label>
                <select
                  className="form-input"
                  value={form.postType}
                  onChange={(e) => set("postType", e.target.value)}
                >
                  {POST_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  className="form-input"
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="faith, prayer, grace"
                />
              </div>
            </div>

            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                border: "1px solid var(--border)",
              }}
            >
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Featured Image</h3>
              <label
                style={{
                  display: "block",
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Upload
                      size={28}
                      style={{ margin: "0 auto 8px", opacity: 0.5 }}
                    />
                    <p style={{ fontSize: 13 }}>Click to upload image</p>
                    <p style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  style={{
                    marginTop: 8,
                    background: "none",
                    border: "none",
                    color: "#e53e3e",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Remove image
                </button>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          form > div { grid-template-columns: 1fr !important; }
        }
        .ql-container { font-size: 15px; min-height: 300px; }
        .ql-editor { min-height: 300px; }
      `}</style>
    </div>
  );
}
