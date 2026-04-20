// src/pages/Profile.jsx
import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext"

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Correct endpoint with /api prefix
        const res = await api.get("/api/auth/profile");

        // ✅ Adjust based on backend response shape
        // If backend returns { user: {...} }
        setProfile(res.data.user || res.data);

        console.log("Profile response:", res.data);
      } catch (err) {
        console.error("Profile error:", err?.response?.data || err.message);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={logout}
            className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{profile?.name}</h2>
            <p className="text-sm text-gray-600">{profile?.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">User ID</p>
            <p className="text-sm font-medium break-all">{profile?._id}</p>
          </div>

          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-sm font-medium capitalize">
              {profile?.role || "user"}
            </p>
          </div>

          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="text-sm font-medium">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>

          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm font-medium">
              {profile?.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
