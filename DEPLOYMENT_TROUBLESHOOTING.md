# KharedLo - Deployment Troubleshooting Guide

## Common Deployment Issues and Solutions

### 1. "Failed to construct 'URL': Invalid URL" Error

**Cause**: Missing or incorrectly configured environment variables in production.

**Solution**:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Ensure all required environment variables are set:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
   - All collection IDs (check DEPLOYMENT_GUIDE.md for full list)

4. **Important**: After adding environment variables, you must:
   - Redeploy your application
   - Clear your browser cache
   - Try accessing the site in an incognito window

### 2. 404 Errors for Images/Assets

**Cause**: Images referenced in code don't exist in the public folder.

**Fixed Issues**:
- `fashion-bg.jpg` was replaced with `pexels-shattha-pilabut-38930-135620.jpg`

**To Check**:
- Ensure all images referenced in your code exist in the `public` folder
- Use correct paths (e.g., `/images/filename.jpg` for files in `public/images/`)

### 3. Appwrite Connection Issues

**Symptoms**:
- "Missing Appwrite configuration" errors
- Unable to fetch products/categories
- Authentication failures

**Solutions**:

1. **Verify Appwrite Project Status**:
   - Log into your Appwrite console
   - Ensure your project is active
   - Check that all collections exist

2. **Check API Keys**:
   - Server-side operations need `APPWRITE_API_KEY`
   - Ensure the API key has correct permissions

3. **CORS Configuration**:
   - In Appwrite console, go to your project settings
   - Add your production domain to allowed origins
   - Include both `https://yourdomain.com` and `https://www.yourdomain.com`

### 4. Stripe Integration Issues

**Common Problems**:
- Payment processing fails
- Webhook errors

**Solutions**:
1. Ensure Stripe keys are correctly set in environment variables
2. Update webhook endpoint in Stripe dashboard to your production URL
3. Regenerate webhook secret for production

### 5. Build Failures

**If your build fails on Vercel**:

1. Check build logs for specific errors
2. Common issues:
   - TypeScript errors: Run `npm run build` locally first
   - Missing dependencies: Ensure all packages are in `dependencies` not `devDependencies`
   - Environment variables: Some are needed at build time (prefixed with `NEXT_PUBLIC_`)

### 6. Performance Issues

**If the site is slow after deployment**:

1. **Check Image Sizes**:
   - Optimize large images
   - Use Next.js Image component for automatic optimization

2. **Database Queries**:
   - Ensure proper indexing in Appwrite
   - Use pagination for large datasets

3. **Client-Side Rendering**:
   - Check for unnecessary re-renders
   - Utilize React Query caching properly

## Debugging Steps

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for red error messages
   - Check Network tab for failed requests

2. **Verify Environment Variables**:
   - In your code, temporarily add:
   ```javascript
   console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
   ```
   - Check if values are undefined

3. **Test Locally with Production Variables**:
   - Create `.env.production.local`
   - Copy production environment variables
   - Run `npm run build && npm start`

4. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Functions tab
   - Look for errors in API routes

## Quick Checklist

Before reporting an issue, verify:

- [ ] All environment variables are set in Vercel
- [ ] You've redeployed after adding environment variables
- [ ] Appwrite project is accessible and running
- [ ] All collection IDs match between code and Appwrite
- [ ] Images exist in the public folder
- [ ] Browser cache is cleared
- [ ] CORS is configured for your domain in Appwrite

## Getting Help

If issues persist:
1. Check Vercel deployment logs
2. Review Appwrite console for errors
3. Test each service (Appwrite, Stripe) individually
4. Create a minimal reproduction of the issue 