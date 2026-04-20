const crypto = require("crypto");
const OTP = require("../models/OTP");
const ShareLink = require("../models/shareLink");
const sendEmail = require("../utils/sendEmail");

/* ======================================================
   SEND OTP
====================================================== */
const sendOTP = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    // Basic validation
    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Token and email are required",
      });
    }

    // Validate share link
    const share = await ShareLink.findOne({ token });
    if (!share || share.expiresAt < new Date()) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired download link",
      });
    }

    // Generate OTP (6 digits)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() +
        (Number(process.env.OTP_EXPIRE_MINUTES) || 10) * 60 * 1000
    );

    // Remove previous unverified OTPs
    await OTP.deleteMany({
      token,
      email: email.toLowerCase(),
      verified: false,
    });

    // Save OTP
    const savedOtp = await OTP.create({
      token,
      email: email.toLowerCase(),
      otp: hashedOtp,
      expiresAt,
      verified: false,
    });

    console.log("✅ OTP saved:", savedOtp._id);

    // Send email
    await sendEmail({
      to: email,
      subject: "Your Secure File Download OTP",
      text: `Your OTP is ${otp}. It will expire in ${
        process.env.OTP_EXPIRE_MINUTES || 10
      } minutes.`,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully to email",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    next(error);
  }
};

/* ======================================================
   VERIFY OTP
====================================================== */
const verifyOTP = async (req, res, next) => {
  try {
    const { token, email, otp } = req.body;

    console.log("INPUT:", { token, email, otp });

    // Validation
    if (!token || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Token, email and OTP are required",
      });
    }

    // Hash entered OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Find matching OTP
    const otpRecord = await OTP.findOne({
      token,
      email: email.toLowerCase(),
      otp: hashedOtp,
      verified: false,
    });

    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Mark OTP verified
    otpRecord.verified = true;
    await otpRecord.save();

    // ✅ IMPORTANT FIX: return SHARED DOWNLOAD URL
    return res.json({
      success: true,
      message: "OTP verified successfully",
      downloadUrl: `/api/file/download/shared/${token}`,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
