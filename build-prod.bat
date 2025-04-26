@echo off
echo Building Expert Recruitments for production

:: Check if .env file exists
if not exist .env (
  echo No .env file found. Please create one with your database configuration.
  exit /b 1
)

:: Build the frontend
echo Building frontend...
npx vite build

:: Build the backend
echo Building backend...
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo Build completed successfully!
echo To start the production server, run: npx cross-env NODE_ENV=production node dist/index.js