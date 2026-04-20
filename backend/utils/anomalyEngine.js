const EventStream = require("../models/EventStream");
const Alert = require("../models/Alert");
const User = require("../models/User");

// We would import the socket instance to push real-time alerts
const { getIO } = require("./socket");

const processEvent = async (eventData) => {
  try {
    // 1. Save event to stream
    const event = await EventStream.create(eventData);

    // 2. Anomaly Model Checks
    const alerts = [];

    // Check A: Off-hours access (e.g., between midnight and 5 AM server time)
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour <= 5) {
      alerts.push({
        type: "off_hours",
        severity: "medium",
        message: `Off-hours activity detected: ${event.action}`,
        userId: event.userId,
        metadata: { eventId: event._id, ipAddress: event.ipAddress },
      });
    }

    // Check B: Unusual Volume (e.g., > 10 events in the last 5 minutes for this user)
    if (event.userId) {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentEventsCount = await EventStream.countDocuments({
        userId: event.userId,
        createdAt: { $gte: fiveMinsAgo },
      });

      if (recentEventsCount > 10) {
        alerts.push({
          type: "unusual_volume",
          severity: "high",
          message: `Unusual volume detected: ${recentEventsCount} actions in 5 mins`,
          userId: event.userId,
          status: "flagged", // flag for review
          metadata: { eventId: event._id, recentCount: recentEventsCount },
        });
      }
    }

    // Check C: Geo-Anomaly (Simplistic check - if we had geoip, we'd check if IP country changed)
    // For now we'll simulate it randomly 1% of the time just to show it, or skip.
    // In a real app we'd use geoip-lite.

    // 3. Alert Engine: Save alerts and emit real-time
    if (alerts.length > 0) {
      const savedAlerts = await Alert.insertMany(alerts);
      
      const io = getIO();
      if (io) {
        savedAlerts.forEach((alert) => {
          io.emit("new_alert", alert);
        });
      }

      // If high severity, we could perform blocking
      alerts.forEach(async (a) => {
        if (a.type === "unusual_volume" && a.userId) {
          // E.g. lock the user account (RBAC drift/blocking action)
          await User.findByIdAndUpdate(a.userId, { status: "blocked" }).catch(() => {});
        }
      });
    }

    return event;
  } catch (error) {
    console.error("Error in Anomaly Engine:", error);
  }
};

module.exports = {
  processEvent,
};
