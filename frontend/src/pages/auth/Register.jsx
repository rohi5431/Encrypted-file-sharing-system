import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE AUTH (ONLY ADDITION)
  const registerWithGoogle = () => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
      "_self"
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-5xl min-h-[640px] overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="https://images.unsplash.com/photo-1609921212029-bb5a28e60960"
            alt="Secure File Sharing"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
            <h2 className="mb-4 text-3xl font-semibold">
              Secure File Sharing Made Simple
            </h2>
            <p className="text-sm leading-relaxed opacity-90">
              Upload, manage, and share your files safely with end-to-end
              protection and a seamless user experience.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex w-full flex-col justify-center px-10 py-8 md:w-1/2">
          <h2 className="mb-1 text-2xl font-semibold text-gray-800">
            Create Account
          </h2>
          <p className="mb-6 text-base text-gray-500">
            Please enter your details to continue
          </p>

          <form onSubmit={submit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1.5 w-full rounded-md border px-3 py-2.5 text-base focus:border-gray-400 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="mt-1.5 w-full rounded-md border px-3 py-2.5 text-base focus:border-gray-400 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-md border px-3 py-2.5 text-base focus:border-gray-400 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className="block text-base font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-md border px-3 py-2.5 text-base focus:border-gray-400 focus:outline-none"
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="mb-3 text-base text-red-500">
                {error}
              </p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gray-800 py-3 text-base font-medium text-white hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={registerWithGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-md border py-3 text-base font-medium hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>

            {/* Login */}
            <p className="mt-5 text-center text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-800 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
