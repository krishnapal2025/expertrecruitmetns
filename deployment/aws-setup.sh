#!/bin/bash
# AWS Deployment Script for Robert Half Job Portal
# This script sets up the AWS infrastructure for the application

# Exit on error
set -e

# Load environment variables from .env if exists
if [ -f .env ]; then
    source .env
fi

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
    echo "AWS CLI not found. Please install it."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials not configured. Please run 'aws configure'."
    exit 1
fi

# Define variables
AWS_REGION=${AWS_REGION:-us-east-1}
APPLICATION_NAME=${APPLICATION_NAME:-rh-job-portal}
ENVIRONMENT=${ENVIRONMENT:-production}
DB_USERNAME=${DB_USERNAME:-admin}
DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 12)}
DB_NAME=${DB_NAME:-rh_job_portal}
EC2_INSTANCE_TYPE=${EC2_INSTANCE_TYPE:-t2.micro}
RDS_INSTANCE_TYPE=${RDS_INSTANCE_TYPE:-db.t3.micro}
S3_BUCKET_NAME=${S3_BUCKET_NAME:-${APPLICATION_NAME}-assets-$(aws sts get-caller-identity --query Account --output text)}
CLOUDFRONT_DISTRIBUTION_NAME=${CLOUDFRONT_DISTRIBUTION_NAME:-${APPLICATION_NAME}-cdn}

echo "Setting up AWS infrastructure for ${APPLICATION_NAME} in ${AWS_REGION}"

# Create VPC if it doesn't exist
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=${APPLICATION_NAME}-vpc" --query "Vpcs[0].VpcId" --output text --region ${AWS_REGION})

if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
    echo "Creating VPC..."
    VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query Vpc.VpcId --output text --region ${AWS_REGION})
    aws ec2 create-tags --resources ${VPC_ID} --tags Key=Name,Value=${APPLICATION_NAME}-vpc --region ${AWS_REGION}
    aws ec2 modify-vpc-attribute --vpc-id ${VPC_ID} --enable-dns-hostnames --region ${AWS_REGION}
    echo "VPC created: ${VPC_ID}"
else
    echo "VPC already exists: ${VPC_ID}"
fi

# Create subnets in different availability zones
echo "Creating/verifying subnets..."
SUBNET_IDS=()
AZS=($(aws ec2 describe-availability-zones --region ${AWS_REGION} --query "AvailabilityZones[0:2].ZoneName" --output text))

for i in {0..1}; do
    SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=${APPLICATION_NAME}-subnet-${i}" --query "Subnets[0].SubnetId" --output text --region ${AWS_REGION})
    
    if [ "$SUBNET_ID" = "None" ] || [ -z "$SUBNET_ID" ]; then
        echo "Creating subnet in ${AZS[$i]}..."
        SUBNET_ID=$(aws ec2 create-subnet --vpc-id ${VPC_ID} --cidr-block 10.0.${i}.0/24 --availability-zone ${AZS[$i]} --query SubnetId --output text --region ${AWS_REGION})
        aws ec2 create-tags --resources ${SUBNET_ID} --tags Key=Name,Value=${APPLICATION_NAME}-subnet-${i} --region ${AWS_REGION}
        # Enable auto-assign public IP
        aws ec2 modify-subnet-attribute --subnet-id ${SUBNET_ID} --map-public-ip-on-launch --region ${AWS_REGION}
        echo "Subnet created: ${SUBNET_ID}"
    else
        echo "Subnet already exists: ${SUBNET_ID}"
    fi
    SUBNET_IDS+=($SUBNET_ID)
done

# Create internet gateway if it doesn't exist
IGW_ID=$(aws ec2 describe-internet-gateways --filters "Name=tag:Name,Values=${APPLICATION_NAME}-igw" --query "InternetGateways[0].InternetGatewayId" --output text --region ${AWS_REGION})

if [ "$IGW_ID" = "None" ] || [ -z "$IGW_ID" ]; then
    echo "Creating internet gateway..."
    IGW_ID=$(aws ec2 create-internet-gateway --query InternetGatewayId --output text --region ${AWS_REGION})
    aws ec2 create-tags --resources ${IGW_ID} --tags Key=Name,Value=${APPLICATION_NAME}-igw --region ${AWS_REGION}
    aws ec2 attach-internet-gateway --vpc-id ${VPC_ID} --internet-gateway-id ${IGW_ID} --region ${AWS_REGION}
    echo "Internet gateway created and attached: ${IGW_ID}"
