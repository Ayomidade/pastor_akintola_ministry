// src/pages/admin/sermons/EditSermon.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { sermonService } from "../../../services/sermon.service.js";
import { ArrowLeft, Upload, Music } from "lucide-react";
import toast from "react-hot-toast";

export default function EditSermon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    preacher: "",
    series: "",
    date: "",
    tags: "",
    isPublished: "false",
  });
  const [audio, setAudio] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    // fetch by getting the list and finding by id — or use slug
    // For edit we load from all sermons
    sermonService
      .getAll({ limit: 100 })
      .then((res) => {
        const s = res.data.data?.find((x) => x._id === id);
        if (s) {
          setForm({
            title: s.title,
            description: s.description || "",
            preacher: s.preacher,
            series: s.series || "",
            date: s.date ? s.date.substring(0, 10) : "",
            tags: s.tags?.join(", ") || "",
            isPublished: String(s.isPublished),
          });
          setThumbPreview(s.thumbnail?.url || null);
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, v);
      });
      if (audio) fd.append("audio", audio);
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
      await sermonService.update(id, fd);
      toast.success("Sermon updated!");
      navigate("/admin/sermons");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
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
    );

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
      <h1 style={{ fontSize: 26, marginBottom: 32 }}>Edit Sermon</h1>

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
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.isPublished}
                  onChange={(e) => set("isPublished", e.target.value)}
                >
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
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
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>
                Replace Audio (Optional)
              </h3>
              <label
                style={{
                  display: "block",
                  border: `2px dashed ${audio ? "var(--gold)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <Music
                  size={24}
                  style={{
                    margin: "0 auto 8px",
                    color: audio ? "var(--gold)" : "var(--border)",
                  }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: audio ? "var(--navy)" : "var(--text-muted)",
                  }}
                >
                  {audio ? audio.name : "Click to replace audio file"}
                </p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files[0])}
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
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Thumbnail</h3>
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
                    style={{ width: "100%", height: 140, objectFit: "cover" }}
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
                      size={20}
                      style={{ margin: "0 auto 8px", opacity: 0.4 }}
                    />
                    <p style={{ fontSize: 13 }}>Replace thumbnail</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setThumbnail(e.target.files[0]);
                    setThumbPreview(URL.createObjectURL(e.target.files[0]));
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
      <style>{`@media(max-width:768px){form>div{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
