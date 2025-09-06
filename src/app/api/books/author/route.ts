import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/middleware/auth';
import { getBooksByAuthor } from '@/lib/database';

// GET books by author (authors only)
export const GET = withRole(['author'])(async (request: NextRequest, user) => {
  try {
    const books = await getBooksByAuthor(user.uid);
    return NextResponse.json(books, { status: 200 });
  } catch (error: any) {
    console.error('Get author books error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch your books' },
      { status: 500 }
    );
  }
});