import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // 1. Back-Office & Super Admin Gate
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("super4c2_admin_token")?.value;
    if (!adminToken) {
      const adminLoginUrl = request.nextUrl.clone();
      adminLoginUrl.pathname = "/admin/login";
      adminLoginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
    return response;
  }

  // 2. Candidate Dashboard & Account Protection
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/account");

  if (!isProtected) return response;

  // NOTE: real auth gating happens in pages too (server-side redirect).
  // Middleware keeps sessions fresh and blocks obvious unauthenticated navigation.
  const hasSbCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSbCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
