# carbuyer-aws

Website bán xe ô tô và phụ kiện sử dụng Node.js, Express, DynamoDB và S3.

## Yêu cầu

- Node.js 18+
- Java (cho DynamoDB Local)
- Docker (cho MinIO)

## Cài đặt

```bash
yarn install
```

## Quick Start

```bash
# 1. Khởi động DynamoDB Local
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

# 2. Khởi động MinIO (Docker)
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"

# 3. Tạo database
yarn db

# 4. Chạy app (S3 tự động setup)
yarn start
```

Development mode:
```bash
yarn dev
```

## Tài khoản mặc định

- Admin: nguyenvanb@example.com / hashedpassword123
- Employee: caophankhai2004@gmail.com / hashedpassword123

## Cấu hình MinIO

- Endpoint: http://localhost:9000
- Console: http://localhost:9001
- Access Key: minioadmin
- Secret Key: minioadmin
- Bucket: carbuyer-aws

## Cấu trúc S3

- `Database/Products/` - Ảnh sản phẩm (public)
- `Database/tintuc/` - Ảnh tin tức (public)
- `Database/danhgia/` - Ảnh đánh giá (public)
- `Database/Users/` - Ảnh users (private, admin only)
- `SlideShow/` - Ảnh slider (public)

## Deployment

Xem [DEPLOYMENT.md](DEPLOYMENT.md) để deploy lên AWS Lightsail hoặc AWS Production.
