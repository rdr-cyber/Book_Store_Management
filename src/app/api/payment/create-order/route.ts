import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { PaymentService } from '@/lib/payment';
import { VPNDetector } from '@/services/vpn-detector';
import { createOrder, getBookById, hasUserPurchasedBook } from '@/lib/database';
import { Order } from '@/lib/types';

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { books, paymentMethod, shippingAddress } = body;

    // Validate input
    if (!books || !Array.isArray(books) || books.length === 0) {
      return NextResponse.json(
        { error: 'Books array is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['upi', 'credit_card', 'debit_card'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Valid payment method is required' },
        { status: 400 }
      );
    }

    // Check for duplicate purchases
    for (const item of books) {
      const alreadyPurchased = await hasUserPurchasedBook(user.uid, item.bookId);
      if (alreadyPurchased) {
        const book = await getBookById(item.bookId);
        return NextResponse.json(
          { error: `You have already purchased "${book?.title}". Duplicate purchases are not allowed.` },
          { status: 400 }
        );
      }
    }

    // Calculate total amount and validate books
    let totalAmount = 0;
    const validatedBooks = [];

    for (const item of books) {
      const book = await getBookById(item.bookId);
      if (!book) {
        return NextResponse.json(
          { error: `Book with ID ${item.bookId} not found` },
          { status: 404 }
        );
      }

      if (book.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${book.title}". Available: ${book.stock}` },
          { status: 400 }
        );
      }

      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;

      validatedBooks.push({
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price,
      });
    }

    // Validate payment amount
    if (!PaymentService.validatePaymentAmount(totalAmount)) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Get client information for security checks
    const userIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Create order in database
    const orderData: Omit<Order, 'id'> = {
      userId: user.uid,
      books: validatedBooks,
      totalAmount,
      status: 'pending',
      paymentMethod: paymentMethod as Order['paymentMethod'],
      paymentGateway: 'razorpay',
      createdAt: new Date(),
      shippingAddress,
    };

    const orderId = await createOrder(orderData);

    // Process payment with security checks
    const paymentResult = await PaymentService.processPayment(
      { ...orderData, id: orderId },
      paymentMethod,
      userIP,
      userAgent
    );

    if (!paymentResult.success) {
      return NextResponse.json(
        { 
          error: paymentResult.error,
          securityBlock: paymentResult.securityBlock 
        },
        { status: paymentResult.securityBlock ? 403 : 400 }
      );
    }

    // Generate payment options for frontend
    const paymentOptions = PaymentService.generatePaymentOptions(
      paymentResult.orderId!,
      totalAmount,
      'INR',
      user.email,
      `${user.firstName} ${user.lastName}`
    );

    return NextResponse.json({
      orderId,
      razorpayOrderId: paymentResult.orderId,
      paymentOptions,
      totalAmount,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
});