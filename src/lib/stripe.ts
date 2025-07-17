import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('Stripe publishable key is not set in environment variables');
      return null;
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export { getStripe };

// Stripe configuration
export const stripeConfig = {
  currency: 'usd',
  locale: 'en' as const,
};

// Payment method types
export interface PaymentMethodResult {
  success: boolean;
  paymentMethod?: import('@stripe/stripe-js').PaymentMethod;
  error?: string;
}

// Payment intent result
export interface PaymentIntentResult {
  success: boolean;
  paymentIntent?: import('@stripe/stripe-js').PaymentIntent;
  error?: string;
}

// Stripe service functions
export const stripeService = {
  // Create payment method
  async createPaymentMethod(stripe: Stripe, cardElement: import('@stripe/stripe-js').StripeCardElement, billingDetails: { name?: string; email?: string; phone?: string; address?: { line1?: string; city?: string; state?: string; country?: string; postal_code?: string } }): Promise<PaymentMethodResult> {
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, paymentMethod };
    } catch {
      return { success: false, error: 'Failed to create payment method' };
    }
  },

  // Confirm payment intent
  async confirmCardPayment(stripe: Stripe, clientSecret: string, paymentMethod: import('@stripe/stripe-js').PaymentMethod): Promise<PaymentIntentResult> {
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, paymentIntent };
    } catch {
      return { success: false, error: 'Failed to confirm payment' };
    }
  },

  // Format amount for Stripe (convert to cents)
  formatAmountForStripe(amount: number): number {
    return Math.round(amount * 100);
  },

  // Format amount for display (convert from cents)
  formatAmountForDisplay(amount: number): number {
    return amount / 100;
  },
}; 