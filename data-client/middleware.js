import { NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/webflow_helper';

/**
 * A middleware function that retrieves an access token from Webflow and sets it as a cookie
 * or redirects to the login page if the access token is missing.
 * 
 * @param {import('next/dist/next-server/server/api-utils').NextApiRequest} request - The Next.js API request object.
 * @returns {import('next/dist/next-server/server/api-utils').NextApiResponse} - The Next.js API response object.
 */
export async function middleware(request) {
  if (request.method === 'OPTIONS') {
    // Preflight request. Reply successfully:
    return new NextResponse(null, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:1337',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (request.nextUrl.pathname === '/webflow_redirect' && request.nextUrl.searchParams.get('code')) {
    try {
      const code = request.nextUrl.searchParams.get('code');
      const token = await getAccessToken(code);
      if (token) {
        // If the access token is retrieved successfully, set it as a cookie and return the response
        const response = NextResponse.next();
        response.cookies.set('webflow_auth', token, {
          // httpOnly: true,
          // secure: true,
          // sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        response.cookies.set('authenticated', 'true');
        return response;
      }
    } catch (error) {
      // TODO: If access denied in query params then customer rejected install request,
      // Send this info to the webflow_redirect page and show an error message to the user.
      // Then redirect them to the login page.
      console.error(`Failed to get access token: ${error}`);
    }
  }

  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname !== '/login' && !request.cookies.get('webflow_auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Run this middleware on all pages except /login
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
