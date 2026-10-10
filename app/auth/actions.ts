"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function signInDemoCandidateAction(next?: string) {
  const cookieStore = await cookies();
  cookieStore.set("sb-super4c2-demo-candidate", DEMO_USER_ID, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: { email: "candidat.demo@super4c2.com" },
    create: {
      id: DEMO_USER_ID,
      email: "candidat.demo@super4c2.com",
      profile: {
        create: {
          displayName: "Dimitri (Candidat Test)",
          targetNclc: 7,
        },
      },
    },
  });

  return { ok: true as const, redirectTo: next || "/dashboard" };
}

export async function signInAction(input: z.infer<typeof signInSchema> & { next?: string }) {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Identifiants invalides." };
  }

  // Fast demo credentials check
  if (
    parsed.data.email === "candidat@canada.ca" ||
    parsed.data.email === "candidat.demo@super4c2.com"
  ) {
    return signInDemoCandidateAction(input.next);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, error: "Configuration Supabase manquante." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    if (data?.user) {
      const user = data.user;
      // Synchronisation de sécurité avec la base PostgreSQL
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email: user.email ?? parsed.data.email },
        create: {
          id: user.id,
          email: user.email ?? parsed.data.email,
          profile: {
            create: {
              displayName: user.user_metadata?.displayName || user.email?.split("@")[0] || "Candidat",
              targetNclc: 7,
            },
          },
        },
      });

      // Si l'utilisateur est Super Admin, initialiser la session d'administration
      const isSuperAdmin =
        user.user_metadata?.role === "SUPER_ADMIN" ||
        user.app_metadata?.role === "SUPER_ADMIN" ||
        user.email === "admin@super4c2.com";

      if (isSuperAdmin) {
        const cookieStore = await cookies();
        cookieStore.set("super4c2_admin_token", `admin-exec-session-${Date.now()}`, {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
        });

        const target = input.next && input.next !== "/dashboard" ? input.next : "/admin";
        return { ok: true as const, redirectTo: target };
      }
    }

    return { ok: true as const, redirectTo: input.next ?? "/dashboard" };
  } catch {
    // If Supabase GoTrue daemon is temporarily unreachable, offer demo fallback
    return {
      ok: false as const,
      error: "Serveur d'authentification Supabase injoignable. Utilisez le bouton 'Accès Démo Candidat'.",
    };
  }
}

export async function signUpAction(input: z.infer<typeof signUpSchema>) {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Informations invalides." };
  }

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            displayName: parsed.data.displayName?.trim() || null,
          },
        },
      });

      if (!error && data?.user) {
        const user = data.user;
        await prisma.user.upsert({
          where: { id: user.id },
          update: { email: parsed.data.email },
          create: {
            id: user.id,
            email: parsed.data.email,
            profile: {
              create: {
                displayName: parsed.data.displayName?.trim() || null,
                targetNclc: 7,
              },
            },
          },
        });

        // Si la session n'est pas établie immédiatement (confirmation par e-mail requise par Supabase)
        if (!data.session) {
          return {
            ok: true as const,
            redirectTo: "/auth/login?registered=pending_confirmation",
            message: "Votre compte a été créé. Si vous avez reçu un e-mail de confirmation, veuillez valider votre lien avant de vous connecter.",
          };
        }

        return { ok: true as const, redirectTo: "/dashboard" };
      }

      if (error) {
        return { ok: false as const, error: error.message };
      }
    } catch {
      // In local dev without Supabase auth GoTrue daemon, continue to local registration below
    }
  }

  // Local candidate registration fallback with valid RFC 4122 UUID
  const candidateId = crypto.randomUUID();
  await prisma.user.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: {
      profile: {
        upsert: {
          create: { displayName: parsed.data.displayName?.trim() || null, targetNclc: 7 },
          update: { displayName: parsed.data.displayName?.trim() || null },
        },
      },
    },
    create: {
      id: candidateId,
      email: parsed.data.email.toLowerCase(),
      profile: {
        create: {
          displayName: parsed.data.displayName?.trim() || null,
          targetNclc: 7,
        },
      },
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("sb-super4c2-demo-candidate", candidateId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true as const, redirectTo: "/dashboard" };
}
