// src/pages/public/About.jsx
import { Link } from "react-router-dom";
import { Youtube, ArrowRight, BookOpen, Mic, Heart, Globe } from "lucide-react";
import { SOCIALS } from "../../config/socials.js";

export default function About() {
  const milestones = [
    {
      year: "2000",
      title: "Ministry Founded",
      desc: "Pastor Daniel Akintola established the ministry with a vision to reach the unreached and disciple believers.",
    },
    {
      year: "2005",
      title: "First Outreach Campaign",
      desc: "A landmark gospel outreach that recorded over 1,000 decisions for Christ across three states.",
    },
    {
      year: "2010",
      title: "International Reach",
      desc: "The ministry expanded beyond Nigeria, hosting conferences in the UK, US, and across West Africa.",
    },
    {
      year: "2015",
      title: "Online Ministry Launch",
      desc: "Launched digital platforms to reach millions with the Word through podcasts and YouTube.",
    },
    {
      year: "2020",
      title: "20 Years of Ministry",
      desc: "Celebrated two decades of faithful service, with thousands of lives transformed globally.",
    },
    {
      year: "2024",
      title: "Still Going Strong",
      desc: "Continuing to preach, counsel, and disciple with the same fire and passion from day one.",
    },
  ];

  const values = [
    {
      icon: <BookOpen size={24} color="var(--gold)" />,
      title: "The Word",
      desc: "Every message is rooted in Scripture. We believe the Bible is the unchanging foundation of life.",
    },
    {
      icon: <Heart size={24} color="var(--gold)" />,
      title: "Love & Care",
      desc: "We are committed to loving people where they are and walking with them towards God's purpose.",
    },
    {
      icon: <Mic size={24} color="var(--gold)" />,
      title: "Proclamation",
      desc: "We preach the Gospel without compromise — in churches, crusades, and across digital platforms.",
    },
    {
      icon: <Globe size={24} color="var(--gold)" />,
      title: "Global Vision",
      desc: "Our mandate extends beyond our locality. We believe the Great Commission is for every nation.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          minHeight: "70vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src="/pastor_image_4.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(13, 27, 42, 0.91) 60%, rgba(13,27,42,0.7) 100%)",
            }}
          />
        </div>
        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: 60,
            paddingBottom: 80,
          }}
        >
          <div className="about-hero-grid">
            <div>
              <div className="tag" style={{ marginBottom: 20 }}>
                The Man Behind the Ministry
              </div>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "var(--cream)",
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                Pastor Daniel Akintola
                <br />
                <em style={{ color: "var(--gold)" }}>Servant of God</em>
              </h1>
              <div className="gold-divider" style={{ marginBottom: 24 }} />
              <p
                style={{
                  color: "rgba(248,245,239,0.7)",
                  lineHeight: 1.9,
                  fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
                  maxWidth: 520,
                  marginBottom: 32,
                }}
              >
                For over two decades, Pastor Daniel Akintola has been a voice of
                faith, hope, and transformation. Called by God and commissioned
                to preach the Gospel, his life is a testament to what God can do
                through a willing vessel.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/contact" className="btn btn-primary">
                  Get in Touch <ArrowRight size={15} />
                </Link>
                <a
                  href={SOCIALS.youtube.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Youtube size={15} /> Watch on YouTube
                </a>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{ position: "relative", maxWidth: 400, width: "100%" }}
              >
                <img
                  // src="https://placehold.co/400x500/162436/C9A84C?text=Pastor+Akintola"
                  src="/pastor_image_3.jpg"
                  alt="Pastor Daniel Akintola"
                  style={{
                    width: "100%",
                    borderRadius: "var(--radius-lg)",
                    display: "block",
                    border: "3px solid rgba(201,168,76,0.3)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -16,
                    right: -16,
                    background: "var(--gold)",
                    padding: "16px 20px",
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
                      marginTop: 3,
                    }}
                  >
                    Years in Ministry
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--gold)", padding: "36px 0" }}>
        <div className="container">
          <div className="about-stats">
            {[
              { num: "500+", label: "Sermons Preached" },
              { num: "50+", label: "Nations Reached" },
              { num: "1000+", label: "Lives Transformed" },
              { num: "20+", label: "Years of Service" },
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
                    color: "var(--navy)",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "rgba(13,27,42,0.65)",
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

      {/* Biography */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 16 }}>
              His Story
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                marginBottom: 10,
              }}
            >
              Biography
            </h2>
            <div className="gold-divider center" />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
            className="bio-grid"
          >
            {[
              `Daniel Oluwagbemileke Akintola is a minister in The Apostolic Church. He is called and commisioned as a deliverance minister with the liberation mandate to bringing men out of the oppression of sin and the devil through the power in the Word of God. He has been used of God to impacting the lives of young folks all over the country. He has ministered in Conferences, Seminars, Crusades, and most campuses in Nigeria.`,
              `He is a dyanmic television preacher, the host of Excellent Living on Glorious Vision TV, the president of ROD online Television and LAWMNA Drama Leader.`,
              `He was educated in both Theological Institution, Polythenic and University. He is the author of several books. He is currently the Area Evangelist of Lagos Area as well as the Yaba District Pastor of The Apostolic Church Nigeria. He is blessed with a loving wife and commited children.`,
              `Today, Pastor Daniel Akintola continues to preach across Nigeria and internationally, hosts regular conferences and revivals, counsels individuals and families, and reaches millions through his YouTube channel, social media platforms, and this ministry website.`,
            ].map((text, i) => (
              <p
                key={i}
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 16 }}>
              What We Stand For
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                marginBottom: 10,
              }}
            >
              Our Core Values
            </h2>
            <div className="gold-divider center" />
          </div>
          <div className="grid-4" style={{ gap: 20 }}>
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "var(--cream)",
                  borderRadius: "var(--radius-lg)",
                  padding: 28,
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: "rgba(201,168,76,0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 10 }}>{v.title}</h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: "var(--navy)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag" style={{ marginBottom: 16 }}>
              The Journey
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                color: "var(--cream)",
                marginBottom: 10,
              }}
            >
              Ministry Milestones
            </h2>
            <div className="gold-divider center" />
          </div>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 2,
                background: "rgba(201,168,76,0.2)",
                transform: "translateX(-50%)",
              }}
              className="timeline-line"
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className="timeline-item"
                  style={{
                    display: "flex",
                    gap: 0,
                    alignItems: "flex-start",
                    flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      paddingRight: i % 2 === 0 ? 40 : 0,
                      paddingLeft: i % 2 !== 0 ? 40 : 0,
                      textAlign: i % 2 === 0 ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px 24px",
                        border: "1px solid rgba(201,168,76,0.15)",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--gold)",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 2,
                          marginBottom: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        {m.year}
                      </p>
                      <h3
                        style={{
                          color: "var(--cream)",
                          fontSize: 16,
                          marginBottom: 8,
                        }}
                      >
                        {m.title}
                      </h3>
                      <p
                        style={{
                          color: "rgba(248,245,239,0.6)",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
                        {m.desc}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      border: "3px solid var(--navy)",
                      flexShrink: 0,
                      marginTop: 24,
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  <div style={{ flex: 1 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube CTA */}
      <section style={{ background: "var(--cream)", padding: "64px 0" }}>
        <div
          className="container"
          style={{ maxWidth: 700, textAlign: "center" }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              background: "#d60000",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Youtube size={36} color="white" />
          </div>
          <h2
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: 12 }}
          >
            Watch the Ministry on YouTube
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 28,
              lineHeight: 1.8,
            }}
          >
            Subscribe to our YouTube channel for sermons, live services,
            devotionals, and ministry updates. Join {SOCIALS.youtube.handle} and
            never miss a message.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href={SOCIALS.youtube.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#d60000",
                color: "white",
                padding: "14px 28px",
                borderRadius: "var(--radius)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 1,
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <Youtube size={16} /> Subscribe Now
            </a>
            <Link
              to="/videos"
              className="btn btn-outline"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <BookOpen size={14} /> Browse Videos
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .bio-grid {
          grid-template-columns: 1fr 1fr;
        }
        .timeline-line { display: block; }
        @media (max-width: 900px) {
          .about-hero-grid { grid-template-columns: 1fr; }
          .about-hero-grid > div:last-child { display: none; }
          .timeline-line { display: none; }
          .timeline-item { flex-direction: column !important; }
          .timeline-item > div:last-child { display: none; }
          .timeline-item > div:first-child { padding: 0 !important; text-align: left !important; flex: none; width: 100%; }
          .timeline-item > div:nth-child(2) { display: none; }
        }
        @media (max-width: 768px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .bio-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
