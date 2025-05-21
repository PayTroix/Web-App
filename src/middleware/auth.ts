import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { web3AuthService } from '@/services/api';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/register', request.url));
    }

    try {
        const userData = await web3AuthService.getUser(token);
        const path = request.nextUrl.pathname;

        // Check organization routes
        if (path.startsWith('/dashboard')) {
            if (userData.user_type !== 'organization' && userData.user_type !== 'both') {
                return NextResponse.redirect(new URL('/roles', request.url));
            }
        }

        // Check recipient routes
        if (path.startsWith('/recipient')) {
            if (userData.user_type !== 'recipient' && userData.user_type !== 'both') {
                return NextResponse.redirect(new URL('/roles', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error validating user access:', error);
        return NextResponse.redirect(new URL('/register', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/recipient/:path*'],
};