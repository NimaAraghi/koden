import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users trying to access protected routes
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = session.user.role;

  // Restrict admin routes
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/new"],
};
