# Hướng dẫn Deploy lên AWS Lightsail

## 1. Chuẩn bị

### Tạo Lightsail Instance
- Chọn OS: Ubuntu 22.04 LTS
- Plan: Tối thiểu 2GB RAM
- Mở ports: 22, 80, 3000, 8000, 9000, 9001

## 2. Cài đặt Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Java (cho DynamoDB Local)
sudo apt install -y openjdk-11-jre-headless

# Install Docker (cho MinIO)
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## 3. Upload Code

```bash
# Trên máy local
scp -r carbuyer-aws ubuntu@YOUR_LIGHTSAIL_IP:/home/ubuntu/

# Hoặc dùng git
ssh ubuntu@YOUR_LIGHTSAIL_IP
git clone YOUR_REPO_URL
cd carbuyer-aws
```

## 4. Cấu hình Environment

```bash
# Copy và chỉnh sửa .env
cp .env.example .env
nano .env
```

Thay đổi các giá trị:
```
BASE_URL=http://YOUR_LIGHTSAIL_IP:3000
DYNAMODB_ENDPOINT=http://YOUR_LIGHTSAIL_IP:8000
S3_ENDPOINT=http://YOUR_LIGHTSAIL_IP:9000
S3_PUBLIC_URL=http://YOUR_LIGHTSAIL_IP:9000/carbuyer-aws
```

## 5. Khởi động Services

### DynamoDB Local
```bash
# Download DynamoDB Local
wget https://s3.ap-southeast-1.amazonaws.com/dynamodb-local-singapore/dynamodb_local_latest.tar.gz
tar -xzf dynamodb_local_latest.tar.gz
rm dynamodb_local_latest.tar.gz

# Chạy DynamoDB
nohup java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8000 > dynamodb.log 2>&1 &
```

### MinIO
```bash
docker run -d \
  --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=your_access_key" \
  -e "MINIO_ROOT_PASSWORD=your_secret_key" \
  -v ~/minio-data:/data \
  --restart unless-stopped \
  quay.io/minio/minio server /data --console-address ":9001"
```

### Node.js App
```bash
# Install dependencies
npm install

# Setup database
npm run db

# Setup S3 bucket (tự động cấu hình policies)
npm run setup-s3

# Chạy app với PM2
sudo npm install -g pm2
pm2 start app.js --name carbuyer-aws
pm2 startup
pm2 save
```

## 6. Cấu hình Nginx (Optional - cho domain)

```bash
sudo apt install -y nginx

# Tạo config
sudo nano /etc/nginx/sites-available/carbuyer
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/carbuyer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Kiểm tra

- App: http://YOUR_LIGHTSAIL_IP:3000
- MinIO Console: http://YOUR_LIGHTSAIL_IP:9001
- DynamoDB: http://YOUR_LIGHTSAIL_IP:8000

## 8. Quản lý

```bash
# Xem logs
pm2 logs carbuyer-aws

# Restart app
pm2 restart carbuyer-aws

# Stop app
pm2 stop carbuyer-aws

# Xem status
pm2 status
```
