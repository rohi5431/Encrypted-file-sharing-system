const User = require("../models/User");
const File = require("../models/file");
const AuditLog = require("../models/AuditLog");
const AdminNotification = require("../models/AdminNotification");
const Alert = require("../models/Alert");
const EventStream = require("../models/EventStream");

/* ================= ADMIN STATS ================= */
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();

    const storageAgg = await File.aggregate([
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);

    const totalStorageBytes = storageAgg[0]?.totalSize || 0;

    const mostDownloadedFile = await File.findOne()
      .sort({ downloadCount: -1 })
      .select("originalName downloadCount size createdAt")
      .lean();

    const dailyUploads = await File.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFiles,
        totalStorageBytes,
        mostDownloadedFile: mostDownloadedFile || null,
        dailyUploads,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ================= ADMIN USERS ================= */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("email role createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= ADMIN FILES ================= */
const getAllFiles = async (req, res, next) => {
  try {
    const files = await File.find()
      .populate("owner", "email")
      .select("originalName size storage createdAt owner")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    next(error);
  }
};
const getUserGrowth = async (req, res) => {
  const data = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data });
};
const deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });

  await File.deleteOne({ _id: file._id });

  await AuditLog.create({
    admin: req.user._id,
    action: "DELETE_FILE",
    target: file.originalName,
  });

  res.json({ success: true });
};

const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("admin", "email")
    .sort({ createdAt: -1 });

  res.json({ logs });
};

/* ================= EXPORT ANALYTICS CSV ================= */
const exportStatsCSV = async (req, res, next) => {
  try {
    const files = await File.find().populate("owner", "email");

    let csv = "File,Owner,Size (bytes),Storage\n";

    files.forEach((f) => {
      csv += `"${f.originalName}","${f.owner?.email || ""}",${f.size},${f.storage}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=analytics.csv"
    );

    res.send(csv);
  } catch (error) {
    next(error);
  }
};
const exportUsersCSV = async (req, res, next) => {
  try {
    const users = await User.find().select("email role createdAt");

    let csv = "Email,Role,Joined\n";
    users.forEach((u) => {
      csv += `"${u.email}","${u.role}","${u.createdAt.toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users.csv"
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
const exportAuditLogsCSV = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate("admin", "email")
      .sort({ createdAt: -1 });

    let csv = "Admin,Action,Target,Date\n";

    logs.forEach((log) => {
      csv += `"${log.admin?.email || ""}","${log.action}","${log.target}","${log.createdAt.toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=audit-logs.csv"
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

const getAdminNotifications = async (req, res) => {
  const notifications = await AdminNotification.find()
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ notifications });
};

exports.getAdminNotifications = async (req, res) => {
  const notifications = await AdminNotification.find()
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ notifications });
};

const markNotificationRead = async (req, res) => {
  await AdminNotification.findByIdAndUpdate(req.params.id, {
    read: true,
  });
  res.json({ success: true });
};

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find().populate("userId", "email").sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, alerts });
  } catch (error) {
    next(error);
  }
};

const resolveAlert = async (req, res, next) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, { status: "resolved" });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getEventStream = async (req, res, next) => {
  try {
    const events = await EventStream.find().populate("userId", "email").sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllFiles,
  getUserGrowth,
  deleteFile,
  getAuditLogs,
  exportStatsCSV,
  exportUsersCSV,
  exportAuditLogsCSV,
  getAdminNotifications,
  markNotificationRead,
  getAlerts,
  resolveAlert,
  getEventStream,
};
