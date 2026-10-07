import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Inscription — Rejoindre Super4C2 | Préparation TCF & TEF Canada",
  description: "Créez votre compte candidat pour vous entraîner en conditions réelles et sécuriser NCLC 7+ pour Entrée Express.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10 px-4">
      <AuthCard
        title="Créer votre compte candidat"
        description="Rejoignez la préparation officielle et débloquez votre potentiel NCLC 7."
        badgeText="Inscription Gratuite TCF Canada"
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
