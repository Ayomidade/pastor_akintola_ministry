// src/pages/admin/Livestream.jsx
import { useState, useEffect } from "react";
import { livestreamService } from "../../services/livestream.service.js";
import { Radio, Play } from "lucide-react";
import toast from "react-hot-toast";

export default function Livestream() {
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ youtubeUrl: "", title: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    livestreamService
      .getActive()
      .then((res) => setActive(res.data.livestream))
      .finally(() => setFetching(false));
  }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await livestreamService.set(form);
      toast.success("Livestream set!");
      const res = await livestreamService.getActive();
      setActive(res.data.livestream);
      setForm({ youtubeUrl: "", title: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!active) return;
    try {
      await livestreamService.deactivate(active._id);
      toast.success("Livestream deactivated.");
      setActive(null);
    } catch {
      toast.error("Failed to deactivate.");
    }
  };

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Livestream</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Manage the active YouTube livestream embed
        </p>
      </div>

      {/* Active stream */}
      {!fetching && (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: active ? "#22c55e" : "var(--border)",
                animation: active ? "pulse 1.5s infinite" : "none",
              }}
            />
            <h3 style={{ fontSize: 16 }}>
              {active ? "Live Now" : "No Active Livestream"}
            </h3>
          </div>

          {active ? (
            <>
              {getEmbedUrl(active.youtubeUrl) && (
                <div
                  style={{
                    aspectRatio: "16/9",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    marginBottom: 16,
                  }}
                >
                  <iframe
                    src={getEmbedUrl(active.youtubeUrl)}
                    title={active.title}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allowFullScreen
                  />
                </div>
              )}
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                {active.title}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                {active.youtubeUrl}
              </p>
              <button
                onClick={handleDeactivate}
                className="btn btn-danger btn-sm"
              >
                Deactivate Stream
              </button>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--text-muted)",
              }}
            >
              <Radio
                size={40}
                style={{ margin: "0 auto 12px", opacity: 0.3 }}
              />
              <p style={{ fontSize: 14 }}>Set a YouTube URL below to go live</p>
            </div>
          )}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        </div>
      )}

      {/* Set stream form */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          border: "1px solid var(--border)",
        }}
      >
        <h3 style={{ fontSize: 16, marginBottom: 20 }}>
          {active ? "Replace Livestream" : "Set Livestream"}
        </h3>
        <form onSubmit={handleSet}>
          <div className="form-group">
            <label className="form-label">YouTube URL *</label>
            <input
              className="form-input"
              value={form.youtubeUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, youtubeUrl: e.target.value }))
              }
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stream Title</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Sunday Morning Service"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            disabled={loading}
          >
            <Play size={14} /> {loading ? "Setting..." : "Go Live"}
          </button>
        </form>
      </div>
    </div>
  );
}
