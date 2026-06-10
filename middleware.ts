import { NextResponse, type NextRequest } from 'next/server';
import { ROLE_COOKIE } from '@/lib/auth';
import { roleForPath } from '@/lib/auth';

// Role-based route guard. Mirrors the Keycloak/next-auth middleware pattern in
// the spec, but driven by a demo role cookie set at login (static-data build).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const requiredRole = roleForPath(pathname);

  if (!requiredRole) return NextResponse.next();

  // Not signed in → send to login with a return path.
  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Signed in but wrong portal → unauthorized.
  if (role !== requiredRole) {
    const url = request.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
