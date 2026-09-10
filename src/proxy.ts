import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route guard ────────────────────────────────────────────────────────────
// Next.js 16 renamed `middleware` to `proxy`. This is a FIRST-PASS filter only:
// it redirects visitors with no session cookie away from attendance pages so
// they see the login screen instead of an empty dashboard.
//
// It is deliberately NOT the security boundary — it only checks that a cookie
// is present, not that it is valid. Every API route independently verifies the
// signed session via getCurrentEmployee(), which is what actually protects data.
// (Next's own docs warn against relying on proxy alone for authorization.)

const COOKIE_NAME = "a7_emp";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(COOKIE_NAME);

  // Attendance pages (but not the login page itself) require a session cookie.
  if (pathname.startsWith("/attendance") && pathname !== "/attendance/login") {
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/attendance/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/attendance/:path*"],
};
