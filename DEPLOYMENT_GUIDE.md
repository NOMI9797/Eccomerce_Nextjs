# KharedLo - Vercel Deployment Guide

## Prerequisites
- GitHub account with your project pushed to a repository
- Vercel account (free tier available)
- Appwrite project set up
- Stripe account configured

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Ensure your repository is public or you have Vercel Pro for private repos**

## Step 2: Set Up Vercel

1. **Go to [vercel.com](https://vercel.com) and sign up/login**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the repository containing your KharedLo project**

## Step 3: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Appwrite Configuration
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=679b0257003b758db270
NEXT_PUBLIC_APPWRITE_DATABASE_ID=679b0257003b758db270
NEXT_PUBLIC_APPWRITE_STORAGE_ID=67a32bbf003270b1e15c
APPWRITE_API_KEY=your_appwrite_api_key_here
```

### Stripe Configuration
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Optional: Google Maps API (if using location features)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Step 4: Configure Build Settings

Vercel should automatically detect Next.js, but verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Step 5: Deploy

1. **Click "Deploy"**
2. **Wait for the build to complete (usually 2-5 minutes)**
3. **Your app will be available at: `https://your-project-name.vercel.app`**

## Step 6: Configure Custom Domain (Optional)

1. **Go to your Vercel project dashboard**
2. **Click "Settings" → "Domains"**
3. **Add your custom domain**
4. **Update DNS records as instructed**

## Step 7: Set Up Stripe Webhooks

1. **Go to your Stripe Dashboard → Webhooks**
2. **Add endpoint:** `https://your-domain.vercel.app/api/stripe/webhooks`
3. **Select events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. **Copy the webhook secret and update your environment variable**

## Step 8: Test Your Deployment

1. **Visit your deployed URL**
2. **Test user registration/login**
3. **Test product browsing**
4. **Test cart functionality**
5. **Test checkout process (both COD and Stripe)**
6. **Test admin dashboard**

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check environment variables are set correctly
   - Ensure all dependencies are in `package.json`
   - Check for TypeScript errors locally first

2. **Appwrite Connection Issues:**
   - Verify Appwrite project ID and endpoint
   - Check API key permissions
   - Ensure database and storage buckets exist

3. **Stripe Payment Issues:**
   - Verify Stripe keys are correct
   - Check webhook endpoint is accessible
   - Test with Stripe test cards

4. **Image Loading Issues:**
   - Verify Appwrite storage bucket permissions
   - Check image URLs in your code

### Environment Variables Checklist:

- [ ] `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- [ ] `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- [ ] `NEXT_PUBLIC_APPWRITE_STORAGE_ID`
- [ ] `APPWRITE_API_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

## Post-Deployment

1. **Monitor your app for any issues**
2. **Set up monitoring and analytics**
3. **Configure backups for your Appwrite database**
4. **Set up error tracking (e.g., Sentry)**

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your Stripe dashboard for suspicious activity

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test locally with the same environment variables 