else
    echo "Internet gateway already exists: ${IGW_ID}"
fi

# Create route table if it doesn't exist
ROUTE_TABLE_ID=$(aws ec2 describe-route-tables --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=${APPLICATION_NAME}-rt" --query "RouteTables[0].RouteTableId" --output text --region ${AWS_REGION})

if [ "$ROUTE_TABLE_ID" = "None" ] || [ -z "$ROUTE_TABLE_ID" ]; then
    echo "Creating route table..."
    ROUTE_TABLE_ID=$(aws ec2 create-route-table --vpc-id ${VPC_ID} --query RouteTableId --output text --region ${AWS_REGION})
    aws ec2 create-tags --resources ${ROUTE_TABLE_ID} --tags Key=Name,Value=${APPLICATION_NAME}-rt --region ${AWS_REGION}
    # Add route to internet
    aws ec2 create-route --route-table-id ${ROUTE_TABLE_ID} --destination-cidr-block 0.0.0.0/0 --gateway-id ${IGW_ID} --region ${AWS_REGION}
    # Associate with subnets
    for SUBNET_ID in "${SUBNET_IDS[@]}"; do
        aws ec2 associate-route-table --subnet-id ${SUBNET_ID} --route-table-id ${ROUTE_TABLE_ID} --region ${AWS_REGION}
    done
    echo "Route table created: ${ROUTE_TABLE_ID}"
else
    echo "Route table already exists: ${ROUTE_TABLE_ID}"
fi

# Create security groups
echo "Creating/verifying security groups..."

# EC2 security group
EC2_SG_ID=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=${APPLICATION_NAME}-ec2-sg" --query "SecurityGroups[0].GroupId" --output text --region ${AWS_REGION})

if [ "$EC2_SG_ID" = "None" ] || [ -z "$EC2_SG_ID" ]; then
    echo "Creating EC2 security group..."
    EC2_SG_ID=$(aws ec2 create-security-group --group-name ${APPLICATION_NAME}-ec2-sg --description "${APPLICATION_NAME} EC2 Security Group" --vpc-id ${VPC_ID} --query GroupId --output text --region ${AWS_REGION})
    aws ec2 create-tags --resources ${EC2_SG_ID} --tags Key=Name,Value=${APPLICATION_NAME}-ec2-sg --region ${AWS_REGION}
    # Allow SSH from anywhere
    aws ec2 authorize-security-group-ingress --group-id ${EC2_SG_ID} --protocol tcp --port 22 --cidr 0.0.0.0/0 --region ${AWS_REGION}
    # Allow HTTP from anywhere
    aws ec2 authorize-security-group-ingress --group-id ${EC2_SG_ID} --protocol tcp --port 80 --cidr 0.0.0.0/0 --region ${AWS_REGION}
    # Allow HTTPS from anywhere
    aws ec2 authorize-security-group-ingress --group-id ${EC2_SG_ID} --protocol tcp --port 443 --cidr 0.0.0.0/0 --region ${AWS_REGION}
    echo "EC2 security group created: ${EC2_SG_ID}"
else
    echo "EC2 security group already exists: ${EC2_SG_ID}"
fi

# RDS security group
RDS_SG_ID=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=${APPLICATION_NAME}-rds-sg" --query "SecurityGroups[0].GroupId" --output text --region ${AWS_REGION})

if [ "$RDS_SG_ID" = "None" ] || [ -z "$RDS_SG_ID" ]; then
    echo "Creating RDS security group..."
    RDS_SG_ID=$(aws ec2 create-security-group --group-name ${APPLICATION_NAME}-rds-sg --description "${APPLICATION_NAME} RDS Security Group" --vpc-id ${VPC_ID} --query GroupId --output text --region ${AWS_REGION})
    aws ec2 create-tags --resources ${RDS_SG_ID} --tags Key=Name,Value=${APPLICATION_NAME}-rds-sg --region ${AWS_REGION}
    # Allow MySQL/PostgreSQL from EC2 security group
    aws ec2 authorize-security-group-ingress --group-id ${RDS_SG_ID} --protocol tcp --port 5432 --source-group ${EC2_SG_ID} --region ${AWS_REGION}
    echo "RDS security group created: ${RDS_SG_ID}"
else
    echo "RDS security group already exists: ${RDS_SG_ID}"
fi

# Create RDS subnet group if it doesn't exist
DB_SUBNET_GROUP_NAME="${APPLICATION_NAME}-db-subnet-group"
DB_SUBNET_GROUP=$(aws rds describe-db-subnet-groups --query "DBSubnetGroups[?DBSubnetGroupName=='${DB_SUBNET_GROUP_NAME}'].DBSubnetGroupName" --output text --region ${AWS_REGION})

if [ "$DB_SUBNET_GROUP" = "None" ] || [ -z "$DB_SUBNET_GROUP" ]; then
    echo "Creating RDS subnet group..."
    aws rds create-db-subnet-group --db-subnet-group-name ${DB_SUBNET_GROUP_NAME} --db-subnet-group-description "${APPLICATION_NAME} DB Subnet Group" --subnet-ids "${SUBNET_IDS[@]}" --region ${AWS_REGION}
    echo "RDS subnet group created: ${DB_SUBNET_GROUP_NAME}"
else
    echo "RDS subnet group already exists: ${DB_SUBNET_GROUP_NAME}"
fi

# Create RDS instance if it doesn't exist
RDS_IDENTIFIER="${APPLICATION_NAME}-db"
RDS_INSTANCE=$(aws rds describe-db-instances --query "DBInstances[?DBInstanceIdentifier=='${RDS_IDENTIFIER}'].DBInstanceIdentifier" --output text --region ${AWS_REGION})

if [ "$RDS_INSTANCE" = "None" ] || [ -z "$RDS_INSTANCE" ]; then
    echo "Creating RDS PostgreSQL instance..."
    aws rds create-db-instance \
        --db-instance-identifier ${RDS_IDENTIFIER} \
        --db-instance-class ${RDS_INSTANCE_TYPE} \
        --engine postgres \
        --master-username ${DB_USERNAME} \
        --master-user-password ${DB_PASSWORD} \
        --allocated-storage 20 \
        --db-name ${DB_NAME} \
        --vpc-security-group-ids ${RDS_SG_ID} \
        --db-subnet-group-name ${DB_SUBNET_GROUP_NAME} \
        --no-publicly-accessible \
        --tags Key=Environment,Value=${ENVIRONMENT} \
        --region ${AWS_REGION}
    echo "RDS instance creation initiated: ${RDS_IDENTIFIER}"
    echo "Waiting for RDS instance to be available..."
    aws rds wait db-instance-available --db-instance-identifier ${RDS_IDENTIFIER} --region ${AWS_REGION}
    echo "RDS instance is now available."
else
    echo "RDS instance already exists: ${RDS_IDENTIFIER}"
fi

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier ${RDS_IDENTIFIER} --query "DBInstances[0].Endpoint.Address" --output text --region ${AWS_REGION})
echo "RDS endpoint: ${RDS_ENDPOINT}"

