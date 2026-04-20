const fs = require("fs");
const path = require("path");
const File = require("../models/file.model");
const { createDecipher } = require("../utils/encryption");

const downloadFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({
      _id: id,
      owner: req.user._id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    const encryptedPath = path.join(__dirname, "..", file.path);

    const iv = Buffer.from(file.iv, "base64");
    const authTag = Buffer.from(file.authTag, "base64");

    const decipher = createDecipher(iv, authTag);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    res.setHeader(
      "Content-Type",
      file.mimeType || "application/octet-stream"
    );

    fs.createReadStream(encryptedPath)
      .pipe(decipher)
      .pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { downloadFileById };
