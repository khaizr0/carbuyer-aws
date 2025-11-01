const express = require('express');
const router = express.Router();
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');

// Route để lấy ảnh user - public access for customer
router.get('/users/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: `Database/Users/${filename}`
    });
    
    const response = await s3Client.send(command);
    res.setHeader('Content-Type', response.ContentType || 'image/jpeg');
    response.Body.pipe(res);
  } catch (error) {
    res.status(404).json({ message: 'File không tồn tại' });
  }
});

module.exports = router;
