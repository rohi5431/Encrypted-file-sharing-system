const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const filePath = "./test-file.txt"; // <-- change this to your file
const url = "http://localhost:5000/file/upload"; // <-- your upload endpoint
const token = "YOUR_JWT_TOKEN_HERE"; // <-- add your token if required, else leave ""

async function uploadFile() {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const headers = formData.getHeaders();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post(url, formData, { headers });

    console.log("Upload successful:", response.data);
  } catch (err) {
    if (err.response) {
      console.error("Upload failed:", err.response.status, err.response.data);
    } else {
      console.error("Upload failed:", err.message);
    }
  }
}

uploadFile();
