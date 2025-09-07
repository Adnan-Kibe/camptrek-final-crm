import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value
  const refreshToken = req.cookies.get("refresh_token")?.value

  if (!accessToken && !refreshToken) {
    // redirect to login if not authenticated
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // continue if token exists
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!sign-in|sign-up|_next/static|_next/image|favicon.ico).*)",
  ],
}


