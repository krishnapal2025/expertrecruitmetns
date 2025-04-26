@echo off
echo Starting Expert Recruitments production server

:: Check if .env file exists
if not exist .env (
  echo No .env file found. Please create one with your database configuration.
  exit /b 1
)

:: Check if dist directory exists
if not exist dist (
  echo The dist directory doesn't exist. Please run build-prod.bat first.
  exit /b 1
)

:: Start the production server
echo Starting production server...
npx cross-env NODE_ENV=production node dist/index.js