const fs = require("fs");
const path = require("path");
const {
  S3Client,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const LOCAL_UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

let s3Client = null;

if (
  process.env.S3_BUCKET &&
  process.env.S3_REGION &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY
) {
  s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
}

async function uploadFile(streamOrBuffer, filename, contentType) {
  if (s3Client) {
    try {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.S3_BUCKET,
          Key: filename,
          Body: streamOrBuffer,
          ContentType: contentType,
        },
      });

      await upload.done();

      return {
        storage: "s3",
        key: filename,
      };
    } catch (err) {
      console.error("S3 upload failed, using local storage");
    }
  }

  const localPath = path.join(LOCAL_UPLOAD_DIR, filename);
  fs.writeFileSync(localPath, streamOrBuffer);

  return {
    storage: "local",
    path: localPath,
  };
}

async function downloadFile(file) {
  if (file.storage === "s3") {
    const obj = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file.key,
      })
    );

    const chunks = [];
    for await (const chunk of obj.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  return fs.readFileSync(file.path);
}

module.exports = {
  uploadFile,
  downloadFile,
};
