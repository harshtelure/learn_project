import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware - Checking path:', pathname);
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  console.log('Middleware - Token present:', !!token);
  
  // Get user data from cookies
  const userData = request.cookies.get('user')?.value;
  let user = null;
  
  try {
    user = userData ? JSON.parse(userData) : null;
    console.log('Middleware - User data:', {
      hasUser: !!user,
      role: user?.role,
      pathname
    });
  } catch (error) {
    console.error('Middleware - Error parsing user data:', error);
  }

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register'];
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    console.log('Middleware - Public path detected');
    // Allow access to public pages without checking auth
    return NextResponse.next();
  }

  // Protected paths
  if (pathname.startsWith('/dashboard/')) {
    console.log('Middleware - Protected path detected');
    // If no token or user data, redirect to login
    if (!token || !user) {
      console.log('Middleware - No auth data, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Extract role from pathname
    const pathRole = pathname.split('/')[2]?.toLowerCase();
    const userRole = user.role?.toLowerCase();

    console.log('Middleware - Role check:', {
      pathRole,
      userRole,
      matches: pathRole === userRole
    });

    // Check if user has access to this dashboard
    if (pathRole !== userRole) {
      console.log('Middleware - Role mismatch, redirecting to correct dashboard');
      // Redirect to user's appropriate dashboard
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
}; 