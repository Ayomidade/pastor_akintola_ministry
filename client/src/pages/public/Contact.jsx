// src/pages/public/Contact.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { contactService } from "../../services/contact.service.js";
import {
  Mail,
  Phone,
  MapPin,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { SOCIALS } from "../../config/socials.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "contact";
  const [type, setType] = useState(defaultType);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.submit({ ...form, type });
      toast.success(
        type === "prayer"
          ? "Prayer request submitted. We're standing with you in prayer."
          : "Message sent successfully. We'll respond within 48 hours.",
      );
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Reach Out
          </div>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="contact-grid">
            {/* Left — info */}
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  marginBottom: 12,
                }}
              >
                Get in Touch
              </h2>
              <div className="gold-divider" style={{ marginBottom: 24 }} />
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                  marginBottom: 36,
                }}
              >
                Whether you need prayer, counselling, or simply want to connect
                with the ministry — we are here for you. You can also reach us
                on any of our social media platforms.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  marginBottom: 40,
                }}
              >
                {[
                  {
                    icon: <Mail size={18} color="var(--gold)" />,
                    label: "Email",
                    value: "pastordanielakintola@gmail.com",
                    href: "mailto:pastordanielakintola@gmail.com",
                  },
                  {
                    icon: <Phone size={18} color="var(--gold)" />,
                    label: "Phone",
                    value: "+234 803 305 3188",
                    href: "tel:+2348033053188",
                  },
                  {
                    icon: <MapPin size={18} color="var(--gold)" />,
                    label: "Location",
                    value: "Lagos, Nigeria",
                    href: null,
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: "var(--white)",
                        borderRadius: "var(--radius)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "1px solid var(--border)",
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          marginBottom: 3,
                        }}
                      >
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          style={{ fontSize: 14, color: "var(--text-primary)" }}
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p
                          style={{ fontSize: 14, color: "var(--text-primary)" }}
                        >
                          {c.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  Follow Us
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    {
                      href: SOCIALS.youtube?.url,
                      icon: <Youtube size={17} />,
                      label: "YouTube",
                      bg: "#d60000",
                    },
                    {
                      href: SOCIALS.facebook?.url,
                      icon: <Facebook size={17} />,
                      label: "Facebook",
                      bg: "#1877F2",
                    },
                    // {
                    //   href: SOCIALS.instagram?.url,
                    //   icon: <Instagram size={17} />,
                    //   label: "Instagram",
                    //   bg: "#E1306C",
                    // },
                    // {
                    //   href: SOCIALS.twitter?.url,
                    //   icon: <Twitter size={17} />,
                    //   label: "X",
                    //   bg: "#000",
                    // },
                    {
                      href: SOCIALS.whatsapp.url,
                      icon: <MessageCircle size={17} />,
                      label: "WhatsApp",
                      bg: "#25D366",
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "8px 14px",
                        borderRadius: "var(--radius)",
                        background: `${s.bg}15`,
                        color: s.bg,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                        border: `1px solid ${s.bg}30`,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = s.bg;
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${s.bg}15`;
                        e.currentTarget.style.color = s.bg;
                      }}
                    >
                      {s.icon} {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Counselling CTA */}
              <div
                style={{
                  marginTop: 36,
                  background: "var(--navy)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 24px",
                }}
              >
                <p
                  style={{
                    color: "var(--gold)",
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 6,
                  }}
                >
                  Need to speak with the Pastor?
                </p>
                <p
                  style={{
                    color: "rgba(248,245,239,0.65)",
                    fontSize: 13,
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  Our live counselling chat is available for registered users.
                </p>
                <Link to="/chat" className="btn btn-primary btn-sm">
                  Start Counselling Chat
                </Link>
              </div>
            </div>

            {/* Right — form */}
            <div
              style={{
                background: "var(--white)",
                padding: "36px 32px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Type switcher */}
              <div
                style={{
                  display: "flex",
                  marginBottom: 28,
                  border: "2px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                }}
              >
                {[
                  ["contact", "Send a Message"],
                  ["prayer", "Prayer Request"],
                ].map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1,
                      padding: "11px 0",
                      border: "none",
                      background: type === t ? "var(--gold)" : "transparent",
                      color:
                        type === t ? "var(--navy)" : "var(--text-secondary)",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      className="form-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-input"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      className="form-input"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {type === "prayer" ? "Prayer Request *" : "Message *"}
                  </label>
                  <textarea
                    className="form-input form-textarea"
                    style={{ minHeight: 140 }}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    required
                    placeholder={
                      type === "prayer"
                        ? "Share your prayer request here..."
                        : "How can we help you?"
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={submitting}
                >
                  {submitting
                    ? "Sending..."
                    : type === "prayer"
                      ? "Submit Prayer Request"
                      : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 56px;
          align-items: start;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 480px) {
          .form-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
