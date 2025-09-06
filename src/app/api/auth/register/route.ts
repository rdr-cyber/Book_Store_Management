import { NextRequest, NextResponse } from 'next/server';
import { registerUser, validateEmail, validatePassword } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['reader', 'author'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either reader or author' },
        { status: 400 }
      );
    }

    // Register user
    const user = await registerUser(email, password, firstName, lastName, role as UserRole);

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}