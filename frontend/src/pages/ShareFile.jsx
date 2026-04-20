import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import CopyButton from "../components/CopyButton";
import OTPInput from "../components/OTPInput";
import CountdownTimer from "../components/CountdownTimer";

export default function ShareFile() {
  const { id } = useParams();

  // Share link
  const [expiry, setExpiry] = useState(24);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP flow
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  /* ================= GENERATE LINK ================= */
  const generateLink = async () => {
    setLoading(true);
    setError("");
    setLink("");
    setEmail("");
    setOtp("");
    setShowOtp(false);
    setOtpError("");

    try {
      const res = await api.post(`/file/share/${id}`, {
        hours: expiry,
      });

      const url =
        res?.data?.shareURL ||
        res?.data?.link ||
        res?.data?.url;

      if (!url) throw new Error("Link missing");

      setLink(url);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to generate link"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!email) {
      setOtpError("Please enter your email");
      return;
    }

    setOtpError("");
    setOtpLoading(true);

    try {
      await api.post("/file/send-otp", {
        token: link.split("/").pop(),
        email,
      });

      setShowOtp(true); // 👈 OTP opens BELOW email
    } catch (err) {
      setOtpError(
        err?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Enter valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const res = await api.post("/file/verify-otp", {
        token: link.split("/").pop(),
        email,
        otp,
      });

      // ✅ ONLY place where navigation happens
      window.location.href = res.data.downloadUrl;
    } catch (err) {
      setOtpError(
        err?.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="flex w-full max-w-5xl min-h-[650px] overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100 px-10 md:flex">
          <img
            src="/secure-share.png"
            alt="Secure File"
            className="w-4/5 max-w-md"
          />

          {/* EMAIL + OTP FLOW */}
          {link && (
            <div className="mt-10 w-full rounded-xl bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-800">
                Secure Download
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Verify your email to download the file
              </p>

              {/* EMAIL */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-4 w-full rounded-lg border px-4 py-3 text-sm"
              />

              <button
                onClick={sendOtp}
                disabled={otpLoading}
                className="mt-4 w-full rounded-lg bg-slate-800 py-3 text-sm text-white"
              >
                {otpLoading ? "Sending OTP..." : "Send OTP"}
              </button>

              {/* OTP INLINE */}
              {showOtp && (
                <div className="mt-6">
                  <OTPInput value={otp} onChange={setOtp} />

                  <div className="mt-3">
                    <CountdownTimer seconds={300} />
                  </div>

                  <button
                    onClick={verifyOtp}
                    disabled={otpLoading}
                    className="mt-4 w-full rounded-lg bg-green-600 py-3 text-sm text-white"
                  >
                    {otpLoading
                      ? "Verifying..."
                      : "Verify & Download"}
                  </button>
                </div>
              )}

              {otpError && (
                <p className="mt-3 text-sm text-red-600">
                  {otpError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full md:w-1/2 px-10 py-14">
          <h2 className="text-3xl font-semibold text-slate-800">
            Share File Securely
          </h2>
          <p className="mt-2 text-base text-slate-500">
            Generate a secure, time-limited link
          </p>

          {/* EXPIRY */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Link Expiry Duration
            </label>

            <select
              value={expiry}
              onChange={(e) =>
                setExpiry(Number(e.target.value))
              }
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value={1}>1 Hour</option>
              <option value={6}>6 Hours</option>
              <option value={24}>24 Hours</option>
            </select>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generateLink}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-slate-800 py-4 text-lg text-white"
          >
            {loading
              ? "Generating Secure Link..."
              : "Generate Share Link"}
          </button>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* LINK DISPLAY (COPY ONLY — NOT CLICKABLE) */}
          {link && (
            <div className="mt-8 rounded-xl border bg-slate-50 p-6">
              <p className="mb-3 text-sm font-medium text-slate-600">
                Secure Download Link (Copy only)
              </p>

              <div className="flex items-center gap-2">
                <input
                  value={link}
                  readOnly
                  className="w-full rounded-lg border bg-white px-4 py-2 text-sm"
                />
                <CopyButton text={link} />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                ⏳ Link expires after {expiry} hour(s)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