# Create S3 bucket if it doesn't exist
S3_BUCKET_EXISTS=$(aws s3api head-bucket --bucket ${S3_BUCKET_NAME} 2>&1 || echo "not exists")

if [[ $S3_BUCKET_EXISTS == *"not exists"* ]]; then
    echo "Creating S3 bucket..."
    aws s3api create-bucket --bucket ${S3_BUCKET_NAME} --region ${AWS_REGION} ${AWS_REGION == "us-east-1" ? "" : "--create-bucket-configuration LocationConstraint=${AWS_REGION}"}
    # Enable versioning
    aws s3api put-bucket-versioning --bucket ${S3_BUCKET_NAME} --versioning-configuration Status=Enabled
    # Block public access
    aws s3api put-public-access-block --bucket ${S3_BUCKET_NAME} --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    echo "S3 bucket created: ${S3_BUCKET_NAME}"
else
    echo "S3 bucket already exists: ${S3_BUCKET_NAME}"
fi

# Create CloudFront distribution if it doesn't exist
CLOUDFRONT_DISTRIBUTIONS=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='${S3_BUCKET_NAME}.s3.amazonaws.com'].Id" --output text --region ${AWS_REGION})

if [ "$CLOUDFRONT_DISTRIBUTIONS" = "None" ] || [ -z "$CLOUDFRONT_DISTRIBUTIONS" ]; then
    echo "Creating CloudFront distribution..."
    # Create an OAI for CloudFront
    OAI_ID=$(aws cloudfront create-cloud-front-origin-access-identity --cloud-front-origin-access-identity-config CallerReference=$(date +%s),Comment="${APPLICATION_NAME} OAI" --query "CloudFrontOriginAccessIdentity.Id" --output text)
    
    # Update bucket policy to allow CloudFront access
    POLICY='{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'${S3_BUCKET_NAME}'/*",
                "Condition": {
                    "StringEquals": {
                        "AWS:SourceArn": "arn:aws:cloudfront::'$(aws sts get-caller-identity --query Account --output text)':distribution/'${CLOUDFRONT_DISTRIBUTIONS}'"
                    }
                }
            }
        ]
    }'
    aws s3api put-bucket-policy --bucket ${S3_BUCKET_NAME} --policy "$POLICY"
    
    # Create CloudFront distribution
    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --origin-domain-name ${S3_BUCKET_NAME}.s3.amazonaws.com \
        --default-root-object index.html \
        --enabled \
        --default-cache-behavior '{"TargetOriginId":"S3-'${S3_BUCKET_NAME}'","ForwardedValues":{"QueryString":false,"Cookies":{"Forward":"none"}},"ViewerProtocolPolicy":"redirect-to-https","MinTTL":0,"DefaultTTL":86400,"MaxTTL":31536000}' \
        --query "Distribution.Id" --output text)
    
    echo "CloudFront distribution created: ${DISTRIBUTION_ID}"
