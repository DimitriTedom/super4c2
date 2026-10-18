import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // 0. Redirection automatique des codes Supabase Auth arrivant sur la racine vers le callback
  if (
    (request.nextUrl.searchParams.has("code") || request.nextUrl.searchParams.has("token_hash")) &&
    pathname !== "/auth/callback"
  ) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

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

  // 2. Tarifs & Checkout -> Redirection vers l'accès 100% gratuit
  if (pathname === "/tarifs" || pathname.startsWith("/checkout")) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = "/dashboard";
    targetUrl.search = "";
    return NextResponse.redirect(targetUrl);
  }

  // 3. Verrouillage du Système : Simulateurs & Outils Candidats Protégés
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/examens") ||
    pathname.startsWith("/carnet-erreurs") ||
    pathname.startsWith("/sujets-recents") ||
    pathname.startsWith("/communaute");

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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|worklets|audio|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*)",
  ],
};
