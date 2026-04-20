import { Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH PAGES ================= */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthSuccess from "./pages/auth/AuthSuccess";

/* ================= USER PAGES ================= */
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import ShareFile from "./pages/ShareFile";
import Download from "./pages/Download";
import VerifyOTP from "./pages/VerifyOTP";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminAILayer from "./pages/admin/AdminAILayer";

/* ================= ROUTE GUARD ================= */
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ================= DEFAULT ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= GOOGLE OAUTH ================= */}
      {/* ❗ MUST be PUBLIC (not protected) */}
      <Route path="/oauth-success" element={<AuthSuccess />} />

      {/* ================= USER ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <MyFiles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/share/:id"
        element={
          <ProtectedRoute>
            <ShareFile />
          </ProtectedRoute>
        }
      />

      {/* ================= PUBLIC ================= */}
      <Route path="/download/:token" element={<Download />} />
      <Route path="/verify-otp/:token" element={<VerifyOTP />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/files"
        element={
          <ProtectedRoute role="admin">
            <AdminFiles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/security"
        element={
          <ProtectedRoute role="admin">
            <AdminAILayer />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center text-gray-500">
            404 | Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
