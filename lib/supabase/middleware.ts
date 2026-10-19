import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export interface SessionResult {
  response: NextResponse;
  user: User | null;
}

/**
 * Rafraîchit la session Supabase et retourne l'utilisateur vérifié côté serveur (getUser).
 */
export async function updateSessionWithUser(request: NextRequest): Promise<SessionResult> {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { response, user: null };
  }

  // Optimisation performance majeure : ne JAMAIS faire d'appel réseau distant si aucun cookie Supabase n'est présent
  const hasSbCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSbCookie) {
    return { response, user: null };
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Timeout strict de 800ms pour ne JAMAIS geler le rendu Next.js si le serveur Supabase est injoignable
    const result = (await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase auth timeout")), 800)
      ),
    ])) as Awaited<ReturnType<typeof supabase.auth.getUser>>;

    return { response, user: result?.data?.user ?? null };
  } catch {
    // Échec gracieux sans impacter la navigation de l'utilisateur
    return { response, user: null };
  }
}

export async function updateSession(request: NextRequest) {
  return (await updateSessionWithUser(request)).response;
}
