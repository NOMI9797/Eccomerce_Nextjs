This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your_storage_id_here
APPWRITE_API_KEY=your_appwrite_api_key_here

# Collection IDs
NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=your_categories_collection_id
NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=your_notifications_collection_id
NEXT_PUBLIC_APPWRITE_CART_COLLECTION_ID=your_cart_collection_id
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional: Google Maps API (if using location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Important**: When deploying to Vercel or other platforms, make sure to add all these environment variables in your project settings.

# Eccomerce-Next.js
