import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import toast from "react-hot-toast";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription, Alert } from "@/components/ui";
import api from "@/api/axios";

function DownloadPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/file/send-otp", { token, email });
      toast.success("OTP sent to your email!");
      navigate(`/verify-otp/${token}?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send OTP. Link may be expired.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-600/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1639329278788-e9a4e6d1b1e1?w=1200&q=80"
          alt="Secure Download"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-10 w-10" />
              <span className="text-2xl font-bold">SecureShare</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Secure File Download
            </h2>
            <p className="text-lg opacity-90">
              Files are encrypted and require OTP verification for access.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center justify-center mb-6 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Lock className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                SecureShare
              </span>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Lock className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Secure Download</CardTitle>
              <CardDescription>
                Enter your email to receive a one-time password
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
                <p>
                  For security reasons, an OTP will be sent to your email before
                  downloading the file.
                </p>
              </div>

              {error && (
                <Alert variant="destructive" description={error} className="mb-4" />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                className="w-full h-12 mt-6"
                loading={loading}
                onClick={sendOtp}
              >
                Send OTP
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function DownloadPageWrapper() {
  return (
    <ThemeProvider>
      <DownloadPage />
    </ThemeProvider>
  );
}
