# RAB_Data - Restore And Backup Data

Thư mục chứa các công cụ backup và restore dữ liệu DynamoDB.

## 📁 Cấu trúc

```
RAB_Data/
├── backupData.js           # Script backup dữ liệu
├── restoreData.js          # Script restore dữ liệu
├── backup-*.json           # Các file backup
└── README.md              # Hướng dẫn sử dụng
```

## 🔧 Cài đặt

Đảm bảo đã cài đặt dependencies:
```bash
npm install
```

## 📦 Backup Data

### Cách 1: Chạy trực tiếp
```bash
cd RAB_Data
node backupData.js
```

### Cách 2: Từ thư mục gốc
```bash
npm run backup
```

### Kết quả:
- Tạo file `backup-YYYY-MM-DDTHH-MM-SS-MMMZ.json`
- Chứa toàn bộ data từ tất cả tables
- Tự động quét và backup tất cả tables trong DynamoDB

## 🔄 Restore Data

### Cách 1: Chạy trực tiếp
```bash
cd RAB_Data
node restoreData.js backup-2025-10-15T03-13-22-686Z.json
```

### Cách 2: Từ thư mục gốc
```bash
npm run restore RAB_Data/backup-2025-10-15T03-13-22-686Z.json
```

### Chức năng:
- ✅ Tự động tạo tables nếu chưa tồn tại
- ✅ Restore toàn bộ data từ file backup
- ✅ Xử lý schema đặc biệt (User table có EmailIndex)
- ✅ Hiển thị progress chi tiết

## 📝 Lưu ý

1. **DynamoDB Local phải đang chạy:**
   ```bash
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```

2. **File .env phải được cấu hình đúng:**
   ```
   DYNAMODB_ENDPOINT=http://localhost:8000
   AWS_REGION=local
   AWS_ACCESS_KEY_ID=fakeAccessKeyId
   AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey
   ```

3. **Backup định kỳ:**
   - Nên backup trước khi thay đổi lớn
   - Giữ nhiều bản backup khác nhau
   - Đặt tên file có timestamp để dễ quản lý

4. **Restore:**
   - Sẽ ghi đè data hiện tại
   - Nên backup trước khi restore
   - Tables sẽ được tạo tự động nếu chưa có

## 🚀 Workflow khuyến nghị

### Setup lần đầu:
```bash
cd RAB_Data
node restoreData.js backup-2025-10-15T03-13-22-686Z.json
```

### Backup định kỳ:
```bash
npm run backup
```

### Restore khi cần:
```bash
npm run restore RAB_Data/backup-YYYY-MM-DDTHH-MM-SS-MMMZ.json
```

## 📊 Tables được backup

- User
- XeOto
- PhuKien
- ThuongHieu
- LoaiPhuKien
- TinTuc
- DatLichKH
- DanhGia
- Slider
- KieuDang
- MauXe
- NguyenLieuXe

## ⚠️ Troubleshooting

**Lỗi: "Backup file not found"**
- Kiểm tra đường dẫn file
- Đảm bảo file tồn tại trong thư mục RAB_Data

**Lỗi: "Cannot connect to DynamoDB"**
- Kiểm tra DynamoDB Local đang chạy
- Kiểm tra cấu hình .env

**Lỗi: "Table already exists"**
- Bình thường, script sẽ bỏ qua và tiếp tục restore data
