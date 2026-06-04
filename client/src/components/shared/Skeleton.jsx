// src/components/shared/Skeleton.jsx
export function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: 20 }}>
        <div
          className="skeleton"
          style={{ height: 12, width: "40%", marginBottom: 12 }}
        />
        <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
        <div
          className="skeleton"
          style={{ height: 20, width: "80%", marginBottom: 16 }}
        />
        <div className="skeleton" style={{ height: 14, width: "60%" }} />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 16, width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
