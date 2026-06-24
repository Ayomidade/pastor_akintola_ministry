import { useState, useEffect } from "react";
import { newsletterService } from "../../services/newsletter.service.js";
import { Users, Mail, Send, Eye, X, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]); // selected subscriber IDs
  const [selectAll, setSelectAll] = useState(false);
  const [view, setView] = useState("subscribers"); // "subscribers" | "compose"
  const [form, setForm] = useState({ subject: "", message: "" });
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

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

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(filtered.map((s) => s._id));
      setSelectAll(true);
    }
  };

  const clearSelection = () => {
    setSelected([]);
    setSelectAll(false);
  };

  const recipientCount =
    selected.length > 0 ? selected.length : subscribers.length;

  const recipientLabel =
    selected.length > 0
      ? `${selected.length} selected subscriber${selected.length !== 1 ? "s" : ""}`
      : `All ${subscribers.length} subscriber${subscribers.length !== 1 ? "s" : ""}`;

  const handleSend = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      return toast.error("Subject and message are required.");
    }

    setSending(true);
    setResult(null);

    try {
      const payload = {
        subject: form.subject,
        message: form.message,
        ...(selected.length > 0 && { recipientIds: selected }),
      };

      const res = await newsletterService.sendBulkEmail(payload);
      setResult(res.data);
      toast.success(res.data.message);
      setPreview(false);

      // Reset form after successful send
      setForm({ subject: "", message: "" });
      setSelected([]);
      setSelectAll(false);
      setView("subscribers");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: "24px 16px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Newsletter</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setView("subscribers")}
            className={`btn btn-sm ${view === "subscribers" ? "btn-dark" : "btn-outline"}`}
          >
            <Users size={14} /> Subscribers
          </button>
          <button
            onClick={() => setView("compose")}
            className={`btn btn-sm ${view === "compose" ? "btn-primary" : "btn-outline"}`}
            disabled={subscribers.length === 0}
          >
            <Mail size={14} /> Compose Email
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Total Subscribers",
            value: subscribers.length,
            icon: <Users size={20} />,
            color: "var(--accent)",
          },
          {
            label: "This Month",
            value: subscribers.filter(
              (s) =>
                new Date(s.subscribedAt).getMonth() === new Date().getMonth() &&
                new Date(s.subscribedAt).getFullYear() ===
                  new Date().getFullYear(),
            ).length,
            icon: <Mail size={20} />,
            color: "#2563EB",
          },
          {
            label: "Selected",
            value: selected.length,
            icon: <Check size={20} />,
            color: selected.length > 0 ? "var(--accent)" : "var(--text-muted)",
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
                background: `${s.color}15`,
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
                  color: "var(--primary)",
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

      {/* Send result banner */}
      {result && (
        <div
          style={{
            background: result.results.failed > 0 ? "#FEF9C3" : "#F0FAF4",
            border: `1px solid ${result.results.failed > 0 ? "#D97706" : "var(--accent)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div
            style={{
              color: result.results.failed > 0 ? "#D97706" : "var(--accent)",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {result.results.failed > 0 ? (
              <AlertCircle size={18} />
            ) : (
              <Check size={18} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {result.message}
            </p>
            {result.results.failed > 0 && (
              <p style={{ fontSize: 13, color: "#92400E" }}>
                {result.results.failed} failed:{" "}
                {result.results.failedEmails.join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={() => setResult(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 2,
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Subscribers View ─────────────────────────────────────── */}
      {view === "subscribers" && (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              className="form-input"
              placeholder="Search subscribers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectAll(false);
              }}
              style={{ maxWidth: 280, marginBottom: 0 }}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                marginLeft: "auto",
                flexWrap: "wrap",
              }}
            >
              {selected.length > 0 && (
                <>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--accent)",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Check size={14} /> {selected.length} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="btn btn-outline btn-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setView("compose")}
                    className="btn btn-primary btn-sm"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Mail size={13} /> Email Selected
                  </button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "3px solid var(--border)",
                  borderTopColor: "var(--accent)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto",
                }}
              />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>
                {search
                  ? "No subscribers match your search."
                  : "No subscribers yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="desktop-table">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--cream)" }}>
                      <th style={{ padding: "12px 20px", width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          style={{
                            width: 16,
                            height: 16,
                            accentColor: "var(--accent)",
                            cursor: "pointer",
                          }}
                        />
                      </th>
                      {["Name", "Email", "Subscribed"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
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
                          background: selected.includes(s._id)
                            ? "rgba(22,163,74,0.04)"
                            : "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleSelect(s._id)}
                      >
                        <td style={{ padding: "14px 20px" }}>
                          <input
                            type="checkbox"
                            checked={selected.includes(s._id)}
                            onChange={() => toggleSelect(s._id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: 16,
                              height: 16,
                              accentColor: "var(--accent)",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14 }}>
                          {s.name || (
                            <span style={{ color: "var(--border)" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14 }}>
                          {s.email}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
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
              </div>

              {/* Mobile cards */}
              <div
                className="mobile-cards"
                style={{
                  display: "none",
                  flexDirection: "column",
                  padding: 16,
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: "var(--accent)",
                      }}
                    />
                    Select all
                  </label>
                </div>
                {filtered.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => toggleSelect(s._id)}
                    style={{
                      background: selected.includes(s._id)
                        ? "rgba(22,163,74,0.06)"
                        : "var(--cream)",
                      borderRadius: "var(--radius)",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      border: `1px solid ${selected.includes(s._id) ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(s._id)}
                      onChange={() => toggleSelect(s._id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: "var(--accent)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          marginBottom: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.name || s.email}
                      </p>
                      {s.name && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.email}
                        </p>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    >
                      {format(new Date(s.subscribedAt), "MMM d")}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Compose View ─────────────────────────────────────────── */}
      {view === "compose" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
            alignItems: "start",
          }}
          className="compose-grid"
        >
          {/* Compose form */}
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
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                background: "var(--cream)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{ fontSize: 18 }}>Compose Email</h2>
              <button
                onClick={() => setView("subscribers")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <X size={14} /> Cancel
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Recipients indicator */}
              <div
                style={{
                  background: "rgba(22,163,74,0.08)",
                  border: "1px solid rgba(22,163,74,0.2)",
                  borderRadius: "var(--radius)",
                  padding: "10px 16px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Users size={14} color="var(--accent)" />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  Sending to: {recipientLabel}
                </span>
                {selected.length > 0 && (
                  <button
                    onClick={clearSelection}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      marginLeft: "auto",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <X size={12} /> Send to all instead
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  className="form-input"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  placeholder="Email subject line..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input form-textarea"
                  style={{
                    minHeight: 280,
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.8,
                  }}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Write your message here...

You can use line breaks to structure your message. Each paragraph will be preserved in the email."
                  required
                />
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 6,
                  }}
                >
                  {form.message.length} characters ·{" "}
                  {form.message.split("\n").filter(Boolean).length} paragraph
                  {form.message.split("\n").filter(Boolean).length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => setPreview(true)}
                  className="btn btn-outline btn-sm"
                  disabled={!form.subject || !form.message}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Eye size={14} /> Preview Email
                </button>
              </div>
            </div>
          </div>

          {/* Right panel — tips + send */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Send card */}
            <div
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                padding: 24,
              }}
            >
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Ready to Send?</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  { label: "Recipients", value: recipientLabel },
                  {
                    label: "Subject",
                    value: form.subject || (
                      <span style={{ color: "var(--border)" }}>Not set</span>
                    ),
                  },
                  {
                    label: "Message",
                    value: form.message ? (
                      `${form.message.length} characters`
                    ) : (
                      <span style={{ color: "var(--border)" }}>Empty</span>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{ color: "var(--text-muted)", fontWeight: 700 }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: "var(--text-primary)",
                        textAlign: "right",
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPreview(true)}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={!form.subject || !form.message || sending}
              >
                <Eye size={15} /> Preview & Send
              </button>
            </div>

            {/* Tips card */}
            <div
              style={{
                background: "var(--cream-dark)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                border: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 14,
                }}
              >
                Tips
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "Use line breaks to separate paragraphs clearly",
                  "Keep the subject short and clear — under 60 characters",
                  "Select specific subscribers to send a targeted message",
                  "Preview the email before sending to check formatting",
                ].map((tip) => (
                  <li
                    key={tip}
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent)",
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      →
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ────────────────────────────────────────── */}
      {preview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(33,33,33,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setPreview(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              width: "100%",
              maxWidth: 660,
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div>
                <h3 style={{ fontSize: 17, marginBottom: 2 }}>Email Preview</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  This is how your email will look to recipients
                </p>
              </div>
              <button
                onClick={() => setPreview(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Email preview */}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: 24,
                background: "#F0FAF4",
              }}
            >
              {/* Simulated email client header */}
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--radius-lg)",
                  padding: "14px 20px",
                  marginBottom: 16,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-muted)", minWidth: 50 }}>
                    From:
                  </span>
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                      "Pastor Daniel Akintola"
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-muted)", minWidth: 50 }}>
                    To:
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {recipientLabel}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--text-muted)", minWidth: 50 }}>
                    Subject:
                  </span>
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 700 }}
                  >
                    {form.subject}
                  </span>
                </div>
              </div>

              {/* Email body preview */}
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Email header */}
                <div
                  style={{
                    background: "#212121",
                    padding: "28px 32px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#16A34A",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Pastor Daniel Akintola
                  </p>
                  {/* <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Ministries
                  </p> */}
                </div>

                {/* Green line */}
                <div style={{ height: 4, background: "#16A34A" }} />

                {/* Subject */}
                <div style={{ padding: "28px 32px 8px" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                      color: "#111111",
                      fontFamily: "Georgia, serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {form.subject}
                  </h2>
                </div>

                {/* Divider */}
                <div style={{ padding: "0 32px 20px" }}>
                  <div
                    style={{ width: 40, height: 3, background: "#16A34A" }}
                  />
                </div>

                {/* Message body */}
                <div style={{ padding: "0 32px 32px" }}>
                  {form.message
                    .split("\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        style={{
                          margin: "0 0 16px",
                          fontSize: 15,
                          color: "#404040",
                          lineHeight: 1.85,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                </div>

                {/* CTA button */}
                <div style={{ padding: "0 32px 32px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      background: "#16A34A",
                      color: "#ffffff",
                      padding: "12px 24px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Visit Our Website
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    background: "#F0FAF4",
                    padding: "20px 32px",
                    borderTop: "1px solid #E5E5E5",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 11,
                      color: "#737373",
                    }}
                  >
                    You are receiving this because you subscribed to our
                    newsletter.
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#737373" }}>
                    © {new Date().getFullYear()} Pastor Daniel Akintola
                    Ministries. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal footer — send action */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  Send to {recipientCount} recipient
                  {recipientCount !== 1 ? "s" : ""}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  This action cannot be undone
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setPreview(false)}
                  className="btn btn-outline btn-sm"
                >
                  Edit Email
                </button>
                <button
                  onClick={handleSend}
                  className="btn btn-primary btn-sm"
                  disabled={sending}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Send size={14} />
                  {sending ? `Sending to ${recipientCount}...` : `Send Now`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-cards { display: flex !important; }
          .compose-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
