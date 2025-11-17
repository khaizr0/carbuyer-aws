terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# IAM Role cho Lambda
resource "aws_iam_role" "lambda_email_role" {
  name = "carbuyer-lambda-email-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Policy cho Lambda - CloudWatch Logs only
resource "aws_iam_role_policy" "lambda_email_policy" {
  name = "carbuyer-lambda-email-policy"
  role = aws_iam_role.lambda_email_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Lambda Function
resource "aws_lambda_function" "email_service" {
  filename         = "../function.zip"
  function_name    = "carbuyer-email-service"
  role            = aws_iam_role.lambda_email_role.arn
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      EMAIL_HOST = var.email_host
      EMAIL_PORT = var.email_port
      EMAIL_USER = var.email_user
      EMAIL_PASS = var.email_pass
    }
  }

  source_code_hash = filebase64sha256("../function.zip")
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/carbuyer-email-service"
  retention_in_days = 7
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "email_api" {
  name = "carbuyer-email-api"
}

resource "aws_api_gateway_resource" "email_resource" {
  rest_api_id = aws_api_gateway_rest_api.email_api.id
  parent_id   = aws_api_gateway_rest_api.email_api.root_resource_id
  path_part   = "send-email"
}

resource "aws_api_gateway_method" "email_post" {
  rest_api_id   = aws_api_gateway_rest_api.email_api.id
  resource_id   = aws_api_gateway_resource.email_resource.id
  http_method   = "POST"
  authorization = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.email_api.id
  resource_id             = aws_api_gateway_resource.email_resource.id
  http_method             = aws_api_gateway_method.email_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.email_service.invoke_arn
}

resource "aws_api_gateway_deployment" "email_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.email_api.id
  stage_name  = "prod"

  depends_on = [aws_api_gateway_integration.lambda_integration]
}

# API Key
resource "aws_api_gateway_api_key" "email_api_key" {
  name = "carbuyer-email-api-key"
}

# Usage Plan
resource "aws_api_gateway_usage_plan" "email_usage_plan" {
  name = "carbuyer-email-usage-plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.email_api.id
    stage  = aws_api_gateway_deployment.email_api_deployment.stage_name
  }

  throttle_settings {
    burst_limit = 100
    rate_limit  = 50
  }

  quota_settings {
    limit  = 10000
    period = "DAY"
  }
}

# Link API Key to Usage Plan
resource "aws_api_gateway_usage_plan_key" "email_usage_plan_key" {
  key_id        = aws_api_gateway_api_key.email_api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.email_usage_plan.id
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_service.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.email_api.execution_arn}/*/*"
}



output "lambda_function_arn" {
  value = aws_lambda_function.email_service.arn
}

output "api_gateway_url" {
  value = "${aws_api_gateway_deployment.email_api_deployment.invoke_url}/send-email"
}

output "api_key" {
  value     = aws_api_gateway_api_key.email_api_key.value
  sensitive = true
}
