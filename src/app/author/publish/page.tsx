

"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import type { Book, User } from "@/lib/types";


export default function PublishBookPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [reorderPoint, setReorderPoint] = useState('');
    const [category, setCategory] = useState('');
    const [coverType, setCoverType] = useState('');
    const [description, setDescription] = useState('');
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const coverImageRef = useRef<HTMLInputElement>(null);
    const bookFileRef = useRef<HTMLInputElement>(null);

    const categories = bookCategories.filter(c => c !== "All");

    useEffect(() => {
        const userString = localStorage.getItem('loggedInUser');
        if (!userString) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to publish a book.' });
            router.push('/login?role=author');
            return;
        }
        const loggedInUser: User = JSON.parse(userString);
        if (loggedInUser.role !== 'author') {
             toast({ variant: 'destructive', title: 'Access Denied', description: 'Only authors can publish books.' });
             router.push('/');
             return;
        }
        setUser(loggedInUser);
    }, [router, toast]);

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
             toast({ variant: 'destructive', title: 'Error', description: 'User session not found.' });
             return;
        }

        if (!title || !price || !stock || !reorderPoint || !category || !coverType || !description) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        
        let coverImageUrl = 'https://placehold.co/400x600.png';
        if (coverImageFile) {
            try {
                coverImageUrl = await fileToDataUrl(coverImageFile);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error processing cover image', description: 'There was an issue reading the cover image file.'});
                return;
            }
        }

        let bookFileUrl: string | undefined = undefined;
        if (bookFile) {
            try {
                bookFileUrl = await fileToDataUrl(bookFile);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error processing book file', description: 'There was an issue reading the book file.'});
                return;
            }
        }
       
        const newBook: Book = {
            id: `book-${Date.now()}`,
            title,
            author: `${user.firstName} ${user.lastName}`,
            authorId: user.id,
            price: parseFloat(price),
            stock: parseInt(stock),
            reorderPoint: parseInt(reorderPoint),
            category: category as Book['category'],
            coverType: coverType as Book['coverType'],
            description,
            imageUrl: coverImageUrl,
            bookFileUrl: bookFileUrl,
        };

        try {
            const existingBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
            localStorage.setItem('publishedBooks', JSON.stringify([...existingBooks, newBook]));
            router.push('/author/dashboard?published=true');
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                 toast({ variant: 'destructive', title: 'Storage Error', description: 'The combined file sizes are too large. Please ensure the total size of the cover image and book file is under 10MB.' });
            } else {
                 toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred while saving.' });
            }
            console.error(error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Publish a New Book</CardTitle>
          <CardDescription>
            Fill in the details below to add your book to the ShelfWise marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
                This is a demo application. Uploaded files are stored in your browser's local storage. Please ensure the total size of the cover and book file is under 10MB to avoid errors.
            </AlertDescription>
          </Alert>
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

            <div className="space-y-2">
                <Label htmlFor="cover-image">Book Cover Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Drag & drop your cover image here, or</p>
                    <Button type="button" variant="outline" className="mt-2" onClick={() => coverImageRef.current?.click()}>Browse Files</Button>
                    <Input id="cover-image" type="file" className="sr-only" ref={coverImageRef} onChange={(e) => handleFileSelect(e, setCoverImageFile)} accept="image/*" />
                    {coverImageFile && (
                        <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center">
                            <Paperclip className="h-4 w-4 mr-2" />
                            <span>{coverImageFile.name}</span>
                        </div>
                    )}
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="book-file">Book File (PDF, EPUB)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Drag & drop your book file here, or</p>
                    <Button type="button" variant="outline" className="mt-2" onClick={() => bookFileRef.current?.click()}>Browse Files</Button>
                     <Input id="book-file" type="file" className="sr-only" ref={bookFileRef} onChange={(e) => handleFileSelect(e, setBookFile)} accept=".pdf,.epub" />
                     {bookFile && (
                        <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center">
                            <Paperclip className="h-4 w-4 mr-2" />
                            <span>{bookFile.name}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" size="lg">Publish Book</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}