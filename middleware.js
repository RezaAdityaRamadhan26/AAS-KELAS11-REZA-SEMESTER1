import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  const PUBLIC_PATHS = ["/", "/login", "/register"];

  // Allow Next.js internals and static files
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth");
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (isPublicAsset || isPublicPath) {
    return NextResponse.next();
  }

  // Check token (JWT strategy configured in NextAuth)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protected: /admin/* and /student/*
  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/student");

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // Optionally include redirect back after login
    url.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/api/:path*", // protect non-auth APIs if needed; auth endpoints are allowed above
  ],
};
