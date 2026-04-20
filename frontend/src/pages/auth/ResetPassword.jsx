import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Invalid or missing reset token</p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });

      alert(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h2 className="mb-4 text-xl font-bold">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="mb-3 w-full rounded border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="mb-3 w-full rounded border p-2"
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <button className="w-full rounded bg-green-600 py-2 text-lg text-white">
          Reset Password
        </button>
      </form>
    </div>
  );
}
