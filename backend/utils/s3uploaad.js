const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");


const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (
  streamOrBuffer,
  key,
  contentType = "application/octet-stream"
) => {
  try {
    if (!process.env.S3_BUCKET) {
      throw new Error("S3_BUCKET not defined");
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: streamOrBuffer,
        ContentType: contentType,
      },
    });

    const result = await upload.done();
    console.log("✅ S3 Upload Success:", result.Key);

    return result;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error);
    throw error;
  }
};

/* =========================
   DOWNLOAD FROM S3 (STREAM)
========================= */
const downloadFileFromS3 = async (key) => {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
    );

    return response.Body; // stream
  } catch (error) {
    console.error("❌ S3 Download Error:", error);
    throw error;
  }
};

module.exports = {
  s3Client,
  uploadFileToS3,
  downloadFileFromS3,
};
