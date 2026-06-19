import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Alert } from "@/components/ui";
import api from "@/api/axios";

const forceDownload = (path) => {
  if (!path) return;
  const link = document.createElement("a");
  link.href = `${import.meta.env.VITE_API_BASE_URL || ""}${path}`;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function VerifyOTPPage() {
  const { token } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/file/verify-otp", { token, email, otp: otpCode });
      const downloadUrl = res.data?.downloadUrl;

      if (!downloadUrl) {
        throw new Error("Download URL missing");
      }

      toast.success("OTP verified!");
      forceDownload(downloadUrl);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid or expired OTP";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Lock className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" description={error} className="mb-6" />
            )}

            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-14 w-12 rounded-lg border border-input bg-background text-center text-xl font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              ))}
            </div>

            <Button
              className="w-full h-12"
              loading={loading}
              onClick={verifyOtp}
            >
              Verify & Download
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-6">
              This OTP is valid for a limited time for security reasons.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyOTPPageWrapper() {
  return (
    <ThemeProvider>
      <VerifyOTPPage />
    </ThemeProvider>
  );
}
