const ShareLink = require("../models/shareLink");
const File = require("../models/file");
const generateToken = require("../utils/tokenGenerator");
const { processEvent } = require("../utils/anomalyEngine");

const createShareLink = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { hours = 24 } = req.body;

    if (!fileId) {
      return res.status(400).json({ message: "File ID missing" });
    }

    const file = await File.findOne({
      _id: fileId,
      owner: req.user?._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const token = generateToken(16);
    const expiresAt = new Date(Date.now() + Number(hours) * 60 * 60 * 1000);

    // ✅ FIX IS HERE
    await ShareLink.create({
      fileId: file._id,   // ✅ CORRECT
      token,
      expiresAt,
    });

    const shareURL = `${process.env.CLIENT_URL.replace(/\/$/, "")}/download/${token}`;

    // Trigger event stream
    await processEvent({
      userId: req.user._id,
      action: "file_share",
      targetId: file._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { hours }
    });

    return res.status(201).json({
      success: true,
      shareURL,
      expiresAt,
    });
  } catch (err) {
    console.error("SHARE LINK ERROR:", err);
    return res.status(500).json({
      message: "Failed to create share link",
      error: err.message,
    });
  }
};

module.exports = { createShareLink };
