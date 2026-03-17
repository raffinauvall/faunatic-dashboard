import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session");
  const pathname = req.nextUrl.pathname;

  // allow static files
  if (
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // belum login
  if (!session && pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // sudah login tapi buka signin
  if (session && pathname === "/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};