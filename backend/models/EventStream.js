const mongoose = require("mongoose");

const eventStreamSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: {
      type: String,
      enum: ["file_access", "file_download", "file_share", "login", "failed_login"],
      required: true,
    },
    targetId: { type: String, default: null }, // File ID or Share ID
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventStream", eventStreamSchema);
