import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Folder,
  Moon,
  Sun,
  LogOut,
  ShieldCheck, // ✅ ADMIN ICON
  Activity,
} from "lucide-react";

export default function AdminLayout({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [dark, setDark] = useState(
    localStorage.getItem("adminTheme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("adminTheme", dark ? "dark" : "light");
  }, [dark]);

  const nav = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={24} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={24} /> },
    { name: "Files", path: "/admin/files", icon: <Folder size={24} /> },
    { name: "AI Security", path: "/admin/security", icon: <Activity size={24} /> },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="flex w-64 flex-col bg-white border-r border-gray-200">

        {/* ===== LOGO ===== */}
        <div className="flex items-center gap-3 px-6 py-6 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-500">Secure Management</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-2 px-4 py-4">
          {nav.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-md font-medium transition
                  ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* ===== LOGOUT ===== */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-md font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={22} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1">
        {/* HEADER */}
        <header className="flex h-23 items-center justify-between bg-white px-8 shadow-sm border-b">
          <h1 className="text-3xl font-semibold text-gray-800">
            {title}
          </h1>

          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-700"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light" : "Dark"}
          </button>
        </header>

        {/* CONTENT */}
        <main className="p-8 text-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
