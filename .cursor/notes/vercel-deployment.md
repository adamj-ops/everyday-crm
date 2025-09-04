# Vercel Deployment Guide

## ✅ Deployment Complete!

Your CRM application has been successfully deployed to Vercel:

**Production URL**: https://everyday-v8tstf568-opsfx.vercel.app
**GitHub Repository**: https://github.com/adamj-ops/everyday-crm
**Vercel Project**: https://vercel.com/opsfx/everyday-crm

## Required Environment Variables

You need to add these environment variables in the Vercel dashboard:

### 1. Database Configuration
```
DATABASE_URL=postgres://USER:PASS@HOST/DBNAME
```
*Your Neon PostgreSQL connection string*

### 2. Development Constants
```
DEV_USER_ID=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
DEV_ORG_ID=11111111-1111-1111-1111-111111111111
```
*Should match your seed data*

### 3. Clerk Authentication (existing)
```
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
```

### 4. Stripe (existing)
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
BILLING_PLAN_ENV=prod
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 5. Optional
```
NEXT_PUBLIC_APP_URL=https://everyday-v8tstf568-opsfx.vercel.app
LOGTAIL_SOURCE_TOKEN=your_logtail_token
```

## How to Add Environment Variables

1. Go to https://vercel.com/opsfx/everyday-crm
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with:
   - **Name**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: Your actual value
   - **Environments**: Select "Production", "Preview", and "Development"

## Testing the Deployment

Once you've added the environment variables:

1. **Redeploy**: Go to the Deployments tab and click "Redeploy" on the latest deployment
2. **Test the API endpoints**:
   ```bash
   curl https://everyday-v8tstf568-opsfx.vercel.app/api/deals/list
   ```
3. **Visit the deals page**:
   ```
   https://everyday-v8tstf568-opsfx.vercel.app/deals
   ```

## Available Features

### ✅ API Endpoints
- `GET /api/deals/list` - List all deals
- `GET /api/deals/list?stage=new` - Filter deals by stage
- `POST /api/deals/update-stage` - Update deal stage
- `POST /api/offers/accept` - Accept offers
- `POST /api/documents/upload` - Upload documents

### ✅ Web Interface
- `/deals` - Deals pipeline dashboard
- Drag-and-drop style stage management
- Real-time deal updates

### ✅ Database Features
- Multi-tenant RLS security
- PostgreSQL with Neon
- Proper transaction handling
- Document storage with Vercel Blob

## Troubleshooting

If you encounter issues:

1. **Check Environment Variables**: Ensure all required variables are set
2. **Check Logs**: Go to Vercel dashboard → Functions → View logs
3. **Database Connection**: Verify your Neon database is accessible
4. **Seed Data**: Ensure you've run the seed SQL in your Neon console

## Next Steps

1. Add your environment variables to Vercel
2. Redeploy the application
3. Test the functionality
4. Access from your laptop at the production URL!

The application is now ready for multi-device access! 🎉
