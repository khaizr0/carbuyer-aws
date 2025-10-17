require('dotenv').config();
const { S3Client, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  forcePathStyle: true
});

const setupPolicies = async () => {
  try {
    // Policy: Public read cho tất cả TRỪ folder Users
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [
            `arn:aws:s3:::${process.env.S3_BUCKET}/Database/Products/*`,
            `arn:aws:s3:::${process.env.S3_BUCKET}/Database/tintuc/*`,
            `arn:aws:s3:::${process.env.S3_BUCKET}/Database/danhgia/*`,
            `arn:aws:s3:::${process.env.S3_BUCKET}/SlideShow/*`
          ]
        },
        {
          Effect: 'Deny',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${process.env.S3_BUCKET}/Database/Users/*`],
          Condition: {
            StringNotEquals: {
              'aws:userid': '${aws:userid}'
            }
          }
        }
      ]
    };

    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: process.env.S3_BUCKET,
      Policy: JSON.stringify(policy)
    }));

    console.log('✓ Đã cấu hình policy S3');
    console.log('  - Public: Products, tintuc, danhgia, SlideShow');
    console.log('  - Private: Users (chỉ admin)');
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
};

setupPolicies();
