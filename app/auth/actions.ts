"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations";

export async function signInDemoCandidateAction(next?: string) {
  const cookieStore = await cookies();
  cookieStore.set("sb-super4c2-demo-candidate", "super4c2_demo_candidate_token", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  await prisma.user.upsert({
    where: { id: "demo-candidate-c4c2" },
    update: { email: "candidat.demo@super4c2.com" },
    create: {
      id: "demo-candidate-c4c2",
      email: "candidat.demo@super4c2.com",
      profile: {
        create: {
          displayName: "Dimitri (Candidat Test)",
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
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    return { ok: true as const, redirectTo: input.next ?? "/dashboard" };
  } catch {
    // If local dev without Supabase GoTrue daemon, provide informative guidance
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
              },
            },
          },
        });
        return { ok: true as const, redirectTo: "/dashboard" };
      }
    } catch {
      // In local dev without Supabase auth GoTrue daemon, continue to local registration below
    }
  }

  // Local candidate registration fallback
  const candidateId = `candidat-${Date.now()}`;
  await prisma.user.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: {
      profile: {
        upsert: {
          create: { displayName: parsed.data.displayName?.trim() || null },
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
