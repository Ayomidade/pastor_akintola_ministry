// src/pages/admin/events/EventList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../../../services/event.service.js";
import ConfirmModal from "../../../components/shared/ConfirmModal.jsx";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetch = () => {
    setLoading(true);
    eventService
      .getAllAdmin()
      .then((res) => {
        setEvents(res.data.events || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async () => {
    try {
      await eventService.delete(deleting);
      toast.success("Event deleted.");
      setDeleting(null);
      fetch();
    } catch {
      toast.error("Could not delete event.");
    }
  };

  return (
    <div style={{ padding: "24px 16px" }}>
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
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Events</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {total} total events
          </p>
        </div>
        <Link
          to="/admin/events/create"
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={16} /> New Event
        </Link>
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
      ) : events.length === 0 ? (
        <div
          style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: 64,
            textAlign: "center",
          }}
        >
          <Calendar
            size={40}
            color="var(--border)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
            No events yet.
          </p>
          <Link to="/admin/events/create" className="btn btn-primary btn-sm">
            Create first event
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map((ev) => (
            <div
              key={ev._id}
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <img
                src={
                  ev.image?.url ||
                  "https://placehold.co/56x56/0D1B2A/C9A84C?text=E"
                }
                alt=""
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--radius)",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  {ev.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {format(new Date(ev.date), "MMMM d, yyyy")}
                  {ev.time && ` • ${ev.time}`}
                  {ev.location && ` • ${ev.location}`}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "var(--radius)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    background: ev.isPublished ? "#f0fdf4" : "#fef9c3",
                    color: ev.isPublished ? "#16a34a" : "#a16207",
                  }}
                >
                  {ev.isPublished ? "Published" : "Draft"}
                </span>
                <Link
                  to={`/admin/events/edit/${ev._id}`}
                  style={{ color: "var(--text-muted)", display: "flex" }}
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => setDeleting(ev._id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e53e3e",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Event"
        message="This will permanently delete this event."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
