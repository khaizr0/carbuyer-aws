# Hướng dẫn Deployment

## Local Development

### 1. Cài đặt
```bash
yarn install
```

### 2. Khởi động Services
```bash
# DynamoDB Local
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

# MinIO (Docker)
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"
```

### 3. Setup Database
```bash
yarn db
```

### 4. Chạy App
```bash
yarn start  # S3 bucket tự động setup
```

---

## AWS Lightsail Deployment

### 1. Tạo Instance
- OS: Ubuntu 22.04
- RAM: 2GB+
- Ports: 22, 80, 3000, 8000, 9000, 9001

### 2. Cài đặt Dependencies
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Java (DynamoDB Local)
sudo apt install -y openjdk-11-jre-headless

# Docker (MinIO)
sudo apt install -y docker.io
sudo usermod -aG docker $USER
```

### 3. Upload Code
```bash
scp -r carbuyer-aws ubuntu@YOUR_IP:/home/ubuntu/
```

### 4. Cấu hình .env
```bash
cp .env.example .env
nano .env
```

Thay đổi:
```
BASE_URL=http://YOUR_IP:3000
DYNAMODB_ENDPOINT=http://YOUR_IP:8000
S3_ENDPOINT=http://YOUR_IP:9000
S3_PUBLIC_URL=http://YOUR_IP:9000/carbuyer-aws
```

### 5. Khởi động Services
```bash
# DynamoDB
wget https://s3.ap-southeast-1.amazonaws.com/dynamodb-local-singapore/dynamodb_local_latest.tar.gz
tar -xzf dynamodb_local_latest.tar.gz
nohup java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb &

# MinIO
docker run -d --name minio -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=your_key" \
  -e "MINIO_ROOT_PASSWORD=your_secret" \
  -v ~/minio-data:/data --restart unless-stopped \
  quay.io/minio/minio server /data --console-address ":9001"

# App
yarn install
yarn db
sudo npm install -g pm2
pm2 start app.js --name carbuyer-aws
pm2 startup && pm2 save
```

---

## AWS Production (S3 + DynamoDB)

### 1. Tạo AWS Resources
```bash
# S3 Bucket
aws s3 mb s3://carbuyer-production --region ap-southeast-1

# DynamoDB Tables
aws dynamodb create-table \
  --table-name XeOto \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1
```

### 2. CloudFront Distribution
- Origin: S3 bucket
- HTTPS only
- Cache: 86400s

### 3. Cấu hình .env
```bash
cp .env.aws-production .env
```

**Quan trọng:**
- ❌ Xóa `DYNAMODB_ENDPOINT` (dùng AWS DynamoDB)
- ❌ Xóa `S3_ENDPOINT` (dùng AWS S3)
- ✅ Dùng CloudFront URL cho `S3_PUBLIC_URL`

### 4. Deploy
```bash
yarn install
pm2 start app.js --name carbuyer-aws
```

---

## Quản lý

```bash
# Logs
pm2 logs carbuyer-aws

# Restart
pm2 restart carbuyer-aws

# Status
pm2 status
```
