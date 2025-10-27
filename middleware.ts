// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // HTTP-only cookie
  const protectedPaths = ["/checkout"];
  const authPages = ["/login"];

  const baseUrl = req.nextUrl.origin; // get the absolute origin (https://localhost:3000)

  // Redirect not-logged-in users from protected pages
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (authPages.some(path => req.nextUrl.pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL("/", baseUrl)); // absolute URL required
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/login"],
};
