# Expert Recruitments Admin Credentials

## Default Admin Account
- **Email:** [REDACTED]
- **Password:** [REDACTED]

## Hash Information (For Technical Reference)
- **Current Password Hash:** [REDACTED]

## Using These Credentials

These credentials can be used to log in to the admin panel both online and when running the application locally.

## Running Admin Operations Locally

When running the application locally with your own PostgreSQL database, you'll need to:

1. Make sure your `.env` file has the correct `DATABASE_URL` for your local PostgreSQL instance
2. Run the admin seeding script to create/update the admin account in your local database:

```bash
node scripts/seed-admin.js
```

This script:
- Creates the admin user if it doesn't exist
- Updates the password if the user already exists
- Creates an admin profile if it doesn't exist

## Updating Admin Password

If you need to change the admin password:

1. Edit the script at `scripts/seed-admin.js`
2. Update the password variable in the script
3. Run the script:

```bash
node scripts/seed-admin.js
```

## Important Notes

- Store this file securely as it contains sensitive access information
- Change the default password after the initial setup for security
- Consider using environment variables for production deployments

## Technical Details

The admin account uses crypto.scrypt for secure password hashing with a random salt, making the stored passwords secure even if the database is compromised.