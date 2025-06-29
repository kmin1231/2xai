// src/services/s3.service.js

const { S3Client, PutObjectCommand, DeleteObjectCommand, } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadImage = async (buffer, key, contentType) => {

  // download file name
  const match = key.match(/^(\d{8}-\d{6})-/);
  const timestamp = match ? match[1] : 'download';
  const contentDisposition = `attachment; filename="highlight-${timestamp}.png"`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ContentDisposition: contentDisposition,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const deleteImage = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };
  await s3.send(new DeleteObjectCommand(params));
};

module.exports = {
  uploadImage,
  deleteImage,
};