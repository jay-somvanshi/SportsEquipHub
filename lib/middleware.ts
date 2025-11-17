import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  const isAdminRoute = pathname.startsWith("/dashboard/admin") || pathname.startsWith("/register")
  const isUserRoute = pathname.startsWith("/dashboard/user")

  // Get session from cookie or check if we need to redirect
  if (isAdminRoute || isUserRoute) {
    // Let client-side handle auth validation
    // This middleware just ensures proper navigation
    const response = NextResponse.next()

    // Prevent caching of protected pages
    response.headers.set("Cache-Control", "no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/register/:path*"],
}
