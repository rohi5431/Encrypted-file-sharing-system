// backend/utils/encryption.js
const crypto = require('crypto');
const { pipeline } = require('stream');
const { promisify } = require('util');
const pump = promisify(pipeline);


// read key from env (base64)
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');
if (KEY.length !== 32) {
throw new Error('ENCRYPTION_KEY must decode to 32 bytes (base64)');
}


// Helper: create cipher stream and return iv
function createCipher() {
// 12 bytes IV for GCM
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv, { authTagLength: 16 });
return { cipher, iv };
}


// Helper: create decipher stream with iv and authTag
function createDecipher(iv, authTag) {
const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv, { authTagLength: 16 });
decipher.setAuthTag(authTag);
return decipher;
}


module.exports = { createCipher, createDecipher, pump };