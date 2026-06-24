import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { authService } from "../../services/auth.service.js";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { admin, isSetupDone, login, setAdmin, setIsSetupDone } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | setup | forgot | reset
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    currentPassword: "",
    newPassword: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (admin) navigate("/admin/dashboard");
  }, [admin]);
  useEffect(() => {
    if (!isSetupDone) setMode("setup");
  }, [isSetupDone]);

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.setup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Admin account created. Please log in.");
      setIsSetupDone(true);
      setMode("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Setup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email: form.email });
      toast.success("OTP sent to your email.");
      setMode("reset");
    } catch {
      toast.error("Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success("Password reset. Please log in.");
      setMode("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: "Admin Login",
    setup: "Create Admin Account",
    forgot: "Forgot Password",
    reset: "Enter OTP",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--primary)",
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
              color: "var(--accent)",
              marginBottom: 4,
            }}
          >
            Pastor Daniel Akintola
          </div>
          <h1 style={{ fontSize: 24 }}>{titles[mode]}</h1>
        </div>

        {mode === "setup" && (
          <form onSubmit={handleSetup}>
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
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin}>
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
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setMode("forgot")}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "var(--accent)",
                fontSize: 13,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              Forgot password?
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot}>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 24,
              }}
            >
              Enter the admin email address to receive a reset OTP.
            </p>
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
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: 13,
                marginTop: 12,
                cursor: "pointer",
              }}
            >
              Back to login
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label className="form-label">OTP Code</label>
              <input
                className="form-input"
                value={form.otp}
                onChange={(e) => set("otp", e.target.value)}
                required
                placeholder="6-digit code"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                value={form.newPassword}
                onChange={(e) => set("newPassword", e.target.value)}
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
