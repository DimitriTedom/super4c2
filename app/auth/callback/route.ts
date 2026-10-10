import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.user) {
          const user = data.user;
          await prisma.user.upsert({
            where: { id: user.id },
            update: { email: user.email ?? "" },
            create: {
              id: user.id,
              email: user.email ?? "",
              profile: {
                create: {
                  displayName: user.user_metadata?.displayName || user.email?.split("@")[0] || "Candidat",
                  targetNclc: 7,
                },
              },
            },
          });
        }
      } catch (err) {
        console.error("Erreur lors de l'échange de code Supabase :", err);
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
