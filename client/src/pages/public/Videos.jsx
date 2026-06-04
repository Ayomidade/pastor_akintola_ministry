// src/pages/public/Videos.jsx
import { useState, useEffect } from "react";
import { Youtube, Play, ExternalLink, Search } from "lucide-react";
import { SOCIALS, YOUTUBE_API_KEY } from "../../config/socials.js";

// ─── YouTube Data API v3 fetch ────────────────────────────────────
async function fetchYouTubeVideos(channelId, pageToken = "") {
  const base = "https://www.googleapis.com/youtube/v3";
  // 1. Get uploads playlist ID
  const channelRes = await fetch(
    `${base}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`,
  );
  const channelData = await channelRes.json();
  const uploadsId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsId) throw new Error("Channel not found");

  // 2. Fetch videos from uploads playlist
  const videosRes = await fetch(
    `${base}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=12&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`,
  );
  const videosData = await videosRes.json();

  return {
    videos:
      videosData.items?.map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      })) || [],
    nextPageToken: videosData.nextPageToken || null,
  };
}

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextToken, setNextToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const hasApiKey =
    !!YOUTUBE_API_KEY && YOUTUBE_API_KEY !== "your_youtube_data_api_v3_key";

  useEffect(() => {
    if (!hasApiKey) {
      setLoading(false);
      return;
    }
    fetchYouTubeVideos(SOCIALS.youtube.channelId)
      .then(({ videos: v, nextPageToken }) => {
        setVideos(v);
        setNextToken(nextPageToken);
      })
      .catch(() => setError("Could not load videos. Please check back later."))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    if (!nextToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const { videos: more, nextPageToken } = await fetchYouTubeVideos(
        SOCIALS.youtube.channelId,
        nextToken,
      );
      setVideos((prev) => [...prev, ...more]);
      setNextToken(nextPageToken);
    } catch {
      setError("Could not load more videos.");
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: "#d60000",
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Youtube size={24} color="white" />
            </div>
            <div className="tag">YouTube Channel</div>
          </div>
          <h1>Sermon Videos</h1>
          <p>Watch messages from Pastor Daniel Akintola on YouTube</p>
          <a
            href={SOCIALS.youtube.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 20,
              background: "#d60000",
              color: "white",
              padding: "10px 22px",
              borderRadius: "var(--radius)",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <Youtube size={14} /> Subscribe on YouTube
          </a>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          {/* No API key message */}
          {!hasApiKey && (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "#d6000015",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Youtube size={40} color="#d60000" />
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>
                Videos from {SOCIALS.youtube.handle}
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: 32,
                  maxWidth: 500,
                  margin: "0 auto 32px",
                  lineHeight: 1.8,
                }}
              >
                Watch all our sermon videos, live service recordings, and
                devotionals directly on our YouTube channel. Subscribe to never
                miss a new upload.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={SOCIALS.youtube.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#d60000",
                    color: "white",
                    padding: "14px 28px",
                    borderRadius: "var(--radius)",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <Youtube size={18} /> Visit YouTube Channel
                </a>
                <p
                  style={{
                    width: "100%",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 16,
                  }}
                >
                  Admin: Add{" "}
                  <code
                    style={{
                      background: "var(--cream-dark)",
                      padding: "2px 6px",
                      borderRadius: 3,
                    }}
                  >
                    VITE_YOUTUBE_API_KEY
                  </code>{" "}
                  to .env to show videos here automatically.
                </p>
              </div>

              {/* Placeholder video grid */}
              <div
                className="grid-3"
                style={{ marginTop: 48, opacity: 0.4, pointerEvents: "none" }}
              >
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="card">
                      <div
                        style={{
                          height: 190,
                          background: "var(--navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Play size={40} color="rgba(201,168,76,0.5)" />
                      </div>
                      <div style={{ padding: 16 }}>
                        <div
                          style={{
                            height: 16,
                            background: "var(--border)",
                            borderRadius: 4,
                            marginBottom: 8,
                          }}
                        />
                        <div
                          style={{
                            height: 12,
                            background: "var(--border)",
                            borderRadius: 4,
                            width: "60%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* With API key */}
          {hasApiKey && (
            <>
              {/* Search */}
              <div
                style={{
                  position: "relative",
                  maxWidth: 420,
                  margin: "0 auto 40px",
                }}
              >
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  className="form-input"
                  placeholder="Search videos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 42 }}
                />
              </div>

              {loading ? (
                <div className="grid-3">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="card">
                        <div className="skeleton" style={{ height: 190 }} />
                        <div style={{ padding: 16 }}>
                          <div
                            className="skeleton"
                            style={{ height: 14, marginBottom: 8 }}
                          />
                          <div
                            className="skeleton"
                            style={{ height: 12, width: "60%" }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : error ? (
                <div style={{ textAlign: "center", padding: "64px 24px" }}>
                  <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                    {error}
                  </p>
                  <a
                    href={SOCIALS.youtube.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Youtube size={16} /> Visit YouTube Channel
                  </a>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 24px" }}>
                  <p style={{ color: "var(--text-muted)" }}>
                    No videos found for "{search}".
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid-3">
                    {filtered.map((video) => (
                      <div
                        key={video.id}
                        className="card"
                        onClick={() => setSelected(video)}
                        style={{ cursor: "pointer" }}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={
                              video.thumbnail ||
                              "https://placehold.co/400x225/0D1B2A/C9A84C?text=Video"
                            }
                            alt={video.title}
                            style={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(13,27,42,0.45)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.opacity = 1)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.opacity = 0)
                            }
                          >
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                background: "#d60000",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Play size={24} color="white" fill="white" />
                            </div>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              background: "rgba(0,0,0,0.7)",
                              padding: "3px 8px",
                              borderRadius: 3,
                            }}
                          >
                            <Youtube size={12} color="white" />
                          </div>
                        </div>
                        <div style={{ padding: "16px 18px" }}>
                          <h3
                            style={{
                              fontSize: 15,
                              lineHeight: 1.3,
                              marginBottom: 8,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {video.title}
                          </h3>
                          <p
                            style={{ fontSize: 11, color: "var(--text-muted)" }}
                          >
                            {formatDate(video.publishedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {nextToken && (
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                      <button
                        onClick={loadMore}
                        className="btn btn-outline"
                        disabled={loadingMore}
                      >
                        {loadingMore ? "Loading..." : "Load More Videos"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Video modal */}
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
            padding: 16,
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 800, cursor: "default" }}
          >
            <div
              style={{
                aspectRatio: "16/9",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${selected.id}?autoplay=1`}
                title={selected.title}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    color: "var(--cream)",
                    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                    marginBottom: 4,
                  }}
                >
                  {selected.title}
                </h3>
                <p style={{ fontSize: 12, color: "rgba(248,245,239,0.45)" }}>
                  {formatDate(selected.publishedAt)}
                </p>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${selected.id}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--gold)",
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                <ExternalLink size={13} /> Open on YouTube
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
