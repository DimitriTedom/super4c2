import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Connexion — Espace Candidat TCF Canada | Super4C2",
  description: "Connectez-vous à votre simulateur CBT et retrouvez vos séries d'entraînement et carnet d'erreurs.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; registered?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const next =
    resolvedParams?.next && resolvedParams.next.startsWith("/") && !resolvedParams.next.startsWith("/auth")
      ? resolvedParams.next
      : "/dashboard";

  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (user) {
    redirect(next);
  }

  return (
    <div className="w-full flex items-center justify-center py-6 px-4">
      <AuthCard
        title="Bon retour parmi nous"
        description="Accédez à votre simulateur CBT et à vos analyses NCLC."
        badgeText="Espace Candidat TCF & TEF"
      >
        <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
