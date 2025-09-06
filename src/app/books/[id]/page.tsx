

"use client";

import Image from "next/image";
import { useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Truck, ShieldCheck, Plus, Minus, BookOpen, FileWarning, MessageSquare, CornerDownRight, UserPlus, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import BookCard from "@/components/BookCard";
import { useState, useEffect, useMemo, FormEvent, Suspense } from "react";
import type { Book, User, Review, Gift as GiftType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Component that uses searchParams
function BookDetailContent() {
  const searchParams = useSearchParams();
  const fromLibrary = searchParams.get('fromLibrary') === 'true';
  return <BookDetailComponent fromLibrary={fromLibrary} />;
}

// Main component logic
function BookDetailComponent({ fromLibrary }: { fromLibrary: boolean }) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [reviewFilter, setReviewFilter] = useState<'all' | 'my'>('all');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const publishedBooks = JSON.parse(localStorage.getItem('publishedBooks') || '[]');
    setAllBooks(publishedBooks);
    
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const parsedUser: User = JSON.parse(loggedInUser);
        setUser(parsedUser);

        const userLibrary = JSON.parse(localStorage.getItem('userLibrary') || '{}');
        const userBookIds = userLibrary[parsedUser.id] || [];
        setHasPurchased(userBookIds.includes(id));
    }
  }, [id]);

  useEffect(() => {
    if (hasMounted) {
      const foundBook = allBooks.find((b) => b.id === id);
      if (foundBook) {
        setBook(foundBook);
        const foundRelated = allBooks.filter(b => b.category === foundBook.category && b.id !== foundBook.id).slice(0, 4);
        setRelatedBooks(foundRelated);

        // Load reviews
        const allReviews: Review[] = JSON.parse(localStorage.getItem('bookReviews') || '[]');
        const bookReviews = allReviews.filter(r => r.bookId === id);
        setReviews(bookReviews);
        
        if (user) {
            setHasAlreadyReviewed(bookReviews.some(r => r.userId === user.id));

            // Check follow status
            const userFollows = JSON.parse(localStorage.getItem('userFollows') || '{}');
            const followedAuthors = userFollows[user.id] || [];
            setIsFollowing(followedAuthors.includes(foundBook.authorId));
        }

      } else if (allBooks.length > 0) {
        // notFound();
      }
    }
  }, [id, hasMounted, allBooks, user]);

  const handleAddToCart = () => {
    if (!book) return;
    if (hasPurchased) {
        toast({ variant: 'destructive', title: "Already Owned", description: "You already own this book."});
        return;
    }
    const cartString = localStorage.getItem('cart') || '[]';
    const cart: { id: string; quantity: number }[] = JSON.parse(cartString);
    const existingItem = cart.find((item: { id: string }) => item.id === book.id);

    if (existingItem) {
      toast({
        variant: 'destructive',
        title: "Already in Cart",
        description: `You have already added "${book.title}" to your cart.`,
      });
    } else {
      cart.push({ id: book.id, quantity });
      localStorage.setItem('cart', JSON.stringify(cart));
      toast({
        title: "Added to Cart!",
        description: `${quantity} x ${book.title} has been added.`,
      });
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleBuyNow = () => {
      if (!book) return;
       if (hasPurchased) {
        toast({ variant: 'destructive', title: "Already Owned", description: "You already own this book."});
        return;
    }
      const buyNowItem = { id: book.id, quantity: quantity };
      localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
      router.push('/checkout');
  }

  const updateQuantity = (amount: number) => {
      if (!book) return;
      setQuantity(prev => {
          const newQuantity = prev + amount;
          if (newQuantity < 1) return 1;
          if (newQuantity > book.stock) return book.stock;
          return newQuantity;
      })
  }

  const handleReviewSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (!user || !book) return;
      if (newRating === 0) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please select a star rating.' });
          return;
      }
      
      const newReview: Review = {
          id: `review-${Date.now()}`,
          bookId: book.id,
          userId: user.id,
          username: `${user.firstName} ${user.lastName}`,
          rating: newRating,
          comment: newComment,
          createdAt: new Date().toISOString()
      };
      
      const allReviews = JSON.parse(localStorage.getItem('bookReviews') || '[]');
      allReviews.push(newReview);
      localStorage.setItem('bookReviews', JSON.stringify(allReviews));

      setReviews(prev => [...prev, newReview]);
      setHasAlreadyReviewed(true);
      setNewRating(0);
      setNewComment("");
      toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });
  }

    const handleFollowUpSubmit = (reviewId: string) => {
    if (!replyContent) {
      toast({ variant: 'destructive', title: 'Error', description: 'Reply content cannot be empty.' });
      return;
    }
    try {
        const allReviews: Review[] = JSON.parse(localStorage.getItem('bookReviews') || '[]');
        const reviewIndex = allReviews.findIndex(r => r.id === reviewId);
        if (reviewIndex > -1) {
            allReviews[reviewIndex].readerFollowUp = replyContent;
            localStorage.setItem('bookReviews', JSON.stringify(allReviews));

            // Update local state to show the change immediately
            setReviews(prev => prev.map(r => r.id === reviewId ? {...r, readerFollowUp: replyContent } : r));
            setReplyingTo(null);
            setReplyContent("");
            toast({ title: "Reply Sent!", description: "Your reply has been posted." });
        }
    } catch (error) {
        console.error("Error saving reply:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save reply.' });
    }
  }
  
  const handleFollow = () => {
    if (!user || !book) return;
    try {
        const userFollows = JSON.parse(localStorage.getItem('userFollows') || '{}');
        let followedAuthors: string[] = userFollows[user.id] || [];
        
        if (isFollowing) {
            // Unfollow
            followedAuthors = followedAuthors.filter(authorId => authorId !== book.authorId);
            toast({ title: "Unfollowed", description: `You are no longer following ${book.author}.` });
        } else {
            // Follow
            followedAuthors.push(book.authorId);
            toast({ title: "Followed!", description: `You are now following ${book.author}.` });
        }

        userFollows[user.id] = [...new Set(followedAuthors)]; // Ensure no duplicates
        localStorage.setItem('userFollows', JSON.stringify(userFollows));
        setIsFollowing(!isFollowing);

    } catch (error) {
        console.error("Error handling follow action:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update your follow status.' });
    }
  };


  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);
  
  const filteredReviews = useMemo(() => {
      if (reviewFilter === 'my' && user) {
          return reviews.filter(review => review.userId === user.id);
      }
      return reviews;
  }, [reviews, reviewFilter, user]);
  
  if (!hasMounted || !book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex justify-center items-start">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            width={500}
            height={750}
            className="rounded-lg shadow-xl aspect-[2/3] object-cover"
            data-ai-hint="book cover"
          />
        </div>
        <div>
          <Badge variant="secondary">{book.category}</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mt-2">
            {book.title}
          </h1>
          <p className="text-xl text-muted-foreground mt-2">by {book.author}</p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(10)].map((_, i) => (
                 <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
          </div>

          <Separator className="my-6" />

          <p className="text-lg leading-relaxed">{book.description}</p>

          <div className="mt-6">
            <p className="text-3xl font-bold text-primary">
              ${book.price.toFixed(2)}
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                book.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
              {fromLibrary || hasPurchased ? (
                 <>
                    {book.bookFileUrl ? (
                        <Button size="lg" className="w-full" asChild>
                            <a href={book.bookFileUrl} download={`${book.title}.pdf`}>
                                <BookOpen className="mr-2"/>
                                Read Now
                            </a>
                        </Button>
                    ) : (
                        <Button size="lg" className="w-full" disabled>
                            <FileWarning className="mr-2"/>
                            Book File Not Available
                        </Button>
                    )}
                     <Button variant="secondary" className="w-full" onClick={() => router.push(`/gift/${book.id}`)} disabled={!book.bookFileUrl}>
                        <Gift className="mr-2"/>
                        Gift this Book
                    </Button>
                </>
              ) : (
                <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Quantity</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(-1)} disabled={book.stock === 0}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-5 text-center">{quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(1)} disabled={book.stock === 0}>
                            <Plus className="h-4 w-4" />
                        </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleAddToCart} disabled={book.stock === 0}>
                                Add to Cart
                            </Button>
                            <Button onClick={handleBuyNow} disabled={book.stock === 0}>
                                Buy Now
                            </Button>
                        </div>
                    </div>
                    </CardContent>
                </Card>
              )}

            {user && user.role === 'reader' && user.id !== book.authorId && (
                <Button variant="outline" className="w-full mt-2" onClick={handleFollow}>
                    <UserPlus className="mr-2" />
                    {isFollowing ? 'Following Author' : 'Follow Author'}
                </Button>
            )}
          </div>


          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                30-day return policy
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <Separator className="my-12" />
      <div className="grid md:grid-cols-2 gap-12">
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold font-headline">Customer Reviews</h2>
                {user && hasPurchased && (
                    <div className="flex gap-2">
                        <Button variant={reviewFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setReviewFilter('all')}>All Reviews</Button>
                        <Button variant={reviewFilter === 'my' ? 'default' : 'outline'} size="sm" onClick={() => setReviewFilter('my')}>My Reviews</Button>
                    </div>
                )}
            </div>

            {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                    {filteredReviews.map(review => (
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
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                                {review.authorReply && (
                                    <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <CornerDownRight className="w-5 h-5 text-muted-foreground mt-1"/>
                                            <div>
                                                <p className="font-semibold text-sm">Reply from the Author</p>
                                                <p className="text-sm text-muted-foreground">{review.authorReply}</p>
                                            </div>
                                        </div>
                                         {review.readerFollowUp ? (
                                            <div className="mt-4 p-4 bg-card rounded-lg ml-8">
                                                <div className="flex items-start gap-3">
                                                    <CornerDownRight className="w-5 h-5 text-muted-foreground mt-1"/>
                                                    <div>
                                                        <p className="font-semibold text-sm">{review.username}'s Follow-up</p>
                                                        <p className="text-sm text-muted-foreground">{review.readerFollowUp}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                             user && user.id === review.userId && (
                                                <div className="mt-4 ml-8">
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
                                                                <Button size="sm" onClick={() => handleFollowUpSubmit(review.id)}>Submit Follow-up</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                                                            Reply to Author
                                                        </Button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                        {reviewFilter === 'my' ? "You haven't reviewed this book yet." : "No reviews yet. Be the first to share your thoughts!"}
                    </p>
                </div>
            )}
        </div>
        <div>
             {user && hasPurchased && !hasAlreadyReviewed && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Leave a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <Label>Your Rating</Label>
                                <div className="flex items-center gap-2 mt-2">
                                {[...Array(10)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-6 h-6 cursor-pointer ${i < newRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                        onClick={() => setNewRating(i + 1)}
                                    />
                                ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="comment">Your Comment (optional)</Label>
                                <Textarea id="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={4} placeholder="Tell us what you thought..."/>
                            </div>
                            <Button type="submit" className="w-full">Submit Review</Button>
                        </form>
                    </CardContent>
                </Card>
            )}
             {user && hasPurchased && hasAlreadyReviewed && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Thank You!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You have already submitted a review for this book.</p>
                    </CardContent>
                 </Card>
            )}
        </div>
      </div>


      {relatedBooks.length > 0 && (
         <div className="mt-20">
            <h2 className="text-3xl font-bold font-headline mb-6">Related Books</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {relatedBooks.map((relatedBook) => (
                    <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
            </div>
         </div>
      )}

    </div>
  );
}

// Main page component with Suspense
export default function BookDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    }>
      <BookDetailContent />
    </Suspense>
  );
}