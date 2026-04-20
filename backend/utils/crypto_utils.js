const crypto = require("crypto");

const ALGO = 'aes-256-gcm';
const IV_LEN = 12; // recommended for GCM

function base64KeyToBuffer(base64Key) {
  return Buffer.from(base64Key, 'base64'); // must be 32 bytes
}

function encryptBuffer(plainBuffer, keyBuffer) {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, keyBuffer, iv, { authTagLength: 16 });
  const encrypted = Buffer.concat([cipher.update(plainBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    encryptedBuffer: encrypted
  };
}

function decryptBuffer(encryptedBuffer, keyBuffer, ivBase64, authTagBase64) {
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = crypto.createDecipheriv(ALGO, keyBuffer, iv, { authTagLength: 16 });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted;
}

module.exports = {
  base64KeyToBuffer,
  encryptBuffer,
  decryptBuffer
};
