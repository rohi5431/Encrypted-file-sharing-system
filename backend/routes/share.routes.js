const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { createShareLink } = require("../controllers/share.controller");

const router = express.Router();

router.post("/share/:fileId", authMiddleware, createShareLink);

module.exports = router;
