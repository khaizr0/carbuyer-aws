# carbuyer-aws

Website bán xe ô tô và phụ kiện sử dụng Node.js, Express, DynamoDB và S3.

## Kiến trúc

- **Backend**: Node.js + Express (chạy trên Lightsail/EC2)
- **Database**: AWS DynamoDB (serverless)
- **Storage**: AWS S3 + CloudFront CDN (serverless)
- **Email**: Nodemailer + Gmail SMTP

## Yêu cầu

### Local Development:
- Node.js 18+
- Java (cho DynamoDB Local)
- Docker (cho MinIO)

### Production:
- Node.js 18+
- AWS Account với IAM credentials

## Cài đặt

```bash
yarn install
```

## Chạy Local (Development)

```bash
# 1. Khởi động DynamoDB Local
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

# 2. Khởi động MinIO (Docker)
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"

# 3. Copy file .env.example thành .env.local và cấu hình
cp .env.example .env.local

# 4. Tạo database và import data
cd RAB_Data
node restoreData.js backup-2025-10-15T03-13-22-686Z.json
cd ..

# 5. Chạy app (S3 bucket tự động setup)
yarn start
```

Development mode với auto-reload:
```bash
yarn dev
```

## Chạy Production (AWS)

```bash
# 1. Copy file .env.aws-production thành .env và cấu hình
cp .env.aws-production .env
nano .env  # Điền AWS credentials và CloudFront URL

# 2. Tạo DynamoDB tables và import data
cd RAB_Data
node restoreData.js backup-2025-10-15T03-13-22-686Z.json
cd ..

# 3. Chạy app
npm start

# Hoặc dùng PM2 để chạy background
npm install -g pm2
pm2 start app.js --name carbuyer
pm2 save
pm2 startup
```

## Tài khoản mặc định

- Admin: nguyenvanb@example.com / hashedpassword123
- Employee: caophankhai2004@gmail.com / hashedpassword123

## Cấu hình

### Local (MinIO):
- Endpoint: http://localhost:9000
- Console: http://localhost:9001
- Access Key: minioadmin
- Secret Key: minioadmin
- Bucket: carbuyer-aws

### Production (AWS):
- S3 Bucket: carbuyer-production
- CloudFront: https://d3kaxlzyq8f9ut.cloudfront.net
- DynamoDB: ap-southeast-1 region
- Lightsail: Node.js app server

## Cấu trúc S3

- `Database/Products/` - Ảnh sản phẩm (public)
- `Database/tintuc/` - Ảnh tin tức (public)
- `Database/danhgia/` - Ảnh đánh giá (public)
- `Database/Users/` - Ảnh users (private, admin only)
- `SlideShow/` - Ảnh slider (public)

## Deployment

Xem [DEPLOYMENT.md](DEPLOYMENT.md) để deploy lên AWS Lightsail hoặc AWS Production.
