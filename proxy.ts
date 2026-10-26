import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const isPropertyDetailsPage = request.nextUrl.pathname.startsWith(
    "/properties/",
  );
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (isPropertyDetailsPage && !hasAccessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && hasAccessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/properties/:path+"],
};
