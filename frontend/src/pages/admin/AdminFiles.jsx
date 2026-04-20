import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";
import { Folder, Download } from "lucide-react";

export default function AdminFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    api
      .get("/admin/files")
      .then((res) => setFiles(res.data.files || []))
      .catch((err) => console.error("AdminFiles error:", err))
      .finally(() => setLoading(false));
  };

  const deleteFile = async (id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await api.delete(`/admin/file/${id}`);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file");
    }
  };

  return (
    <AdminLayout title="Files">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Folder size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Files Management
            </h2>
            <p className="text-sm text-gray-600">
              View, manage, and delete uploaded files
            </p>
          </div>
        </div>

        {/* EXPORT CSV */}
        <a
          href="http://localhost:5000/api/admin/export-files"
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download size={16} />
          Export CSV
        </a>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {loading && (
          <p className="p-6 text-center text-gray-500">
            Loading files...
          </p>
        )}

        {!loading && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">
                  File Name
                </th>
                <th className="p-4 text-center font-medium text-gray-700">
                  Owner
                </th>
                <th className="p-4 text-center font-medium text-gray-700">
                  Size
                </th>
                <th className="p-4 text-center font-medium text-gray-700">
                  Storage
                </th>
                <th className="p-4 text-center font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {files.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No files found
                  </td>
                </tr>
              )}

              {files.map((file) => (
                <tr
                  key={file._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 text-gray-800">
                    {file.originalName}
                  </td>

                  <td className="p-4 text-center text-gray-700">
                    {file.owner?.email || "—"}
                  </td>

                  <td className="p-4 text-center text-gray-700">
                    {(file.size / 1024).toFixed(1)} KB
                  </td>

                  <td className="p-4 text-center capitalize text-gray-700">
                    {file.storage}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteFile(file._id)}
                      className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
