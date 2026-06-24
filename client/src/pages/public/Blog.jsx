// src/pages/public/Blog.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { postService } from "../../services/post.service.js";
import { SkeletonCard } from "../../components/shared/Skeleton.jsx";
import { format } from "date-fns";
import { Search } from "lucide-react";

const CATEGORIES = [
  "All",
  "Faith",
  "Prayer",
  "Devotional",
  "Announcements",
  "General",
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  useEffect(() => {
    setLoading(true);
    postService
      .getAll({
        published: true,
        page,
        limit: 9,
        category: category || undefined,
      })
      .then((res) => {
        setPosts(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, category]);

  const setCategory = (c) => {
    setPage(1);
    setSearchParams(c && c !== "All" ? { category: c } : {});
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Articles & Devotionals
          </div>
          <h1>The Blog</h1>
          <p>Insights, reflections, and updates from the ministry</p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          {/* Category Filter */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 48,
              justifyContent: "center",
            }}
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: "8px 20px",
                  border: "2px solid",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  background:
                    category === c || (c === "All" && !category)
                      ? "var(--accent)"
                      : "transparent",
                  borderColor:
                    category === c || (c === "All" && !category)
                      ? "var(--accent)"
                      : "var(--border)",
                  color:
                    category === c || (c === "All" && !category)
                      ? "var(--primary)"
                      : "var(--text-secondary)",
                  transition: "var(--transition)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Search
                size={40}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>No posts found.</p>
            </div>
          ) : (
            <div className="grid-3">
              {posts.map((p) => (
                <Link
                  key={p._id}
                  to={`/blog/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card">
                    <img
                      src={
                        p.featuredImage?.url ||
                        "https://placehold.co/400x220/0D1B2A/C9A84C?text=Article"
                      }
                      alt={p.title}
                      style={{ width: "100%", height: 200, objectFit: "cover" }}
                    />
                    <div style={{ padding: 24 }}>
                      <div
                        style={{ display: "flex", gap: 8, marginBottom: 12 }}
                      >
                        <span className="tag">{p.category}</span>
                        {p.postType !== "article" && (
                          <span
                            className="tag"
                            style={{
                              background: "var(--primary)",
                              color: "var(--accent)",
                            }}
                          >
                            {p.postType}
                          </span>
                        )}
                      </div>
                      <h3
                        style={{
                          fontSize: 18,
                          marginBottom: 10,
                          lineHeight: 1.3,
                        }}
                      >
                        {p.title}
                      </h3>
                      {p.scripture && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--accent)",
                            fontStyle: "italic",
                            marginBottom: 8,
                          }}
                        >
                          "{p.scripture}"
                        </p>
                      )}
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 12,
                        }}
                      >
                        {format(new Date(p.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
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
