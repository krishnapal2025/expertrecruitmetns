#!/bin/bash
# EC2 Initialization Script
# This script is used as user data when launching an EC2 instance

# Update system packages
yum update -y

# Install necessary packages
yum install -y httpd git nginx

# Install PHP 7.4 (Amazon Linux 2)
amazon-linux-extras enable php7.4
yum clean metadata
yum install -y php php-pdo php-mysqlnd php-pgsql php-json php-gd php-mbstring php-xml php-fpm

# Install Node.js 18.x
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 for Node.js process management
npm install -g pm2

# Setup application directory
APP_DIR="/var/www/html"
mkdir -p $APP_DIR

# Clone the application repository
# Note: In production, you should use a private repository with credentials
GIT_REPO=${GIT_REPO_URL:-https://github.com/yourusername/your-repo.git}
git clone $GIT_REPO $APP_DIR

# Set up environment variables
cat > $APP_DIR/.env << EOF
# Database Configuration
DB_HOST=${RDS_ENDPOINT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

# AWS Configuration
AWS_REGION=${AWS_REGION}
S3_BUCKET=${S3_BUCKET_NAME}
CLOUDFRONT_DOMAIN=${CLOUDFRONT_DOMAIN}

# Application Configuration
NODE_ENV=production
PORT=5000
EOF

# Install application dependencies
cd $APP_DIR
npm install

# Build the frontend application
npm run build

# Configure Nginx
cat > /etc/nginx/conf.d/app.conf << 'EOF'
server {
    listen 80;
    server_name _;

    # API requests go to PHP
    location /api/ {
        root /var/www/html/php-api;
        try_files $uri $uri/ /api/index.php?$query_string;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_pass unix:/var/run/php-fpm/www.sock;
        }
    }

    # Static files (served by S3/CloudFront in production, but keep as fallback)
    location /assets/ {
        alias /var/www/html/client/public/;
        try_files $uri @backend;
    }

    # Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend fallback
    location @backend {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Configure PHP
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/g' /etc/php.ini
sed -i 's/user = apache/user = nginx/g' /etc/php-fpm.d/www.conf
sed -i 's/group = apache/group = nginx/g' /etc/php-fpm.d/www.conf

# Set proper permissions
chown -R nginx:nginx $APP_DIR

# Start and enable services
systemctl enable php-fpm
systemctl start php-fpm
systemctl enable nginx
systemctl start nginx

# Create log directory for application
mkdir -p /var/log/nodejs
chown -R ec2-user:ec2-user /var/log/nodejs

# Set up PM2 process
cd $APP_DIR
sudo -u ec2-user pm2 start npm --name "app" -- start
sudo -u ec2-user pm2 startup
sudo -u ec2-user pm2 save

# Setup CloudWatch logging for the application
yum install -y awslogs
cat > /etc/awslogs/config/application.conf << EOF
[/var/log/nodejs/application.log]
datetime_format = %Y-%m-%d %H:%M:%S
file = /var/log/nodejs/application.log
buffer_duration = 5000
log_stream_name = {instance_id}-application-log
initial_position = start_of_file
log_group_name = ${APPLICATION_NAME}-logs
EOF

# Start and enable AWS CloudWatch Logs
systemctl enable awslogsd
systemctl start awslogsd

# Setup daily database backup to S3
cat > /etc/cron.daily/database-backup << EOF
#!/bin/bash
TIMESTAMP=\$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="/tmp/db-backup-\$TIMESTAMP.sql"
S3_BUCKET="${S3_BUCKET_NAME}"
S3_BACKUP_PATH="backups/database/\$TIMESTAMP.sql"

# Create backup
export PGPASSWORD="${DB_PASSWORD}"
pg_dump -h ${RDS_ENDPOINT} -U ${DB_USERNAME} -d ${DB_NAME} > \$BACKUP_FILE

# Upload to S3
aws s3 cp \$BACKUP_FILE s3://\$S3_BUCKET/\$S3_BACKUP_PATH --region ${AWS_REGION}

# Clean up
rm \$BACKUP_FILE
EOF
chmod +x /etc/cron.daily/database-backup

# Setup instance for Auto Scaling (if needed)
touch /etc/cloud/cloud-init.done

echo "EC2 initialization completed successfully."