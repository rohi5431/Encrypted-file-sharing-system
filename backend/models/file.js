const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    storage: {
      type: String,
      enum: ["s3", "local"],
      required: true,
    },

    s3Key: {
      type: String,
    },

    localPath: {
      type: String,
    },

    iv: {
      type: String,
      required: true,
    },

    authTag: {
      type: String,
      required: true,
    },

    downloadCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ createdAt: -1 });
module.exports =
  mongoose.models.File || mongoose.model("File", fileSchema);
