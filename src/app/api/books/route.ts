import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/middleware/auth';
import { createBook, getAllBooks } from '@/lib/database';
import { Book } from '@/lib/types';

// GET all books (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books, { status: 200 });
  } catch (error: any) {
    console.error('Get books error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST create new book (authors only)
export const POST = withRole(['author'])(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const {
      title,
      price,
      imageUrl,
      description,
      category,
      coverType,
      stock,
      reorderPoint,
      bookFileUrl
    } = body;

    // Validate required fields
    if (!title || !price || !description || !category || !coverType || stock === undefined || reorderPoint === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price and stock
    if (price <= 0 || stock < 0 || reorderPoint < 0) {
      return NextResponse.json(
        { error: 'Invalid price, stock, or reorder point values' },
        { status: 400 }
      );
    }

    // Create book data
    const bookData: Omit<Book, 'id'> = {
      title: title.trim(),
      author: `${user.firstName} ${user.lastName}`,
      authorId: user.uid,
      price: parseFloat(price),
      imageUrl: imageUrl || 'https://placehold.co/400x600/e2e8f0/64748b?text=Book+Cover',
      description: description.trim(),
      category,
      coverType,
      stock: parseInt(stock),
      reorderPoint: parseInt(reorderPoint),
      bookFileUrl,
      publishedAt: new Date(),
      sales: 0,
      revenue: 0,
      averageRating: 0,
      totalReviews: 0,
    };

    const bookId = await createBook(bookData);

    return NextResponse.json({
      message: 'Book published successfully',
      bookId,
      book: { id: bookId, ...bookData }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create book error:', error);
    return NextResponse.json(
      { error: 'Failed to publish book. Please try again.' },
      { status: 500 }
    );
  }
});