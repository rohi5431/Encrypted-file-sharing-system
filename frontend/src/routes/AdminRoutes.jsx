AdminRoutes.jsximport { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminFiles from "../pages/admin/AdminFiles";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <ProtectedRoute role="admin">
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/files" element={<AdminFiles />} />
      </Routes>
    </ProtectedRoute>
  );
}
