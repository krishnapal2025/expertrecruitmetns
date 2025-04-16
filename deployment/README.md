# AWS Deployment Documentation

This directory contains scripts and configuration files for deploying the RH Job Portal application to AWS.

## Deployment Options

We provide two options for deploying to AWS:

1. **Manual Deployment**: Using shell scripts and AWS CLI commands
2. **Terraform Deployment**: Using Infrastructure as Code with Terraform

## Prerequisites

- AWS CLI installed and configured with appropriate credentials
- Terraform installed (for Terraform deployment option)
- A registered domain name (optional, for custom domain setup)
- SSL certificate in AWS Certificate Manager (for HTTPS)

## Manual Deployment

### 1. Setup AWS Account and CLI

If you haven't already, install and configure the AWS CLI:

```bash
# Install AWS CLI
pip install awscli

# Configure your AWS credentials
aws configure
```

### 2. Set up AWS Resources

Run the setup script to create necessary AWS resources:

```bash
# Make the script executable
chmod +x aws-setup.sh

# Run the setup script
./aws-setup.sh
```

This will create:
- EC2 instance for the application
- RDS PostgreSQL database
- S3 bucket for static assets
- CloudFront distribution for content delivery

### 3. Deploy Application

Once the infrastructure is in place, deploy the application:

```bash
# Make the script executable
chmod +x s3-deploy.sh

# Deploy static assets to S3
./s3-deploy.sh
```

## Terraform Deployment

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Create a `terraform.tfvars` file

Create a file named `terraform.tfvars` with your specific configuration:

```hcl
aws_region        = "us-east-1"
application_name  = "rh-job-portal"
environment       = "production"
db_username       = "admin"
db_password       = "your-secure-password"
s3_bucket_name    = "your-globally-unique-bucket-name"
public_key_path   = "~/.ssh/id_rsa.pub"
git_repo_url      = "https://github.com/yourusername/your-repo.git"
```

### 3. Plan and Apply

```bash
# See what changes will be made
terraform plan

# Apply the changes
terraform apply
```

### 4. Configure DNS (Optional)

If you have a custom domain:

1. Create a new record in your domain's DNS settings
2. Point it to the CloudFront distribution domain or EC2 elastic IP

## EC2 User Data Script

The EC2 instance is configured using the `ec2-user-data.sh` script, which:

- Installs necessary software (PHP, Node.js, Nginx, etc.)
- Clones the application repository
- Sets up environment variables
- Configures Nginx as a reverse proxy
- Sets up PM2 for Node.js process management
- Configures CloudWatch logs for monitoring
- Sets up daily database backups to S3

## Maintenance Tasks

### Database Backups

Database backups are automatically created daily and stored in the S3 bucket.

To manually backup the database:

```bash
# SSH into the EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Run the backup script
sudo /etc/cron.daily/database-backup
```

### Deploying Updates

To deploy application updates:

1. Push changes to the Git repository
2. SSH into the EC2 instance and pull the latest changes
3. Rebuild and restart the application
4. Deploy updated static assets to S3 using the `s3-deploy.sh` script

### Monitoring

The application logs are sent to CloudWatch. You can view them in the AWS Console under CloudWatch > Log Groups > [application-name]-logs.

## Cleanup

To remove all AWS resources when they're no longer needed:

### For Manual Deployment

Follow the AWS documentation to manually delete each resource (EC2, RDS, S3, CloudFront).

### For Terraform Deployment

```bash
cd terraform
terraform destroy
```