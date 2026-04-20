import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import OTPInput from "../components/OTPInput";
import CountdownTimer from "../components/CountdownTimer";

/* =========================
   BACKEND URL
========================= */
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* =========================
   FORCE FILE DOWNLOAD
========================= */
const forceDownload = (path) => {
  if (!path) return;

  const link = document.createElement("a");
  link.href = `${BACKEND_URL}${path}`;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function VerifyOTP() {
  const { token } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/file/verify-otp", {
        token,
        email,
        otp,
      });

      const downloadUrl = res.data?.downloadUrl;

      if (!downloadUrl) {
        throw new Error("Download URL missing from server");
      }

      // ✅ CORRECT SHARED DOWNLOAD ROUTE
      forceDownload(downloadUrl);
    } catch (err) {
      console.error("Verify OTP Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* ICON */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          🔐
        </div>

        {/* HEADER */}
        <h2 className="text-center text-2xl font-semibold text-slate-800">
          Verify One-Time Password
        </h2>

        <p className="mt-2 text-center text-sm text-slate-500">
          Enter the 6-digit OTP sent to
          <br />
          <span className="font-medium text-slate-700">
            {email}
          </span>
        </p>

        {/* OTP INPUT */}
        <div className="mt-6 flex justify-center">
          <OTPInput value={otp} onChange={setOtp} />
        </div>

        {/* TIMER */}
        <div className="mt-4 flex justify-center text-sm text-slate-500">
          <CountdownTimer seconds={300} />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-green-600 py-3 text-base font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Verifying OTP..." : "Verify & Download"}
        </button>

        {/* FOOTER */}
        <p className="mt-4 text-center text-xs text-slate-400">
          This OTP is valid for a limited time for security reasons.
        </p>
      </div>
    </div>
  );
}
