const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "base64");

if (KEY.length !== 32) throw new Error("Invalid ENCRYPTION_KEY");

const createCipher = () => {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  return { cipher, iv };
};

const createDecipher = (iv, authTag) => {
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);
  return decipher;
};

module.exports = { createCipher, createDecipher };
