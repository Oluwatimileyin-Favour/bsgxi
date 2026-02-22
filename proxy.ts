import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {

  const userIsLoggedIn: boolean = request.cookies.has('next-auth.session-token');
  const userIsAGuestUser: boolean = request.cookies.has('Guest');


  if(!request.nextUrl.pathname.startsWith('/login') && !userIsLoggedIn && !userIsAGuestUser) {
    return NextResponse.redirect(new URL('/login', request.url))
  } 

  if(request.nextUrl.pathname.startsWith('/login') && (userIsLoggedIn || userIsAGuestUser)) {
    return NextResponse.redirect(new URL('/', request.url))
  } 
}
 
export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/stats/:path*'],
}