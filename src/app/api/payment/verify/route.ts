import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { updateOrderStatus } from '@/lib/database';
import crypto from 'crypto';

// Safe payment verification without external dependencies
function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      console.warn('Razorpay key secret not found, using mock verification');
      // Mock verification for development
      return signature === 'mock_signature' || signature.startsWith('mock_');
    }
    
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
}

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_id 
    } = body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        { error: 'Missing required payment verification data' },
        { status: 400 }
      );
    }

    // Verify payment signature using local function
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      // Update order status to failed
      try {
        await updateOrderStatus(order_id, 'failed');
      } catch (dbError) {
        console.error('Database error updating failed order:', dbError);
      }
      
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update order status to completed
    try {
      await updateOrderStatus(order_id, 'completed', razorpay_payment_id);
    } catch (dbError) {
      console.error('Database error updating completed order:', dbError);
      return NextResponse.json(
        { error: 'Payment verified but order update failed. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Payment verified successfully',
      orderId: order_id,
      paymentId: razorpay_payment_id,
      verified: true
    }, { status: 200 });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed. Please contact support.' },
      { status: 500 }
    );
  }
});