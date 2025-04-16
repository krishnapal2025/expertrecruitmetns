terraform {
  backend "s3" {
    bucket         = "terraform-state-rh-job-portal"  # Replace with your S3 bucket name
    key            = "terraform.tfstate"
    region         = "us-east-1"                      # Replace with your region
    encrypt        = true
    dynamodb_table = "terraform-locks-rh-job-portal"  # DynamoDB table for state locking
  }
}