
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/lib/types";

type LightweightCartItem = { id: string; quantity: number };
type CartItem = Book & { quantity: number };


export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
    const lightweightCart: LightweightCartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
    
    const hydratedCart = lightweightCart.map(item => {
        const bookDetails = allPublishedBooks.find(b => b.id === item.id);
        return bookDetails ? { ...bookDetails, quantity: item.quantity } : null;
    }).filter((i): i is CartItem => i !== null);

    setCartItems(hydratedCart);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const lightweightCart = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));
      localStorage.setItem('cart', JSON.stringify(lightweightCart));
    }
  }, [cartItems, hasMounted]);


  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
        removeItem(id);
        return;
    };
    const itemToUpdate = cartItems.find(item => item.id === id);
    if (itemToUpdate && newQuantity > itemToUpdate.stock) {
        toast({ variant: 'destructive', title: 'Stock Limit', description: `Only ${itemToUpdate.stock} copies available.` });
        return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast({ title: 'Item Removed', description: 'The book has been removed from your cart.' });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxes = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + taxes + shipping;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline tracking-tight text-center mb-10">
        Your Shopping Cart
      </h1>
      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex items-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={100}
                    height={150}
                    className="object-cover aspect-[2/3]"
                    data-ai-hint="book cover"
                  />
                  <div className="flex-grow p-4">
                    <Link
                      href={`/books/${item.id}`}
                      className="font-semibold font-headline hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.author}
                    </p>
                    <p className="text-lg font-semibold text-primary mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
           <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-headline font-semibold">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't added any books yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/books">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
