# carbuyer-aws

Website bán xe ô tô và phụ kiện sử dụng Node.js, Express và DynamoDB.

## Yêu cầu

- Node.js
- DynamoDB Local (chạy trên localhost:8000)

## Cài đặt

```bash
npm install
```

## Khởi động DynamoDB Local

```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

## Tạo tables và dữ liệu mẫu

```bash
npm run db
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
