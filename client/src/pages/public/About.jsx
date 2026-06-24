// src/pages/public/About.jsx
import { Link } from "react-router-dom";
import {
  Youtube,
  ArrowRight,
  BookOpen,
  Mic,
  Heart,
  Globe,
  Shield,
  Group,
  GroupIcon,
} from "lucide-react";
import { SOCIALS } from "../../config/socials.js";

export default function About() {
 const milestones = [
   {
     year: "2001",
     title: "Ministry Begins",
     desc: "By the grace of God, Pastor Daniel Akintola answered the call to full-time ministry, beginning a journey that would touch thousands of lives.",
   },
   {
     year: "Est.",
     title: "ROD TV Pioneered",
     desc: "Pastor Akintola pioneered ROD TV, creating a platform to bring the Gospel into homes through the power of television broadcasting.",
   },
   {
     year: "Ongoing",
     title: "Excellent Living — Glorious Vision TV",
     desc: "He serves as the presenter of Excellent Living on Glorious Vision Television, delivering life-transforming messages to a wide viewership.",
   },
   {
     year: "Weekly",
     title: "Voice of Redemption — Radio Broadcast",
     desc: "Pastor Akintola anchors a weekly radio broadcast tagged Voice of Redemption, carrying the Gospel across the airwaves into homes and hearts.",
   },
   {
     year: "19+",
     title: "Abidan Productions — Gospel Movies",
     desc: "As President of Abidan Productions, he has overseen the production of over 19 Gospel movies including the widely acclaimed Ayaba Movie — using drama to evangelise and disciple.",
   },
   {
     year: "Current",
     title: "Drama Coordinator — TAC Nigeria",
     desc: "Pastor Akintola serves as the Drama Coordinator for The Apostolic Church Nigeria, Lawmna Territory, equipping and directing the use of drama for Kingdom impact.",
   },
 ];

  const values = [
    {
      icon: <BookOpen size={24} color="var(--accent)" />,
      title: "Know God Deeply",
      desc: "Everything flows from intimacy with God. We pursue a knowledge of Him that goes beyond the surface into the depths of His Word and character.",
    },
    {
      icon: <Shield size={24} color="var(--accent)" />,
      title: "Walk in Holiness",
      desc: "We believe that holiness is not optional but the natural fruit of a life surrendered to God — lived out daily in thought, word, and action.",
    },
    {
      icon: <Heart size={24} color="var(--accent)" />,
      title: "Depend on the Holy Spirit",
      desc: "We do nothing in our own strength. Every sermon preached, every movie produced, every soul reached is the work of the Holy Spirit through yielded vessels.",
    },
    {
      icon: <Globe size={24} color="var(--accent)" />,
      title: "Serve God's Kingdom Faithfully",
      desc: "We are committed to faithful, consistent service — through television, radio, drama, and the preached Word — until every soul has heard the Gospel.",
    },
    // {
    //   icon: <Group size={24} color="var(--accent)" />,
    //   title: "",
    //   desc:""
    // },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          minHeight: "70vh",
          background: "var(--primary)",
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
                "linear-gradient(135deg, rgba(13, 27, 42, 0.75) 60%, rgba(33,33,33,0.7) 100%)",
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
                  color: "var(--white)",
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                Pastor Daniel Akintola
                <br />
                <em style={{ color: "var(--accent)" }}>Servant of God</em>
              </h1>
              <div className="gold-divider" style={{ marginBottom: 24 }} />
              <p
                style={{
                  color: "rgba(250,250,250,0.7)",
                  lineHeight: 1.9,
                  fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
                  maxWidth: 520,
                  marginBottom: 32,
                }}
              >
                Since 2001, Pastor Daniel Akintola has been a voice of faith,
                transformation, and Kingdom impact, preaching over 4,000
                sermons, pioneering ROD TV, producing Gospel movies through
                Abidan Productions, and reaching nations with the message of
                Jesus Christ.
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
                    border: "3px solid rgba(22,163,74,0.3)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -16,
                    right: -16,
                    background: "var(--accent)",
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
                      color: "var(--primary)",
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
                      color: "var(--primary)",
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
      {/* <section style={{ background: "var(--accent)", padding: "36px 0" }}>
        <div className="container">
          <div className="about-stats">
            {[
              { num: "2001", label: "Year Ministry Began" },
              { num: "4,000+", label: "Sermons Preached" },
              { num: "7+", label: "Nations Reached" },
              { num: "19+", label: "Gospel Movies Produced" },
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
                    color: "var(--primary)",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "rgba(33,33,33,0.65)",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

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
              // `He is a dyanmic television preacher, the host of Excellent Living on Glorious Vision TV, the president of ROD online Television and LAWMNA Drama Leader.`,
              `He was educated in both Theological Institution, Polythenic and University. He is the author of several books. He is currently the Area Evangelist of Lagos Area as well as the Yaba District Pastor of The Apostolic Church Nigeria. He is blessed with a loving wife and commited children.`,
              `Today, Pastor Daniel Akintola continues to preach across Nigeria and internationally, hosts regular conferences and revivals, counsels individuals and families, and reaches millions through his YouTube channel, social media platforms, and this ministry website.`,
              `By the grace of God, Pastor Daniel Akintola has been ministering since 2001. Through the help of the Holy Spirit, he has preached over 4,000 sermons, impacting lives across local communities and nations far beyond Nigeria's borders.`,
              `God has used Pastor Daniel Akintola's messages to reach many countries including the United States of America, Canada, South Africa, Ghana, Togo, and Jordan, to mention a few. His messages carry a consistent thread which is the transforming power of Jesus Christ.`,
              `Pastor Akintola pioneered ROD TV and serves as the presenter of Excellent Living on Glorious Vision Television. He also anchors a weekly radio broadcast tagged Voice of Redemption, bringing the Gospel into homes across the airwaves every week.`,
              `He is the President of Abidan Productions, an evangelical drama and movie production outfit that has produced over 19 Gospel movies, including the widely known Ayaba Movie. He currently serves as the Drama Coordinator for The Apostolic Church Nigeria, Lawmna Territory.`,
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

      {/* Nations reached strip */}
      {/* <section style={{ background: "var(--cream-dark)", padding: "56px 0" }}>
        <div
          className="container"
          style={{ maxWidth: 860, textAlign: "center" }}
        >
          <div className="tag" style={{ marginBottom: 16 }}>
            Global Reach
          </div>
          <h2
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: 16 }}
          >
            Nations Touched by the Gospel
          </h2>
          <div className="gold-divider center" style={{ marginBottom: 24 }} />
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.9,
              fontSize: 15,
              marginBottom: 36,
            }}
          >
            God has used Pastor Daniel Akintola's messages to reach many
            countries. Through missions, media, and ministry, the Gospel has
            crossed borders and transformed lives far beyond Nigeria.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            {[
              "Nigeria",
              "United States",
              "Canada",
              "South Africa",
              "Ghana",
              "Togo",
              "Jordan",
            ].map((country) => (
              <div
                key={country}
                style={{
                  padding: "10px 20px",
                  background: "var(--white)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                  }}
                />
                {country}
              </div>
            ))}
            <div
              style={{
                padding: "10px 20px",
                background: "var(--accent)",
                borderRadius: "var(--radius-lg)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--white)",
                fontStyle: "italic",
              }}
            >
              & many more...
            </div>
          </div>
        </div>
      </section> */}

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
          {/* Core values guiding quote */}
          <div
            style={{
              background: "var(--primary)",
              borderRadius: "var(--radius-lg)",
              padding: "32px 40px",
              marginBottom: 48,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                left: 20,
                fontSize: 120,
                fontFamily: "var(--font-display)",
                color: "rgba(22,163,74,0.1)",
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              "
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                color: "var(--white)",
                lineHeight: 1.8,
                position: "relative",
                zIndex: 1,
                maxWidth: 760,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              "To know God deeply, walk in holiness, depend on the Holy Spirit,
              serve God's Kingdom faithfully, and help others experience
              transformation through the power of Jesus Christ."
            </p>
            <p
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--accent)",
                position: "relative",
                zIndex: 1,
              }}
            >
              — Pastor Daniel Akintola
            </p>
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
                    background: "rgba(22,163,74,0.1)",
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
      <section className="section" style={{ background: "var(--primary)" }}>
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
                background: "rgba(22,163,74,0.2)",
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
                        border: "1px solid rgba(22,163,74,0.15)",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--accent)",
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
                          color: "rgba(250,250,250,0.6)",
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
                      background: "var(--accent)",
                      border: "3px solid var(--primary)",
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
