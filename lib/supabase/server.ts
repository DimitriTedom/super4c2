import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("sb-super4c2-demo-candidate")?.value;

  if (demoCookie) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(demoCookie);
    const dbUser = isUuid
      ? await prisma.user.findFirst({
          where: { id: demoCookie },
          include: { profile: true },
        })
      : null;

    const fallbackId = "00000000-0000-0000-0000-000000000001";

    return {
      auth: {
        async getUser() {
          return {
            data: {
              user: {
                id: dbUser?.id || fallbackId,
                email: dbUser?.email || "candidat.demo@super4c2.com",
                app_metadata: {},
                user_metadata: { displayName: dbUser?.profile?.displayName || "Dimitri (Candidat Test)" },
                aud: "authenticated",
                created_at: dbUser?.createdAt?.toISOString() || new Date().toISOString(),
              },
            },
            error: null,
          };
        },
        async signOut() {
          cookieStore.delete("sb-super4c2-demo-candidate");
          return { error: null };
        },
      },
    } as unknown as ReturnType<typeof createServerClient>;
  }

  if (!url || !anonKey) {
    return null;
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't set cookies directly.
        }
      },
    },
  });
}
