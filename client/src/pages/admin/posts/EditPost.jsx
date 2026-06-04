// src/pages/admin/posts/EditPost.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    postType: "",
    scripture: "",
    tags: "",
  });
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    postService
      .getById(id)
      .then((res) => {
        const p = res.data.post;
        setForm({
          title: p.title,
          category: p.category,
          postType: p.postType,
          scripture: p.scripture || "",
          tags: p.tags?.join(", ") || "",
        });
        setContent(p.content);
        setPreview(p.featuredImage?.url || null);
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await postService.update(id, fd);
      toast.success("Post updated!");
      navigate("/admin/posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update post.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid var(--border)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

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
      <h1 style={{ fontSize: 26, marginBottom: 32 }}>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 24,
            alignItems: "start",
          }}
        >
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
                />
              </div>
              <div className="form-group">
                <label className="form-label">Scripture Reference</label>
                <input
                  className="form-input"
                  value={form.scripture}
                  onChange={(e) => set("scripture", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content *</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
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
                      height: 160,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Upload
                      size={24}
                      style={{ margin: "0 auto 8px", opacity: 0.5 }}
                    />
                    <p style={{ fontSize: 13 }}>Click to replace image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          form > div { grid-template-columns: 1fr !important; }
        }
        .ql-editor { min-height: 280px; }
      `}</style>
    </div>
  );
}
