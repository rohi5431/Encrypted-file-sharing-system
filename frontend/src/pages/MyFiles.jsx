import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import useIdleLogout from "../hooks/useIdleLogout";
import FileCard from "../components/FileCard";

export default function Dashboard() {
  const { user, logout, loadUser } = useContext(AuthContext);
  const location = useLocation();

  const [files, setFiles] = useState([]);

  /* ================= GOOGLE OAUTH TOKEN ================= */
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      loadUser();
    }
  }, [location.search]);

  /* ================= FETCH FILES ================= */
  useEffect(() => {
    api
      .get("/file/my-files")
      .then((res) => {
        setFiles(res.data.files || []);
      })
      .catch((err) => {
        console.error("Dashboard file fetch error:", err);
      });
  }, []);

  /* ================= AUTO LOGOUT ================= */
  useIdleLogout();

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  /* ================= STORAGE CALCULATION ================= */
  const calculateStorageUsed = () => {
    if (!files || files.length === 0) return "0 KB";

    const totalBytes = files.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );

    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024)
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    if (totalBytes < 1024 * 1024 * 1024)
      return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

    return `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden w-72 flex-col bg-slate-900 text-slate-100 md:flex">
        <div className="px-8 py-8 text-3xl font-semibold tracking-wide">
          Secure<span className="text-teal-400">Share</span>
        </div>

        <nav className="flex-1 space-y-3 px-6 text-base">
          <Link
            to="/dashboard"
            className="block rounded-xl bg-slate-800 px-5 py-3 font-medium"
          >
            📊 Dashboard
          </Link>

          <Link
            to="/upload"
            className="block rounded-xl px-5 py-3 hover:bg-slate-800"
          >
            ⬆ Upload Files
          </Link>

          <Link
            to="/files"
            className="block rounded-xl px-5 py-3 hover:bg-slate-800"
          >
            📁 My Files
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block rounded-xl px-5 py-3 hover:bg-slate-800"
            >
              🛡 Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-6">
          <button
            onClick={logout}
            className="w-full rounded-xl bg-red-500 py-3 text-base font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1">
        {/* ================= TOP BAR ================= */}
        <div className="flex h-24 items-center justify-between border-b bg-white px-10">
          <h1 className="text-3xl font-semibold text-slate-800">
            Secure File Dashboard
          </h1>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-base font-medium text-slate-700">
                {user?.name}
              </p>
              <p className="text-sm text-slate-500">
                {user?.email}
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-300 text-xl font-bold text-slate-700">
              {avatarLetter}
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="space-y-10 p-10">

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Files", value: files.length, icon: "📁" },
              { title: "Storage Used", value: calculateStorageUsed(), icon: "💾" },
              { title: "Shared Files", value: "—", icon: "🔗" },
              { title: "Security Status", value: "Protected", icon: "🔒" },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl bg-white p-8 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-slate-500">
                      {card.title}
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold text-slate-800">
                      {card.value}
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= RECENT FILES (WITH SHARE LOGIC) ================= */}
          <div className="rounded-2xl bg-white p-8 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800">
                Recent Files
              </h2>
              <Link
                to="/files"
                className="text-base text-teal-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {files.slice(0, 5).map((file) => (
                <FileCard key={file._id} file={file} />
              ))}

              {files.length === 0 && (
                <p className="text-center text-slate-500">
                  No files uploaded yet
                </p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
