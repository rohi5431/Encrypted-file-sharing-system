import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../api/axios";
import { AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 1. Fetch initial alerts
    api.get("/admin/alerts")
      .then((res) => {
        if (res.data.success) {
          setAlerts(res.data.alerts);
        }
      })
      .catch(console.error);

    // 2. Setup socket
    // Assume backend is on the same host or a known URL. In a real app we'd use environment variables
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
    const socket = io(socketUrl);

    socket.on("new_alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 50)); // Keep latest 50
    });

    return () => socket.disconnect();
  }, []);

  const resolveAlert = async (id) => {
    try {
      await api.put(`/admin/alerts/${id}/resolve`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "resolved" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          Live AI Security Alerts
        </h3>
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No active alerts.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                alert.status === "resolved"
                  ? "bg-gray-50 border-gray-200 opacity-60"
                  : alert.severity === "high" || alert.severity === "critical"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex gap-3">
                {alert.status === "resolved" ? (
                  <CheckCircle className="text-gray-400 mt-1" size={20} />
                ) : (
                  <AlertCircle
                    className={
                      alert.severity === "high" || alert.severity === "critical"
                        ? "text-red-500 mt-1"
                        : "text-yellow-500 mt-1"
                    }
                    size={20}
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {alert.type.replace("_", " ").toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {alert.status !== "resolved" && (
                <button
                  onClick={() => resolveAlert(alert._id)}
                  className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Resolve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
