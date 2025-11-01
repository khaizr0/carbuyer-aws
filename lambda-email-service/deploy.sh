#!/bin/bash

echo "Building Lambda package..."
npm install --production
zip -r function.zip index.js node_modules package.json

echo "Deploying with Terraform..."
cd terraform
terraform init
terraform apply -auto-approve

echo "Getting API Gateway URL..."
API_URL=$(terraform output -raw api_gateway_url)
echo ""
echo "✅ Deployment complete!"
echo "API Gateway URL: $API_URL"
echo ""
echo "Add this to your EC2 .env file:"
echo "LAMBDA_EMAIL_API_URL=$API_URL"
