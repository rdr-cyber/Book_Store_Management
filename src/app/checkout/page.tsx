
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreditCard, Lock } from "lucide-react";
import type { Book, User, Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { isVpnOrProxy } from "@/services/vpn-detector";
import { sendOrderConfirmationEmail } from "@/services/email";

type CartItem = Book & { quantity: number };

type LightweightOrderItem = {
    id: string;
    quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Shipping State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  useEffect(() => {
    setHasMounted(true);
    
    const buyNowItemString = localStorage.getItem('buyNowItem');
    const regularCartString = localStorage.getItem('cart');
    let itemsToCheckout: LightweightOrderItem[] = [];
    
    if (buyNowItemString) {
        itemsToCheckout = [JSON.parse(buyNowItemString)];
        setIsBuyNow(true);
    } else if (regularCartString) {
        itemsToCheckout = JSON.parse(regularCartString);
        setIsBuyNow(false);
    }
    
    const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
    const hydratedItems = itemsToCheckout.map(item => {
        const bookDetails = allPublishedBooks.find(b => b.id === item.id);
        return bookDetails ? { ...bookDetails, quantity: item.quantity } : null;
    }).filter((i): i is CartItem => i !== null);
    
    setOrderItems(hydratedItems);
    
    if (hydratedItems.length === 0 && hasMounted) {
        router.replace('/books');
    }

    const userString = localStorage.getItem('loggedInUser');
    if (userString) {
        const user: User = JSON.parse(userString);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
    }

  }, [router, hasMounted]);

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.0 : 0;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  const validateForm = () => {
    if (!firstName || !lastName || !address || !city || !zip || !country || !email) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all shipping and contact information.' });
        return false;
    }
    if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
        if (!cardNumber || !expiry || !cvc) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all payment information.' });
            return false;
        }
    }
    return true;
  }

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (await isVpnOrProxy()) {
        toast({ variant: 'destructive', title: 'Forbidden Network Request', description: 'Checkout is not allowed from a VPN or proxy network.' });
        return;
    }
    
    if (!validateForm()) {
        return;
    }
    
    const userString = localStorage.getItem('loggedInUser');
    if (!userString) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to place an order.' });
        router.push('/login?role=reader');
        return;
    }
    const user: User = JSON.parse(userString);

    const orderDetails = {
      items: orderItems.map(item => ({ 
          id: item.id, 
          title: item.title,
          quantity: item.quantity,
          price: item.price,
      })),
      subtotal,
      shipping,
      taxes,
      total,
      shippingAddress: {
        name: `${firstName} ${lastName}`,
        address: `${address}, ${city}, ${zip}, ${country}`,
      },
      paymentMethod: `${paymentMethod}${cardNumber ? ` ending in ${cardNumber.slice(-4)}` : ''}`,
      orderId: `SW-${Date.now()}`
    };
    
    try {
        // Update user library
        const userLibrary = JSON.parse(localStorage.getItem('userLibrary') || '{}');
        const userBookIds = userLibrary[user.id] || [];
        const newBookIds = orderDetails.items.map(item => item.id);
        userLibrary[user.id] = [...new Set([...userBookIds, ...newBookIds])];
        localStorage.setItem('userLibrary', JSON.stringify(userLibrary));

        // Create transaction records for author dashboard
        const existingTransactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
        const newTransactions: Transaction[] = orderItems.map(item => ({
            id: `txn-${item.id}-${Date.now()}`,
            userId: user.id,
            bookId: item.id,
            authorId: item.authorId,
            quantity: item.quantity,
            amount: item.price * item.quantity,
            status: 'success',
            createdAt: new Date(),
        }));
        localStorage.setItem('transactions', JSON.stringify([...existingTransactions, ...newTransactions]));

        // Update book stock
        const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
        orderItems.forEach(cartItem => {
            const bookIndex = allPublishedBooks.findIndex(book => book.id === cartItem.id);
            if(bookIndex > -1) {
                allPublishedBooks[bookIndex].stock -= cartItem.quantity;
            }
        });
        localStorage.setItem('publishedBooks', JSON.stringify(allPublishedBooks));

        localStorage.setItem('latestOrder', JSON.stringify(orderDetails));

        // "Send" confirmation email
        await sendOrderConfirmationEmail({ email, orderDetails });
        
        // Clear cart or buy now item
        if (isBuyNow) {
            localStorage.removeItem('buyNowItem');
        } else {
            const cartItems: LightweightOrderItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
            const orderItemIds = new Set(orderItems.map(item => item.id));
            const updatedCart = cartItems.filter(item => !orderItemIds.has(item.id));
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        
        router.push('/checkout/success');
        
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save order. Storage might be full.' });
        return;
    }
  }

  if (!hasMounted || orderItems.length === 0) {
    return null; // or a loading skeleton
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          Checkout
        </h1>
      </div>
      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Accordion type="single" defaultValue="item-1" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-headline">
                  1. Shipping Information
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required/>
                      </div>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Anytown" value={city} onChange={e => setCity(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="12345" value={zip} onChange={e => setZip(e.target.value)} required/>
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" placeholder="United States" value={country} onChange={e => setCountry(e.target.value)} required />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-headline">
                  2. Payment Method
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payment Type</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Credit Card">
                                  <div className="flex items-center gap-2">
                                      <CreditCard className="w-5 h-5" />
                                      Credit Card
                                  </div>
                              </SelectItem>
                              <SelectItem value="Debit Card">
                                  <div className="flex items-center gap-2">
                                      <CreditCard className="w-5 h-5" />
                                      Debit Card
                                  </div>
                              </SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                    {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                        <>
                           <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                                id="card-number"
                                placeholder="•••• •••• •••• ••••"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                required
                            />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiration</Label>
                                <Input id="expiry" placeholder="MM / YY" value={expiry} onChange={e => setExpiry(e.target.value)} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="•••" value={cvc} onChange={e => setCvc(e.target.value)} required/>
                            </div>
                            </div>
                        </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={orderItems.length === 0}>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our{" "}
                    <a href="#" className="underline hover:text-primary">
                      Terms & Conditions
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}