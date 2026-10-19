import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nouveau mot de passe | Super4C2",
  description: "Définissez un nouveau mot de passe pour votre compte Super4C2.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect("/auth/login?error=link_expired");
  }

  return (
    <div className="w-full flex items-center justify-center py-6 px-4">
      <AuthCard
        title="Nouveau mot de passe"
        description="Choisissez un mot de passe robuste que vous n'utilisez nulle part ailleurs."
        badgeText="Sécurité du compte"
      >
        <ResetPasswordForm />
      </AuthCard>
    </div>
  );
}
