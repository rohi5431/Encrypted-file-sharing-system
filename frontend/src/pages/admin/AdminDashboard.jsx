import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";
import StatCard from "../../components/admin/StatCard";
import AdminStoragePie from "./AdminStoragePie";
import AdminTopFileChart from "./AdminTopFileChart";
import AdminUploadsChart from "./AdminUploadsChart";
import LiveAlerts from "../../components/admin/LiveAlerts";
import { Users, Folder, HardDrive } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("Admin stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* ================= HEADER ================= */}
      <div className="mb-10 flex items-center justify-between rounded-2xl bg-white px-8 py-7 shadow-sm border border-gray-200">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            System Overview
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Platform usage statistics
          </p>
        </div>

        <a
          href="http://localhost:5000/api/admin/export"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Export CSV
        </a>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={loading ? "—" : stats?.totalUsers}
          icon={<Users size={24} />}
        />

        <StatCard
          title="Total Files"
          value={loading ? "—" : stats?.totalFiles}
          icon={<Folder size={24} />}
        />

        <StatCard
          title="Storage Used"
          value={
            loading
              ? "—"
              : `${(stats?.totalStorageBytes / (1024 * 1024)).toFixed(2)} MB`
          }
          icon={<HardDrive size={22} />}
        />
      </div>

      {/* ================= CHARTS ================= */}
      {!loading && stats && (
        <>
          {/* STORAGE + TOP FILE */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
              <AdminStoragePie totalStorage={stats.totalStorageBytes} />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
              <AdminTopFileChart file={stats.mostDownloadedFile} />
            </div>
          </div>

          {/* DAILY UPLOADS */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
              <AdminUploadsChart data={stats.dailyUploads} />
            </div>
            
            {/* NEW AI ALERT LAYER */}
            <LiveAlerts />
          </div>
        </>
      )}
    </AdminLayout>
  );
}
