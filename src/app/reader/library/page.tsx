
"use client";

import { useState, useEffect } from "react";
import BookCard from "@/components/BookCard";
import type { Book, User } from "@/lib/types";

export default function ReaderLibraryPage() {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
        const loggedInUserString = localStorage.getItem('loggedInUser');
        if (loggedInUserString) {
            const loggedInUser: User = JSON.parse(loggedInUserString);
            
            const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
            const userLibraryData = JSON.parse(localStorage.getItem('userLibrary') || '{}');
            const userBookIds: string[] = userLibraryData[loggedInUser.id] || [];
            
            const booksInLibrary = allPublishedBooks.filter(book => userBookIds.includes(book.id));
            setLibraryBooks(booksInLibrary);
        } else {
            setLibraryBooks([]);
        }
    } catch(e) {
        setLibraryBooks([]);
    }
  }, []);

  if (!hasMounted) {
      return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          My Library
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          All the books you have purchased. Read them anytime, anywhere.
        </p>
      </div>

      {libraryBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {libraryBooks.map((book) => (
            <BookCard key={book.id} book={book} hasAccess={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-headline font-semibold">Your Library is Empty</h2>
          <p className="mt-2 text-muted-foreground">
            Purchase books to add them to your library.
          </p>
        </div>
      )}
    </div>
  );
}

    