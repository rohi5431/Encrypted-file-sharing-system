import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/admin/notifications").then(res =>
      setNotifications(res.data.notifications)
    );
  }, []);

  return (
    <div className="relative">
      <span className="text-xl">🔔</span>

      <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg">
        {notifications.map(n => (
          <div
            key={n._id}
            className={`p-3 text-sm border-b ${
              n.read ? "text-gray-400" : "font-medium"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}
