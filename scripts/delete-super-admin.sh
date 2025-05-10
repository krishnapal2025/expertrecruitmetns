#!/bin/bash

# A script to delete a super admin account by ID
# Usage: scripts/delete-super-admin.sh SUPER_ADMIN_ID
# Example: scripts/delete-super-admin.sh 11

if [ -z "$1" ]; then
  echo "Error: Super admin ID is required"
  echo "Usage: scripts/delete-super-admin.sh SUPER_ADMIN_ID"
  echo "Example: scripts/delete-super-admin.sh 11"
  exit 1
fi

SUPER_ADMIN_ID=$1

echo "Attempting to delete super admin with ID: $SUPER_ADMIN_ID"

# Use direct SQL commands for simplicity and reliability
psql "$DATABASE_URL" << EOF
-- Run a simpler SQL command for direct deletion
BEGIN;

-- First, save the user type to check if it's a super_admin
DO \$\$
DECLARE
    user_exists BOOLEAN;
    user_type_value TEXT;
    admin_profile_id INTEGER;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM users WHERE id = $SUPER_ADMIN_ID) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE EXCEPTION 'User with ID % does not exist', $SUPER_ADMIN_ID;
    END IF;
    
    -- Check if it's a super_admin
    SELECT user_type INTO user_type_value FROM users WHERE id = $SUPER_ADMIN_ID;
    
    IF user_type_value <> 'super_admin' THEN
        RAISE EXCEPTION 'User with ID % is not a super_admin (current type: %)', 
            $SUPER_ADMIN_ID, user_type_value;
    END IF;
    
    -- Get admin profile ID if exists
    SELECT id INTO admin_profile_id FROM admins WHERE user_id = $SUPER_ADMIN_ID;
    
    -- Display info message
    RAISE NOTICE 'Found super_admin account with ID % and admin profile ID %', 
        $SUPER_ADMIN_ID, admin_profile_id;
END \$\$;

-- Update blog posts to remove author reference
UPDATE blog_posts SET author_id = NULL WHERE author_id = $SUPER_ADMIN_ID;

-- Delete notifications
DELETE FROM notifications WHERE user_id = $SUPER_ADMIN_ID;

-- Clear job assignments
UPDATE jobs SET assigned_to = NULL WHERE assigned_to = $SUPER_ADMIN_ID;

-- Delete admin profile
DELETE FROM admins WHERE user_id = $SUPER_ADMIN_ID;

-- Delete the user
DELETE FROM users WHERE id = $SUPER_ADMIN_ID;

COMMIT;
EOF

# Show a completion message
echo "Script completed."