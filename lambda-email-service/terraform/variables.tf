variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-southeast-1"
}

variable "email_host" {
  description = "SMTP host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "email_port" {
  description = "SMTP port"
  type        = string
  default     = "465"
}

variable "email_user" {
  description = "SMTP username"
  type        = string
  sensitive   = true
}

variable "email_pass" {
  description = "SMTP password"
  type        = string
  sensitive   = true
}
