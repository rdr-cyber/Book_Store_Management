
'use server';

/**
 * @fileOverview A mock email sending service.
 *
 * In a real-world application, this service would integrate with a third-party
 * email provider like SendGrid, Resend, or AWS SES to send transactional emails.
 *
 * For this demo, it simply logs the email content to the server console to
 * simulate the action of sending an email without requiring API keys or setup.
 */

type OrderItem = {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

type OrderDetails = {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
    shippingAddress: {
      name: string;
      address: string;
    };
    orderId: string;
};

type EmailPayload = {
    email: string;
    orderDetails: OrderDetails;
}

function generateOrderConfirmationHtml(orderDetails: OrderDetails): string {
    const itemsHtml = orderDetails.items.map(item => `
        <tr>
            <td>${item.title} (x${item.quantity})</td>
            <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h1 style="text-align: center; color: #333;">Thank You for Your Order!</h1>
            <p>Your order #${orderDetails.orderId} has been confirmed.</p>
            
            <h2>Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item</th>
                        <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding: 8px; text-align: right;">Subtotal</td>
                        <td style="padding: 8px; text-align: right;">$${orderDetails.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; text-align: right;">Shipping</td>
                        <td style="padding: 8px; text-align: right;">$${orderDetails.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; text-align: right;">Taxes</td>
                        <td style="padding: 8px; text-align: right;">$${orderDetails.taxes.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">Total</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">$${orderDetails.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <h2>Shipping To</h2>
            <p style="white-space: pre-line;">
                ${orderDetails.shippingAddress.name}
                ${orderDetails.shippingAddress.address.replace(/, /g, '\n')}
            </p>
            
            <p style="text-align: center; color: #777; margin-top: 20px;">ShelfWise Bookstore</p>
        </div>
    `;
}

export async function sendOrderConfirmationEmail({ email, orderDetails }: EmailPayload): Promise<void> {
  // In a real app, you'd use a service like SendGrid, Resend, etc.
  // For demo purposes, we simulate email sending
  
  try {
    // Simulate email service call
    // const emailService = new EmailService();
    // await emailService.send({
    //   to: email,
    //   from: 'no-reply@shelfwise.com',
    //   subject: `Your ShelfWise Order Confirmation #${orderDetails.orderId}`,
    //   html: generateOrderConfirmationHtml(orderDetails)
    // });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In demo mode, we silently succeed
    // In production, integrate with your preferred email service
  } catch (error) {
    // Handle email sending errors gracefully
    throw new Error('Failed to send confirmation email');
  }
}
