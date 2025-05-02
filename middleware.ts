import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define which paths are public (don't require authentication)
  const publicRoutes = ["/", "/signin", "/signup", "/api/auth/register"];
  const isPublicPath = publicRoutes.includes(path) || 
                      path.startsWith('/api/auth') ||
                      path.includes('/about-the-app');

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if route is public or user is authenticated
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Authentication routes shouldn't be accessible when logged in
  if ((path === "/signin" || path === "/signup") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Limit the middleware to specific paths
export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/api/:path*",
    "/schedule-trainer/:path*",
    "/my-students/:path*",
    "/assigned-task/:path*",
    "/about-the-app/:path*",
    "/reports/:path*",
    "/add-user/:path*",
    "/exercise/:path*",
    "/payment/:path*",
    "/fees/:path*",
    "/chat/:path*",
    "/settings/:path*",
    "/diet/:path*",
    "/clients/:path*",
    "/feedback/:path*",
    "/trainer/:path*",
    "/attendance/:path*",
  ],
};
