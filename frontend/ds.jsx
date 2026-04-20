import { Routes, Route, Navigate } from "react-router-dom";

/* Auth pages */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* User pages */
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import ShareFile from "./pages/ShareFile";

/* Secure download */
import Download from "./pages/Download";
import VerifyOTP from "./pages/VerifyOTP";

/* Admin */
import AdminDashboard from "./pages/AdminDashboard";

/* Route guard */
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Default redirect */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

      {/* Public routes */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />  */}

      {/* Protected user routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* <Route
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
     */}
      {/* Public but secure routes */}
      {/*<Route path="/download/:token" element={<Download />} />
      <Route path="/verify-otp/:token" element={<VerifyOTP />} /> */}

      {/* Admin-only route */}
      {/*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      */}
      {/* 404 fallback */}
      {/*}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center text-gray-500">
            404 | Page Not Found
          </div>
        }
      /> */}
    </Routes>
  );
}
