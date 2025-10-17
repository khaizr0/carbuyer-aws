require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

// Config cho AWS S3 thực hoặc MinIO local
const s3Config = {
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
};

// Nếu có S3_ENDPOINT (MinIO local) thì thêm endpoint và forcePathStyle
if (process.env.S3_ENDPOINT) {
  s3Config.endpoint = process.env.S3_ENDPOINT;
  s3Config.forcePathStyle = true;
}

const s3Client = new S3Client(s3Config);

const S3_BUCKET = process.env.S3_BUCKET || 'carbuyer-aws';

module.exports = { s3Client, S3_BUCKET };
