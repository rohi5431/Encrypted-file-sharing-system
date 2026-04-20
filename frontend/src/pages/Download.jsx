import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function Download() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/file/send-otp", { token, email });
      navigate(`/verify-otp/${token}?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("OTP error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Failed to send OTP. Link may be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="flex w-full max-w-5xl min-h-[620px] overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* ================= LEFT IMAGE ================= */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100 md:flex">
          <img
            src="/secure-share.png"
            alt="Secure File Download"
            className="w-4/5 max-w-md scale-105"
          />
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="w-full md:w-1/2 px-10 py-14 flex flex-col justify-center">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 w-fit text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Back
          </button>

          {/* HEADER */}
          <h2 className="text-3xl font-semibold text-slate-800">
            Secure File Download
          </h2>
          <p className="mt-2 text-base text-slate-500">
            Verify your email to receive a one-time password (OTP)
          </p>

          {/* INFO */}
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            🔒 For security reasons, an OTP will be sent to your email before
            downloading the file.
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* EMAIL INPUT */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* SEND OTP BUTTON */}
          <button
            onClick={sendOtp}
            disabled={loading || !email}
            className="mt-6 w-full rounded-xl bg-slate-800 py-4 text-lg font-medium text-white hover:bg-slate-900 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </div>
      </div>
    </div>
  );
}
