// src/pages/admin/Newsletter.jsx
import { useState, useEffect } from "react";
import { newsletterService } from "../../services/newsletter.service.js";
import { Users, Mail } from "lucide-react";
import { format } from "date-fns";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    newsletterService
      .getAll()
      .then((res) => setSubscribers(res.data.subscribers || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Newsletter</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {subscribers.length} subscribers
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "Total Subscribers",
            value: subscribers.length,
            icon: <Users size={20} />,
            color: "var(--gold)",
          },
          {
            label: "This Month",
            value: subscribers.filter(
              (s) =>
                new Date(s.subscribedAt).getMonth() === new Date().getMonth(),
            ).length,
            icon: <Mail size={20} />,
            color: "#3b82f6",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius)",
                background: `${s.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "var(--navy)",
                }}
              >
                {s.value}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <input
            className="form-input"
            placeholder="Search subscribers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid var(--border)",
                borderTopColor: "var(--gold)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }}
            />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>No subscribers found.</p>
          </div>
        ) : (
          <>
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              className="desktop-table"
            >
              <thead>
                <tr style={{ background: "var(--cream)" }}>
                  {["Name", "Email", "Subscribed"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s._id}
                    style={{
                      borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <td style={{ padding: "14px 20px", fontSize: 14 }}>
                      {s.name || "—"}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 14 }}>
                      {s.email}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      {format(new Date(s.subscribedAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className="mobile-cards"
              style={{
                display: "none",
                flexDirection: "column",
                padding: 16,
                gap: 10,
              }}
            >
              {filtered.map((s) => (
                <div
                  key={s._id}
                  style={{
                    background: "var(--cream)",
                    borderRadius: "var(--radius)",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>
                      {s.name || s.email}
                    </p>
                    {s.name && (
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {s.email}
                      </p>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {format(new Date(s.subscribedAt), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`@media(max-width:640px){.desktop-table{display:none!important}.mobile-cards{display:flex!important}}`}</style>
    </div>
  );
}
