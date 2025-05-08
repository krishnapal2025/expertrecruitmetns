# Deployment Guide for Expert Recruitments on Fly.io

This document provides instructions for deploying the Expert Recruitments application on Fly.io, along with troubleshooting steps for common issues.

## Prerequisites

1. Fly.io account and CLI installed
2. PostgreSQL database provisioned on Fly.io
3. Environment variables configured (see below)

## Environment Variables

Ensure these essential environment variables are set in your Fly.io application:

```
NODE_ENV=production
SESSION_SECRET=<your-strong-session-secret>
COOKIE_DOMAIN=<your-app-domain>.fly.dev
FLY_APP_NAME=<your-fly-app-name>
```

## Common Issues and Solutions

### Authentication Issues

If you're experiencing login/signup issues in the deployed environment, it's often related to cookie settings and cross-domain policies.

#### Session Expiration/Authentication Failures

**Symptoms:**
- "Your session has expired" errors when trying to register a super admin
- "Registration failed" despite successful user creation
- Unable to maintain login state

**Solutions:**
- For super-admin signup, if you encounter a session error, follow these steps:
  1. After registering, you'll receive a confirmation message
  2. You may need to manually visit `/admin-login` and log in with your credentials

### Cross-Domain Cookie Issues

The application uses special cookie settings for Fly.io deployments:
- SameSite=None
- Secure=true (for production)
- HttpOnly=true
- Proxy mode enabled

If you continue to have authentication issues:

1. Check that the `COOKIE_DOMAIN` environment variable matches your Fly.io app domain
2. Ensure your browser allows third-party cookies
3. Consider using a custom domain with proper DNS settings

## Super Admin Creation

For first-time setup, use the `/super-admin-signup` path to create the initial super admin account. If you encounter session issues during signup:

1. Try using an incognito/private browsing window
2. Ensure you're using the correct domain (your-app.fly.dev)
3. If the account is created but you're not logged in, visit `/admin-login` and log in manually

## Database Considerations

The application requires a PostgreSQL database. On Fly.io, you can provision one with:

```bash
fly postgres create
```

Ensure your database connection string is properly configured in your Fly.io app's environment variables.