const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { pipeline } = require("stream/promises");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const File = require("../models/file");
const ShareLink = require("../models/shareLink");
const OTP = require("../models/OTP");
const { createCipher, createDecipher } = require("../utils/crypto");
const { processEvent } = require("../utils/anomalyEngine");
const { scanForSensitiveData } = require("../utils/dlpScanner");

/* =========================
   LOCAL UPLOAD DIR
========================= */
const LOCAL_UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

/* =========================
   S3 SETUP
========================= */
const isS3Enabled =
  process.env.S3_BUCKET &&
  process.env.S3_REGION &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY;

let s3 = null;
if (isS3Enabled) {
  s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
}

/* =========================
   UPLOAD FILE
========================= */
exports.uploadFile = async (req, res) => {
  let encryptedPath = null;

  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    // --- AI Data Loss Prevention (DLP) Check ---
    if (req.body.ignoreDLP !== "true") {
      const dlpResult = await scanForSensitiveData(req.file.path);
      if (dlpResult.hasSensitiveData) {
        return res.status(409).json({ 
          warning: true, 
          message: "⚠️ AI Warning: This file contains highly sensitive data (e.g., Credit Card, Passwords, SSN). Are you sure you want to encrypt and upload it?" 
        });
      }
    }

    const { cipher, iv } = createCipher();
    encryptedPath = `${req.file.path}.enc`;

    await pipeline(
      fs.createReadStream(req.file.path),
      cipher,
      fs.createWriteStream(encryptedPath)
    );

    const authTag = cipher.getAuthTag();

    let storage = "local";
    let s3Key = null;
    let localPath = null;

    /* ===== Upload to S3 if enabled ===== */
    if (isS3Enabled) {
      try {
        s3Key = `encrypted/${Date.now()}-${req.file.originalname}.enc`;
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: s3Key,
            Body: fs.createReadStream(encryptedPath),
            ContentType: "application/octet-stream",
          })
        );
        storage = "s3";
      } catch (err) {
        console.error("❌ S3 upload failed, fallback to local:", err);
      }
    }

    /* ===== Fallback to local ===== */
    if (storage === "local") {
      localPath = path.join(
        LOCAL_UPLOAD_DIR,
        `${Date.now()}-${req.file.originalname}.enc`
      );
      fs.copyFileSync(encryptedPath, localPath);
    }

    const file = await File.create({
      owner: req.user._id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storage,
      s3Key,
      localPath,
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
    });

    await processEvent({
      userId: req.user._id,
      action: "file_access",
      targetId: file._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { actionDetails: "File Uploaded via controller", size: file.size }
    });

    res.status(201).json({ success: true, file });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  } finally {
    try {
      if (req?.file?.path && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      if (encryptedPath && fs.existsSync(encryptedPath))
        fs.unlinkSync(encryptedPath);
    } catch {}
  }
};

/* =========================
   GET MY FILES
========================= */
exports.getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .select("originalName mimeType size storage createdAt");

    res.json({ success: true, files });
  } catch {
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

/* =========================
   DOWNLOAD (OWNER) BY FILE ID
========================= */
exports.downloadFileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const decipher = createDecipher(
      Buffer.from(file.iv, "base64"),
      Buffer.from(file.authTag, "base64")
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    res.setHeader(
      "Content-Type",
      file.mimeType || "application/octet-stream"
    );

    await processEvent({
      userId: req.user?._id || null,
      action: "file_download",
      targetId: file._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { actionDetails: "File Downloaded" }
    });

    if (file.storage === "s3") {
      const s3Response = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: file.s3Key,
        })
      );
      return s3Response.Body.pipe(decipher).pipe(res);
    }

    if (!fs.existsSync(file.localPath))
      return res.status(404).json({ message: "File missing on server" });

    fs.createReadStream(file.localPath).pipe(decipher).pipe(res);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};

/* =========================
   DOWNLOAD SHARED FILE (TOKEN)
========================= */
exports.downloadSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    /* Cleanup expired OTPs */
    await OTP.deleteMany({ expiresAt: { $lt: new Date() } });

    /* OTP must be verified */
    const otp = await OTP.findOne({ token, verified: true });
    if (!otp) {
      return res.status(403).json({
        message: "OTP verification required",
      });
    }

    /* Share link must exist and not be expired */
    const share = await ShareLink.findOne({ token });
    if (!share || share.expiresAt < new Date()) {
      return res.status(404).json({
        message: "Invalid or expired link",
      });
    }

    /* File must exist */
    const file = await File.findById(share.fileId);
    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const decipher = createDecipher(
      Buffer.from(file.iv, "base64"),
      Buffer.from(file.authTag, "base64")
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    res.setHeader(
      "Content-Type",
      file.mimeType || "application/octet-stream"
    );

    await processEvent({
      userId: null,
      action: "file_download",
      targetId: file._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { actionDetails: "Shared File Downloaded via OTP" }
    });

    if (file.storage === "s3") {
      const s3Response = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: file.s3Key,
        })
      );
      return s3Response.Body.pipe(decipher).pipe(res);
    }

    if (!fs.existsSync(file.localPath)) {
      return res.status(404).json({
        message: "File missing on server",
      });
    }

    fs.createReadStream(file.localPath).pipe(decipher).pipe(res);
  } catch (err) {
    console.error("SHARED DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};
