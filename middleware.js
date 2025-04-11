import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes and their allowed roles
  const protectedRoutes = {
    '/admin': 'Admin',
    '/client': 'Client'
  };

  // Check if the current path is a protected route
  const requiredRole = protectedRoutes[path];
  if (requiredRole) {
    // Get the user role from localStorage
    const userRole = request.cookies.get('userRole')?.value;

    // If no role is found, redirect to login
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user role doesn't match required role, redirect to appropriate dashboard
    if (userRole !== requiredRole) {
      return NextResponse.redirect(new URL(`/${userRole.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/client/:path*']
}; 