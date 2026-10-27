import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);

  const { pathname, search } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const isDashboard = pathname.startsWith("/dashboard");
  
  const isPropertyDetails = pathname.startsWith("/properties/");

  if (isDashboard && !hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && hasAccessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPropertyDetails && !hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/properties/:path*"],
};
