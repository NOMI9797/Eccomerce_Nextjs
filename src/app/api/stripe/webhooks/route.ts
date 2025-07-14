import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ordersService } from '@/appwrite/db/orders';
import { notificationService } from '@/appwrite/db/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(failedPayment);
      break;

    case 'charge.dispute.created':
      const dispute = event.data.object as Stripe.Dispute;
      await handleDispute(dispute);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;
    const userId = paymentIntent.metadata?.userId;
    if (!orderId || !userId) {
      console.error('No order ID or user ID found in payment intent metadata');
      return;
    }

    // Update order payment status
    await ordersService.updatePaymentStatus(orderId, 'paid');

    // Create notification for payment success
    await notificationService.createPaymentStatusNotification(
      userId,
      orderId,
      paymentIntent.metadata?.orderNumber || '',
      'paid'
    );

    console.log(`Payment succeeded for order ${orderId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;
    const userId = paymentIntent.metadata?.userId;
    if (!orderId || !userId) {
      console.error('No order ID or user ID found in payment intent metadata');
      return;
    }

    // Update order payment status
    await ordersService.updatePaymentStatus(orderId, 'failed');

    // Create notification for payment failure
    await notificationService.createPaymentStatusNotification(
      userId,
      orderId,
      paymentIntent.metadata?.orderNumber || '',
      'failed'
    );

    console.log(`Payment failed for order ${orderId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  try {
    // Handle dispute logic here
    console.log('Dispute created for charge:', dispute.charge);
    
    // You can add notification logic for disputes
    // This would typically notify admin about the dispute
  } catch (error) {
    console.error('Error handling dispute:', error);
  }
} 