// src/components/shared/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/sermons", label: "Sermons" },
    { to: "/videos", label: "Videos" },
    { to: "/ebooks", label: "Ebooks" },
    { to: "/events", label: "Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
    { to: "/donate", label: "Donation" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled
          ? "rgba(13, 27, 42, 0.55)"
          : "rgba(13, 27, 42, 0.97)",
        backdropFilter: scrolled ? "blur(5px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            flexDirection: "column",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--accent)",
              lineHeight: 1,
            }}
          >
            Pastor Daniel Akintola
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(250,250,250,0.6)",
              marginTop: 2,
            }}
          >
            Ministries
          </span>
        </Link>

        {/* Desktop */}
        <div
          style={{ display: "flex", gap: 32, alignItems: "center" }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "rgba(250,250,250,0.85)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: isActive
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                paddingBottom: 2,
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/chat" className="btn btn-primary btn-sm">
            Counselling
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            color: "var(--cream)",
            display: "none",
          }}
          className="mobile-toggle"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "var(--primary)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            borderTop: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "rgba(250,250,250,0.85)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/chat"
            className="btn btn-primary btn-sm"
            style={{ alignSelf: "flex-start" }}
          >
            Counselling
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
