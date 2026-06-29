import { useState, useEffect } from "react";
import { ebookService } from "../../services/ebook.service.js";
import { SkeletonCard } from "../../components/shared/Skeleton.jsx";
import { BookOpen, Download } from "lucide-react";
import toast from "react-hot-toast";
import { deriveFilename, downloadFile } from "../../utils/download.js";

export default function Ebooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    ebookService
      .getAll({ published: true })
      .then((res) => setEbooks(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (ebook) => {
    try {
      await ebookService.incrementDownload(ebook._id);
      const filename = deriveFilename(ebook.title, "pdf");
      await downloadFile(ebook.file.url, filename);
      toast.success("Download started.");
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Free Resources
          </div>
          <h1>Ebooks & Resources</h1>
          <p>Download free books, devotionals, and study guides</p>
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
          ) : ebooks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <BookOpen
                size={48}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>
                No ebooks available yet.
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {ebooks.map((eb) => (
                <div key={eb._id} className="card">
                  <img
                    src={
                      eb.coverImage?.url ||
                      "https://placehold.co/400x300/0D1B2A/C9A84C?text=Ebook"
                    }
                    alt={eb.title}
                    style={{ width: "100%", height: 240, objectFit: "cover" }}
                  />
                  <div style={{ padding: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 10,
                      }}
                    >
                      <span className="tag">{eb.category}</span>
                      {eb.isFree && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#22c55e",
                            background: "#f0fdf4",
                            padding: "2px 8px",
                            borderRadius: "var(--radius)",
                            letterSpacing: 1,
                            textTransform: "uppercase",
                          }}
                        >
                          FREE
                        </span>
                      )}
                    </div>
                    <h3
                      style={{ fontSize: 18, marginBottom: 6, lineHeight: 1.3 }}
                    >
                      {eb.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      By {eb.author}
                    </p>
                    {eb.description && (
                      <>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                            marginBottom: 8,
                            lineHeight: 1.6,
                            maxHeight: expandedId === eb._id ? 100 : "auto",
                            overflowY:
                              expandedId === eb._id ? "auto" : "hidden",
                          }}
                        >
                          {expandedId === eb._id
                            ? eb.description
                            : `${eb.description.slice(0, 55)}...`}
                        </p>

                        {eb.description.length > 55 && (
                          <span
                            onClick={() =>
                              setExpandedId(
                                expandedId === eb._id ? null : eb._id,
                              )
                            }
                            style={{
                              fontSize: 12,
                              color: "var(--accent)",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            {expandedId === eb._id ? "Read less" : "Read more"}
                          </span>
                        )}
                      </>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        {eb.downloadCount} downloads
                      </span>
                      <button
                        onClick={() => handleDownload(eb)}
                        className="btn btn-primary btn-sm"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
