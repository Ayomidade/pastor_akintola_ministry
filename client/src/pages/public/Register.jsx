// src/pages/public/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVisitorAuth } from "../../context/VisitorAuthContext.jsx";
import toast from "react-hot-toast";
import { visitorService } from "../../services/visitor.service.js";

export default function Register() {
  const { login } = useVisitorAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error("Passwords do not match.");
    setLoading(true);
    try {
      await visitorService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await login({ email: form.email, password: form.password });
      toast.success("Welcome! Your account has been created.");
      navigate("/chat");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          padding: 48,
          width: "100%",
          maxWidth: 440,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: 4,
            }}
          >
            Pastor Daniel Akintola
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Register to access counselling chat
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/visitor/login"
            style={{ color: "var(--accent)", fontWeight: 700 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
