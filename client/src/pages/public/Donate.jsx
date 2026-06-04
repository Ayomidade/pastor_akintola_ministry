// src/pages/public/Donate.jsx
import { useState } from "react";
import {
  Heart,
  CreditCard,
  Building,
  Copy,
  Check,
  Shield,
  Youtube,
} from "lucide-react";
import { SOCIALS } from "../../config/socials.js";
import toast from "react-hot-toast";

// ─── UPDATE THESE with real details ──────────────────────────────
const BANK_ACCOUNTS = [
  {
    bank: "First Bank of Nigeria",
    accountName: "Pastor Daniel Akintola Ministries",
    accountNumber: "3012345678",
    logo: "FB",
  },
  {
    bank: "Zenith Bank",
    accountName: "Pastor Daniel Akintola Ministries",
    accountNumber: "2098765432",
    logo: "ZB",
  },
  {
    bank: "GTBank",
    accountName: "Pastor Daniel Akintola Ministries",
    accountNumber: "0123456789",
    logo: "GT",
  },
];

export default function Donate() {
  const [copied, setCopied] = useState("");

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(""), 2500);
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Support the Ministry
          </div>
          <h1>Give & Donate</h1>
          <p>Your giving fuels the Gospel — thank you for your generosity</p>
        </div>
      </div>

      {/* Scripture */}
      <section
        style={{
          background: "var(--gold)",
          padding: "32px 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 600 }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
              color: "var(--navy)",
              lineHeight: 1.7,
            }}
          >
            "Each man should give what he have decided in his heart to give, not
            reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(13,27,42,0.6)",
            }}
          >
            2 Corinthians 9:7
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="donate-grid">
            {/* Left — giving form */}
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  marginBottom: 28,
                  border: "2px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: "13px 0",
                    border: "none",
                    background: "var(--gold)",
                    color: "var(--navy)",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Building size={14} /> {"Bank Transfer"}
                </button>
              </div>

              {/* Bank Transfer */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    marginBottom: 8,
                  }}
                >
                  Transfer your gift directly to any of the accounts below.
                  Please use your name as the payment reference.
                </p>
                {BANK_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.bank}
                    style={{
                      background: "var(--white)",
                      borderRadius: "var(--radius-lg)",
                      padding: "20px 24px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "var(--radius)",
                          background: "var(--navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--gold)",
                          flexShrink: 0,
                        }}
                      >
                        {acc.logo}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            marginBottom: 2,
                          }}
                        >
                          {acc.bank}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {acc.accountName}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "var(--cream)",
                        borderRadius: "var(--radius)",
                        padding: "12px 16px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            marginBottom: 4,
                          }}
                        >
                          Account Number
                        </p>
                        <p
                          style={{
                            fontFamily: "monospace",
                            fontSize: 20,
                            fontWeight: 700,
                            letterSpacing: 3,
                            color: "var(--navy)",
                          }}
                        >
                          {acc.accountNumber}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(acc.accountNumber, acc.bank)
                        }
                        style={{
                          background:
                            copied === acc.bank
                              ? "var(--gold)"
                              : "var(--white)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                          padding: "8px 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          color:
                            copied === acc.bank
                              ? "var(--navy)"
                              : "var(--text-secondary)",
                          transition: "all 0.2s",
                        }}
                      >
                        {copied === acc.bank ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copied === acc.bank ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    background: "rgba(201,168,76,0.1)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px 20px",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--navy)",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong>Note:</strong> After transferring, kindly send your
                    name, amount, and bank to{" "}
                    <a
                      href="mailto:pastordanielakintola@gmail.com"
                      style={{ color: "var(--gold)", fontWeight: 700 }}
                    >
                      pastordanielakintola@gmail.com
                    </a>{" "}
                    for confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — why give */}
            <div>
              <div
                style={{
                  background: "var(--navy)",
                  borderRadius: "var(--radius-lg)",
                  padding: "32px 28px",
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{
                    color: "var(--gold)",
                    fontSize: 18,
                    marginBottom: 20,
                  }}
                >
                  Why Your Gift Matters
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {[
                    {
                      icon: "🎙️",
                      title: "Sermon Production",
                      desc: "Funds recording, editing, and distribution of messages across platforms.",
                    },
                    {
                      icon: "🌍",
                      title: "Outreach Campaigns",
                      desc: "Enables us to reach communities with the Gospel locally and globally.",
                    },
                    {
                      icon: "📚",
                      title: "Resources & Ebooks",
                      desc: "Supports the creation of free teaching materials for believers worldwide.",
                    },
                    {
                      icon: "🤝",
                      title: "Welfare & Counselling",
                      desc: "Helps us care for those in need and provide free counselling services.",
                    },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: 14 }}>
                      <div
                        style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            color: "var(--cream)",
                            fontWeight: 700,
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          {item.title}
                        </p>
                        <p
                          style={{
                            color: "rgba(248,245,239,0.55)",
                            fontSize: 13,
                            lineHeight: 1.7,
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tithe note */}
              {/* <div
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 28px",
                  border: "1px solid var(--border)",
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Heart size={16} color="var(--gold)" /> Tithes & Offerings
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    lineHeight: 1.8,
                  }}
                >
                  We receive tithes, offerings, first-fruits, and all forms of
                  seeds sown into the Kingdom. Every gift, large or small, is
                  received with prayer and gratitude.
                  <em
                    style={{
                      display: "block",
                      marginTop: 10,
                      color: "var(--gold)",
                    }}
                  >
                    "Bring the whole tithe into the storehouse..." — Malachi
                    3:10
                  </em>
                </p>
              </div> */}

              {/* YouTube give CeTA */}
              <a
                href={SOCIALS.youtube.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "#d60000",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 24px",
                  textDecoration: "none",
                }}
              >
                <Youtube size={32} color="white" style={{ flexShrink: 0 }} />
                <div>
                  <p
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Support us on YouTube
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                    Subscribe, like and share — it helps us reach more people
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .donate-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .amount-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 900px) {
          .donate-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .amount-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
