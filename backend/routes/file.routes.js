const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const fileController = require("../controllers/file.controller");

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  fileController.uploadFile
);

router.get(
  "/my-files",
  authMiddleware,
  fileController.getMyFiles
);

router.get(
  "/download/:id",
  authMiddleware,
  fileController.downloadFileById
);

router.get(
  "/download/shared/:token",
  fileController.downloadSharedFile
);

module.exports = router;
