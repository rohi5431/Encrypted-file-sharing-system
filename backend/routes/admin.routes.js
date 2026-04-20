const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
    getUserGrowth,
    deleteFile,
    getAuditLogs,
    exportStatsCSV,
    exportUsersCSV,
    exportAuditLogsCSV,
    markNotificationRead,
    getAdminNotifications,
    getAlerts,
    resolveAlert,
    getEventStream,
} = require("../controllers/admin.controller");

const {
  getAdminStats,
  getAllUsers,
  getAllFiles,
} = require("../controllers/admin.controller");

// Admin stats
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

// Admin users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Admin files
router.get("/files", authMiddleware, adminMiddleware, getAllFiles);
router.get("/user-growth", authMiddleware, adminMiddleware, getUserGrowth);
router.delete("/file/:id", authMiddleware, adminMiddleware, deleteFile);
router.get("/audit-logs", authMiddleware, adminMiddleware, getAuditLogs);
router.get("/export", authMiddleware, adminMiddleware, exportStatsCSV);
router.get("/export", authMiddleware, adminMiddleware, exportStatsCSV);
router.get("/export/users", authMiddleware, adminMiddleware, exportUsersCSV);
router.get("/export/audit-logs", authMiddleware, adminMiddleware, exportAuditLogsCSV);
router.get("/notifications", authMiddleware, adminMiddleware, getAdminNotifications);
router.put("/notifications/:id/read", authMiddleware, adminMiddleware, markNotificationRead);

// AI Layer Alerts & Events
router.get("/alerts", authMiddleware, adminMiddleware, getAlerts);
router.put("/alerts/:id/resolve", authMiddleware, adminMiddleware, resolveAlert);
router.get("/events", authMiddleware, adminMiddleware, getEventStream);


module.exports = router;
