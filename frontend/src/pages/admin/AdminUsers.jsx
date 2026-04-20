import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((err) => {
        console.error("AdminUsers error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Users">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Users size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Users Management
            </h2>
            <p className="text-sm text-gray-600">
              View and manage registered users
            </p>
          </div>
        </div>

        {/* EXPORT CSV */}
        <a
          href="http://localhost:5000/api/admin/export-users"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Export CSV
        </a>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {loading && (
          <p className="p-6 text-center text-gray-500">
            Loading users...
          </p>
        )}

        {!loading && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="p-4 text-center font-medium text-gray-700">
                  Role
                </th>
                <th className="p-4 text-center font-medium text-gray-700">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="p-6 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 text-gray-800">
                    {user.email}
                  </td>
                  <td className="p-4 text-center capitalize text-gray-700">
                    {user.role}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
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
