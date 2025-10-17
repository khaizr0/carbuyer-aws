# carbuyer-aws

Website bán xe ô tô và phụ kiện sử dụng Node.js, Express và DynamoDB.

## Yêu cầu

- Node.js
- DynamoDB Local (chạy trên localhost:8000)
- MinIO Server (chạy trên localhost:9000)

## Cài đặt

```bash
npm install
```

## Khởi động DynamoDB Local

```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

## Khởi động MinIO Server

```bash
minio server ~/minio-data --console-address ":9001"
```

Hoặc sử dụng Docker:

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"
```

## Tạo tables và dữ liệu mẫu

```bash
npm run db
```

## Setup S3 Bucket trên MinIO

S3 bucket sẽ được tự động setup khi chạy `npm start` hoặc `yarn start`.

Nếu muốn setup thủ công:
```bash
npm run setup-s3
```

## Chạy ứng dụng

```bash
npm start
```

hoặc development mode:

```bash
npm run dev
```

## Kiểm tra tables

```bash
node checkTables.js
```

## Tài khoản mặc định

- Admin: nguyenvanb@example.com / hashedpassword123
- Employee: caophankhai123@gmail.com / hashedpassword123

## Cấu hình MinIO

- Endpoint: http://localhost:9000
- Console: http://localhost:9001
- Access Key: minioadmin
- Secret Key: minioadmin
- Bucket: carbuyer-aws

## Lưu trữ ảnh

Ứng dụng sử dụng MinIO S3 để lưu trữ ảnh:
- Sản phẩm: `Database/Products/`
- Tin tức: `Database/tintuc/`
- Đánh giá: `Database/danhgia/`
- Users: `Database/Users/`
- Slider: `SlideShow/`
