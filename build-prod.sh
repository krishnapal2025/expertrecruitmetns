#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Please create one with your database configuration."
  exit 1
fi

# Build the frontend
echo "Building frontend..."
npx vite build

# Build the backend
echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"
echo "To start the production server, run: cross-env NODE_ENV=production node dist/index.js"