import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialButtons from "@/components/auth/SocialButtons";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import api from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";

function LoginPage() {
  const { loadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      const token = res?.data?.token ?? res?.data?.data?.token ?? null;

      if (!token) {
        setErrors({ general: "Login failed: no token received" });
        return;
      }

      localStorage.setItem("token", token);
      toast.success("Welcome back!");

      const user = await loadUser();
      navigate(user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid credentials";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      {/* Heading */}
      <div className="mb-7">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-1.5"
          style={{ color: "#F8FAFC" }}
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm"
          style={{ color: "#64748B" }}
        >
          Sign in to your secure workspace
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General error */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-xl text-sm overflow-hidden"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#FCA5A5",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="w-4 h-4" />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
        </motion.div>

        {/* Remember + Forgot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className="w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer"
              style={{
                background: form.remember
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "rgba(255,255,255,0.05)",
                border: form.remember
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.15)",
              }}
              onClick={() => setForm({ ...form, remember: !form.remember })}
            >
              {form.remember && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs" style={{ color: "#64748B" }}>
              Remember me
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium transition-colors"
            style={{ color: "#60A5FA" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#60A5FA")}
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{
              background: loading
                ? "rgba(59,130,246,0.4)"
                : "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              color: "#ffffff",
              boxShadow: loading
                ? "none"
                : "0 0 20px rgba(59,130,246,0.35), 0 4px 15px rgba(0,0,0,0.3)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SocialButtons label="Continue" />
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-6 text-center text-sm"
        style={{ color: "#475569" }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold transition-colors"
          style={{ color: "#60A5FA" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#60A5FA")}
        >
          Create one free
        </Link>
      </motion.p>
    </AuthLayout>
  );
}

export default function LoginPageWrapper() {
  return (
    <ThemeProvider>
      <LoginPage />
    </ThemeProvider>
  );
}
