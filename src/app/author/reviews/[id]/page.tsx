
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageSquare, CornerDownRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Review, Book } from "@/lib/types";

export default function BookReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    setHasMounted(true);
    if (bookId) {
      try {
        const allPublishedBooks: Book[] = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
        const foundBook = allPublishedBooks.find(b => b.id === bookId);
        setBook(foundBook || null);

        const allReviews: Review[] = JSON.parse(localStorage.getItem('bookReviews') || '[]');
        const bookReviews = allReviews.filter(r => r.bookId === bookId);
        setReviews(bookReviews);

      } catch (error) {
        console.error("Error loading review data:", error);
        setBook(null);
        setReviews([]);
      }
    }
  }, [bookId]);

  const handleReplySubmit = (reviewId: string) => {
    if (!replyContent) {
      toast({ variant: 'destructive', title: 'Error', description: 'Reply content cannot be empty.' });
      return;
    }
    try {
        const allReviews: Review[] = JSON.parse(localStorage.getItem('bookReviews') || '[]');
        const reviewIndex = allReviews.findIndex(r => r.id === reviewId);
        if (reviewIndex > -1) {
            allReviews[reviewIndex].authorReply = replyContent;
            localStorage.setItem('bookReviews', JSON.stringify(allReviews));

            // Update local state to show the change immediately
            setReviews(prev => prev.map(r => r.id === reviewId ? {...r, authorReply: replyContent } : r));
            setReplyingTo(null);
            setReplyContent("");
            toast({ title: "Reply Sent!", description: "Your reply has been posted." });
        }
    } catch (error) {
        console.error("Error saving reply:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save reply.' });
    }
  }


  if (!hasMounted) {
    return <div>Loading...</div>;
  }
  
  if (!book) {
      return (
          <div className="container mx-auto px-4 py-12 text-center">
              <h1 className="text-2xl font-bold">Book not found.</h1>
                <Button asChild className="mt-6">
                    <Link href="/author/dashboard">Go Back to Dashboard</Link>
                </Button>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
            <Button variant="outline" asChild className="mb-4">
                <Link href="/author/dashboard">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
            <h1 className="text-4xl font-bold font-headline">Reader Reviews</h1>
            <p className="text-muted-foreground mt-2 text-xl">for &quot;{book.title}&quot;</p>
        </div>

        {reviews.length > 0 ? (
            <div className="space-y-6">
                {reviews.map(review => (
                    <Card key={review.id}>
                        <CardHeader className="pb-2 flex-row justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">{review.username}</CardTitle>
                                <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(10)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{review.comment || <i>No comment provided.</i>}</p>
                            
                            {review.authorReply ? (
                                <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <CornerDownRight className="w-5 h-5 text-muted-foreground mt-1"/>
                                        <div>
                                            <p className="font-semibold text-sm">Your Reply</p>
                                            <p className="text-sm text-muted-foreground">{review.authorReply}</p>
                                        </div>
                                    </div>
                                     {review.readerFollowUp && (
                                        <div className="mt-4 p-4 bg-card rounded-lg ml-8">
                                            <div className="flex items-start gap-3">
                                                <CornerDownRight className="w-5 h-5 text-muted-foreground mt-1"/>
                                                <div>
                                                    <p className="font-semibold text-sm">{review.username}'s Follow-up</p>
                                                    <p className="text-sm text-muted-foreground">{review.readerFollowUp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4">
                                   {replyingTo === review.id ? (
                                    <div className="space-y-2">
                                        <Textarea 
                                            placeholder="Write your reply..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            rows={3}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                            <Button size="sm" onClick={() => handleReplySubmit(review.id)}>Submit Reply</Button>
                                        </div>
                                    </div>
                                   ) : (
                                     <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                                        Reply
                                    </Button>
                                   )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                <MessageSquare className="w-16 h-16 text-muted-foreground" />
                <p className="mt-4 text-xl font-headline text-muted-foreground">This book has no reviews yet.</p>
            </div>
        )}
    </div>
  );
}
