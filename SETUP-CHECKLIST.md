# Setup Checklist

## Local Development

- [ ] Cài đặt dependencies: `npm install`
- [ ] Khởi động DynamoDB Local
- [ ] Khởi động MinIO Server
- [ ] Tạo `.env` từ `.env.example`
- [ ] Tạo database: `npm run db`
- [ ] Chạy app: `npm start` (tự động setup S3)

## Production (AWS Lightsail)

- [ ] Tạo Lightsail instance
- [ ] Mở ports: 22, 80, 3000, 8000, 9000, 9001
- [ ] Cài đặt Node.js, Java, Docker
- [ ] Upload code
- [ ] Cấu hình `.env` với IP Lightsail
- [ ] Khởi động DynamoDB Local
- [ ] Khởi động MinIO (Docker)
- [ ] Tạo database: `npm run db`
- [ ] Chạy app với PM2: `pm2 start app.js` (tự động setup S3)
- [ ] (Optional) Setup Nginx cho domain

## Lưu ý quan trọng

### S3 Policies
- **Tự động cấu hình** khi start app (`npm start` hoặc `yarn start`)
- Policy này cấu hình:
  - ✅ Public: Products, tintuc, danhgia, SlideShow
  - 🔒 Private: Users (chỉ admin)

### Khi nào cần chạy lại?
- ✅ **TỰ ĐỘNG** mỗi khi start app
- ❌ **KHÔNG** cần chạy thủ công

### Test Access Control
```bash
# Upload file test
node test-upload-user-file.js

# Mở browser
http://localhost:3000/test-user-files
```
