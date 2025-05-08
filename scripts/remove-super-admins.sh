#!/bin/bash

# This script calls the API endpoint to remove all super admin accounts
# Usage: ./scripts/remove-super-admins.sh

echo "Removing all super admin accounts from the system..."
curl -X POST http://localhost:5000/api/system/remove-super-admins -H "Content-Type: application/json" -d '{}'

echo -e "\n\nDone."