import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { PaymentService } from '@/lib/payment';
import { updateOrderStatus } from '@/lib/database';

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

    // Verify payment signature
    const verificationResult = await PaymentService.handlePaymentSuccess(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!verificationResult.verified) {
      // Update order status to failed
      await updateOrderStatus(order_id, 'failed');
      
      return NextResponse.json(
        { error: verificationResult.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update order status to completed
    await updateOrderStatus(order_id, 'completed', razorpay_payment_id);

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