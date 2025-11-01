# Tối ưu Code CarBuyer AWS

## ✅ Đã tối ưu:

### 1. **Bảo mật: Xóa Hardcoded Credentials**
- ❌ Trước: AWS credentials trong .env
- ✅ Sau: Dùng IAM Role cho EC2
- File: `config/s3.js` (cả 2 services)

### 2. **S3 Presigned URL cho Users folder**
- File: `utils/s3-presigned.js`
- Dùng cho ảnh private (Database/Users/*)

### 3. **Lambda Email Client**
- File: `utils/email-client.js`
- Gọi Lambda thay vì gửi email trực tiếp từ EC2

### 4. **IAM Role Policy**
- File: `iam-policies/ec2-role-policy.json`
- Permissions: S3 + DynamoDB

## 📝 Các bước deploy:

### Bước 1: Tạo IAM Role
```bash
aws iam create-role --role-name carbuyer-ec2-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam put-role-policy --role-name carbuyer-ec2-role \
  --policy-name carbuyer-ec2-policy \
  --policy-document file://iam-policies/ec2-role-policy.json

aws iam create-instance-profile --instance-profile-name carbuyer-ec2-profile
aws iam add-role-to-instance-profile --instance-profile-name carbuyer-ec2-profile \
  --role-name carbuyer-ec2-role
```

### Bước 2: Attach IAM Role vào EC2
```bash
aws ec2 associate-iam-instance-profile \
  --instance-id i-xxxxx \
  --iam-instance-profile Name=carbuyer-ec2-profile
```

### Bước 3: Xóa credentials khỏi .env
```bash
# Xóa 2 dòng này:
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
```

### Bước 4: Deploy Lambda Email Service
```bash
cd lambda-email-service
npm install
zip -r function.zip index.js node_modules package.json
cd terraform
terraform init
terraform apply
```

### Bước 5: Cập nhật LAMBDA_EMAIL_API_URL
```bash
# Lấy API URL từ Terraform output
terraform output api_gateway_url

# Thêm vào .env
LAMBDA_EMAIL_API_URL=https://xxxxx.execute-api.ap-southeast-1.amazonaws.com/prod/send-email
```

### Bước 6: Restart services
```bash
pm2 restart all
```

## 💰 Tiết kiệm chi phí:

- ✅ Xóa Interface Endpoint: **-$14-20/tháng**
- ✅ Dùng Gateway Endpoint: **$0** (miễn phí)
- ✅ Lambda Email: **$0** (free tier)

## 🔒 Bảo mật:

- ✅ Không còn hardcoded credentials
- ✅ IAM Role với least privilege
- ✅ Presigned URL cho private files
- ✅ S3 bucket policy đúng

## 📊 Performance:

- ✅ CloudFront cache ảnh public
- ✅ Gateway Endpoint cho S3/DynamoDB (nhanh hơn NAT)
- ✅ Lambda async email (không block request)
