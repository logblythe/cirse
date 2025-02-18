import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // const userFromCookie = request.cookies.get("user")?.value;
  // const user = userFromCookie ? (JSON.parse(userFromCookie) as AuthUser) : null;
  // if (!user || !(user as AuthUser).email) {
  //   return NextResponse.redirect(
  //     new URL(
  //       `/login?redirect=${request.nextUrl.pathname}?${request.nextUrl.search}`,
  //       request.url
  //     )
  //   );
  // } else {
  //   return NextResponse.next();
  // }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/events/:path*", "/rules/:path*", "/webhooks/:path*"],
};
