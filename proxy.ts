import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes (account/support and account handle their own auth state)
const protectedRoutes = ["/booking", "/checkout"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check for authentication token in cookies
  const token = request.cookies.get("token")

  // If user is trying to access /Signin, redirect to home (with in-place auth modal if unauthenticated)
  if (pathname === "/Signin") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    if (!token) {
      url.searchParams.set("auth", "required")
      const returnUrl = request.nextUrl.searchParams.get("returnUrl")
      if (returnUrl) {
        url.searchParams.set("returnUrl", returnUrl)
      }
    }
    return NextResponse.redirect(url)
  }

  // If it's a protected route and no token exists, redirect to referer if available, or home with auth=required & returnUrl
  if (isProtectedRoute && !token) {
    const referer = request.headers.get("referer")
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        // If referer is from the same origin and not another protected route
        if (
          refererUrl.origin === request.nextUrl.origin &&
          !protectedRoutes.some((route) => refererUrl.pathname.startsWith(route))
        ) {
          refererUrl.searchParams.set("auth", "required")
          refererUrl.searchParams.set("returnUrl", pathname)
          return NextResponse.redirect(refererUrl)
        }
      } catch {
        // ignore url parsing error
      }
    }

    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("auth", "required")
    url.searchParams.set("returnUrl", pathname)
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
