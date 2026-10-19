import type { User } from "@supabase/supabase-js";

/**
 * Détermine si un utilisateur Supabase est Super Admin.
 *
 * SÉCURITÉ : on ne se fie JAMAIS à `user_metadata` (modifiable par l'utilisateur lui-même
 * via `supabase.auth.updateUser`). Sources de confiance :
 *  - `app_metadata.role === "SUPER_ADMIN"` (inscriptible uniquement côté serveur / SQL)
 *  - e-mail vérifié présent dans la variable d'environnement `ADMIN_EMAILS` (séparés par des virgules)
 */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;

  if (user.app_metadata?.role === "SUPER_ADMIN") return true;

  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const email = user.email?.toLowerCase();
  const emailVerified = Boolean(user.email_confirmed_at);

  return Boolean(email && emailVerified && allowlist.includes(email));
}
