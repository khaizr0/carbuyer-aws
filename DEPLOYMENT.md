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

### 6. (Tùy chọn) Setup Nginx - Truy cập không cần port

Nếu muốn truy cập `http://YOUR_IP` thay vì `http://YOUR_IP:3000`:

```bash
# Cài Nginx
sudo apt update
sudo apt install -y nginx

# Tạo config
sudo nano /etc/nginx/sites-available/carbuyer
```

Paste vào (thay YOUR_IP):
```nginx
server {
    listen 80;
    server_name YOUR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
# Tạo symlink
sudo ln -s /etc/nginx/sites-available/carbuyer /etc/nginx/sites-enabled/

# Xóa default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Update `.env`:
```env
BASE_URL=http://YOUR_IP
```

Firewall Lightsail:
- ✅ Mở port 80
- ❌ Đóng port 3000 (chỉ localhost)

Restart app:
```bash
pm2 restart carbuyer-aws
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

### 3. Lightsail Instance
- OS: Ubuntu 22.04
- RAM: 1GB+ (khuyến nghị 2GB)
- Firewall: Mở port 22, 80, 443

### 4. Cấu hình .env
```bash
cp .env.aws-production .env
nano .env
```

**Cấu hình:**
```env
PORT=3000
BASE_URL=http://YOUR_IP
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=carbuyer-production
S3_PUBLIC_URL=https://your-cloudfront-id.cloudfront.net
```

**Quan trọng:**
- ❌ Không có `DYNAMODB_ENDPOINT` (dùng AWS DynamoDB)
- ❌ Không có `S3_ENDPOINT` (dùng AWS S3)
- ✅ Dùng CloudFront URL cho `S3_PUBLIC_URL`

### 5. Deploy
```bash
# Clone code từ GitHub
git clone https://github.com/YOUR_USERNAME/carbuyer-aws.git
cd carbuyer-aws

# Cài dependencies
yarn install

# Tạo tables và import data
cd RAB_Data
node restoreData.js backup-2025-10-15T03-13-22-686Z.json
cd ..

# Chạy app với PM2
sudo npm install -g pm2
pm2 start app.js --name carbuyer
pm2 startup
pm2 save
```

### 6. Setup Nginx (Khuyến nghị)

```bash
# Cài Nginx
sudo apt install -y nginx

# Tạo config
sudo nano /etc/nginx/sites-available/carbuyer
```

Paste vào (thay YOUR_IP hoặc domain):
```nginx
server {
    listen 80;
    server_name YOUR_IP;  # Hoặc yourdomain.com nếu có

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/carbuyer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 7. (Tùy chọn) SSL với Let's Encrypt

Nếu có domain:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Update `.env`:
```env
BASE_URL=https://yourdomain.com
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
