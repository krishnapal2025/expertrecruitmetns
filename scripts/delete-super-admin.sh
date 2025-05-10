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

# Begin transaction
echo "BEGIN;" > /tmp/delete-super-admin-temp.sql

# Check user exists and is a super_admin
echo "DO \$\$
DECLARE
    user_exists boolean;
    user_type text;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM users WHERE id = $SUPER_ADMIN_ID) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE EXCEPTION 'No user found with ID %', $SUPER_ADMIN_ID;
    END IF;
    
    -- Check if user is a super_admin
    SELECT user_type INTO user_type FROM users WHERE id = $SUPER_ADMIN_ID;
    
    IF user_type <> 'super_admin' THEN
        RAISE EXCEPTION 'User with ID % is not a super_admin (type: %)', $SUPER_ADMIN_ID, user_type;
    END IF;
    
    -- Update blog posts to remove author reference
    UPDATE blog_posts SET author_id = NULL WHERE author_id = $SUPER_ADMIN_ID;
    
    -- Delete notifications
    DELETE FROM notifications WHERE user_id = $SUPER_ADMIN_ID;
    
    -- Clear job assignments
    UPDATE jobs SET assigned_to = NULL WHERE assigned_to = $SUPER_ADMIN_ID;
    
    -- Delete admin profile if exists
    DELETE FROM admins WHERE user_id = $SUPER_ADMIN_ID;
    
    -- Delete the user
    DELETE FROM users WHERE id = $SUPER_ADMIN_ID;
    
    RAISE NOTICE 'Successfully deleted super admin with ID %', $SUPER_ADMIN_ID;
END \$\$;" >> /tmp/delete-super-admin-temp.sql

# Commit transaction
echo "COMMIT;" >> /tmp/delete-super-admin-temp.sql

# Execute the SQL
if psql "$DATABASE_URL" -f /tmp/delete-super-admin-temp.sql; then
    echo "Super admin account with ID $SUPER_ADMIN_ID successfully deleted"
else
    echo "Failed to delete super admin account with ID $SUPER_ADMIN_ID"
    exit 1
fi

# Clean up
rm /tmp/delete-super-admin-temp.sql