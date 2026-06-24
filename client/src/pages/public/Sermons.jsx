// src/pages/public/Sermons.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sermonService } from "../../services/sermon.service.js";
import { SkeletonCard } from "../../components/shared/Skeleton.jsx";
import { format } from "date-fns";
import { Headphones, Download } from "lucide-react";

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    sermonService
      .getAll({ published: true, page, limit: 9 })
      .then((res) => {
        setSermons(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Audio Messages
          </div>
          <h1>Sermons</h1>
          <p>Listen to and download powerful messages from the Word of God</p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          {loading ? (
            <div className="grid-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : sermons.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Headphones
                size={48}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>
                No sermons available yet.
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {sermons.map((s) => (
                <Link
                  key={s._id}
                  to={`/sermons/${s.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card">
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          s.thumbnail?.url ||
                          "https://placehold.co/400x220/0D1B2A/C9A84C?text=Sermon"
                        }
                        alt={s.title}
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
                          background: "rgba(33,33,33,0.3)",
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
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Headphones size={24} color="var(--primary)" />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: 20 }}>
                      {s.series && (
                        <div
                          className="tag"
                          style={{ marginBottom: 10, fontSize: 10 }}
                        >
                          {s.series}
                        </div>
                      )}
                      <h3
                        style={{
                          fontSize: 17,
                          marginBottom: 8,
                          lineHeight: 1.3,
                        }}
                      >
                        {s.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginBottom: 12,
                        }}
                      >
                        {s.preacher} • {format(new Date(s.date), "MMM d, yyyy")}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Headphones size={12} /> {s.listenCount}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Download size={12} /> {s.downloadCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 48,
              }}
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    border: "2px solid",
                    borderColor:
                      page === i + 1 ? "var(--accent)" : "var(--border)",
                    background:
                      page === i + 1 ? "var(--accent)" : "transparent",
                    color:
                      page === i + 1
                        ? "var(--primary)"
                        : "var(--text-secondary)",
                    borderRadius: "var(--radius)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
