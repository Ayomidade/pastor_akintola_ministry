// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { chatService } from "../../services/chat.service.js";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Mic,
  BookOpen,
  Calendar,
  Image,
  MessageSquare,
  Mail,
  Phone,
  Radio,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const NAV = [
  {
    to: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  { to: "/admin/posts", icon: <FileText size={18} />, label: "Posts" },
  { to: "/admin/sermons", icon: <Mic size={18} />, label: "Sermons" },
  { to: "/admin/ebooks", icon: <BookOpen size={18} />, label: "Ebooks" },
  { to: "/admin/events", icon: <Calendar size={18} />, label: "Events" },
  { to: "/admin/gallery", icon: <Image size={18} />, label: "Gallery" },
  {
    to: "/admin/comments",
    icon: <MessageSquare size={18} />,
    label: "Comments",
  },
  { to: "/admin/contacts", icon: <Phone size={18} />, label: "Contacts" },
  { to: "/admin/newsletter", icon: <Mail size={18} />, label: "Newsletter" },
  { to: "/admin/livestream", icon: <Radio size={18} />, label: "Livestream" },
  { to: "/admin/chat", icon: <MessageCircle size={18} />, label: "Chat" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      chatService
        .getUnreadCount()
        .then((res) => setUnread(res.data.unreadCount))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
    navigate("/admin/login");
  };

  const W = collapsed ? 72 : 240;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--cream)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: W,
          background: "var(--primary)",
          transition: "width 0.25s ease",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: collapsed ? "24px 0" : "24px 20px",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--accent)",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Pastor Daniel Akintola
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "rgba(250,250,250,0.4)",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Admin Panel
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(250,250,250,0.4)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "12px 0" : "12px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                color: isActive ? "var(--accent)" : "rgba(250,250,250,0.55)",
                background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                borderLeft: isActive
                  ? "3px solid var(--accent)"
                  : "3px solid transparent",
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                transition: "var(--transition)",
                textDecoration: "none",
                position: "relative",
              })}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {item.label === "Chat" && unread > 0 && (
                <span
                  style={{
                    background: "#e53e3e",
                    color: "white",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            padding: collapsed ? "16px 0" : "16px 20px",
            borderTop: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          {!collapsed && (
            <p
              style={{
                fontSize: 12,
                color: "rgba(250,250,250,0.4)",
                marginBottom: 12,
              }}
            >
              Signed in as
              <br />
              <span style={{ color: "var(--accent)" }}>{admin?.name}</span>
            </p>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: "rgba(250,250,250,0.5)",
              cursor: "pointer",
              fontSize: 12,
              padding: collapsed ? "0" : "8px 0",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
            }}
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: W,
          flex: 1,
          transition: "margin-left 0.25s ease",
          minHeight: "100vh",
        }}
      >
        <Outlet context={{ unread, setUnread }} />
      </main>
    </div>
  );
}
