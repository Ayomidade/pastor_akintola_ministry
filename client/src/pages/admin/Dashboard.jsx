// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postService } from "../../services/post.service.js";
import { sermonService } from "../../services/sermon.service.js";
import { ebookService } from "../../services/ebook.service.js";
import { commentService } from "../../services/comment.service.js";
import { contactService } from "../../services/contact.service.js";
import { newsletterService } from "../../services/newsletter.service.js";
import { chatService } from "../../services/chat.service.js";
import { eventService } from "../../services/event.service.js";
import {
  FileText,
  Mic,
  BookOpen,
  MessageSquare,
  Users,
  Phone,
  Calendar,
  MessageCircle,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      postService.getAll({ limit: 1 }),
      sermonService.getAll({ limit: 1 }),
      ebookService.getAll({ limit: 1 }),
      commentService.getAllAdmin(),
      contactService.getAll(),
      newsletterService.getAll(),
      chatService.getUnreadCount(),
      eventService.getAllAdmin(),
    ])
      .then(
        ([
          posts,
          sermons,
          ebooks,
          comments,
          contacts,
          newsletter,
          chat,
          events,
        ]) => {
          setStats({
            posts: posts.data.total || 0,
            sermons: sermons.data.total || 0,
            ebooks: ebooks.data.total || 0,
            comments:
              comments.data.comments?.filter((c) => !c.isApproved).length || 0,
            contacts:
              contacts.data.contacts?.filter((c) => !c.isRead).length || 0,
            subscribers: newsletter.data.subscribers?.length || 0,
            unreadChat: chat.data.unreadCount || 0,
            events: events.data.total || 0,
          });
        },
      )
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Posts",
      value: stats.posts,
      icon: <FileText size={22} />,
      to: "/admin/posts",
      color: "#3b82f6",
      action: "New Post",
      actionTo: "/admin/posts/create",
    },
    {
      label: "Total Sermons",
      value: stats.sermons,
      icon: <Mic size={22} />,
      to: "/admin/sermons",
      color: "#8b5cf6",
      action: "Upload Sermon",
      actionTo: "/admin/sermons/create",
    },
    {
      label: "Total Ebooks",
      value: stats.ebooks,
      icon: <BookOpen size={22} />,
      to: "/admin/ebooks",
      color: "#ec4899",
      action: "Upload Ebook",
      actionTo: "/admin/ebooks/upload",
    },
    {
      label: "Pending Comments",
      value: stats.comments,
      icon: <MessageSquare size={22} />,
      to: "/admin/comments",
      color: "#f59e0b",
      highlight: stats.comments > 0,
    },
    {
      label: "Unread Messages",
      value: stats.contacts,
      icon: <Phone size={22} />,
      to: "/admin/contacts",
      color: "#10b981",
      highlight: stats.contacts > 0,
    },
    {
      label: "Newsletter Subscribers",
      value: stats.subscribers,
      icon: <Users size={22} />,
      to: "/admin/newsletter",
      color: "var(--gold)",
    },
    {
      label: "Unread Chats",
      value: stats.unreadChat,
      icon: <MessageCircle size={22} />,
      to: "/admin/chat",
      color: "#e53e3e",
      highlight: stats.unreadChat > 0,
    },
    {
      label: "Total Events",
      value: stats.events,
      icon: <Calendar size={22} />,
      to: "/admin/events",
      color: "#06b6d4",
      action: "New Event",
      actionTo: "/admin/events/create",
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Welcome back. Here's what's happening.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                border: card.highlight
                  ? `2px solid ${card.color}`
                  : "1px solid var(--border)",
                transition: "var(--transition)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-md)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius)",
                    background: `${card.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
                {card.highlight && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: card.color,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: loading ? "transparent" : "var(--navy)",
                  background: loading ? "var(--cream-dark)" : "transparent",
                  borderRadius: "var(--radius)",
                  marginBottom: 4,
                }}
              >
                {loading ? "—" : (card.value ?? 0)}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  letterSpacing: 0.5,
                }}
              >
                {card.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "New Post", to: "/admin/posts/create" },
            { label: "Upload Sermon", to: "/admin/sermons/create" },
            { label: "Upload Ebook", to: "/admin/ebooks/upload" },
            { label: "New Event", to: "/admin/events/create" },
            { label: "Update Gallery", to: "/admin/gallery" },
            { label: "Set Livestream", to: "/admin/livestream" },
          ].map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="btn btn-outline btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Plus size={14} /> {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
