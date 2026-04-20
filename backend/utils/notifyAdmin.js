const AdminNotification = require("../models/AdminNotification");

module.exports = async function notifyAdmin(message, type = "info") {
  await AdminNotification.create({
    message,
    type,
  });
};
