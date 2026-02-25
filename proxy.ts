// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // 1. Check if the user has the secure Laravel session cookie
    const hasSession = request.cookies.has('is_logged_in');
    
    // 2. Are they trying to access a protected route?
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

    // 3. Are they trying to access a guest route? 
    const isGuestRoute = request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register';

    // If they want the dashboard but have no session, kick them to login
    if (isProtectedRoute && !hasSession) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If they are already logged in and try to go to the login page, push them to the dashboard
    if (isGuestRoute && hasSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// 4. Configure which routes this bouncer should watch
export const config = {
    matcher: ['/dashboard/:path*', '/auth/login', '/auth/register'],
};