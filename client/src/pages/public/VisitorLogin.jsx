// src/pages/public/VisitorLogin.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useVisitorAuth } from "../../context/VisitorAuthContext.jsx";
import toast from "react-hot-toast";

export default function VisitorLogin() {
  const { login } = useVisitorAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/chat";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
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
          padding: 48,
          width: "100%",
          maxWidth: 420,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--gold)",
              marginBottom: 4,
            }}
          >
            Pastor Daniel Akintola
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Sign In</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Sign in to access counselling chat
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
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
          Don't have an account?{" "}
          <Link
            to="/visitor/register"
            style={{ color: "var(--gold)", fontWeight: 700 }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
