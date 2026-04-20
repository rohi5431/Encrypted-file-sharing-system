import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/axios";
import { Activity } from "lucide-react";

export default function AdminAILayer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/events")
      .then((res) => {
        if (res.data.success) {
          setEvents(res.data.events);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="AI Security Layer">
      <div className="mb-10 flex items-center justify-between rounded-2xl bg-white px-8 py-7 shadow-sm border border-gray-200">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Global Event Stream
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Real-time file access, downloads, and anomaly detection logging.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading events...</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Target ID</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {ev.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">{ev.userId?.email || "Unknown"}</td>
                    <td className="px-6 py-4">{ev.ipAddress || "—"}</td>
                    <td className="px-6 py-4 font-mono text-xs">{ev.targetId || "—"}</td>
                    <td className="px-6 py-4">
                      {new Date(ev.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
