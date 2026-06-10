// src/pages/public/SermonDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { sermonService } from "../../services/sermon.service.js";
import AudioPlayer from "../../components/AudioPlayer.jsx";
import { format } from "date-fns";
import { ArrowLeft, Download } from "lucide-react";
import toast from "react-hot-toast";
import { deriveFilename, downloadFile } from "../../utils/download.js";

export default function SermonDetail() {
  const { slug } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sermonService
      .getBySlug(slug)
      .then((res) => setSermon(res.data.sermon))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleListen = () =>
    sermonService.incrementListen(sermon._id).catch(() => {});

  const handleDownload = async () => {
    try {
      await sermonService.incrementDownload(sermon._id);
      const filename=deriveFilename(sermon.title, "mp3")
      await downloadFile(sermon.audio.url, filename)
      toast.success("Download started.")
    } catch {
      toast.error("Download failed.");
    }
  };

  if (loading || !sermon)
    return (
      <div
        style={{
          paddingTop: 120,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--cream)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
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
    <div
      style={{ paddingTop: 80, background: "var(--cream)", minHeight: "100vh" }}
    >
      <div style={{ height: 380, overflow: "hidden", position: "relative" }}>
        <img
          src={
            sermon.thumbnail?.url ||
            "https://placehold.co/1200x380/0D1B2A/C9A84C?text=Sermon"
          }
          alt={sermon.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,27,42,0.9) 40%, transparent)",
          }}
        />
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0 }}>
          <div className="container">
            {sermon.series && (
              <div className="tag" style={{ marginBottom: 12 }}>
                {sermon.series}
              </div>
            )}
            <h1
              style={{
                color: "var(--cream)",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              }}
            >
              {sermon.title}
            </h1>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{ maxWidth: 760, paddingTop: 48, paddingBottom: 80 }}
      >
        <Link
          to="/sermons"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-muted)",
            fontSize: 13,
            marginBottom: 32,
          }}
        >
          <ArrowLeft size={14} /> Back to Sermons
        </Link>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <span>By {sermon.preacher}</span>
          <span>•</span>
          <span>{format(new Date(sermon.date), "MMMM d, yyyy")}</span>
          <span>•</span>
          <span>{sermon.listenCount} listens</span>
        </div>

        {sermon.description && (
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: 32,
            }}
          >
            {sermon.description}
          </p>
        )}

        <AudioPlayer
          src={sermon.audio.url}
          title={sermon.title}
          onPlay={handleListen}
          onDownload={handleDownload}
        />

        <div
          style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}
        >
          <button
            onClick={handleDownload}
            className="btn btn-outline btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Download size={14} /> Download MP3
          </button>
        </div>

        {sermon.tags?.length > 0 && (
          <div
            style={{ marginTop: 40, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {sermon.tags.map((t) => (
              <span
                key={t}
                style={{
                  padding: "4px 12px",
                  background: "var(--cream-dark)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
