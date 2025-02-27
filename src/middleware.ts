import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AuthUser } from "./type/auth";

export function middleware(request: NextRequest) {
  const userFromCookie = request.cookies.get("user")?.value;
  const user = userFromCookie ? (JSON.parse(userFromCookie) as AuthUser) : null;
  if (!user) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  const hasTokenExpired = user && new Date().getTime() > user.expiresIn;
  if (hasTokenExpired) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/events/:path*", "/rules/:path*", "/webhooks/:path*"],
};
