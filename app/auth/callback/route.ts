import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncPrismaUser } from "@/lib/supabase/sync-user";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") ?? "/dashboard";

  // Détermination de l'origine absolue (protection reverse-proxy Vercel)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = isLocalEnv
    ? url.origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : (process.env.NEXT_PUBLIC_APP_URL || url.origin || "https://super4c2.vercel.app");

  const supabase = await createSupabaseServerClient();
  let success = false;
  if (supabase) {
    try {
      let authUser = null;

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.user) {
          authUser = data.user;
        }
      } else if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (!error && data?.user) {
          authUser = data.user;
        }
      }

      if (authUser) {
        success = true;
        await syncPrismaUser(
          authUser.id,
          authUser.email ?? "",
          authUser.user_metadata?.displayName || authUser.email?.split("@")[0] || null
        );
      }
    } catch (err) {
      console.error("Erreur lors de la validation Supabase :", err);
    }
  }

  if (!success) {
    return NextResponse.redirect(new URL("/auth/login?error=link_expired", origin));
  }

  const safeNext =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/dashboard";
  return NextResponse.redirect(new URL(safeNext, origin));
}
