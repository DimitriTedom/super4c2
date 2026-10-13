import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Connexion — Espace Candidat TCF Canada | Super4C2",
  description: "Connectez-vous à votre simulateur CBT et retrouvez vos séries d'entraînement et carnet d'erreurs.",
};

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center py-6 px-4">
      <AuthCard
        title="Bon retour parmi nous"
        description="Accédez à votre simulateur officiel CBT et à vos analyses NCLC."
        badgeText="Espace Candidat TCF & TEF"
      >
        <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
