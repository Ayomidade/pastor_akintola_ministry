import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mediaService } from "../../services/media.service.js";
import { Image, ArrowLeft, Grid, ChevronRight } from "lucide-react";

export default function Media() {
  const { slug } = useParams();

  return slug ? <CollectionView slug={slug} /> : <CollectionGrid />;
}

// ─── Public grid of all collections ──────────────────────────────
function CollectionGrid() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mediaService
      .getCollections()
      .then((res) => setCollections(res.data.collections || []))
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
          <p>Browse our photo collections from ministry events and services</p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          {loading ? (
            <div className="grid-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: 280, borderRadius: "var(--radius-lg)" }}
                  />
                ))}
            </div>
          ) : collections.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Image
                size={48}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>No collections yet.</p>
            </div>
          ) : (
            <div className="grid-3">
              {collections.map((col) => (
                <Link
                  key={col._id}
                  to={`/gallery/${col.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card" style={{ overflow: "hidden" }}>
                    {/* Cover image */}
                    <div
                      style={{
                        position: "relative",
                        height: 220,
                        background: "var(--primary)",
                        overflow: "hidden",
                      }}
                    >
                      {col.coverImage ? (
                        <img
                          src={col.coverImage.url}
                          alt={col.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Grid size={40} color="rgba(201,168,76,0.3)" />
                        </div>
                      )}
                      {/* Image count badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          background: "rgba(33,33,33,0.8)",
                          backdropFilter: "blur(4px)",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        {col.imageCount}{" "}
                        {col.imageCount === 1 ? "photo" : "photos"}
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: 17,
                            marginBottom: col.description ? 4 : 0,
                          }}
                        >
                          {col.title}
                        </h3>
                        {col.description && (
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--text-muted)",
                              lineHeight: 1.5,
                            }}
                          >
                            {col.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        size={18}
                        color="var(--accent)"
                        style={{ flexShrink: 0, marginLeft: 8 }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Single collection view with lightbox ─────────────────────────
function CollectionView({ slug }) {
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    mediaService
      .getCollectionBySlug(slug)
      .then((res) => {
        setCollection(res.data.collection);
        setImages(res.data.images || []);
      })
      .catch(() => navigate("/gallery"))
      .finally(() => setLoading(false));
  }, [slug]);

  const openLightbox = (img, index) => {
    setSelected(img);
    setSelectedIndex(index);
  };

  const prev = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelected(images[newIndex]);
    setSelectedIndex(newIndex);
  };

  const next = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex + 1) % images.length;
    setSelected(images[newIndex]);
    setSelectedIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev(e);
      if (e.key === "ArrowRight") next(e);
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, selectedIndex]);

  if (loading)
    return (
      <div
        style={{
          paddingTop: 120,
          minHeight: "100vh",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div>
      {/* Collection header */}
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <Link
            to="/gallery"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(250,250,250,0.5)",
              fontSize: 13,
              marginBottom: 20,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> All Collections
          </Link>
          <div className="tag" style={{ marginBottom: 12 }}>
            Collection
          </div>
          <h1>{collection?.title}</h1>
          {collection?.description && (
            <p style={{ marginTop: 8 }}>{collection.description}</p>
          )}
          <p
            style={{
              marginTop: 8,
              color: "rgba(250,250,250,0.4)",
              fontSize: 13,
            }}
          >
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          {images.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Image
                size={48}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>
                No images in this collection yet.
              </p>
            </div>
          ) : (
            <div className="media-masonry">
              {images.map((img, index) => (
                <div
                  key={img._id}
                  onClick={() => openLightbox(img, index)}
                  style={{
                    cursor: "zoom-in",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--primary)",
                    position: "relative",
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || ""}
                    style={{
                      width: "100%",
                      display: "block",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  {img.caption && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(33,33,33,0.85), transparent)",
                        padding: "24px 12px 10px",
                        color: "var(--cream)",
                        fontSize: 12,
                      }}
                    >
                      {img.caption}
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
            background: "rgba(33,33,33,0.97)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {/* Prev */}
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              zIndex: 1,
              fontSize: 22,
            }}
          >
            ‹
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 900,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src={selected.url}
              alt={selected.caption || ""}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "var(--radius-lg)",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {selected.caption && (
                <p style={{ color: "rgba(250,250,250,0.7)", fontSize: 14 }}>
                  {selected.caption}
                </p>
              )}
              <p
                style={{
                  color: "rgba(250,250,250,0.3)",
                  fontSize: 12,
                  marginLeft: "auto",
                }}
              >
                {selectedIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              zIndex: 1,
              fontSize: 22,
            }}
          >
            ›
          </button>
        </div>
      )}

      <style>{`
        .media-masonry {
          columns: 3;
          column-gap: 12px;
        }
        .media-masonry > div {
          break-inside: avoid;
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .media-masonry { columns: 3; }
        }
        @media (max-width: 480px) {
          .media-masonry { columns: 2; }
        }
      `}</style>
    </div>
  );
}
