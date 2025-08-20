
"use client";

import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookCheck, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookCard({ book, hasAccess = false }: { book: Book, hasAccess?: boolean }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check for purchase duplication (already own)
     if (hasAccess) {
        toast({
          variant: 'destructive',
          title: "Already Owned",
          description: "You already have this book in your library.",
        });
        return;
    }
    
    // Check for cart duplication
    const existingItem = cart.find((item: any) => item.id === book.id);
    if (existingItem) {
        toast({
          variant: 'destructive',
          title: "Already in Cart",
          description: `You have already added "${book.title}" to your cart.`,
        });
        return;
    } else {
        cart.push({ id: book.id, quantity: 1 });
    }
    
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        toast({
          title: "Added to Cart!",
          description: `${book.title} has been added to your shopping cart.`,
        });
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Could not add to cart.',
            description: 'There was an issue adding the item to your cart, likely due to storage limits.'
        });
    }
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (hasAccess) {
        toast({
          variant: 'destructive',
          title: "Already Owned",
          description: "You already have this book in your library.",
        });
        return;
    }

    const buyNowItem = { id: book.id, quantity: 1 };
    
    try {
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        router.push('/checkout');
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Could not proceed to checkout.',
            description: 'There was an issue preparing your item for checkout.'
        });
    }
  }

  const handleGift = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/gift/${book.id}`);
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={ hasAccess ? `/books/${book.id}?fromLibrary=true` : `/books/${book.id}`} className="block overflow-hidden group">
        <CardHeader className="p-0 relative">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            width={400}
            height={600}
            className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="book cover"
          />
          {hasAccess && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <BookCheck className="h-12 w-12 text-white" />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <Badge variant="secondary" className="mb-2">
            {book.category}
          </Badge>
          <CardTitle className="text-lg font-headline group-hover:text-primary">
            {book.title}
          </CardTitle>
          <CardDescription className="mt-1">{book.author}</CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="flex flex-col items-start p-4 pt-0 gap-3">
        <p className="text-xl font-semibold text-primary">${book.price.toFixed(2)}</p>
        <div className="w-full">
          {hasAccess ? (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/books/${book.id}?fromLibrary=true`}>Read Now</Link>
              </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleAddToCart} disabled={book.stock === 0}>
                {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button onClick={handleBuyNow} disabled={book.stock === 0}>
                Buy
              </Button>
            </div>
          )}
        </div>
        <Button variant="secondary" className="w-full" onClick={handleGift} disabled={book.stock === 0}>
            <Gift className="mr-2"/>
            Gift this Book
        </Button>
      </CardFooter>
    </Card>
  );
}