// src/pages/admin/sermons/CreateSermon.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sermonService } from "../../../services/sermon.service.js";
import { ArrowLeft, Upload, Music } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateSermon() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    preacher: "Pastor Daniel Akintola",
    series: "",
    date: "",
    tags: "",
  });
  const [audio, setAudio] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audio) return toast.error("Audio file is required.");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      fd.append("audio", audio);
      if (thumbnail) fd.append("thumbnail", thumbnail);
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
      await sermonService.create(fd);
      toast.success("Sermon uploaded!");
      navigate("/admin/sermons");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 860, margin: "0 auto" }}>
      <Link
        to="/admin/sermons"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 28,
        }}
      >
        <ArrowLeft size={14} /> Back to Sermons
      </Link>
      <h1 style={{ fontSize: 26, marginBottom: 32 }}>Upload Sermon</h1>

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
                  <label className="form-label">Preacher</label>
                  <input
                    className="form-input"
                    value={form.preacher}
                    onChange={(e) => set("preacher", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Series</label>
                  <input
                    className="form-input"
                    value={form.series}
                    onChange={(e) => set("series", e.target.value)}
                    placeholder="e.g. Faith Series 2025"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input
                    className="form-input"
                    value={form.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    placeholder="faith, grace"
                  />
                </div>
              </div>
            </div>

            {/* Audio upload */}
            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                border: "1px solid var(--border)",
              }}
            >
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Audio File *</h3>
              <label
                style={{
                  display: "block",
                  border: `2px dashed ${audio ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  padding: 32,
                  textAlign: "center",
                }}
              >
                <Music
                  size={32}
                  style={{
                    margin: "0 auto 12px",
                    color: audio ? "var(--accent)" : "var(--border)",
                  }}
                />
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: audio ? "var(--primary)" : "var(--text-muted)",
                  }}
                >
                  {audio ? audio.name : "Click to upload audio"}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  MP3, WAV, M4A, OGG
                </p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files[0])}
                  style={{ display: "none" }}
                  required
                />
              </label>
              {audio && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    background: "var(--cream)",
                    borderRadius: "var(--radius)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--primary)" }}>
                    {audio.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAudio(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e53e3e",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
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
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>
                Thumbnail (Optional)
              </h3>
              <label
                style={{
                  display: "block",
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    alt=""
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
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
                    <p style={{ fontSize: 13 }}>Upload thumbnail</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumb}
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
              {loading ? "Uploading..." : "Upload Sermon"}
            </button>
          </div>
        </div>
      </form>
      <style>{`@media(max-width:768px){form>div{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
