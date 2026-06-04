// src/pages/public/Media.jsx
import { useState, useEffect } from "react";
import { mediaService } from "../../services/media.service.js";
import { Image } from "lucide-react";

export default function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    mediaService
      .getAll()
      .then((res) => setMedia(res.data.media || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Gallery
          </div>
          <h1>Media</h1>
          <p>Photos and moments from our ministry</p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          {loading ? (
            <div className="grid-4">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: 220, borderRadius: "var(--radius-lg)" }}
                  />
                ))}
            </div>
          ) : media.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Image
                size={48}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>
                No media uploaded yet.
              </p>
            </div>
          ) : (
            <div className="grid-4">
              {media.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelected(item)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "1",
                    background: "var(--navy)",
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.caption || "Media"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  {item.caption && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(13,27,42,0.8), transparent)",
                        padding: "20px 12px 10px",
                        color: "var(--cream)",
                        fontSize: 12,
                      }}
                    >
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
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
            src={selected.url}
            alt={selected.caption || ""}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "var(--radius-lg)",
            }}
          />
          {selected.caption && (
            <div
              style={{
                position: "absolute",
                bottom: 32,
                color: "var(--cream)",
                fontSize: 14,
              }}
            >
              {selected.caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