else
    echo "CloudFront distribution already exists: ${CLOUDFRONT_DISTRIBUTIONS}"
    DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTIONS}
fi

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id ${DISTRIBUTION_ID} --query "Distribution.DomainName" --output text --region ${AWS_REGION})
echo "CloudFront domain: ${CLOUDFRONT_DOMAIN}"

# Create EC2 key pair if it doesn't exist
KEY_PAIR_NAME="${APPLICATION_NAME}-key"
KEY_PAIR_EXISTS=$(aws ec2 describe-key-pairs --key-names ${KEY_PAIR_NAME} 2>&1 || echo "not exists")

if [[ $KEY_PAIR_EXISTS == *"not exists"* ]]; then
    echo "Creating EC2 key pair..."
    aws ec2 create-key-pair --key-name ${KEY_PAIR_NAME} --query "KeyMaterial" --output text --region ${AWS_REGION} > ${KEY_PAIR_NAME}.pem
    chmod 400 ${KEY_PAIR_NAME}.pem
    echo "EC2 key pair created: ${KEY_PAIR_NAME}.pem"
else
    echo "EC2 key pair already exists: ${KEY_PAIR_NAME}"
fi

# Create EC2 instance if it doesn't exist
EC2_INSTANCE_NAME="${APPLICATION_NAME}-app-server"
EC2_INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=${EC2_INSTANCE_NAME}" "Name=instance-state-name,Values=running,pending,stopping,stopped" --query "Reservations[0].Instances[0].InstanceId" --output text --region ${AWS_REGION})

