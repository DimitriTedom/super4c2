import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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
        await prisma.user.upsert({
          where: { id: authUser.id },
          update: { email: authUser.email ?? "" },
          create: {
            id: authUser.id,
            email: authUser.email ?? "",
            profile: {
              create: {
                displayName: authUser.user_metadata?.displayName || authUser.email?.split("@")[0] || "Candidat",
                targetNclc: 7,
              },
            },
          },
        });
      }
    } catch (err) {
      console.error("Erreur lors de la validation Supabase :", err);
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}
