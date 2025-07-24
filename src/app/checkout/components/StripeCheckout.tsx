"use client";

import React, { useState, useEffect } from 'react';
import { StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { getStripe, stripeService } from '@/lib/stripe';

interface StripeCheckoutProps {
  amount: number;
  onPaymentSuccess: (paymentIntent: { id: string }) => void;
  onPaymentError: (error: string) => void;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
    };
  };
  disabled?: boolean;
}

// Card element styling function to include disabled state
const getCardElementOptions = (disabled: boolean) => ({
  style: {
    base: {
      fontSize: '16px',
      color: disabled ? '#9ca3af' : '#424770',
      '::placeholder': {
        color: disabled ? '#d1d5db' : '#aab7c4',
      },
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
  disabled,
});

// Main checkout form component
const CheckoutForm: React.FC<StripeCheckoutProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  customerDetails,
  disabled = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string>('');

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'usd',
            metadata: {
              customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
              customerEmail: customerDetails.email,
              // These will be updated when order is created
              orderId: '',
              orderNumber: '',
              userId: '',
            },
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
      } catch (error: unknown) {
        console.error('Error creating payment intent:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
        onPaymentError(errorMessage);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, customerDetails, onPaymentError]);

  const handleCardChange = (event: { complete: boolean; error?: { message: string } }) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || processing || disabled) {
      return;
    }

    setProcessing(true);

    try {
      const card = elements.getElement(CardElement);
      
      if (!card) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const billingDetails = {
        name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: {
          line1: customerDetails.address.street,
          city: customerDetails.address.city,
          state: customerDetails.address.region,
          country: customerDetails.address.country,
          postal_code: customerDetails.address.postalCode,
        },
      };

      const paymentMethodResult = await stripeService.createPaymentMethod(
        stripe,
        card,
        billingDetails
      );

      if (!paymentMethodResult.success || !paymentMethodResult.paymentMethod) {
        throw new Error(paymentMethodResult.error || 'Failed to create payment method');
      }

      // Confirm payment
      const paymentResult = await stripeService.confirmCardPayment(
        stripe,
        clientSecret,
        paymentMethodResult.paymentMethod
      );

      if (!paymentResult.success || !paymentResult.paymentIntent) {
        throw new Error(paymentResult.error || 'Failed to confirm payment');
      }

      // Payment successful
      onPaymentSuccess({ id: paymentResult.paymentIntent.id });
      toast.success('Payment successful!');
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      onPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-200 dark:border-blue-600 border-t-blue-600 dark:border-t-blue-400 rounded-full"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Initializing payment...</span>
      </div>
    );
  }



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <FiLock className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <span className="text-sm text-blue-800 dark:text-blue-300">
          Your payment information is encrypted and secure
        </span>
      </div>

      {/* Card Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Card Information *
        </label>
        <div className="relative">
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardElement 
              options={getCardElementOptions(false)}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm"
            >
              <FiAlertCircle className="w-4 h-4" />
              <span>{cardError}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Rs {amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || !cardComplete || processing}
        className="w-full h-12 text-base font-medium"
      >
        <AnimatePresence mode="wait">
          {processing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing Payment...
            </motion.div>
          ) : (
            <motion.div
              key="pay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <FiCreditCard className="w-4 h-4" />
              Pay Rs {amount.toFixed(2)}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Stripe Notice */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Powered by <span className="font-medium">Stripe</span> - Industry-leading payment security
      </p>
    </form>
  );
};

// Main Stripe wrapper component
const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  const [stripePromise, setStripePromise] = useState<Promise<import('@stripe/stripe-js').Stripe | null> | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripe = await getStripe();
      setStripePromise(Promise.resolve(stripe));
    };

    initializeStripe();
  }, []);

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-200 dark:border-blue-600 border-t-blue-600 dark:border-t-blue-400 rounded-full"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading payment system...</span>
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#ffffff',
        colorText: '#374151',
        colorDanger: '#dc2626',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout; 