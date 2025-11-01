const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');

// Tạo presigned URL cho ảnh Users (private)
async function getPresignedUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Helper cho Users folder
async function getUserImageUrl(filename) {
  return await getPresignedUrl(`Database/Users/${filename}`);
}

module.exports = {
  getPresignedUrl,
  getUserImageUrl
};