if [ "$EC2_INSTANCE_ID" = "None" ] || [ -z "$EC2_INSTANCE_ID" ]; then
    echo "Creating EC2 instance..."
    # Get the latest Amazon Linux 2 AMI
    AMI_ID=$(aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" "Name=state,Values=available" --query "sort_by(Images, &CreationDate)[-1].ImageId" --output text --region ${AWS_REGION})
    
    # Create user data script
    cat > user-data.sh << 'EOF'
#!/bin/bash
# Update system packages
yum update -y

# Install necessary packages
yum install -y httpd php git php-pdo php-mysqlnd php-pgsql nginx

# Install nodejs
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Setup directories
mkdir -p /var/www/html

# Clone the application repository
cd /var/www
git clone https://github.com/user/repo.git html

# Install application dependencies
cd /var/www/html
npm install

# Configure Nginx to proxy requests to Node.js
cat > /etc/nginx/conf.d/default.conf << 'NGINX_CONF'
server {
    listen 80;
    server_name _;

    location /api/ {
        root /var/www/html/php-api;
        try_files $uri $uri/ /api/index.php?$query_string;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_pass unix:/var/run/php-fpm/www.sock;
        }
    }

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONF

# Set environment variables
cat > /var/www/html/.env << ENV_VARS
DATABASE_HOST=${RDS_ENDPOINT}
DATABASE_NAME=${DB_NAME}
DATABASE_USER=${DB_USERNAME}
DATABASE_PASSWORD=${DB_PASSWORD}
S3_BUCKET=${S3_BUCKET_NAME}
CLOUDFRONT_DOMAIN=${CLOUDFRONT_DOMAIN}
ENV_VARS

# Start and enable services
systemctl start php-fpm
systemctl enable php-fpm
systemctl start nginx
systemctl enable nginx

# Start the application
cd /var/www/html
npm run build
npm run start &
EOF

    # Create EC2 instance
    EC2_INSTANCE_ID=$(aws ec2 run-instances \
        --image-id ${AMI_ID} \
        --instance-type ${EC2_INSTANCE_TYPE} \
        --key-name ${KEY_PAIR_NAME} \
        --security-group-ids ${EC2_SG_ID} \
        --subnet-id ${SUBNET_IDS[0]} \
        --user-data file://user-data.sh \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${EC2_INSTANCE_NAME}}]" \
        --query "Instances[0].InstanceId" \
        --output text \
        --region ${AWS_REGION})
    
    echo "EC2 instance creation initiated: ${EC2_INSTANCE_ID}"
    echo "Waiting for EC2 instance to be running..."
    aws ec2 wait instance-running --instance-ids ${EC2_INSTANCE_ID} --region ${AWS_REGION}
    echo "EC2 instance is now running."
else
    echo "EC2 instance already exists: ${EC2_INSTANCE_ID}"
fi

# Get EC2 public IP
EC2_PUBLIC_IP=$(aws ec2 describe-instances --instance-ids ${EC2_INSTANCE_ID} --query "Reservations[0].Instances[0].PublicIpAddress" --output text --region ${AWS_REGION})
echo "EC2 public IP: ${EC2_PUBLIC_IP}"

# Output deployment information
echo "============== Deployment Information =============="
echo "Application Name: ${APPLICATION_NAME}"
echo "Environment: ${ENVIRONMENT}"
echo "Region: ${AWS_REGION}"
echo ""
echo "EC2 Instance ID: ${EC2_INSTANCE_ID}"
echo "EC2 Public IP: ${EC2_PUBLIC_IP}"
echo "EC2 SSH Key: ${KEY_PAIR_NAME}.pem"
echo ""
echo "RDS Instance ID: ${RDS_IDENTIFIER}"
echo "RDS Endpoint: ${RDS_ENDPOINT}"
echo "Database Name: ${DB_NAME}"
echo "Database Username: ${DB_USERNAME}"
echo "Database Password: ${DB_PASSWORD}"
echo ""
echo "S3 Bucket: ${S3_BUCKET_NAME}"
echo "CloudFront Distribution ID: ${DISTRIBUTION_ID}"
echo "CloudFront Domain: ${CLOUDFRONT_DOMAIN}"
echo "=================================================="

# Save deployment information to a file
cat > deployment-info.txt << DEPLOYMENT_INFO
Application Name: ${APPLICATION_NAME}
Environment: ${ENVIRONMENT}
Region: ${AWS_REGION}

EC2 Instance ID: ${EC2_INSTANCE_ID}
EC2 Public IP: ${EC2_PUBLIC_IP}
EC2 SSH Key: ${KEY_PAIR_NAME}.pem

RDS Instance ID: ${RDS_IDENTIFIER}
RDS Endpoint: ${RDS_ENDPOINT}
Database Name: ${DB_NAME}
Database Username: ${DB_USERNAME}
Database Password: ${DB_PASSWORD}

S3 Bucket: ${S3_BUCKET_NAME}
CloudFront Distribution ID: ${DISTRIBUTION_ID}
CloudFront Domain: ${CLOUDFRONT_DOMAIN}
DEPLOYMENT_INFO

echo "Deployment information saved to deployment-info.txt"