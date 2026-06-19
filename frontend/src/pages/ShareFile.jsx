import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link as LinkIcon, Clock, Mail, Lock, Check, Copy, ArrowLeft, Shield } from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Select,
  Badge,
} from "@/components/ui";
import api from "@/api/axios";

export default function ShareFile() {
  const { id } = useParams();

  const [expiry, setExpiry] = useState(24);
  const [link, setLink] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  /* OTP Flow State */
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [copied, setCopied] = useState(false);

  const expiryOptions = [
    { value: 1, label: "1 Hour" },
    { value: 6, label: "6 Hours" },
    { value: 24, label: "24 Hours" },
    { value: 72, label: "3 Days" },
    { value: 168, label: "1 Week" },
  ];

  /* Generate Share Link */
  const generateLink = async () => {
    setGenerating(true);
    setError("");
    setLink("");
    setEmail("");
    setOtp("");
    setShowOtp(false);
    setOtpError("");

    try {
      const res = await api.post(`/file/share/${id}`, { hours: expiry });
      const shareUrl = res?.data?.shareURL || res?.data?.link || res?.data?.url;

      if (!shareUrl) throw new Error("Failed to generate link");

      setLink(shareUrl);
      toast.success("Share link generated!");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to generate link";
      setError(message);
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  /* Copy Link */
  const copyLink = async () => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  /* Send OTP */
  const sendOtp = async () => {
    if (!email) {
      setOtpError("Please enter your email");
      return;
    }

    setOtpError("");
    setOtpLoading(true);

    try {
      const token = link.split("/").pop();
      await api.post("/file/send-otp", { token, email });
      setShowOtp(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to send OTP";
      setOtpError(message);
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  /* Verify OTP */
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const token = link.split("/").pop();
      const res = await api.post("/file/verify-otp", { token, email, otp });
      window.location.href = res.data.downloadUrl;
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid or expired OTP";
      setOtpError(message);
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <Link
            to="/files"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to files
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Share File</h1>
          <p className="text-muted-foreground mt-1">
            Generate a secure, time-limited download link
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Share2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Generate Share Link</CardTitle>
                  <CardDescription>
                    Recipients will need OTP verification to download
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Expiry Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Clock className="inline-block h-4 w-4 mr-1" />
                  Link Expiry Duration
                </label>
                <Select
                  value={expiry}
                  onChange={(e) => setExpiry(Number(e.target.value))}
                  options={expiryOptions}
                />
              </div>

              {/* Generate Button */}
              <Button
                className="w-full h-12"
                loading={generating}
                onClick={generateLink}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Generate Share Link
              </Button>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generated Link */}
              <AnimatePresence>
                {link && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <div className="rounded-xl bg-success/5 border border-success/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Share Link Generated
                        </span>
                        <Badge variant="success" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Expires in {expiry}h
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          value={link}
                          readOnly
                          className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm"
                        />
                        <Button
                          variant={copied ? "accent" : "secondary"}
                          onClick={copyLink}
                          className="shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* OTP Verification Section */}
                    <div className="rounded-xl bg-muted/50 border border-border p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          OTP Verification Required
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4">
                        Recipients must verify their email before downloading
                      </p>

                      {/* Email Input */}
                      <Input
                        type="email"
                        placeholder="recipient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="h-4 w-4" />}
                      />

                      <Button
                        variant="secondary"
                        className="w-full mt-3"
                        loading={otpLoading && !showOtp}
                        onClick={sendOtp}
                      >
                        Send OTP
                      </Button>

                      {/* OTP Input */}
                      <AnimatePresence>
                        {showOtp && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border">
                              <Input
                                label="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) =>
                                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                placeholder="000000"
                                className="text-center tracking-widest text-lg"
                              />

                              <Button
                                className="w-full mt-3"
                                loading={otpLoading}
                                onClick={verifyOtp}
                              >
                                Verify & Download
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* OTP Error */}
                      <AnimatePresence>
                        {otpError && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-3 text-sm text-destructive"
                          >
                            {otpError}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 shrink-0">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Secure Sharing
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Links are encrypted and require OTP verification. Files remain
                    encrypted at rest and in transit. Links automatically expire
                    after the selected duration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
