@echo off
echo Starting Expert Recruitments local development environment

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Node.js is not installed. Please install it first.
  exit /b 1
)

:: Check if .env file exists
if not exist .env (
  echo No .env file found. Please create one with your database configuration.
  exit /b 1
)

:: Start the development server with cross-env
echo Starting development server...
npx cross-env NODE_ENV=development npx tsx server/index.ts