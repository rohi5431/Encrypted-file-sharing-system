require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const multer = require("multer");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/file.routes");
const shareRoutes = require("./routes/share.routes");
const otpRoutes = require("./routes/otp.routes");
const adminRoutes = require("./routes/admin.routes");

const authMiddleware = require("./middleware/auth.middleware");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const { apiLimiter, authLimiter } = require("./middleware/rateLimit.middleware");
const passport = require("passport");

const FileModel = require("./models/file");
require("./cron/adminReports.cron");
const app = express();
const server = http.createServer(app);
const socket = require("./utils/socket");
socket.init(server);
require("./config/passport");
app.use(passport.initialize());



const {
  base64KeyToBuffer,
  encryptBuffer,
  decryptBuffer,
} = require("./utils/crypto_utils");

const { uploadFileToS3 } = require("./utils/s3uploaad");
const { processEvent } = require("./utils/anomalyEngine");

if (!process.env.ENCRYPTION_KEY) {
  console.error("❌ ENCRYPTION_KEY missing in .env");
  process.exit(1);
}
if (!process.env.CLIENT_URL) {
  console.error("❌ CLIENT_URL missing in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const STORAGE = process.env.STORAGE || "local";
const LOCAL_DIR = path.resolve("./uploads_encrypted");
const KEY = base64KeyToBuffer(process.env.ENCRYPTION_KEY);

connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5176",
  "http://localhost:5178",
  "http://localhost:5188",
  
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/file/send-otp", authLimiter);

app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/file", require("./routes/file.routes"));
app.use("/api/file", require("./routes/share.routes"));
app.use("/api/file", require("./routes/otp.routes"));

const upload = multer({ storage: multer.memoryStorage() });

app.post(
  "/api/file/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file provided" });
      }

      const { iv, authTag, encryptedBuffer } = encryptBuffer(req.file.buffer, KEY);
      const id = uuidv4();

      const meta = {
        id,
        owner: req.user._id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        iv,
        authTag,
        storage: STORAGE,
      };

      if (STORAGE === "local") {
        await fs.mkdir(LOCAL_DIR, { recursive: true });
        const filepath = path.join(LOCAL_DIR, `${id}.enc`);
        await fs.writeFile(filepath, encryptedBuffer);
        meta.localPath = filepath;
      } else {
        const s3Key = `encrypted/${id}.enc`;
        await uploadFileToS3(encryptedBuffer, s3Key, "application/octet-stream");
        meta.s3Key = s3Key;
      }

      await FileModel.create(meta);

      // Trigger event stream
      await processEvent({
        userId: req.user._id,
        action: "file_access",
        targetId: id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: { actionDetails: "File Uploaded", fileSize: req.file.size }
      });

      res.status(201).json({
        success: true,
        message:
          STORAGE === "s3"
            ? "✅ File uploaded to AWS S3"
            : "📁 File uploaded to Local Storage",
        id,
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* =========================
   FILE DOWNLOAD
========================= */
app.get("/api/file/download/:id", async (req, res) => {
  try {
    const meta = await FileModel.findOne({ id: req.params.id }).lean();
    if (!meta) return res.status(404).send("File not found");

    let encryptedBuffer;

    if (meta.storage === "local") {
      encryptedBuffer = await fs.readFile(meta.localPath);
    } else {
      const { GetObjectCommand } = require("@aws-sdk/client-s3");
      const { s3Client } = require("./utils/uploadFileToS3");
      const obj = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: meta.s3Key,
        })
      );

      const chunks = [];
      for await (const chunk of obj.Body) chunks.push(chunk);
      encryptedBuffer = Buffer.concat(chunks);
    }

    const decrypted = decryptBuffer(encryptedBuffer, KEY, meta.iv, meta.authTag);

    // Trigger event stream
    await processEvent({
      userId: req.user ? req.user._id : null, // Depending on if download is auth protected
      action: "file_download",
      targetId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { actionDetails: "File Downloaded" }
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${meta.originalName}"`
    );
    res.setHeader("Content-Type", meta.mimeType);
    res.send(decrypted);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).send("Download error");
  }
});

app.get("/api/files", authMiddleware, async (req, res) => {
  try {
    const files = await FileModel.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .select("id originalName mimeType size createdAt");

    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, message: "List error" });
  }
});

/* =========================
   ERROR HANDLERS
========================= */
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ status: "OK", service: "Encrypted File Share Backend" });
});

/* =========================
   START SERVER
========================= */
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Storage mode: ${STORAGE}`);
});
