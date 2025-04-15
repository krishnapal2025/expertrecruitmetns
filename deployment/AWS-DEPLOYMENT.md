# AWS Deployment Guide

This guide walks through deploying the Robert Half Job Portal application to AWS using EC2, RDS, S3, and CloudFront.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Application codebase

## Deployment Infrastructure

The application will be deployed using the following AWS services:

- **EC2**: Hosts the application server (Node.js/Express and PHP)
- **RDS**: PostgreSQL database for storing application data
- **S3**: Storage for static assets (images, user uploads, etc.)
- **CloudFront**: CDN for fast content delivery

## Deployment Steps

### 1. Set Up Environment Variables

1. Copy the example configuration file:
   ```
   cp deployment/aws-config.env.example .env
   ```

2. Edit the `.env` file with your preferred settings:
   ```
   nano .env
   ```

### 2. Run the Deployment Script

1. Make the deployment script executable:
   ```
   chmod +x deployment/aws-setup.sh
   ```

2. Run the script:
   ```
   ./deployment/aws-setup.sh
   ```

3. The script will create all necessary AWS resources and output the deployment information.

### 3. Deployment Information

After successful deployment, the script will generate a `deployment-info.txt` file with all the necessary information, including:
- EC2 Instance details
- RDS Database connection information
- S3 Bucket name
- CloudFront Distribution details

## AWS Architecture

### Network Architecture

The application uses a VPC with the following components:
- 2 subnets across different availability zones
- Internet Gateway for public access
- Route tables for network routing
- Security groups for access control

### Database Setup

- PostgreSQL on RDS
- Private subnet placement
- Security group limited to EC2 access

### Static Assets

- S3 bucket for storing static assets
- CloudFront distribution for CDN
- Secure access using Origin Access Identity

### Application Server

- EC2 instance running Amazon Linux 2
- Node.js for the frontend application
- PHP for the backend API
- Nginx as a reverse proxy

## Updating the Application

To update the application code:

1. SSH into the EC2 instance:
   ```
   ssh -i <key-pair-name>.pem ec2-user@<ec2-public-ip>
   ```

2. Navigate to the application directory:
   ```
   cd /var/www/html
   ```

3. Pull the latest code:
   ```
   git pull
   ```

4. Install dependencies (if needed):
   ```
   npm install
   ```

5. Rebuild the application:
   ```
   npm run build
   ```

6. Restart the application:
   ```
   pm2 restart all
   ```

## Uploading Assets to S3

To upload assets to S3:

1. Using AWS CLI:
   ```
   aws s3 cp <local-file> s3://<bucket-name>/<destination-path>
   ```

2. Or using the AWS S3 Console:
   - Navigate to the S3 bucket
   - Click "Upload"
   - Select files to upload
   - Configure permissions and properties
   - Click "Upload"

## Setting Up Database

The database schema will be automatically created on first deployment. To manually run migrations:

1. SSH into the EC2 instance
2. Navigate to the application directory
3. Run the database migrations:
   ```
   npm run migrate
   ```

## Setting Up HTTPS

To set up HTTPS:

1. Register a domain name (if you don't have one)
2. Create an SSL certificate using AWS Certificate Manager
3. Update the CloudFront distribution to use the certificate
4. Create a Route 53 record pointing to the CloudFront distribution

## Monitoring and Logging

- CloudWatch Logs for application logs
- CloudWatch Metrics for performance monitoring
- CloudWatch Alarms for alerts

## Troubleshooting

### Common Issues

1. **EC2 instance not accessible**:
   - Check security group rules
   - Verify the instance is running
   - Check the instance's public IP

2. **Database connection issues**:
   - Check database security group
   - Verify database credentials
   - Check if the database is accessible from the EC2 instance

3. **Static assets not loading**:
   - Check S3 bucket permissions
   - Verify CloudFront distribution is working
   - Check for CORS issues

### Accessing Logs

- Application logs: `/var/log/nodejs/application.log`
- Nginx logs: `/var/log/nginx/{access,error}.log`
- System logs: `/var/log/messages`

## Cost Optimization

To optimize costs:

1. Use reserved instances for EC2 to reduce costs
2. Configure auto-scaling for handling traffic spikes
3. Use lifecycle policies for S3 to manage storage costs
4. Monitor and optimize RDS performance

## Security Best Practices

1. Use IAM roles for EC2 instances
2. Enable encryption for RDS and S3
3. Use security groups to limit access
4. Regularly update software packages
5. Implement a disaster recovery plan

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)