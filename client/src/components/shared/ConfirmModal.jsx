// src/components/shared/ConfirmModal.jsx
export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  danger = true,
}) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(33,33,33,0.7)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          padding: 32,
          maxWidth: 420,
          width: "100%",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h3 style={{ marginBottom: 12, fontSize: 20 }}>{title}</h3>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-sm ${danger ? "btn-danger" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
