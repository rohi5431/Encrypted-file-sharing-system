import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { loadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      const token =
        res?.data?.token ?? res?.data?.data?.token ?? res?.token ?? null;

      if (!token) {
        setError("Login failed: no token received from server");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      const loadedUser = await loadUser();

      if (loadedUser) {
        navigate("/dashboard");
      } else {
        setError("Login succeeded but loading profile failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-5xl min-h-[640px] overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* LEFT IMAGE */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="https://images.unsplash.com/photo-1609921212029-bb5a28e60960"
            alt="Secure Login"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
            <h2 className="mb-4 text-3xl font-semibold">
              Access Your Secure Workspace
            </h2>
            <p className="text-sm leading-relaxed opacity-90">
              Sign in to manage and share your files securely
              using our trusted platform.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex w-full flex-col justify-center px-10 py-12 md:w-1/2">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="mb-8 text-base text-gray-500">
            Login to continue to your account
          </p>

          <form onSubmit={submit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="mt-2 w-full rounded-md border px-3 py-3 text-base focus:border-gray-400 focus:outline-none"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="mb-7">
              <label className="block text-base font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-md border px-3 py-3 text-base focus:border-gray-400 focus:outline-none"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="mb-4 text-base text-red-500">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gray-800 py-3.5 text-base font-medium text-white hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Actions */}
            <div className="my-7 flex gap-4">
              <Link
                to="/forgot-password"
                className="flex-1 text-center rounded-md bg-gray-200 py-3 text-base font-medium text-gray-700 hover:bg-gray-300"
              >
                Forgot Password
              </Link>

              <Link
                to="/reset-password"
                className="flex-1 text-center rounded-md bg-gray-200 py-3 text-base font-medium text-gray-700 hover:bg-gray-300"
              >
                Reset Password
              </Link>
            </div>

            {/* Register */}
            <p className="mt-6 text-center text-base text-gray-600">
              New user?{" "}
              <Link
                to="/register"
                className="font-medium text-gray-800 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
