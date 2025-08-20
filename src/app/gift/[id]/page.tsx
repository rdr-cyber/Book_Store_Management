
"use client";

import { useState, useEffect, FormEvent, FocusEvent } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gift, ArrowLeft, CreditCard } from "lucide-react";
import type { Book, User, Gift as GiftType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function GiftPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipient, setRecipient] = useState<User | null>(null);
  const [giver, setGiver] = useState<User | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [recipientStatusMessage, setRecipientStatusMessage] = useState<string | null>(null);
  const [isGiftable, setIsGiftable] = useState(false);


  useEffect(() => {
    setHasMounted(true);
    
    const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
    const foundBook = allPublishedBooks.find(b => b.id === bookId);

    if (foundBook) {
      setBook(foundBook);
    } else {
      toast({ variant: "destructive", title: "Book not found", description: "This book cannot be gifted as it was not found." });
      router.push("/books");
    }

    const userString = localStorage.getItem('loggedInUser');
    if (userString) {
      const user: User = JSON.parse(userString);
      setGiver(user);
    } else {
        toast({ variant: "destructive", title: "Login Required", description: "You must be logged in to gift a book." });
        router.push(`/login?role=reader&redirect=/gift/${bookId}`);
    }
  }, [bookId, router, toast]);
  
  const handleEmailBlur = (e: FocusEvent<HTMLInputElement>) => {
      const email = e.target.value.trim().toLowerCase();
      setRecipientEmail(email);
      setRecipientStatusMessage(null);
      setIsGiftable(false);
      setRecipient(null);

      if (!email) return;

      if (email === giver?.email) {
          setRecipientStatusMessage("You cannot gift a book to yourself.");
          return;
      }
      
      const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundRecipient = allUsers.find(u => u.email.toLowerCase() === email && u.role === 'reader');
      
      if (foundRecipient) {
          const userLibrary = JSON.parse(localStorage.getItem('userLibrary') || '{}');
          const recipientLibrary: string[] = userLibrary[foundRecipient.id] || [];

          if (recipientLibrary.includes(bookId)) {
              setRecipientStatusMessage('This reader already owns the book.');
          } else {
              const existingGifts: GiftType[] = JSON.parse(localStorage.getItem('gifts') || '[]');
              const hasBeenGifted = existingGifts.some(g => g.bookId === bookId && g.recipientUserId === foundRecipient.id && g.giverUserId === giver?.id);

              if(hasBeenGifted) {
                setRecipientStatusMessage('You have already gifted this book to this user.');
              } else {
                setRecipient(foundRecipient);
                setRecipientStatusMessage('Recipient found!');
                setIsGiftable(true);
              }
          }
      } else {
          setRecipientStatusMessage('No reader account found with that email address.');
      }
  }


  const handleGiftSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!giver || !book || !recipient || !isGiftable) {
        toast({ variant: "destructive", title: "Cannot Send Gift", description: recipientStatusMessage || "Please resolve the issues with the recipient's details." });
        return;
    }

    if (!cardNumber || !expiry || !cvc) {
        toast({ variant: "destructive", title: "Payment Incomplete", description: "Please fill out all payment details." });
        return;
    }

    try {
        // Create gift record
        const newGift: GiftType = {
            id: `gift-${Date.now()}`,
            bookId: book.id,
            giverUserId: giver.id,
            recipientEmail: recipient.email,
            recipientUserId: recipient.id,
            amount: book.price,
            status: "claimed", // Auto-claimed in this simulation
            createdAt: new Date(),
        };

        const existingGifts: GiftType[] = JSON.parse(localStorage.getItem('gifts') || '[]');
        existingGifts.push(newGift);
        localStorage.setItem('gifts', JSON.stringify(existingGifts));

        // Add book to recipient's library
        const userLibrary = JSON.parse(localStorage.getItem('userLibrary') || '{}');
        const recipientLibrary: string[] = userLibrary[recipient.id] || [];
        recipientLibrary.push(book.id);
        userLibrary[recipient.id] = recipientLibrary;
        localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
        
        toast({ title: "Gift Sent!", description: `${book.title} has been successfully sent to ${recipient.email}.` });
        router.push("/books");

    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred while sending the gift.' });
    }
  }

  if (!hasMounted || !book) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mb-4">
            <Button variant="outline" asChild>
                <Link href={`/books/${book.id}`}>
                    <ArrowLeft className="mr-2"/>
                    Back to Book
                </Link>
            </Button>
        </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col items-center">
            <Image
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                width={300}
                height={450}
                className="rounded-lg shadow-xl aspect-[2/3] object-cover"
                data-ai-hint="book cover"
            />
            <h2 className="text-2xl font-bold font-headline mt-4">{book.title}</h2>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
            <p className="text-3xl font-bold text-primary mt-2">${book.price.toFixed(2)}</p>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Gift This Book</CardTitle>
                    <CardDescription>
                        Send this book to another ShelfWise reader.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleGiftSubmit} className="space-y-6">
                        <Accordion type="single" defaultValue="item-1" collapsible className="w-full">
                             <AccordionItem value="item-1">
                                <AccordionTrigger className="text-xl font-headline">
                                    1. Recipient Details
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient-email">Recipient's Email</Label>
                                        <Input 
                                            id="recipient-email" 
                                            type="email"
                                            placeholder="friend@example.com" 
                                            defaultValue={recipientEmail}
                                            onBlur={handleEmailBlur}
                                            required 
                                        />
                                         {recipientStatusMessage && (
                                            <p className={`text-sm ${isGiftable ? 'text-green-600' : 'text-destructive'}`}>
                                                {recipientStatusMessage}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="recipient-first-name">First Name</Label>
                                            <Input 
                                                id="recipient-first-name"
                                                value={recipient?.firstName || ''}
                                                readOnly
                                                disabled
                                                placeholder="Recipient's first name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="recipient-last-name">Last Name</Label>
                                            <Input 
                                                id="recipient-last-name"
                                                value={recipient?.lastName || ''}
                                                readOnly
                                                disabled
                                                placeholder="Recipient's last name"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground pt-2">The book will be added directly to the recipient's ShelfWise library.</p>
                                </AccordionContent>
                             </AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger className="text-xl font-headline">
                                    2. Payment Information
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
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
                                    <p className="text-sm text-muted-foreground pt-2">Your card will be charged <strong>${book.price.toFixed(2)}</strong>.</p>
                                </AccordionContent>
                             </AccordionItem>
                        </Accordion>
                        
                        <Button type="submit" size="lg" className="w-full" disabled={!isGiftable}>
                            <Gift className="mr-2" />
                            Pay and Send Gift
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
