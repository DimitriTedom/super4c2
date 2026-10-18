"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

async function resolveOrigin(): Promise<string> {
  // En production, ne JAMAIS renvoyer localhost
  if (process.env.NODE_ENV === "production") {
    const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (prodHost) {
      return `https://${prodHost.replace(/\/$/, "")}`;
    }
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl.replace(/\/$/, "")}`;
    }
  }

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host && !host.includes("localhost")) {
      const proto = h.get("x-forwarded-proto") ?? "https";
      return `${proto}://${host}`;
    }
    if (host && host.includes("localhost") && process.env.NODE_ENV !== "production") {
      return "http://localhost:3000";
    }
  } catch {
    // Si headers() n'est pas disponible dans le contexte d'appel
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }

  return process.env.NODE_ENV === "production"
    ? "https://super4c2.vercel.app"
    : "http://localhost:3000";
}

export async function signInAction(input: z.infer<typeof signInSchema> & { next?: string }) {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Identifiants invalides." };
  }

  // Nettoyage préventif des anciens cookies démo résiduels
  const cookieStore = await cookies();
  cookieStore.delete("sb-super4c2-demo-candidate");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, error: "Configuration Supabase manquante." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed")) {
        return {
          ok: false as const,
          error: "Votre adresse e-mail n'a pas encore été confirmée. Veuillez cliquer sur le lien reçu dans votre boîte de réception avant de vous connecter.",
        };
      }
      if (msg.includes("invalid login credentials") || msg.includes("invalid_grant")) {
        return {
          ok: false as const,
          error: "Adresse e-mail ou mot de passe incorrect. Veuillez vérifier vos identifiants.",
        };
      }
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
  } catch (err: unknown) {
    const error = err as Error;
    return {
      ok: false as const,
      error: error?.message || "Erreur de connexion au serveur d'authentification.",
    };
  }
}

export async function signUpAction(input: z.infer<typeof signUpSchema> & { next?: string }) {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Informations invalides." };
  }

  // Nettoyage préventif des anciens cookies démo résiduels
  const cookieStore = await cookies();
  cookieStore.delete("sb-super4c2-demo-candidate");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, error: "Configuration Supabase manquante." };
  }

  try {
    const origin = await resolveOrigin();
    const nextPath = input.next || "/dashboard";
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        data: {
          displayName: parsed.data.displayName?.trim() || null,
        },
      },
    });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    if (data?.user) {
      const user = data.user;
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email: parsed.data.email.trim().toLowerCase() },
        create: {
          id: user.id,
          email: parsed.data.email.trim().toLowerCase(),
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
        const loginTarget = input.next
          ? `/auth/login?registered=pending_confirmation&next=${encodeURIComponent(input.next)}`
          : "/auth/login?registered=pending_confirmation";
        return {
          ok: true as const,
          redirectTo: loginTarget,
          message:
            "Votre compte a été créé avec succès ! Un e-mail contenant un lien de confirmation vous a été envoyé. Veuillez cliquer sur ce lien pour valider votre adresse avant de vous connecter.",
        };
      }

      return { ok: true as const, redirectTo: input.next || "/dashboard" };
    }

    return { ok: false as const, error: "Impossible de créer le compte. Veuillez réessayer." };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      ok: false as const,
      error: error?.message || "Une erreur est survenue lors de la création du compte.",
    };
  }
}

export async function resetPasswordForEmailAction(email: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, error: "Configuration Supabase manquante." };
  }
  const origin = await resolveOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${origin}/auth/callback?next=/account`,
  });
  if (error) {
    return { ok: false as const, error: error.message };
  }
  return {
    ok: true as const,
    message: "Un lien de réinitialisation de mot de passe vous a été envoyé par e-mail.",
  };
}

export async function updatePasswordAction(newPassword: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, error: "Configuration Supabase manquante." };
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, message: "Votre mot de passe a été mis à jour avec succès." };
}
