import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Check, Shield } from "lucide-react";
import toast from "react-hot-toast";

import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription, Alert } from "@/components/ui";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import api from "@/api/axios";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = () => {
    if (!password) return { score: 0, label: "", color: "" };
    if (password.length < 6) return { score: 1, label: "Weak", color: "text-destructive" };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password))
      return { score: 3, label: "Strong", color: "text-success" };
    return { score: 2, label: "Medium", color: "text-warning" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });
      toast.success(res.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Reset failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className="border-0 shadow-xl max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Alert
              variant="destructive"
              title="Invalid Request"
              description="The password reset link is invalid or has expired."
            />
            <Link
              to="/forgot-password"
              className="mt-4 inline-block text-sm text-accent hover:underline"
            >
              Request a new reset link
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              SecureShare
            </span>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Enter a new password for your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" description={error} />
              )}

              <div>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  icon={<Lock className="h-4 w-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.score === 1
                            ? "bg-destructive w-1/3"
                            : strength.score === 2
                            ? "bg-warning w-2/3"
                            : "bg-success w-full"
                        }`}
                      />
                    </div>
                    <span className={`text-xs ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                icon={<Lock className="h-4 w-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                className="w-full h-11"
                loading={loading}
              >
                Reset password
                <Check className="ml-2 h-4 w-4" />
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPageWrapper() {
  return (
    <ThemeProvider>
      <ResetPasswordPage />
    </ThemeProvider>
  );
}
