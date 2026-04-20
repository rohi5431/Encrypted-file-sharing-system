import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import UploadChart from "../components/UploadChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER (INCREASED HEIGHT) ================= */}
        <div className="mb-8 rounded-2xl bg-white px-8 py-7 shadow">
          <h1 className="text-3xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            System overview & platform usage statistics
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
          />
          <StatCard
            title="Total Files"
            value={stats?.totalFiles ?? 0}
          />
          <StatCard
            title="Storage Used"
            value={`${(
              (stats?.totalStorageBytes || 0) /
              (1024 * 1024)
            ).toFixed(2)} MB`}
          />
          <StatCard
            title="Top Downloaded"
            value={
              stats?.mostDownloadedFile?.originalName || "—"
            }
          />
        </div>

        {/* ================= CHART ================= */}
        {stats?.dailyUploads && (
          <div className="mt-10 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Daily File Uploads (Last 14 Days)
            </h2>
            <UploadChart data={stats.dailyUploads} />
          </div>
        )}
      </div>
    </div>
  );
}
