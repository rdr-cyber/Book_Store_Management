

"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, Compass, Lightbulb, BookHeart, Users, Newspaper, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Book as BookType, User, Gift as GiftType } from "@/lib/types";
import BookCard from "@/components/BookCard";

type HydratedGift = {
    book: BookType;
    giver: User;
    createdAt: Date;
    id: string;
}

export default function ReaderDashboard() {
  const [libraryBooks, setLibraryBooks] = useState<BookType[]>([]);
  const [followedAuthorBooks, setFollowedAuthorBooks] = useState<BookType[]>([]);
  const [receivedGifts, setReceivedGifts] = useState<HydratedGift[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    try {
        const loggedInUserString = localStorage.getItem('loggedInUser');
        if (loggedInUserString) {
            const loggedInUser: User = JSON.parse(loggedInUserString);

            if (loggedInUser.role !== 'reader') {
                router.push('/login?role=reader');
                return;
            }

            setUser(loggedInUser);

            const allPublishedBooks: BookType[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
            const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Hydrate library
            const userLibraryData = JSON.parse(localStorage.getItem('userLibrary') || '{}');
            const userBookIds: string[] = userLibraryData[loggedInUser.id] || [];
            const booksInLibrary = allPublishedBooks.filter(book => userBookIds.includes(book.id));
            setLibraryBooks(booksInLibrary);

            // Hydrate followed authors' books
            const userFollows = JSON.parse(localStorage.getItem('userFollows') || '{}');
            const followedAuthorIds: string[] = userFollows[loggedInUser.id] || [];
            const booksFromFollowed = allPublishedBooks
                .filter(book => followedAuthorIds.includes(book.authorId))
                .sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1])); // Sort by newest first
            setFollowedAuthorBooks(booksFromFollowed);

            // Hydrate received gifts
            const allGifts: GiftType[] = JSON.parse(localStorage.getItem('gifts') || '[]');
            const userGifts = allGifts.filter(gift => gift.recipientUserId === loggedInUser.id);
            const hydratedGifts = userGifts.map(gift => {
                const book = allPublishedBooks.find(b => b.id === gift.bookId);
                const giver = allUsers.find(u => u.id === gift.giverUserId);
                if (book && giver) {
                    return { ...gift, book, giver };
                }
                return null;
            }).filter((g): g is HydratedGift => g !== null)
              .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReceivedGifts(hydratedGifts);


        } else {
            router.push('/login?role=reader');
            setLibraryBooks([]);
            setFollowedAuthorBooks([]);
            setReceivedGifts([]);
        }
    } catch(e) {
        setLibraryBooks([]);
        setFollowedAuthorBooks([]);
        setReceivedGifts([]);
    }
  }, [router]);

  if (!hasMounted || !user) {
      return null; // Or a loading skeleton
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Reader Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.firstName || "Reader"}! Here's your personalized space.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content - Library and Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {libraryBooks.length > 0 && (
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center">
                    <BookHeart className="mr-3" />
                    Continue Reading
                </CardTitle>
                </CardHeader>
                <CardContent>
                
                    <div className="flex gap-6 items-center">
                    <Image
                        src={libraryBooks[0].imageUrl}
                        alt={libraryBooks[0].title}
                        width={120}
                        height={180}
                        className="rounded-md object-cover aspect-[2/3]"
                        data-ai-hint="book cover"
                    />
                    <div>
                        <h3 className="text-xl font-headline font-semibold">
                        {libraryBooks[0].title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                        by {libraryBooks[0].author}
                        </p>
                        <Button asChild>
                        <Link href={`/books/${libraryBooks[0].id}?fromLibrary=true`}>
                            Jump Back In
                        </Link>
                        </Button>
                    </div>
                    </div>
                
                </CardContent>
            </Card>
          )}

           {receivedGifts.length > 0 && (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Gift className="mr-3" />
                        Gifts Received
                    </CardTitle>
                    <CardDescription>Books that have been gifted to you by other readers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {receivedGifts.slice(0, 3).map((gift) => (
                           <div key={gift.id}>
                               <BookCard book={gift.book} hasAccess={true} />
                               <p className="text-sm text-center mt-2 text-muted-foreground">A gift from {gift.giver.firstName} {gift.giver.lastName}</p>
                           </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
          )}

          {followedAuthorBooks.length > 0 && (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Newspaper className="mr-3" />
                        New From Authors You Follow
                    </CardTitle>
                    <CardDescription>The latest books from authors you're following.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {followedAuthorBooks.slice(0, 3).map((book) => (
                           <BookCard key={book.id} book={book} hasAccess={libraryBooks.some(libBook => libBook.id === book.id)} />
                        ))}
                    </div>
                </CardContent>
              </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>My Library</CardTitle>
              <CardDescription>
                An overview of your purchased books.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {libraryBooks.slice(0, 4).map((book) => (
                  <Link key={book.id} href={`/books/${book.id}?fromLibrary=true`}>
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      width={150}
                      height={225}
                      className="rounded-md object-cover aspect-[2/3] transition-all hover:opacity-80"
                      data-ai-hint="book cover"
                    />
                  </Link>
                ))}
              </div>
              {libraryBooks.length === 0 && (
                <p className="text-muted-foreground">Your library is empty.</p>
              )}
            </CardContent>
            {libraryBooks.length > 0 && ( // Show View Full Library only if there are books
              <CardFooter>
                 <Button variant="outline" asChild>
                    <Link href="/reader/library">View Full Library</Link>
                 </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Compass className="mr-3" />
                Explore
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild size="lg">
                <Link href="/books">Browse All Books</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/reader/library">Go to My Library</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-3" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get personalized book suggestions based on your taste.
              </p>
              <Button asChild className="w-full">
                <Link href="/ai/suggestions?role=reader">
                  Find My Next Read
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}