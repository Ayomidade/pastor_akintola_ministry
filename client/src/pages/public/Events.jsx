// src/pages/public/Events.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../../services/event.service.js";
import { SkeletonCard } from "../../components/shared/Skeleton.jsx";
import { format } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    setLoading(true);
    eventService
      .getAll({ upcoming: filter === "upcoming" })
      .then((res) => setEvents(res.data.data || []))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="page-header" style={{ paddingTop: 120 }}>
        <div className="container">
          <div className="tag" style={{ marginBottom: 16 }}>
            Programs & Gatherings
          </div>
          <h1>Events</h1>
          <p>Join us for worship, fellowship, and the Word</p>
        </div>
      </div>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 48,
              justifyContent: "center",
            }}
          >
            {["upcoming", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 24px",
                  border: "2px solid",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  background: filter === f ? "var(--accent)" : "transparent",
                  borderColor: filter === f ? "var(--accent)" : "var(--border)",
                  color:
                    filter === f ? "var(--primary)" : "var(--text-secondary)",
                  transition: "var(--transition)",
                }}
              >
                {f === "upcoming" ? "Upcoming" : "All Events"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Calendar
                size={48}
                color="var(--border)"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ color: "var(--text-muted)" }}>No events found.</p>
            </div>
          ) : (
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
                        "https://placehold.co/400x220/0D1B2A/C9A84C?text=Event"
                      }
                      alt={ev.title}
                      style={{ width: "100%", height: 200, objectFit: "cover" }}
                    />
                    <div style={{ padding: 24 }}>
                      <div
                        style={{ display: "flex", gap: 16, marginBottom: 16 }}
                      >
                        <div
                          style={{
                            background: "var(--primary)",
                            borderRadius: "var(--radius)",
                            padding: "10px 14px",
                            textAlign: "center",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 700,
                              color: "var(--accent)",
                              lineHeight: 1,
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {format(new Date(ev.date), "d")}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                              color: "rgba(250,250,250,0.6)",
                              marginTop: 2,
                            }}
                          >
                            {format(new Date(ev.date), "MMM yyyy")}
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: 17,
                              lineHeight: 1.3,
                              marginBottom: 8,
                            }}
                          >
                            {ev.title}
                          </h3>
                          {ev.time && (
                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                marginBottom: 4,
                              }}
                            >
                              <Clock size={12} /> {ev.time}
                            </p>
                          )}
                          {ev.location && (
                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <MapPin size={12} /> {ev.location}
                            </p>
                          )}
                        </div>
                      </div>
                      {ev.description && (
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                            lineHeight: 1.6,
                          }}
                        >
                          {ev.description.slice(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
