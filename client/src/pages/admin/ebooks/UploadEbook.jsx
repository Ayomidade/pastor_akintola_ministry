// src/pages/admin/ebooks/UploadEbook.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ebookService } from "../../../services/ebook.service.js";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function UploadEbook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "Pastor Daniel Akintola",
    description: "",
    category: "General",
    isFree: "true",
  });
  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdf) return toast.error("PDF file is required.");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("pdf", pdf);
      if (cover) fd.append("cover", cover);
      await ebookService.upload(fd);
      toast.success("Ebook uploaded!");
      navigate("/admin/ebooks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 860, margin: "0 auto" }}>
      <Link
        to="/admin/ebooks"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 28,
        }}
      >
        <ArrowLeft size={14} /> Back to Ebooks
      </Link>
      <h1 style={{ fontSize: 26, marginBottom: 32 }}>Upload Ebook</h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
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
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  className="form-input"
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {[
                      "General",
                      "Devotional",
                      "Bible Study",
                      "Prayer",
                      "Marriage",
                      "Finance",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <select
                    className="form-input"
                    value={form.isFree}
                    onChange={(e) => set("isFree", e.target.value)}
                  >
                    <option value="true">Free</option>
                    <option value="false">Paid</option>
                  </select>
                </div>
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
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>PDF File *</h3>
              <label
                style={{
                  display: "block",
                  border: `2px dashed ${pdf ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  padding: 32,
                  textAlign: "center",
                }}
              >
                <FileText
                  size={32}
                  style={{
                    margin: "0 auto 12px",
                    color: pdf ? "var(--accent)" : "var(--border)",
                  }}
                />
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: pdf ? "var(--primary)" : "var(--text-muted)",
                  }}
                >
                  {pdf ? pdf.name : "Click to upload PDF"}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  PDF files only
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </label>
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
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Cover Image</h3>
              <label
                style={{
                  display: "block",
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt=""
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
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
                      size={24}
                      style={{ margin: "0 auto 8px", opacity: 0.4 }}
                    />
                    <p style={{ fontSize: 13 }}>Upload cover image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setCover(e.target.files[0]);
                    setCoverPreview(URL.createObjectURL(e.target.files[0]));
                  }}
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
              {loading ? "Uploading..." : "Upload Ebook"}
            </button>
          </div>
        </div>
      </form>
      <style>{`@media(max-width:768px){form>div{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
