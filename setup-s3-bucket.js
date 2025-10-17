require('dotenv').config();
const { CreateBucketCommand, PutBucketPolicyCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('./config/s3');

const setupBucket = async () => {
  try {
    // Kiểm tra bucket đã tồn tại chưa
    let bucketExists = false;
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
      console.log(`✓ Bucket "${S3_BUCKET}" đã tồn tại`);
      bucketExists = true;
    } catch (error) {
      // Bucket chưa tồn tại, tạo mới
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
      console.log(`✓ Đã tạo bucket "${S3_BUCKET}"`);
    }

    // Cấu hình policy - Public cho mọi thứ TRỪ folder Users
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [
            `arn:aws:s3:::${S3_BUCKET}/Database/Products/*`,
            `arn:aws:s3:::${S3_BUCKET}/Database/tintuc/*`,
            `arn:aws:s3:::${S3_BUCKET}/Database/danhgia/*`,
            `arn:aws:s3:::${S3_BUCKET}/SlideShow/*`
          ]
        }
      ]
    };

    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: S3_BUCKET,
      Policy: JSON.stringify(policy)
    }));
    
    console.log('✓ Đã cấu hình bucket policy:');
    console.log('  - Public: Products, tintuc, danhgia, SlideShow');
    console.log('  - Private: Users (chỉ admin)');
    console.log('\nBucket đã sẵn sàng sử dụng!');
    console.log(`URL: ${process.env.S3_PUBLIC_URL}`);
  } catch (error) {
    console.error('Lỗi khi setup bucket:', error.message);
  }
};

setupBucket();

module.exports = { setupBucket };
