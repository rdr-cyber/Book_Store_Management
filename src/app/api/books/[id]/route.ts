import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/middleware/auth';
import { getBookById, updateBook } from '@/lib/database';

// GET single book (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await getBookById(params.id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error: any) {
    console.error('Get book error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT update book (authors only, can only update their own books)
export const PUT = withRole(['author'])(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
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

    // Get existing book to verify ownership
    const existingBook = await getBookById(params.id);
    
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (existingBook.authorId !== user.uid) {
      return NextResponse.json(
        { error: 'You can only update your own books' },
        { status: 403 }
      );
    }

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

    // Update book data
    const updateData = {
      title: title.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl || existingBook.imageUrl,
      description: description.trim(),
      category,
      coverType,
      stock: parseInt(stock),
      reorderPoint: parseInt(reorderPoint),
      bookFileUrl: bookFileUrl || existingBook.bookFileUrl,
    };

    await updateBook(params.id, updateData);

    // Get updated book
    const updatedBook = await getBookById(params.id);

    return NextResponse.json({
      message: 'Book updated successfully',
      book: updatedBook
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update book error:', error);
    return NextResponse.json(
      { error: 'Failed to update book. Please try again.' },
      { status: 500 }
    );
  }
});