

"use client";

import { useState, useMemo, useEffect } from "react";
import BookCard from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book, User } from "@/lib/types";
import { useSearchParams } from 'next/navigation';

const BOOKS_PER_PAGE = 8;

export default function BooksPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]); 
  const [user, setUser] = useState<User | null>(null);
  const [userLibrary, setUserLibrary] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const query = searchParams.get('q');
    if (query) {
        setSearchTerm(query);
    }
    
    // Load books published by authors from localStorage.
    const publishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
    setBooks(publishedBooks);

    const loggedInUserString = localStorage.getItem('loggedInUser');
    if (loggedInUserString) {
        const loggedInUser: User = JSON.parse(loggedInUserString);
        setUser(loggedInUser);

        const allLibraryData = JSON.parse(localStorage.getItem('userLibrary') || '{}');
        setUserLibrary(allLibraryData[loggedInUser.id] || []);
    }
  }, [searchParams]);

  const filteredBooks = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return books
      .filter((book) =>
        book.title.toLowerCase().includes(lowercasedTerm) ||
        book.author.toLowerCase().includes(lowercasedTerm)
      )
      .filter(
        (book) =>
          selectedCategory === "All" || book.category === selectedCategory
      );
  }, [searchTerm, selectedCategory, books]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );
  
  const categories = useMemo(() => {
    const allCategories = ["All", ...new Set(books.map((book) => book.category))];
    // Remove duplicates
    return [...new Set(allCategories)];
  }, [books]);
  
  if (!hasMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Explore Our Collection
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find your next adventure. Search by title or filter by category.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or author..."
            className="w-full rounded-lg bg-background pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex-none">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {paginatedBooks.map((book) => (
              <BookCard key={book.id} book={book} hasAccess={userLibrary.includes(book.id)} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-headline font-semibold">No Books Found</h2>
          <p className="mt-2 text-muted-foreground">
            There are currently no books matching your criteria. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}