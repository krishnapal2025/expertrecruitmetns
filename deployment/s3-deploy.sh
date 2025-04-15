#!/bin/bash
# S3 and CloudFront Deployment Script
# This script uploads static assets to S3 and invalidates the CloudFront cache

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
S3_BUCKET_NAME=${S3_BUCKET_NAME:-${APPLICATION_NAME}-assets-$(aws sts get-caller-identity --query Account --output text)}
ASSETS_DIR=${ASSETS_DIR:-"client/public"}
BUILD_DIR=${BUILD_DIR:-"client/dist"}

# Check if distribution ID is provided or can be retrieved
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "Attempting to retrieve CloudFront distribution ID..."
    CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='${S3_BUCKET_NAME}.s3.amazonaws.com'].Id" --output text --region ${AWS_REGION})
    
    if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        echo "CloudFront distribution ID not found. Please provide it as CLOUDFRONT_DISTRIBUTION_ID."
        exit 1
    fi
fi

echo "S3 Bucket: ${S3_BUCKET_NAME}"
echo "CloudFront Distribution: ${CLOUDFRONT_DISTRIBUTION_ID}"

# Function to upload assets
upload_assets() {
    local source_dir=$1
    local s3_prefix=$2
    
    echo "Uploading assets from ${source_dir} to s3://${S3_BUCKET_NAME}/${s3_prefix}..."
    aws s3 sync ${source_dir} s3://${S3_BUCKET_NAME}/${s3_prefix} --delete --region ${AWS_REGION}
    echo "Upload complete."
}

# Function to invalidate CloudFront cache
invalidate_cache() {
    local paths=$1
    
    echo "Invalidating CloudFront cache for paths: ${paths}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths ${paths} --query "Invalidation.Id" --output text --region ${AWS_REGION})
    echo "Invalidation initiated: ${INVALIDATION_ID}"
    
    echo "Waiting for invalidation to complete..."
    aws cloudfront wait invalidation-completed --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --id ${INVALIDATION_ID} --region ${AWS_REGION}
    echo "Invalidation complete."
}

# Upload public assets
if [ -d "$ASSETS_DIR" ]; then
    upload_assets "$ASSETS_DIR" "assets"
    invalidate_cache "/assets/*"
fi

# Upload build output if exists
if [ -d "$BUILD_DIR" ]; then
    upload_assets "$BUILD_DIR" ""
    invalidate_cache "/*"
fi

echo "Deployment to S3 and CloudFront completed successfully."