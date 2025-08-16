
"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Paperclip, AlertTriangle } from "lucide-react";
import { bookCategories } from "@/lib/sample-data";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/lib/types";


export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const bookId = params.id as string;
    
    const [book, setBook] = useState<Book | null>(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [reorderPoint, setReorderPoint] = useState('');
    const [category, setCategory] = useState('');
    const [coverType, setCoverType] = useState('');
    const [description, setDescription] = useState('');

    const categories = bookCategories.filter(c => c !== "All");

    useEffect(() => {
        if (bookId) {
            const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
            const foundBook = allPublishedBooks.find(b => b.id === bookId);
            if (foundBook) {
                setBook(foundBook);
                setTitle(foundBook.title);
                setPrice(foundBook.price.toString());
                setStock(foundBook.stock.toString());
                setReorderPoint(foundBook.reorderPoint?.toString() || '');
                setCategory(foundBook.category);
                setCoverType(foundBook.coverType);
                setDescription(foundBook.description);
            } else {
                 toast({ variant: 'destructive', title: 'Error', description: 'Book not found.' });
                 router.push('/author/dashboard');
            }
        }
    }, [bookId, router, toast]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !price || !stock || !reorderPoint || !category || !coverType || !description) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
       
        const updatedBook: Book = {
            ...book!,
            title,
            price: parseFloat(price),
            stock: parseInt(stock),
            reorderPoint: parseInt(reorderPoint),
            category: category as Book['category'],
            coverType: coverType as Book['coverType'],
            description,
        };

        try {
            const existingBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
            const bookIndex = existingBooks.findIndex(b => b.id === bookId);
            if (bookIndex > -1) {
                existingBooks[bookIndex] = updatedBook;
                localStorage.setItem('publishedBooks', JSON.stringify(existingBooks));
                router.push('/author/dashboard?edited=true');
            } else {
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not find the book to update.' });
            }
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred while saving.' });
            console.error(error);
        }
    };
    
    if (!book) {
        return <div>Loading...</div>; // Or a skeleton loader
    }


  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Edit Book</CardTitle>
          <CardDescription>
            Update the details for your book below. Cover image and book file cannot be changed after publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., The Adventures of a Coder" required />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="19.99" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="100" required />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={setCategory} value={category} required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                           {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                           <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input id="reorderPoint" type="number" value={reorderPoint} onChange={e => setReorderPoint(e.target.value)} placeholder="10" required />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="coverType">Cover Type</Label>
                <Select onValueChange={setCoverType} value={coverType} required>
                    <SelectTrigger id="coverType">
                        <SelectValue placeholder="Select a cover type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Paperback">Paperback</SelectItem>
                        <SelectItem value="Hardcover">Hardcover</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Book Description</Label>
              <Textarea id="description" rows={6} value={description} onChange={e => setDescription(e.target.value)} placeholder="A detailed summary of your book..." required />
            </div>

            <div className="flex justify-end">
                <Button type="submit" size="lg">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
