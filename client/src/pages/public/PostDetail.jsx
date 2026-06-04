// src/pages/public/PostDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { postService } from "../../services/post.service.js";
import { commentService } from "../../services/comment.service.js";
import { likeService } from "../../services/like.service.js";
import { format } from "date-fns";
import { Heart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    body: "",
    parentId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([postService.getBySlug(slug)])
      .then(([res]) => {
        setPost(res.data.post);
        return commentService.getByPost(res.data.post._id);
      })
      .then((res) => setComments(res.data.comments || []))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await likeService.like(post._id);
      setPost((p) => ({ ...p, likesCount: p.likesCount + 1 }));
      setLiked(true);
      toast.success("Post liked!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not like post.");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await commentService.add(post._id, form);
      toast.success("Comment submitted for approval.");
      setForm({ name: "", email: "", body: "", parentId: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit comment.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!post)
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
        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: 16 }}>Post not found</h2>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );

  return (
    <div
      style={{ paddingTop: 80, background: "var(--cream)", minHeight: "100vh" }}
    >
      {/* Hero image */}
      <div style={{ height: 420, overflow: "hidden", position: "relative" }}>
        <img
          src={
            post.featuredImage?.url ||
            "https://placehold.co/1200x420/0D1B2A/C9A84C?text=Article"
          }
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,27,42,0.8), transparent)",
          }}
        />
      </div>

      <div
        className="container"
        style={{ maxWidth: 800, paddingTop: 48, paddingBottom: 80 }}
      >
        <Link
          to="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-muted)",
            fontSize: 13,
            marginBottom: 32,
          }}
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span className="tag">{post.category}</span>
          {post.postType !== "article" && (
            <span
              className="tag"
              style={{ background: "var(--navy)", color: "var(--gold)" }}
            >
              {post.postType}
            </span>
          )}
        </div>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </h1>

        {post.scripture && (
          <div
            style={{
              background: "var(--gold)",
              padding: "16px 20px",
              borderRadius: "var(--radius)",
              marginBottom: 24,
              borderLeft: "4px solid var(--gold-dark)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                color: "var(--navy)",
                fontSize: 16,
              }}
            >
              "{post.scripture}"
            </p>
          </div>
        )}

        <p
          style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 40 }}
        >
          {format(new Date(post.createdAt), "MMMM d, yyyy")}
        </p>

        <div
          style={{ borderTop: "1px solid var(--border)", paddingTop: 40 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="post-content"
        />

        {/* Like button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "32px 0",
            borderTop: "1px solid var(--border)",
            marginTop: 40,
          }}
        >
          <button
            onClick={handleLike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              border: "2px solid",
              borderColor: liked ? "var(--gold)" : "var(--border)",
              background: liked ? "var(--gold)" : "transparent",
              color: liked ? "var(--navy)" : "var(--text-secondary)",
              borderRadius: "var(--radius)",
              fontWeight: 700,
              fontSize: 13,
              cursor: liked ? "default" : "pointer",
              transition: "var(--transition)",
            }}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}
          </button>
        </div>

        {/* Comments */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 22, marginBottom: 32 }}>
            Comments ({comments.length})
          </h3>
          {comments.length === 0 ? (
            <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
              Be the first to comment.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                marginBottom: 48,
              }}
            >
              {comments.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  onReply={(id) => setForm((f) => ({ ...f, parentId: id }))}
                />
              ))}
            </div>
          )}

          {/* Comment form */}
          <div
            style={{
              background: "var(--white)",
              padding: 32,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
            }}
          >
            <h4 style={{ marginBottom: 24, fontSize: 18 }}>
              {form.parentId ? "Write a Reply" : "Leave a Comment"}
            </h4>
            {form.parentId && (
              <button
                onClick={() => setForm((f) => ({ ...f, parentId: "" }))}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gold)",
                  fontSize: 12,
                  cursor: "pointer",
                  marginBottom: 16,
                  padding: 0,
                }}
              >
                ✕ Cancel reply
              </button>
            )}
            <form onSubmit={handleComment}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-input form-textarea"
                  value={form.body}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, body: e.target.value }))
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`.post-content { font-size: 17px; line-height: 1.9; color: var(--text-secondary); }
        .post-content h2,.post-content h3 { color: var(--navy); margin: 32px 0 16px; }
        .post-content p { margin-bottom: 20px; }
        .post-content img { border-radius: var(--radius); margin: 24px 0; }
        .post-content blockquote { border-left: 4px solid var(--gold); padding: 12px 20px; background: var(--cream-dark); border-radius: 0 var(--radius) var(--radius) 0; margin: 24px 0; font-style: italic; }`}
      </style>
    </div>
  );
}

function CommentItem({ comment, onReply }) {
  return (
    <div
      style={{
        background: "var(--white)",
        padding: 20,
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "var(--navy)",
              fontSize: 14,
            }}
          >
            {comment.name[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14 }}>{comment.name}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {format(new Date(comment.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <button
          onClick={() => onReply(comment._id)}
          style={{
            background: "none",
            border: "none",
            color: "var(--gold)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Reply
        </button>
      </div>
      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {comment.body}
      </p>
      {comment.replies?.length > 0 && (
        <div
          style={{
            marginTop: 16,
            paddingLeft: 20,
            borderLeft: "2px solid var(--border)",
          }}
        >
          {comment.replies.map((r) => (
            <div
              key={r._id}
              style={{
                background: "var(--cream)",
                padding: 16,
                borderRadius: "var(--radius)",
                marginTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--navy)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {r.name[0].toUpperCase()}
                </div>
                <p style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</p>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {r.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
