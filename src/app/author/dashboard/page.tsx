

"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, DollarSign, Users, BookUp, Pencil, Star } from "lucide-react";
import Link from "next/link";
import type { UserRole, Book as BookType, Transaction, Review } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type UserInfo = {
    firstName: string;
    lastName: string;
    role: UserRole;
    id: string; 
}

type BookSales = {
    [bookId: string]: number;
}

type BookReviews = {
    [bookId: string]: {
        count: number;
        average: number;
    }
}

type FilterType = 'all' | 'outOfStock' | 'lowStock';

export default function AuthorDashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authorBooks, setAuthorBooks] = useState<BookType[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [bookSales, setBookSales] = useState<BookSales>({});
  const [bookReviews, setBookReviews] = useState<BookReviews>({});
  const [followers, setFollowers] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const published = params.get('published');
    const edited = params.get('edited');

    if (published === 'true') {
      toast({
        title: "Book Published!",
        description: "Your book is now live in the marketplace.",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
     if (edited === 'true') {
      toast({
        title: "Book Updated!",
        description: "Your book details have been successfully updated.",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const parsedUser: UserInfo = JSON.parse(loggedInUser);
        if (parsedUser.role !== 'author') {
            router.push('/login?role=author');
            return;
        }

        setUser(parsedUser);

        // Load books from localStorage
        const allPublishedBooks: BookType[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
        const userBooks = allPublishedBooks.filter(book => book.authorId === parsedUser.id);
        setAuthorBooks(userBooks);
        
        // Load transactions and calculate stats
        const allTransactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
        const authorTransactions = allTransactions.filter(txn => userBooks.some(b => b.id === txn.bookId));

        const revenue = authorTransactions.reduce((acc, txn) => acc + txn.amount, 0);
        setTotalRevenue(revenue);
        
        const sales = authorTransactions.reduce((acc, txn) => acc + txn.quantity, 0);
        setTotalSales(sales);
        
        const salesByBook = authorTransactions.reduce((acc, txn) => {
            acc[txn.bookId] = (acc[txn.bookId] || 0) + txn.quantity;
            return acc;
        }, {} as BookSales);
        setBookSales(salesByBook);

        // Load reviews and calculate stats
        const allReviews: Review[] = JSON.parse(localStorage.getItem('bookReviews') || '[]');
        const reviewsByBook = userBooks.reduce((acc, book) => {
            const bookReviews = allReviews.filter(r => r.bookId === book.id);
            const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
            acc[book.id] = {
                count: bookReviews.length,
                average: bookReviews.length > 0 ? totalRating / bookReviews.length : 0
            };
            return acc;
        }, {} as BookReviews);
        setBookReviews(reviewsByBook);


        // Calculate Followers
        const userFollows = JSON.parse(localStorage.getItem('userFollows') || '{}');
        const followerCount = Object.values(userFollows).filter(followedAuthors => 
            (followedAuthors as string[]).includes(parsedUser.id)
        ).length;
        setFollowers(followerCount);

      } else {
        router.push('/login?role=author');
      }
    } catch (error) {
        console.error("Error loading author dashboard data:", error);
        setUser(null);
        setAuthorBooks([]);
    }
  }, [toast, router]);
  
  const filteredBooks = useMemo(() => {
    if (filter === 'outOfStock') {
        return authorBooks.filter(book => book.stock === 0);
    }
    if (filter === 'lowStock') {
        return authorBooks.filter(book => book.stock > 0 && book.stock <= book.reorderPoint);
    }
    return authorBooks;
  }, [authorBooks, filter]);

  if (!user) {
    return null; // or a loading skeleton
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold font-headline">Author Dashboard</h1>
            {user && (
                 <p className="text-muted-foreground mt-2">Welcome back, {user.firstName} {user.lastName}!</p>
            )}
        </div>
        <Button asChild>
            <Link href="/author/publish">
                <BookUp className="mr-2" />
                Publish New Book
            </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on completed sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Sold</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">Total units sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{followers}</div>
             <p className="text-xs text-muted-foreground">{followers === 1 ? 'person follows you' : 'people follow you'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Published Books</CardTitle>
          <CardDescription>
            Manage your books, view sales, and edit details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All Books</Button>
              <Button variant={filter === 'lowStock' ? 'default' : 'outline'} onClick={() => setFilter('lowStock')}>Low Stock</Button>
              <Button variant={filter === 'outOfStock' ? 'default' : 'outline'} onClick={() => setFilter('outOfStock')}>Out of Stock</Button>
          </div>
          {authorBooks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Avg. Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell className="hidden md:table-cell">${book.price.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">{book.stock}</TableCell>
                    <TableCell>{bookSales[book.id] || 0}</TableCell>
                    <TableCell>
                      {bookReviews[book.id]?.count > 0 ? (
                        <Link href={`/author/reviews/${book.id}`} className="flex items-center gap-1 hover:underline">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{bookReviews[book.id].average.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({bookReviews[book.id].count})</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">No reviews</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/author/edit-book/${book.id}`}>
                            <Pencil className="mr-2 h-3 w-3"/>
                            Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-headline font-semibold">You haven't published any books yet.</h3>
                <p className="text-muted-foreground mt-2 mb-4">Click the button below to get started.</p>
                <Button asChild>
                    <Link href="/author/publish">
                        <BookUp className="mr-2" />
                        Publish Your First Book
                    </Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}