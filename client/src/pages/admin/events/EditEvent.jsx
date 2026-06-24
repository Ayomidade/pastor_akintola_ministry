// src/pages/admin/events/EditEvent.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { eventService } from "../../../services/event.service.js";
import { ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    isPublished: "false",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    eventService
      .getAllAdmin()
      .then((res) => {
        const ev = res.data.events?.find((x) => x._id === id);
        if (ev) {
          setForm({
            title: ev.title,
            description: ev.description || "",
            date: ev.date ? ev.date.substring(0, 10) : "",
            time: ev.time || "",
            location: ev.location || "",
            category: ev.category,
            isPublished: String(ev.isPublished),
          });
          setPreview(ev.image?.url || null);
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);
      await eventService.update(id, fd);
      toast.success("Event updated!");
      navigate("/admin/events");
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
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div style={{ padding: "24px 16px", maxWidth: 760, margin: "0 auto" }}>
      <Link
        to="/admin/events"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 28,
        }}
      >
        <ArrowLeft size={14} /> Back to Events
      </Link>
      <h1 style={{ fontSize: 26, marginBottom: 32 }}>Edit Event</h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
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
                <label className="form-label">Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  className="form-input"
                  type="time"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  className="form-input"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
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
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                border: "1px solid var(--border)",
              }}
            >
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Event Image</h3>
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
                    <p style={{ fontSize: 12 }}>Replace image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
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
