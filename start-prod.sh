#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Please create one with your database configuration."
  exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "The dist directory doesn't exist. Please run build-prod.sh first."
  exit 1
fi

# Start the production server
echo "Starting production server..."
cross-env NODE_ENV=production node dist/index.js