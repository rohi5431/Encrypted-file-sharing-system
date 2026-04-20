const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  // FIX: use { id: userId } to match middleware
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );

  const isProd = process.env.NODE_ENV === "production";

  // Set cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
  });

  return token;
};

module.exports = generateToken;
