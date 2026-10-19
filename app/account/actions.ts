"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function resolveOrigin(): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (prodHost) return `https://${prodHost.replace(/\/$/, "")}`;
  }
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // headers() indisponible
  }
  return process.env.NODE_ENV === "production" ? "https://super4c2.vercel.app" : "http://localhost:3000";
}

/** Supprime définitivement le compte et toutes les données de l'utilisateur connecté (RGPD). */
export async function deleteAccountAction(confirmation: string) {
  if (confirmation.trim().toUpperCase() !== "SUPPRIMER") {
    return { ok: false as const, error: "Tapez SUPPRIMER pour confirmer." };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, error: "Configuration Supabase manquante." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Session expirée. Reconnectez-vous." };

  const { error } = await supabase.rpc("delete_own_account");
  if (error) {
    const missing = error.message.includes("delete_own_account") || error.code === "PGRST202";
    return {
      ok: false as const,
      error: missing
        ? "La suppression de compte n'est pas encore activée sur le serveur. Contactez le support."
        : "Impossible de supprimer le compte pour le moment. Réessayez ou contactez le support.",
    };
  }

  try {
    await supabase.auth.signOut();
  } catch {
    // le compte n'existe plus : ignorer
  }
  const cookieStore = await cookies();
  cookieStore.delete("sb-super4c2-demo-candidate");
  return { ok: true as const };
}

/** Demande un changement d'adresse e-mail (confirmation par lien envoyé aux deux adresses selon config Supabase). */
export async function changeEmailAction(newEmail: string) {
  const parsed = z.string().email().safeParse(newEmail.trim().toLowerCase());
  if (!parsed.success) return { ok: false as const, error: "Adresse e-mail invalide." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, error: "Configuration Supabase manquante." };

  const origin = await resolveOrigin();
  const { error } = await supabase.auth.updateUser(
    { email: parsed.data },
    { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/account")}` }
  );
  if (error) return { ok: false as const, error: error.message };
  return {
    ok: true as const,
    message: "Un e-mail de confirmation a été envoyé. Cliquez sur le lien pour valider la nouvelle adresse.",
  };
}

/** Révoque toutes les sessions de l'utilisateur sur tous les appareils. */
export async function signOutEverywhereAction() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, error: "Configuration Supabase manquante." };
  const { error } = await supabase.auth.signOut({ scope: "global" });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
