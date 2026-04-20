import { useState } from "react";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data?.message || "Reset link sent to your email 📧");
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 className="mb-1 text-2xl font-semibold text-gray-800">
          Forgot Password
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Enter your registered email to receive a reset link
        </p>

        {/* Email */}
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="mb-4 w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Success Message */}
        {msg && (
          <p className="mb-3 rounded bg-green-50 px-3 py-2 text-sm text-green-600">
            {msg}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-lg font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Hint */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Check your inbox and spam folder
        </p>
      </form>
    </div>
  );
}
