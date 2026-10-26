import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (isAuthPage && request.cookies.has("accessToken")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};