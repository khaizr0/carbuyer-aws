require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

// Config cho AWS S3 thực hoặc MinIO local
const s3Config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
