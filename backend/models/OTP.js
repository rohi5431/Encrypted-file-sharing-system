const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String, // hashed OTP
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ✅ Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Compound index for faster verification lookups
otpSchema.index({ token: 1, email: 1 });

module.exports = mongoose.model("OTP", otpSchema);
