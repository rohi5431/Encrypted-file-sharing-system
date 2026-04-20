require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const existing = await User.findOne({ email: "admin@gmail.com" });

  if (existing) {
    console.log("⚠️ Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash("Admin@123", 10);

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin created");
  process.exit();
}

createAdmin();
