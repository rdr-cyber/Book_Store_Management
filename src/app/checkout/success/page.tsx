
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ShoppingBag, Download } from 'lucide-react';
import type { Book } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type OrderItem = Book & { quantity: number };

type LightweightOrderItem = {
    id: string;
    quantity: number;
}

type LightweightOrder = {
    items: LightweightOrderItem[];
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
    shippingAddress: {
      name: string;
      address: string;
    };
    paymentMethod: string;
    orderId: string;
}

type HydratedOrder = Omit<LightweightOrder, 'items'> & {
    items: OrderItem[];
}

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState<HydratedOrder | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        setHasMounted(true);
        const storedOrderString = localStorage.getItem('latestOrder');
        if (storedOrderString) {
            const storedOrder: LightweightOrder = JSON.parse(storedOrderString);
            const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');

            const hydratedItems = storedOrder.items.map(item => {
                const bookDetails = allPublishedBooks.find(book => book.id === item.id);
                return bookDetails ? { ...bookDetails, quantity: item.quantity } : null;
            }).filter((i): i is OrderItem => i !== null);

            const hydratedOrder: HydratedOrder = {
                ...storedOrder,
                items: hydratedItems,
            }
            setOrder(hydratedOrder);
        }
    }, []);

    const handleDownloadInvoice = () => {
        const input = invoiceRef.current;
        if (input && order) {
            html2canvas(input, { scale: 2 }) // Increase scale for better resolution
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;
                    const ratio = canvasWidth / canvasHeight;
                    const width = pdfWidth - 20; // with margin
                    const height = width / ratio;

                    let position = 10;
                     if (height > pdfHeight - 20) {
                        pdf.addImage(imgData, 'PNG', 10, position, width, height, undefined, 'FAST');
                    } else {
                        pdf.addImage(imgData, 'PNG', 10, position, width, height);
                    }
                    pdf.save(`Invoice-${order.orderId}.pdf`);
                });
        }
    }


    if (!hasMounted) {
        return null; // Or a loading spinner
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">No order details found.</h1>
                <p className="text-muted-foreground mt-2">
                    Please complete the checkout process to see your confirmation.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/books">Go Shopping</Link>
                </Button>
            </div>
        );
    }

  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
            <div ref={invoiceRef}>
                <Card className="shadow-lg">
                <CardHeader className="text-center bg-card rounded-t-lg p-8">
                    <div className="flex justify-center items-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-headline">
                    Thank You for Your Order!
                    </CardTitle>
                    <CardDescription className="pt-2 text-lg">
                    A confirmation email has been sent to your address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold font-headline">Order Details</h3>
                            <span className="text-sm text-muted-foreground">Order #{order.orderId}</span>
                        </div>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={60}
                            height={90}
                            className="rounded-md object-cover aspect-[2/3] border"
                            data-ai-hint="book cover"
                            />
                            <div className="flex-grow">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                                {item.author}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                            </p>
                            </div>
                            <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold font-headline mb-2">Shipping To</h4>
                            <address className="text-sm text-muted-foreground not-italic whitespace-pre-line">
                                {order.shippingAddress.name}
                                <br />
                                {order.shippingAddress.address.replace(/, /g, '\n')}
                            </address>
                        </div>
                        <div>
                            <h4 className="font-semibold font-headline mb-2">Payment Method</h4>
                            <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes</span>
                        <span>${order.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </div>

            <div className="text-center mt-8 flex items-center justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/books">
                    <ShoppingBag className="mr-2" />
                    Continue Shopping
                    </Link>
                </Button>
                <Button onClick={handleDownloadInvoice} variant="outline" size="lg">
                        <Download className="mr-2" />
                        Download Invoice
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
