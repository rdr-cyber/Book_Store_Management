import { NextRequest, NextResponse } from 'next/server';
import { signOutUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Sign out user from Firebase
    await signOutUser();

    // Clear the auth cookie
    const response = NextResponse.json({
      message: 'Logout successful'
    }, { status: 200 });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}