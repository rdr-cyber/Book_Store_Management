import { NextRequest, NextResponse } from 'next/server';
import { verifyJWTToken } from '@/lib/auth';
import { AuthUser } from '@/lib/types';

export function withAuth(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      // Get token from cookie
      const token = req.cookies.get('auth-token')?.value;

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Verify token
      const user = verifyJWTToken(token);

      // Call the handler with the authenticated user
      return await handler(req, user);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}

export function withRole(roles: string[]) {
  return function(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
    return withAuth(async (req: NextRequest, user: AuthUser) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return await handler(req, user);
    });
  };
}

export function authMiddleware(req: NextRequest, user: AuthUser) {
  // Add user to request headers for further processing
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', user.uid);
  requestHeaders.set('x-user-role', user.role);
  requestHeaders.set('x-user-email', user.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}