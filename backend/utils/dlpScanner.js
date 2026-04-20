const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Regex heuristics as a fallback
const HEURISTICS = {
  creditCard: /\b(?:\d[ -]*?){13,16}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  aadhaar: /\b\d{4}\s\d{4}\s\d{4}\b/,
  emailList: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
};

/**
 * Reads up to the first 10KB of a file to extract text
 */
function extractTextPreview(filePath) {
  try {
    const buffer = Buffer.alloc(10240); // 10KB max
    const fd = fs.openSync(filePath, "r");
    const bytesRead = fs.readSync(fd, buffer, 0, 10240, 0);
    fs.closeSync(fd);
    return buffer.toString("utf8", 0, bytesRead);
  } catch (err) {
    console.error("Error reading file for DLP:", err);
    return "";
  }
}

/**
 * Scans file for sensitive data using Gemini API (if key exists) or Regex Fallback
 */
async function scanForSensitiveData(filePath) {
  const text = extractTextPreview(filePath);
  
  if (!text || text.trim().length === 0) {
    return { hasSensitiveData: false }; // binary file or empty
  }

  // Use Gemini if API key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
      You are a Data Loss Prevention (DLP) engine. 
      Analyze the following text from an uploaded file and determine if it contains highly sensitive personal information.
      Sensitive info includes: Credit Card numbers, Social Security Numbers (SSN), Aadhaar numbers, Passport numbers, bank account numbers, or a large dump of passwords/emails.
      
      Reply EXACTLY with "YES" if it contains sensitive data, or "NO" if it is safe.
      
      Text to analyze:
      ${text.substring(0, 5000)}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim().toUpperCase();
      
      if (responseText.includes("YES")) {
        return { hasSensitiveData: true, reason: "AI detected highly sensitive data." };
      }
      return { hasSensitiveData: false };
    } catch (err) {
      console.error("Gemini DLP scan failed, falling back to regex:", err);
      // Fall through to regex if API fails
    }
  }

  // Fallback Regex heuristic scan
  for (const [type, regex] of Object.entries(HEURISTICS)) {
    if (regex.test(text)) {
      // If it's just one email, it might be fine, but if it matches CC, SSN, Aadhaar, flag it
      if (type !== 'emailList' || text.match(new RegExp(regex, 'g')).length > 5) {
         return { hasSensitiveData: true, reason: `Regex detected pattern: ${type}` };
      }
    }
  }

  return { hasSensitiveData: false };
}

module.exports = {
  scanForSensitiveData
};
