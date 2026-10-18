import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  LogOut,
  Mail,
  PenTool,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/account/profile-edit-form";
import { SecurityPasswordForm } from "@/components/account/security-password-form";

export const metadata = {
  title: "Mon Compte — Espace Candidat | Super4C2",
  description: "Gérez votre profil candidat, suivez vos objectifs NCLC et vos accès aux examens TCF Canada.",
};

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect("/auth/login?next=/account");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  const displayName = dbUser?.profile?.displayName || user.email?.split("@")[0] || "Candidat";
  const initials = displayName.slice(0, 2).toUpperCase();

  const initialProfile = {
    displayName: dbUser?.profile?.displayName || null,
    targetNclc: dbUser?.profile?.targetNclc || 7,
    examDate: dbUser?.profile?.examDate ? dbUser.profile.examDate.toISOString() : null,
    country: dbUser?.profile?.country || null,
    phone: dbUser?.profile?.phone || null,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-black shadow-md ring-4 ring-primary/20">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Compte Vérifié
                </span>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="font-semibold shadow-xs">
              <Link href="/examens">
                <BookOpen className="mr-2 h-4 w-4" />
                Reprendre l&apos;entraînement
              </Link>
            </Button>
            <form action="/logout" method="POST">
              <Button variant="outline" type="submit" className="font-medium text-muted-foreground hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Formulaire interactif d'édition du profil */}
      <ProfileEditForm initialProfile={initialProfile} userEmail={user.email || ""} />

      {/* Formulaire sécurisé de mise à jour du mot de passe */}
      <SecurityPasswordForm />

      {/* Grid of Profile Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Card 1 : Objectif Immigration & NCLC */}
        <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold">Objectif Linguistique Canada</h2>
            </div>
            <span className="font-mono text-xs font-bold text-primary">
              NCLC {dbUser?.profile?.targetNclc || 7}+
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Programme cible :</span>
              <span className="font-semibold">Entrée Express (Fédéral)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Bonus CRS convoité :</span>
              <span className="font-bold text-emerald-600">+50 à +62 points</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Date officielle :</span>
              <span className="font-semibold">
                {dbUser?.profile?.examDate
                  ? new Date(dbUser.profile.examDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Non définie"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Niveau actuel estimé :</span>
              <span className="font-mono font-semibold">B2 • Palier critique</span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/nclc-calculator">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Recalculer mes points CRS
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 2 : Abonnement & Entraînements */}
        <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold">Abonnement & Accès</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              Actif
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Formule :</span>
              <span className="font-semibold">Pack Entraînement TCF Canada</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Simulateur CBT officiel :</span>
              <span className="font-semibold text-emerald-600">Accès illimité</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Carnet d&apos;Erreurs SRS :</span>
              <span className="font-semibold text-emerald-600">Activé (J+1, J+3, J+7)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Correcteur IA FEI :</span>
              <span className="font-semibold text-emerald-600">Instantané</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                🎉 Pass Lancement 100% Gratuit Actif
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Accès illimité aux épreuves d&apos;Écrit et d&apos;Oral
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="rounded-3xl border bg-muted/20 p-6 space-y-4">
        <h3 className="font-display text-base font-bold">Raccourcis Pratiques</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="secondary" asChild className="justify-start">
            <Link href="/examens/demo-101-ee/intro">
              <PenTool className="mr-2 h-4 w-4 text-brand-crimson" />
              Expression Écrite (3 Tâches)
            </Link>
          </Button>
          <Button variant="secondary" asChild className="justify-start">
            <Link href="/carnet-erreurs">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Mon Carnet d&apos;Erreurs SRS
            </Link>
          </Button>
          <Button variant="secondary" asChild className="justify-start">
            <Link href="/test-gratuit">
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
              Test Diagnostique 5 min
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
