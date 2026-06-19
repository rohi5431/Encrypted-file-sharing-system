import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, ArrowRight, AlertCircle, Check } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialButtons from "@/components/auth/SocialButtons";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import api from "@/api/axios";

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", bars: 0 };
  if (pwd.length < 6) return { score: 1, label: "Weak", color: "#EF4444", bars: 1 };
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(pwd))
    return { score: 4, label: "Excellent", color: "#22C55E", bars: 4 };
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pwd))
    return { score: 3, label: "Strong", color: "#3B82F6", bars: 3 };
  return { score: 2, label: "Medium", color: "#F59E0B", bars: 2 };
};

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = "Name is required (min 2 chars)";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreed) e.agreed = "You must accept the Terms & Conditions";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "Registration failed";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="register">
      {/* Heading */}
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-1.5"
          style={{ color: "#F8FAFC" }}
        >
          Create your account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm"
          style={{ color: "#64748B" }}
        >
          Join thousands of teams securing their files with AI
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            id="name"
            label="Full name"
            type="text"
            placeholder="John Doe"
            icon={<User className="w-4 h-4" />}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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
          transition={{ delay: 0.3 }}
        >
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          {form.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      background:
                        bar <= strength.bars
                          ? strength.color
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#475569" }}>
                  Password strength
                </span>
                <span className="text-xs font-medium" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <PasswordInput
            id="confirm"
            label="Confirm password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
        </motion.div>

        {/* Terms checkbox */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <div
              className="w-4 h-4 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                background: form.agreed
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "rgba(255,255,255,0.05)",
                border: form.agreed
                  ? "1px solid transparent"
                  : errors.agreed
                  ? "1px solid rgba(239,68,68,0.6)"
                  : "1px solid rgba(255,255,255,0.15)",
              }}
              onClick={() => setForm({ ...form, agreed: !form.agreed })}
            >
              {form.agreed && (
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              )}
            </div>
            <span className="text-xs leading-5" style={{ color: "#64748B" }}>
              I agree to the{" "}
              <span
                className="font-medium cursor-pointer"
                style={{ color: "#60A5FA" }}
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className="font-medium cursor-pointer"
                style={{ color: "#60A5FA" }}
              >
                Privacy Policy
              </span>
            </span>
          </label>
          {errors.agreed && (
            <p className="mt-1 text-xs" style={{ color: "#F87171" }}>
              {errors.agreed}
            </p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <SocialButtons label="Sign up" />
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-6 text-center text-sm"
        style={{ color: "#475569" }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold transition-colors"
          style={{ color: "#60A5FA" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#60A5FA")}
        >
          Sign in
        </Link>
      </motion.p>
    </AuthLayout>
  );
}

export default function RegisterPageWrapper() {
  return (
    <ThemeProvider>
      <RegisterPage />
    </ThemeProvider>
  );
}
