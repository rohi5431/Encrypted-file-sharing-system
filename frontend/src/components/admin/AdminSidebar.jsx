import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow">
      {/* HEADER */}
      <div className="p-6 text-2xl font-bold text-gray-800">
        Admin Panel
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2 p-3">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `block rounded-lg px-5 py-3 text-lg font-medium transition
            ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block rounded-lg px-5 py-3 text-lg font-medium transition
            ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/files"
          className={({ isActive }) =>
            `block rounded-lg px-5 py-3 text-lg font-medium transition
            ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Files
        </NavLink>
      </nav>
    </aside>
  );
}
