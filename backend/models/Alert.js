const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["unusual_volume", "off_hours", "geo_anomaly", "rbac_drift"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    metadata: { type: Object, default: {} },
    status: {
      type: String,
      enum: ["new", "flagged", "resolved", "blocked"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
