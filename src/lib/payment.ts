import crypto from 'crypto';
import { Order, PaymentIntent } from './types';
import { VPNDetector } from '../services/vpn-detector';

// Dynamic import for Razorpay to handle server-side only usage
let razorpayInstance: any = null;

// Initialize Razorpay only when needed and in server environment
const getRazorpayInstance = async () => {
  if (!razorpayInstance && typeof window === 'undefined') {
    try {
      const Razorpay = (await import('razorpay')).default;
      
      // Check if environment variables are available
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      
      if (keyId && keySecret) {
        razorpayInstance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
      } else {
        console.warn('Razorpay credentials not found, using mock implementation');
        // Return mock instance for development
        razorpayInstance = {
          orders: {
            create: async (options: any) => ({
              id: `mock_order_${Date.now()}`,
              amount: options.amount,
              currency: options.currency,
              receipt: options.receipt,
              status: 'created'
            })
          },
          payments: {
            fetch: async (paymentId: string) => ({
              id: paymentId,
              status: 'captured',
              amount: 100000
            }),
            refund: async (paymentId: string, data: any) => ({
              id: `refund_${Date.now()}`,
              payment_id: paymentId,
              amount: data.amount,
              status: 'processed'
            })
          }
        };
      }
    } catch (error) {
      console.error('Failed to initialize Razorpay:', error);
      throw new Error('Payment service unavailable');
    }
  }
  return razorpayInstance;
};

export class PaymentService {
  
  // Create a Razorpay order
  static async createRazorpayOrder(
    amount: number, 
    currency: string = 'INR',
    receipt: string,
    notes?: Record<string, string>
  ) {
    try {
      const razorpay = await getRazorpayInstance();
      
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Verify Razorpay payment signature
  static verifyPaymentSignature(
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

  // Process payment with security checks
  static async processPayment(
    orderData: Order,
    paymentMethod: string,
    userIP?: string,
    userAgent?: string
  ): Promise<{
    success: boolean;
    orderId?: string;
    error?: string;
    securityBlock?: boolean;
  }> {
    try {
      // Perform VPN and security checks
      const vpnResult = await VPNDetector.detectVPN(userIP);
      const securityChecks = await VPNDetector.performSecurityChecks(userAgent);

      // Block payment if VPN is detected with high risk
      if (VPNDetector.shouldBlockPayment(vpnResult)) {
        return {
          success: false,
          error: 'Payment blocked due to security concerns. Please disable VPN and try again.',
          securityBlock: true
        };
      }

      // Block payment if suspicious activity detected
      if (securityChecks.suspicious) {
        return {
          success: false,
          error: `Payment blocked: ${securityChecks.reasons.join(', ')}`,
          securityBlock: true
        };
      }

      // Create Razorpay order
      const razorpayOrder = await this.createRazorpayOrder(
        orderData.totalAmount,
        'INR',
        `order_${orderData.id}`,
        {
          orderId: orderData.id,
          userId: orderData.userId,
          paymentMethod: paymentMethod
        }
      );

      return {
        success: true,
        orderId: razorpayOrder.id
      };

    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }
  }

  // Handle payment success callback
  static async handlePaymentSuccess(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{
    verified: boolean;
    error?: string;
  }> {
    try {
      const isValidSignature = this.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValidSignature) {
        return {
          verified: false,
          error: 'Payment verification failed'
        };
      }

      return {
        verified: true
      };

    } catch (error) {
      console.error('Error handling payment success:', error);
      return {
        verified: false,
        error: 'Payment verification error'
      };
    }
  }

  // Get payment status
  static async getPaymentStatus(paymentId: string) {
    try {
      const razorpay = await getRazorpayInstance();
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }

  // Refund payment
  static async refundPayment(paymentId: string, amount?: number) {
    try {
      const razorpay = await getRazorpayInstance();
      
      const refundData: any = {
        payment_id: paymentId,
      };

      if (amount) {
        refundData.amount = amount * 100; // Convert to paise
      }

      const refund = await razorpay.payments.refund(paymentId, refundData);
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Generate payment options for frontend
  static generatePaymentOptions(
    orderId: string,
    amount: number,
    currency: string = 'INR',
    userEmail: string,
    userName: string,
    userPhone?: string
  ) {
    return {
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency,
      name: 'Book Store Management',
      description: 'Purchase books from our online store',
      order_id: orderId,
      handler: function (response: any) {
        // This will be handled by the frontend
        console.log('Payment successful:', response);
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone || '',
      },
      notes: {
        address: 'Book Store Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
      method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true,
      },
    };
  }

  // Validate payment amount
  static validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 500000; // Max ₹5,00,000 per transaction
  }

  // Calculate processing fees
  static calculateProcessingFees(amount: number, paymentMethod: string): number {
    // Standard Razorpay fees
    const rates = {
      upi: 0.0, // No fees for UPI below ₹2000
      card: 0.0236, // 2.36% for cards
      netbanking: 0.019, // 1.9% for net banking
      wallet: 0.024, // 2.4% for wallets
    };

    let rate = rates.card; // Default rate
    
    if (paymentMethod === 'upi' && amount <= 2000) {
      rate = rates.upi;
    } else if (rates[paymentMethod as keyof typeof rates]) {
      rate = rates[paymentMethod as keyof typeof rates];
    }

    const fees = amount * rate;
    const gst = fees * 0.18; // 18% GST on processing fees
    
    return Math.round((fees + gst) * 100) / 100; // Round to 2 decimal places
  }
}