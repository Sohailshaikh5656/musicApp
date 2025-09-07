// middleware.ts or .js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdminRoute = pathname.startsWith('/admin');

  // Allow public routes
  const publicRoutes = ['/user/signin', '/user/signup', '/user/login', '/admin/login', "/user/forgetPassword"];
  // Cookies.get() won't work in middleware as it's server-side
  // Instead, get the admin_token from request cookies
  if (publicRoutes.includes(pathname)) return NextResponse.next();

  if (isAdminRoute) {
    console.log("🛂 Admin check: ", token);
    console.log("🛂 is Admin Role: ", token?.role);
    if (!token || token.role !== "admin") {
      url.pathname = '/admin/login';
      url.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(url);
    }
  } else if (!publicRoutes.includes(pathname)) {
    console.log("🛂 User check: ", token);
    console.log("🛂 is User Role: ", token?.role);
    if (!token || token.role !== "user") {
      url.pathname = '/user/signin';
      url.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
};