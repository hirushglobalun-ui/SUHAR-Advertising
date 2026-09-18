import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Cross-Site Request Forgery (CSRF) Mitigation on Admin Mutation APIs
  if (pathname.startsWith("/api/admin")) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost !== host) {
            return NextResponse.json(
              { error: "Forbidden: Cross-origin mutation request rejected." },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: "Forbidden: Malformed request origin." },
            { status: 403 }
          );
        }
      }
    }
  }

  // 2. Protect Admin UI Routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("suhar_admin_session")?.value;

    let isValidFormat = false;
    if (sessionCookie && sessionCookie.includes(".")) {
      try {
        const [payload] = sessionCookie.split(".");
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        if (decoded && decoded.expiresAt && Date.now() <= decoded.expiresAt) {
          isValidFormat = true;
        }
      } catch {
        isValidFormat = false;
      }
    }

    if (pathname === "/admin/login") {
      if (sessionCookie && isValidFormat) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!sessionCookie || !isValidFormat) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (sessionCookie && !isValidFormat) {
        response.cookies.delete("suhar_admin_session");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
