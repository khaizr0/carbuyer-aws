# Deploy lên AWS Production

## So sánh Local vs AWS Production

| Service | Local | AWS Production |
|---------|-------|----------------|
| **DynamoDB** | DynamoDB Local (port 8000) | AWS DynamoDB |
| **S3** | MinIO (port 9000) | AWS S3 + CloudFront |
| **Server** | Node.js local | Lightsail / EC2 |
| **Redis** | (không dùng) | ElastiCache (optional) |

## Bước 1: Tạo AWS Resources

### 1.1 DynamoDB Tables
```bash
# Tạo tables trên AWS Console hoặc CLI
aws dynamodb create-table \
  --table-name XeOto \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1

# Tương tự cho các tables khác: PhuKien, TinTuc, DanhGia, Slider, etc.
```

### 1.2 S3 Bucket + CloudFront
```bash
# Tạo S3 bucket
aws s3 mb s3://carbuyer-production --region ap-southeast-1

# Tạo CloudFront distribution
# - Origin: S3 bucket
# - Viewer Protocol Policy: Redirect HTTP to HTTPS
# - Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
```

### 1.3 IAM User/Role
```bash
# Tạo IAM user với permissions:
# - DynamoDB: Full access
# - S3: Full access cho bucket carbuyer-production
# - Lưu Access Key và Secret Key
```

### 1.4 Lightsail Instance
- OS: Ubuntu 22.04
- Plan: 2GB RAM trở lên
- Static IP: Attach static IP
- Firewall: Mở ports 22, 80, 443, 3000

## Bước 2: Cấu hình .env

Copy `.env.aws-production` thành `.env` và điền thông tin:

```bash
cp .env.aws-production .env
nano .env
```

**Quan trọng:**
- ❌ **XÓA** `DYNAMODB_ENDPOINT` (để dùng AWS DynamoDB thực)
- ❌ **XÓA** `S3_ENDPOINT` (để dùng AWS S3 thực)
- ✅ **THÊM** CloudFront URL vào `S3_PUBLIC_URL`
- ✅ **THÊM** AWS credentials hoặc dùng IAM role

## Bước 3: Deploy Code

```bash
# Upload code
scp -r carbuyer-aws ubuntu@YOUR_LIGHTSAIL_IP:/home/ubuntu/

# SSH vào server
ssh ubuntu@YOUR_LIGHTSAIL_IP
cd carbuyer-aws

# Install dependencies
npm install

# Chạy app
pm2 start app.js --name carbuyer-aws
pm2 startup
pm2 save
```

## Bước 4: Setup Nginx + SSL

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Cấu hình Nginx
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/carbuyer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d your-domain.com
```

## Bước 5: Migrate Data (Optional)

Nếu có data từ local cần migrate:

```bash
# Backup từ local
npm run backup

# Upload file backup lên server
scp RAB_Data/backup-*.json ubuntu@YOUR_LIGHTSAIL_IP:/home/ubuntu/carbuyer-aws/RAB_Data/

# Restore trên server
npm run restore
```

## Lưu ý quan trọng

### S3 Policies
App sẽ tự động setup policies khi start. Nhưng với AWS S3 thực, bạn nên:
1. Tắt "Block all public access" cho bucket
2. Dùng CloudFront để serve files (bảo mật hơn)
3. Cấu hình CORS nếu cần

### DynamoDB
- Không cần chạy DynamoDB Local
- Dùng AWS Console để tạo tables
- Hoặc chạy script tạo tables tự động (cần viết thêm)

### CloudFront
- Cache TTL: 86400 (1 ngày) cho static files
- Invalidate cache khi update ảnh: `aws cloudfront create-invalidation --distribution-id XXX --paths "/*"`

### Cost Optimization
- DynamoDB: Dùng On-Demand hoặc Provisioned với Auto Scaling
- S3: Dùng S3 Intelligent-Tiering
- CloudFront: Free tier 1TB/tháng
- Lightsail: Fixed price $10-20/tháng

## Monitoring

```bash
# Xem logs
pm2 logs carbuyer-aws

# Monitor
pm2 monit

# Restart
pm2 restart carbuyer-aws
```

## Rollback

```bash
# Nếu có vấn đề, rollback về local:
# 1. Đổi .env về config local
# 2. Restart app
pm2 restart carbuyer-aws
```
