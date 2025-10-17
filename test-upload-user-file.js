require('dotenv').config();
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('./config/s3');
const fs = require('fs');

async function uploadTestFile() {
  try {
    // Tạo file test đơn giản
    const testContent = Buffer.from('Test user file content');
    
    await s3Client.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: 'Database/Users/test-avatar.jpg',
      Body: testContent,
      ContentType: 'image/jpeg'
    }));
    
    console.log('✓ Đã upload file test: Database/Users/test-avatar.jpg');
    console.log('\nTest URLs:');
    console.log('1. Truy cập trực tiếp (sẽ bị chặn):');
    console.log(`   ${process.env.S3_PUBLIC_URL}/Database/Users/test-avatar.jpg`);
    console.log('\n2. Qua route protected (cần login admin):');
    console.log('   http://localhost:3000/files/users/test-avatar.jpg');
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

uploadTestFile();
