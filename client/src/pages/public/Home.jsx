// src/pages/public/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Headphones,
  Calendar,
  ArrowRight,
  Play,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { postService } from "../../services/post.service.js";
import { sermonService } from "../../services/sermon.service.js";
import { eventService } from "../../services/event.service.js";
import { livestreamService } from "../../services/livestream.service.js";
import { newsletterService } from "../../services/newsletter.service.js";
import { SkeletonCard } from "../../components/shared/Skeleton.jsx";
import { SOCIALS } from "../../config/socials.js";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [livestream, setLivestream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    Promise.all([
      postService.getAll({ published: true, limit: 3 }),
      sermonService.getAll({ published: true, limit: 3 }),
      eventService.getAll({ upcoming: true, limit: 3 }),
      livestreamService.getActive(),
    ])
      .then(([p, s, e, l]) => {
        setPosts(p.data.data || []);
        setSermons(s.data.data || []);
        setEvents(e.data.data || []);
        setLivestream(l.data.livestream);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await newsletterService.subscribe({ email });
      toast.success("You're subscribed!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed.");
    }
  };

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            // src="https://placehold.co/1920x1080/0D1B2A/C9A84C?text=+"
            src="/pastor_image_2.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.15,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(13, 27, 42, 0.28) 50%, rgba(13,27,42,0.7) 100%)",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: 120,
            paddingBottom: 80,
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <div className="tag" style={{ marginBottom: 20 }}>
              Welcome to the Ministry
            </div>
            <h1
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
                color: "var(--cream)",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Walking in Faith,
              <br />
              <em style={{ color: "var(--gold)" }}>Living in Grace</em>
            </h1>
            <div className="gold-divider" style={{ marginBottom: 20 }} />
            <p
              style={{
                fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                color: "rgba(248,245,239,0.72)",
                lineHeight: 1.85,
                maxWidth: 520,
                marginBottom: 36,
              }}
            >
              Join us as we explore the depths of God's Word, worship together,
              and grow in the knowledge of His love and purpose for our lives.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/sermons" className="btn btn-primary">
                <Headphones size={15} /> Listen to Sermons
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Connect With Us <ArrowRight size={15} />
              </Link>
            </div>

            {/* Social row in hero */}
            <div
              style={{
                marginTop: 48,
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(248,245,239,0.3)",
                }}
              >
                Follow us
              </span>
              {[
                {
                  href: SOCIALS.youtube?.url,
                  icon: <Youtube size={18} />,
                  label: "YouTube",
                },
                {
                  href: SOCIALS.facebook?.url,
                  icon: <Facebook size={18} />,
                  label: "Facebook",
                },
                {
                  href: SOCIALS.instagram?.url,
                  icon: <Instagram size={18} />,
                  label: "Instagram",
                },
                {
                  href: SOCIALS.twitter?.url,
                  icon: <Twitter size={18} />,
                  label: "Twitter",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(248,245,239,0.55)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--gold)";
                    e.currentTarget.style.color = "var(--navy)";
                    e.currentTarget.style.borderColor = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(248,245,239,0.55)";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: "rgba(248,245,239,0.25)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Scroll</span>
          <div
            style={{
              width: 1,
              height: 36,
              background:
                "linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)",
            }}
          />
        </div> */}
      </section>

      {/* ── Livestream sticky banner ─────────────────────────────────── */}
      {livestream && (
        <div
          style={{
            position: "fixed",
            top: 72,
            left: 0,
            right: 0,
            zIndex: 900,
            background: "var(--gold)",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#e53e3e",
                animation: "pulse 1.5s infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontWeight: 700,
                color: "var(--navy)",
                fontSize: 13,
                letterSpacing: 0.5,
              }}
            >
              LIVE NOW — {livestream.title}
            </span>
          </div>
          <a
            href={livestream.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--navy)",
              color: "var(--cream)",
              padding: "7px 16px",
              borderRadius: "var(--radius)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            <Youtube size={13} /> Watch Live
          </a>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        </div>
      )}

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--border)",
          padding: "36px 0",
        }}
      >
        <div className="container">
          <div className="stats-grid">
            {[
              { num: "500+", label: "Sermons Preached" },
              { num: "20+", label: "Years of Ministry" },
              { num: "1000+", label: "Lives Transformed" },
              { num: "50+", label: "Nations Reached" },
            ].map((s) => (
              <div
                key={s.label}
                style={{ textAlign: "center", padding: "8px 0" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About strip ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="about-grid">
            <div>
              <div className="tag" style={{ marginBottom: 16 }}>
                About the Pastor
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  marginBottom: 16,
                }}
              >
                A Life Surrendered
                <br />
                to God's Purpose
              </h2>
              <div className="gold-divider" style={{ marginBottom: 24 }} />
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                  marginBottom: 16,
                }}
              >
                With decades of ministry experience, Pastor Daniel Akintola has
                dedicated his life to the teaching of God's Word, the
                transformation of lives, and the building of the Kingdom of God
                across nations.
              </p>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                  marginBottom: 32,
                }}
              >
                Through preaching, counselling, and discipleship, the ministry
                continues to impact thousands of lives across Nigeria and
                beyond.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/about" className="btn btn-primary">
                  Learn More <ArrowRight size={15} />
                </Link>
                <a
                  href={SOCIALS.youtube?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Youtube size={16} /> Watch on YouTube
                </a>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <img
                // src="https://placehold.co/560x600/0D1B2A/C9A84C?text=Pastor+Akintola"
                src="/pastor_image_7.jpg"
                alt="Pastor Daniel Akintola"
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-lg)",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -16,
                  left: -16,
                  background: "var(--gold)",
                  padding: "18px 22px",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--navy)",
                    lineHeight: 1,
                  }}
                >
                  20+
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "var(--navy)",
                    marginTop: 4,
                  }}
                >
                  Years of Ministry
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── YouTube CTA ──────────────────────────────────────────────── */}
      <section style={{ background: "var(--navy)", padding: "64px 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#d60000",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Youtube size={32} color="white" />
              </div>
              <div>
                <h3
                  style={{
                    color: "var(--cream)",
                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                    marginBottom: 6,
                  }}
                >
                  Subscribe on YouTube
                </h3>
                <p style={{ color: "rgba(248,245,239,0.6)", fontSize: 14 }}>
                  Watch sermons, live services, and devotionals —{" "}
                  {SOCIALS.youtube?.handle}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={SOCIALS.youtube?.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#d60000",
                  color: "white",
                  padding: "13px 24px",
                  borderRadius: "var(--radius)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                <Youtube size={16} /> Subscribe Now
              </a>
              <Link
                to="/videos"
                className="btn btn-outline"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Play size={15} /> Watch Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Sermons ───────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--navy)" }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="tag" style={{ marginBottom: 12 }}>
                Audio Messages
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  color: "var(--cream)",
                }}
              >
                Latest Sermons
              </h2>
              <div className="gold-divider" style={{ marginTop: 10 }} />
            </div>
            <Link
              to="/sermons"
              style={{
                color: "var(--gold)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              All Sermons <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid-3">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : sermons.length === 0 ? (
              <p style={{ color: "rgba(248,245,239,0.4)", gridColumn: "1/-1" }}>
                No sermons yet.
              </p>
            ) : (
              sermons.map((s) => (
                <Link
                  key={s._id}
                  to={`/sermons/${s.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(201,168,76,0.12)",
                    }}
                  >
                    <img
                      src={
                        s.thumbnail?.url ||
                        "https://placehold.co/400x220/162436/C9A84C?text=Sermon"
                      }
                      alt={s.title}
                      style={{ width: "100%", height: 190, objectFit: "cover" }}
                    />
                    <div style={{ padding: 18 }}>
                      {s.series && (
                        <div
                          className="tag"
                          style={{ marginBottom: 8, fontSize: 10 }}
                        >
                          {s.series}
                        </div>
                      )}
                      <h3
                        style={{
                          fontSize: 16,
                          color: "var(--cream)",
                          marginBottom: 6,
                          lineHeight: 1.3,
                        }}
                      >
                        {s.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(248,245,239,0.45)",
                        }}
                      >
                        {s.preacher} • {format(new Date(s.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Latest Posts ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="tag" style={{ marginBottom: 12 }}>
                From the Blog
              </div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                Articles & Updates
              </h2>
              <div className="gold-divider" style={{ marginTop: 10 }} />
            </div>
            <Link
              to="/blog"
              style={{
                color: "var(--gold)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              All Posts <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid-3">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : posts.length === 0 ? (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1" }}>
                No posts yet.
              </p>
            ) : (
              posts.map((p) => (
                <Link
                  key={p._id}
                  to={`/blog/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card">
                    <img
                      src={
                        p.featuredImage?.url ||
                        "https://placehold.co/400x220/0D1B2A/C9A84C?text=Article"
                      }
                      alt={p.title}
                      style={{ width: "100%", height: 190, objectFit: "cover" }}
                    />
                    <div style={{ padding: 18 }}>
                      <div className="tag" style={{ marginBottom: 8 }}>
                        {p.category}
                      </div>
                      <h3
                        style={{
                          fontSize: 17,
                          marginBottom: 8,
                          lineHeight: 1.3,
                        }}
                      >
                        {p.title}
                      </h3>
                      {p.scripture && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--gold)",
                            fontStyle: "italic",
                            marginBottom: 6,
                          }}
                        >
                          "{p.scripture}"
                        </p>
                      )}
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {format(new Date(p.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────── */}
      {events.length > 0 && (
        <section className="section" style={{ background: "var(--white)" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <div className="tag" style={{ marginBottom: 12 }}>
                  Coming Up
                </div>
                <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                  Upcoming Events
                </h2>
                <div className="gold-divider" style={{ marginTop: 10 }} />
              </div>
              <Link
                to="/events"
                style={{
                  color: "var(--gold)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                All Events <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid-3">
              {events.map((ev) => (
                <Link
                  key={ev._id}
                  to={`/events/${ev.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card">
                    <img
                      src={
                        ev.image?.url ||
                        "https://placehold.co/400x200/0D1B2A/C9A84C?text=Event"
                      }
                      alt={ev.title}
                      style={{ width: "100%", height: 170, objectFit: "cover" }}
                    />
                    <div
                      style={{
                        padding: 18,
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--gold)",
                          borderRadius: "var(--radius)",
                          padding: "8px 12px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "var(--navy)",
                            lineHeight: 1,
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {format(new Date(ev.date), "d")}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            color: "var(--navy)",
                            marginTop: 2,
                          }}
                        >
                          {format(new Date(ev.date), "MMM")}
                        </div>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: 15,
                            lineHeight: 1.3,
                            marginBottom: 4,
                          }}
                        >
                          {ev.title}
                        </h3>
                        {ev.location && (
                          <p
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            📍 {ev.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Scripture banner ─────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--gold)",
          padding: "56px 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 680 }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              fontStyle: "italic",
              color: "var(--navy)",
              lineHeight: 1.7,
              marginBottom: 14,
            }}
          >
            "For I know the plans I have for you, declares the Lord, plans to
            prosper you and not to harm you, plans to give you hope and a
            future."
          </p>
          <p
            style={{
              fontWeight: 700,
              color: "var(--navy)",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Jeremiah 29:11
          </p>
        </div>
      </section>

      {/* ── Social media section ─────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 16 }}>
              Stay Connected
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                marginBottom: 12,
              }}
            >
              Follow the Ministry
            </h2>
            <div className="gold-divider center" />
          </div>

          <div className="socials-grid">
            {/* YouTube — featured */}
            <a
              href={SOCIALS.youtube?.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#d60000",
                borderRadius: "var(--radius-lg)",
                padding: "32px 24px",
                textAlign: "center",
                color: "white",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transition: "transform 0.2s, box-shadow 0.2s",
                // gridColumn: "span 2",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Youtube size={44} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                  YouTube
                </p>
                <p style={{ fontSize: 13, opacity: 0.85 }}>
                  {SOCIALS.youtube?.handle}
                </p>
              </div>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Subscribe & Watch
              </span>
            </a>

            {/* Facebook */}
            <a
              href={SOCIALS.facebook?.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#1877F2",
                borderRadius: "var(--radius-lg)",
                padding: "28px 20px",
                textAlign: "center",
                color: "white",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Facebook size={32} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Facebook
                </p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>
                  {SOCIALS.facebook?.handle}
                </p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>Like our page</p>
              </div>
            </a>

            {/* Instagram */}
            {/* <a
              href={SOCIALS.instagram?.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                borderRadius: "var(--radius-lg)",
                padding: "28px 20px",
                textAlign: "center",
                color: "white",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Instagram size={32} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Instagram
                </p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>
                  {SOCIALS.instagram?.handle}
                </p>
              </div>
            </a> */}

            {/* Twitter / X */}
            {/* <a
              href={SOCIALS.twitter?.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#000",
                borderRadius: "var(--radius-lg)",
                padding: "28px 20px",
                textAlign: "center",
                color: "white",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Twitter size={32} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  X (Twitter)
                </p>
                <p style={{ fontSize: 12, opacity: 0.7 }}>
                  {SOCIALS.twitter?.handle}
                </p>
              </div>
            </a> */}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────── */}
      <section
        className="section"
        style={{ background: "var(--navy)", textAlign: "center" }}
      >
        <div className="container" style={{ maxWidth: 540 }}>
          <div className="tag" style={{ marginBottom: 16 }}>
            Stay Connected
          </div>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "var(--cream)",
              marginBottom: 10,
            }}
          >
            Never Miss a Blessing
          </h2>
          <div className="gold-divider center" style={{ marginBottom: 16 }} />
          <p
            style={{
              color: "rgba(248,245,239,0.55)",
              marginBottom: 28,
              fontSize: 15,
            }}
          >
            Subscribe for devotionals, sermon updates, and event notices.
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{
                flex: 1,
                padding: "13px 16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "var(--radius)",
                color: "var(--cream)",
                fontSize: 14,
              }}
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          gap: 16px;
        }
        .socials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .newsletter-form {
          display: flex;
          gap: 12px;
          max-width: 440px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .socials-grid { grid-template-columns: repeat(2, 1fr); }
          .socials-grid > a:first-child { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .about-grid { grid-template-columns: 1fr; gap: 32px; }
          .about-grid > div:last-child { display: none; }
          .section-header { flex-direction: column; align-items: flex-start; }
          .socials-grid { grid-template-columns: 1fr 1fr; }
          .socials-grid > a:first-child { grid-column: span 2; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .socials-grid { grid-template-columns: repeat(2, 1fr); }
          .socials-grid > a:first-child { grid-column: span 1; }
          .newsletter-form { flex-direction: column; }
          .newsletter-form button { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
