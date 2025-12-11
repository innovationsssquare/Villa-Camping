import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = ["/booking", "/account", "/checkout"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check for authentication token in cookies
  const token = request.cookies.get("token")

  // If token exists and user is trying to access /Signin, redirect to home (/)
  if (pathname === "/Signin" && token) {
    const url = request.nextUrl.clone()
    url.pathname = "/" // Redirect to home
    return NextResponse.redirect(url)
  }

  // If it's a protected route and no token exists, redirect to Signin
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/Signin"
    url.searchParams.set("returnUrl", pathname) // Store the original path to redirect back after login
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
