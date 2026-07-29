import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Building2,
  Shield,
  CheckCircle,
  QrCode,
  Wrench,
  BarChart3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";
import { getDashboardRoute } from "../../components/auth/Guards";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';

const features = [
  {
    icon: QrCode,
    title: "Visitor Management",
    desc: "QR passes & real-time gate tracking",
  },
  {
    icon: Wrench,
    title: "Smart Complaints",
    desc: "Raise, track & resolve issues fast",
  },
  {
    icon: AlertTriangle,
    title: "Security & SOS",
    desc: "24/7 incident management",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Real-time society insights",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.login(form);
      const { user, accessToken, refreshToken } = response.data;
      setAuth({ user, accessToken, refreshToken });
      toast.success(`Welcome back, ${user.firstName}!`);
      const from =
        location.state?.from?.pathname || getDashboardRoute(user.role);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      const { user, accessToken, refreshToken } = response.data;
      setAuth({ user, accessToken, refreshToken });
      toast.success(`Welcome back, ${user.firstName}!`);
      const from = location.state?.from?.pathname || getDashboardRoute(user.role);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Google Login Error details:", err);
      const msg = err.response?.data?.message || err.message || "Google Login failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ── Left Panel ────────────────────────────────────────────────── */}
      <div className="auth-left hidden lg:flex">
        {/* Background orbs */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            top: -150,
            left: -150,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="animate-float"
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            bottom: -80,
            right: -80,
            background:
              "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)",
            pointerEvents: "none",
            animationDelay: "1.5s",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
          style={{ maxWidth: 480, position: "relative", zIndex: 1 }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3" style={{ marginBottom: 60 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white" style={{ fontSize: 18 }}>
                Smart Society Hub
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                Smarter Living Together
              </div>
            </div>
          </div>

          <h2
            className="font-black text-white"
            style={{
              fontSize: 52,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Your society,
            <br />
            digitized.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: 52,
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            One platform for residents, committee, security and maintenance to
            collaborate effortlessly.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4"
                style={{
                  padding: "18px 20px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  <f.icon size={20} className="text-white" />
                </div>
                <div>
                  <div
                    className="font-semibold text-white"
                    style={{ fontSize: 15 }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 13.5,
                      marginTop: 2,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className="flex gap-8"
            style={{
              marginTop: 52,
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {[
              ["5", "User Roles"],
              ["15+", "Modules"],
              ["Real-time", "Updates"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div
                  className="font-black text-white"
                  style={{ fontSize: 28, letterSpacing: "-0.02em" }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel ───────────────────────────────────────────────── */}
      <div className="auth-right">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          {/* Icon + heading */}
          <div className="text-center" style={{ marginBottom: 36 }}>
            <div
              className="inline-flex items-center justify-center mb-5"
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
              }}
            >
              <Shield size={26} className="text-white" />
            </div>
            <h1
              className="font-black text-slate-900"
              style={{
                fontSize: 30,
                letterSpacing: "-0.025em",
                marginBottom: 8,
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "#6b7280", fontSize: 15 }}>
              Sign in to your Smart Society Hub account
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
              style={{
                marginBottom: 24,
                padding: "14px 18px",
                borderRadius: 14,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14 }}>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`input ${error ? "input-error" : ""}`}
                  style={{ paddingLeft: 46 }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: 7 }}
              >
                <label
                  className="label"
                  style={{ marginBottom: 0 }}
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: 13, fontWeight: 600, color: "#6366f1" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className={`input ${error ? "input-error" : ""}`}
                  style={{ paddingLeft: 46, paddingRight: 48 }}
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full btn-lg"
              style={{ width: "100%", marginTop: 4, fontSize: 15.5 }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                    }}
                    className="animate-spin"
                  />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} /> Sign in
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm text-slate-400 font-medium">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed.')}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          {/* Demo hint */}
          <div
            style={{
              marginTop: 24,
              padding: "14px 18px",
              borderRadius: 14,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
            }}
          >
            <div
              className="flex items-center gap-2 font-semibold"
              style={{ marginBottom: 4, fontSize: 13 }}
            >
              <CheckCircle size={14} /> Quick Start (localStorage mode)
            </div>
            <p style={{ fontSize: 13 }}>
              Register a new account — all data saves to your browser's
              localStorage.
            </p>
          </div>

          <p
            className="text-center"
            style={{ color: "#9ca3af", fontSize: 14, marginTop: 24 }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6366f1", fontWeight: 700 }}>
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
