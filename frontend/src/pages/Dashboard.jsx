import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import useIdleLogout from "../hooks/useIdleLogout";
import FileCard from "../components/FileCard";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard() {
  const { user, logout, loadUser } = useContext(AuthContext);
  const location = useLocation();

  const [files, setFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  // upload states
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ===== Upload logic (same backend) ===== */
  const uploadFile = async (ignoreDLP = false) => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (ignoreDLP === true) {
      formData.append("ignoreDLP", "true");
    }

    setStatus("");
    setProgress(0);

    try {
      await api.post("/file/upload", formData, {
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      // refresh files
      const res = await api.get("/file/my-files");
      setFiles(res.data.files || []);

      // success UX
      setSuccessMsg("✅ File uploaded successfully");
      setShowUpload(false);
      setFile(null);
      setProgress(0);

      // auto hide message
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      if (err?.response?.data?.warning) {
        const proceed = window.confirm(err.response.data.message);
        if (proceed) {
          return uploadFile(true);
        } else {
          setStatus("Upload cancelled to protect sensitive data.");
          setProgress(0);
          return;
        }
      }

      setStatus(
        err?.response?.data?.message ||
          err.message ||
          "Upload failed ❌"
      );
    }
  };

  /* ===== OAuth token ===== */
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      loadUser();
    }
  }, [location.search]);

  /* ===== Fetch files ===== */
  useEffect(() => {
    api.get("/file/my-files").then((res) => {
      setFiles(res.data.files || []);
    });
  }, []);

  useIdleLogout();

  const calculateStorageUsed = () => {
    if (!files.length) return "0 KB";
    const total = files.reduce((s, f) => s + (f.size || 0), 0);
    return total < 1024
      ? `${total} B`
      : total < 1024 * 1024
      ? `${(total / 1024).toFixed(2)} KB`
      : `${(total / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="hidden w-72 bg-slate-900 text-white md:flex flex-col">
        <div className="px-8 py-8 text-3xl font-semibold">
          Secure<span className="text-teal-400">Share</span>
        </div>

        <nav className="px-6 space-y-3">
          <Link to="/dashboard" className="block bg-slate-800 px-5 py-3 rounded-xl">
            📊 Dashboard
          </Link>
          <Link to="/files" className="block px-5 py-3 rounded-xl hover:bg-slate-800">
            📁 My Files
          </Link>
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-500 py-3 rounded-xl"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* HEADER */}
        <div className="flex h-24 items-center justify-between bg-white px-10 border-b">
          <h1 className="text-3xl font-semibold">Dashboard</h1>

          <button
            onClick={() => setShowUpload(!showUpload)}
            className="rounded-lg bg-slate-800 px-6 py-3 text-white hover:bg-slate-900"
          >
            ⬆ Upload File
          </button>
        </div>

        <div className="p-10 space-y-8">

          {/* SUCCESS MESSAGE */}
          {successMsg && (
            <div className="rounded-xl bg-green-100 text-green-700 px-6 py-4 font-medium">
              {successMsg}
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Total Files", value: files.length },
              { title: "Storage Used", value: calculateStorageUsed() },
              { title: "Security", value: "Protected" },
              { title: "Status", value: "Active" },
            ].map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow">
                <p className="text-slate-500">{c.title}</p>
                <h3 className="text-3xl font-semibold mt-2">{c.value}</h3>
              </div>
            ))}
          </div>

          {/* UPLOAD PANEL */}
          {showUpload && (
            <div className="rounded-2xl bg-white p-8 shadow">
              <h2 className="text-2xl font-semibold mb-4">
                Upload File
              </h2>

              <div className="border-2 border-dashed rounded-xl p-8 text-center bg-slate-50">
                <label className="cursor-pointer bg-slate-800 px-6 py-3 rounded-lg text-white">
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>

                {file && (
                  <p className="mt-3 text-sm">{file.name}</p>
                )}
              </div>

              {progress > 0 && (
                <div className="mt-4">
                  <ProgressBar value={progress} />
                </div>
              )}

              {status && (
                <p className="mt-3 text-red-600 text-center">
                  {status}
                </p>
              )}

              <button
                onClick={uploadFile}
                className="mt-6 w-full bg-slate-800 py-3 rounded-xl text-white"
              >
                Upload
              </button>
            </div>
          )}

          {/* RECENT FILES */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-6">
              Recent Files
            </h2>

            <div className="space-y-4">
              {files.slice(0, 5).map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
