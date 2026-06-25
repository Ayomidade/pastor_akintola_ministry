// src/components/shared/Footer.jsx
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { newsletterService } from "../../services/newsletter.service.js";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--primary)",
        color: "rgba(250,250,250,0.7)",
        paddingTop: 64,
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 48,
            borderBottom: "1px solid rgba(22,163,74,0.2)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                color: "var(--accent)",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Pastor Daniel Akintola
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(250,250,250,0.4)",
                marginBottom: 16,
              }}
            >
              Ministries
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
              Spreading the Gospel of Jesus Christ through faith, hope, and the
              power of God's Word.
            </p>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <a
                href="mailto:pastordanielakintola@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "rgba(250,250,250,0.6)",
                }}
              >
                <Mail size={14} color="var(--accent)" />{" "}
                pastordanielakintola@gmail.com
              </a>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                <Phone size={14} color="var(--accent)" /> +234 803 305 3188
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                <MapPin size={14} color="var(--accent)" /> Lagos, Nigeria
              </span>
            </div>
          </div>

          <div>
            <h4
              style={{
                color: "var(--accent)",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 20,
                fontFamily: "var(--font-body)",
              }}
            >
              Ministry
            </h4>
            {[
              ["About", "/about"],
              ["Blog", "/blog"],
              ["Sermons", "/sermons"],
              ["Videos", "/videos"],
              ["Ebooks", "/ebooks"],
              ["Events", "/events"],
              ["Gallery", "/gallery"],
              ["Donation", "/donate"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: "block",
                  fontSize: 13,
                  marginBottom: 10,
                  color: "rgba(250,250,250,0.6)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(250,250,250,0.6)")
                }
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <h4
              style={{
                color: "var(--accent)",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 20,
                fontFamily: "var(--font-body)",
              }}
            >
              Connect
            </h4>
            {[
              ["Contact Us", "/contact"],
              ["Prayer Request", "/contact?type=prayer"],
              ["Counselling", "/chat"],
              ["Newsletter", "/"],
            ].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                style={{
                  display: "block",
                  fontSize: 13,
                  marginBottom: 10,
                  color: "rgba(250,250,250,0.6)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(250,250,250,0.6)")
                }
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <h4
              style={{
                color: "var(--accent)",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 20,
                fontFamily: "var(--font-body)",
              }}
            >
              Newsletter
            </h4>
            <p style={{ fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
              Receive updates, devotionals and event notices.
            </p>
            <NewsletterMini />
          </div>
        </div>

        <div
          style={{
            padding: "24px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "rgba(250,250,250,0.4)",
          }}
        >
          <span>
            © {new Date().getFullYear()} Pastor Daniel Akintola. All rights
            reserved.
          </span>
          <Link
            to="/admin/login"
            style={{ color: "rgba(250,250,250,0.2)", fontSize: 11 }}
          >
            Admin
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

function NewsletterMini() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newsletterService.subscribe({ email });
      setDone(true);
    } catch {}
  };

  if (done)
    return (
      <p style={{ fontSize: 13, color: "var(--accent)" }}>
        ✓ You're subscribed!
      </p>
    );

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Your email"
        required
        style={{
          padding: "10px 12px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(22,163,74,0.3)",
          borderRadius: "var(--radius)",
          color: "var(--cream)",
          fontSize: 13,
        }}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        style={{ justifyContent: "center" }}
      >
        Subscribe
      </button>
    </form>
  );
}
