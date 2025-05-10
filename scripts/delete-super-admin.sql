-- Script to delete a super admin account by ID
-- Run this script with the super admin ID you want to delete
-- Example: psql $DATABASE_URL -f scripts/delete-super-admin.sql -v id=11

-- Begin a transaction to ensure atomicity
BEGIN;

-- Get the admin profile ID for this user
DO $$
DECLARE
    admin_id integer;
    user_type text;
BEGIN
    -- First, check if the user exists and is a super_admin
    SELECT user_type INTO user_type FROM users WHERE id = :id;
    
    IF user_type IS NULL THEN
        RAISE EXCEPTION 'No user found with ID %', :id;
    ELSIF user_type <> 'super_admin' THEN
        RAISE EXCEPTION 'User with ID % is not a super_admin (type: %)', :id, user_type;
    END IF;
    
    -- Get the admin profile ID
    SELECT id INTO admin_id FROM admins WHERE user_id = :id;
    
    -- Update blog posts to remove author reference
    UPDATE blog_posts SET author_id = NULL WHERE author_id = :id;
    
    -- Delete notifications
    DELETE FROM notifications WHERE user_id = :id;
    
    -- Clear job assignments
    UPDATE jobs SET assigned_to = NULL WHERE assigned_to = :id;
    
    -- Delete admin profile if exists
    IF admin_id IS NOT NULL THEN
        DELETE FROM admins WHERE id = admin_id;
    END IF;
    
    -- Delete the user
    DELETE FROM users WHERE id = :id AND user_type = 'super_admin';
    
    RAISE NOTICE 'Successfully deleted super admin with ID %', :id;
END $$;

-- Commit the transaction
COMMIT;