import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, orderId, orderNumber, userId } = body;

    // Validate required fields
    if (!paymentIntentId || !orderId || !orderNumber || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update payment intent with order metadata
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        orderId,
        orderNumber,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error updating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to update payment intent' },
      { status: 500 }
    );
  }
} 