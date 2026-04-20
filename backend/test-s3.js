require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

async function testS3Upload() {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: "test/hello.txt",
        Body: "Hello AWS S3",
        ContentType: "text/plain",
      })
    );

    console.log("✅ S3 upload test SUCCESS");
  } catch (error) {
    console.error("❌ S3 upload test FAILED");
    console.error(error);
  }
}

testS3Upload();
