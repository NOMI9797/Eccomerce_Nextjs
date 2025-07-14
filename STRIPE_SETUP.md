# Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up Stripe payment processing for your KharedLo e-commerce application.

## Prerequisites
1. A Stripe account (sign up at [https://stripe.com](https://stripe.com))
2. Your Stripe API keys (available in your Stripe dashboard)

## Step 1: Get Your Stripe API Keys

### Development/Test Keys
1. Log into your Stripe Dashboard
2. Navigate to **Developers > API Keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Production Keys (when ready to go live)
1. Toggle to "Live" mode in your Stripe Dashboard
2. Copy the production keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Webhook Configuration (optional for development)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Important Notes:
- **NEVER** commit your secret key to version control
- The `NEXT_PUBLIC_` prefix is required for client-side variables
- Use test keys for development and switch to live keys for production

## Step 3: Test the Integration

### Test Card Numbers
Stripe provides test card numbers for development:

#### Successful Payments:
- **Visa**: `4242424242424242`
- **Visa (debit)**: `4000056655665556`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`

#### Failed Payments:
- **Generic decline**: `4000000000000002`
- **Insufficient funds**: `4000000000009995`
- **Lost card**: `4000000000009987`
- **Stolen card**: `4000000000009979`

#### Test Details:
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3-digit number (4-digit for Amex)
- **ZIP**: Any 5-digit number

## Step 4: Webhook Configuration (Optional but Recommended)

For production, set up webhooks to handle payment events:

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Set URL to: `https://yourdomain.com/api/stripe/webhooks`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.dispute.created`

## Step 5: Security Considerations

### For Development:
- Use test keys only
- Never expose secret keys in client-side code
- Test with various card scenarios

### For Production:
- Use live keys
- Enable webhook signature verification
- Implement proper error logging
- Set up monitoring for failed payments

## Step 6: Currency and Localization

The current implementation uses USD by default. To change:

1. Update `src/lib/stripe.ts`:
```typescript
export const stripeConfig = {
  currency: 'eur', // Change to your preferred currency
  locale: 'en' as const,
};
```

2. Update the API endpoint in `src/app/api/stripe/create-payment-intent/route.ts`:
```typescript
const { amount, currency = 'eur', metadata = {} } = body;
```

## Step 7: Testing Checklist

### Before Going Live:
- [ ] Test successful payments with various card types
- [ ] Test failed payments and error handling
- [ ] Verify order creation with payment status
- [ ] Test notifications are sent correctly
- [ ] Verify invoice generation includes payment info
- [ ] Test both dark and light mode UI
- [ ] Ensure proper error messages are displayed
- [ ] Test mobile responsiveness

## Troubleshooting

### Common Issues:

#### "Stripe publishable key is not set"
- Check your `.env.local` file
- Ensure the variable name is exactly `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Restart your development server after adding environment variables

#### "Failed to create payment intent"
- Verify your secret key is correct
- Check the Stripe Dashboard for error logs
- Ensure your API endpoint is accessible

#### "Invalid API key"
- Make sure you're using the correct keys for your environment
- Don't mix test and live keys

#### Payment processing but order not created
- Check browser console for JavaScript errors
- Verify the order creation logic in `handleStripePaymentSuccess`
- Check Appwrite database permissions

## API Endpoints

The integration includes these endpoints:

### `/api/stripe/create-payment-intent`
- **POST**: Creates a payment intent for the order total
- **GET**: Checks if Stripe is properly configured

## Support

### Stripe Resources:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)

### Implementation Files:
- `src/lib/stripe.ts` - Stripe service and configuration
- `src/app/api/stripe/create-payment-intent/route.ts` - Payment intent API
- `src/app/checkout/components/StripeCheckout.tsx` - Checkout component
- `src/app/checkout/page.tsx` - Main checkout page with integration

## Going Live

When ready for production:

1. Replace test keys with live keys in environment variables
2. Set up webhook endpoints
3. Enable proper logging and monitoring
4. Test thoroughly with real payment methods
5. Ensure PCI compliance requirements are met

Remember: Stripe handles PCI compliance for card data, but you're responsible for securing your application and API keys. 