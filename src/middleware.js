import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/auth/login", "/auth/register"];

  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isHome = pathname === "/";

  // 1. If not authenticated & route is protected → redirect to login
  if (!isAuth && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 2. If authenticated and they try to access "/" → redirect to dashboard
  if (isHome && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
