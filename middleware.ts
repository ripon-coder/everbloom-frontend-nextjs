// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // HTTP-only cookie
  const protectedPaths = ["/checkout", "/address-book"]; // ✅ added address-book
  const authPages = ["/login"];

  const baseUrl = req.nextUrl.origin; // e.g. https://localhost:3000

  // Redirect unauthenticated users trying to access protected routes
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  if (authPages.some(path => req.nextUrl.pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL("/", baseUrl)); // absolute URL required
  }

  return NextResponse.next();
}

export const config = {
  // ✅ add address-book to matcher
  matcher: ["/checkout/:path*", "/address-book/:path*", "/login"],
};
