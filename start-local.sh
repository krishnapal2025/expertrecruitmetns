#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Please create one with your database configuration."
  exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo "PostgreSQL is not installed. Please install it first."
  exit 1
fi

# Check if database exists
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw ${PGDATABASE}; then
  echo "Database ${PGDATABASE} exists."
else
  echo "Creating database ${PGDATABASE}..."
  psql -U postgres -c "CREATE DATABASE ${PGDATABASE}"
fi

# Push the Drizzle schema to the database
echo "Updating database schema..."
npx drizzle-kit push

# Start the development server
echo "Starting development server..."
cross-env NODE_ENV=development npx tsx server/index.ts