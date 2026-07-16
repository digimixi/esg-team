import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const refCode = url.searchParams.get('ref');
  
  // If there's a ref parameter, store it in a cookie
  if (refCode) {
    // Create a response that continues the request chain
    const response = NextResponse.next();
    
    // Set the referral cookie valid for 30 days
    response.cookies.set('esg_partner_ref', refCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all paths except API routes, static assets, and Sanity Studio
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)',
  ],
}
