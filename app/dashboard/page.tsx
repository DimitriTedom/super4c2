import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  Trophy,
  ArrowRight,
  History,
  CheckCircle2,
  Calendar,
  Play,
  Flame,
  Clock,
  Target,
  Lock,
  User,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ExamCountdownWidget } from "@/components/dashboard/exam-countdown-widget";
import { CandidateCompanionWelcome } from "@/components/dashboard/candidate-companion-welcome";

export const metadata = {
  title: "Tableau de Bord Candidat — Objectif NCLC 7 / C2 | Super4C2",
  description:
    "Votre centre de pilotage pour réussir le TCF Canada C2 : Expression Écrite, Expression Orale IA et suivi d'admissibilité Entrée Express (+50 pts CRS).",
};

interface AttemptSummary {
  id: string;
  discipline: string;
  nclcLevel: number;
  tcfScaledScore: number;
  crsPointsUnlocked: number;
  createdAt: Date;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  // Récupération des dernières tentatives d'examen du candidat connecté
  const recentAttempts: AttemptSummary[] = await prisma.userAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const hasAttempts = recentAttempts.length > 0;

  // Calcul du niveau le plus récent par épreuve (si tentative existante)
  const latestByDiscipline: Record<string, number> = {};
  recentAttempts.forEach((a: AttemptSummary) => {
    if (!latestByDiscipline[a.discipline] && a.nclcLevel > 0) {
      latestByDiscipline[a.discipline] = a.nclcLevel;
    }
  });

  const userDisplayName =
    user.user_metadata?.displayName || user.email?.split("@")[0] || "Candidat";

  return (
    <div className="space-y-10 py-2">
      {/* 1. Header Candidat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Cockpit Officiel TCF Canada
            </span>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Accès 100% Gratuit Lancement
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mt-1">
            Bienvenue, {userDisplayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Objectif : <strong>NCLC 7+ (C1/C2)</strong> pour débloquer automatiquement vos +50 points bonus Entrée Express.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/carnet-erreurs" className="flex items-center gap-2">
              <Image
                src="/brand/icons-3d/srs-memory-vault.png"
                alt="SRS"
                width={20}
                height={20}
                className="h-4 w-4 object-contain"
              />
              <span className="text-xs font-semibold">Carnet SRS</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <Link href="/account" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Mon Profil</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Bandeau Célébration Lancement 100% Gratuit */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-brand-crimson/10 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-2">
                <span>Période de Lancement : Accès 100% Gratuit & Illimité</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  Offre Spéciale
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Toutes nos simulations avancées d&apos;<strong>Expression Écrite</strong> (3 tâches FEI avec Magic Rewrite) et d&apos;<strong>Expression Orale</strong> (Examinateur IA M. Laurent) sont ouvertes en accès libre.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="shrink-0 bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold gap-1.5 shadow-md"
          >
            <Link href="/examens/demo-101-ee/intro">
              <PenTool className="h-4 w-4" />
              <span>S&apos;entraîner maintenant</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 3. Accueil Interactif du Compagnon 3D */}
      <CandidateCompanionWelcome userDisplayName={userDisplayName} />

      {/* 4. Section : Vos Super-Pouvoirs Actifs & Gratuits (Cartes Héroïques) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
              Vos Épreuves Phares Actives
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Les deux compétences clés où 78% des candidats perdent leurs points au TCF Canada.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            2 / 2 Disponibles
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* CARTE 1 : EXPRESSION ÉCRITE */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-brand-crimson/40 bg-gradient-to-b from-card via-card to-brand-crimson/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-crimson px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
              <Sparkles className="h-3.5 w-3.5" /> Recommandé · 100% Gratuit
            </span>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-crimson/10 p-1 transition-transform group-hover:scale-105">
                  <Image
                    src="/brand/icons-3d/expression-ecrite-pen.png"
                    alt="Expression Écrite"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain drop-shadow-sm"
                  />
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    Correction IA FEI
                  </span>
                  <span className="text-xs text-muted-foreground">Barème 20/20</span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold">Expression Écrite (EE)</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  3 tâches officielles (Courriel 15m, Récit 20m, Argumentation 25m). Clavier de caractères accentués (Maj/Min), barre de temps dynamique et Magic Rewrite C1/C2.
                </p>
              </div>

              {/* Raccourcis Didactiques */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Link
                  href="/examens/demo-101-ee/ee?mode=training&task=1"
                  className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-brand-crimson/40 transition-colors"
                >
                  <span className="text-[10px] text-muted-foreground block">Tâche 1</span>
                  <span className="text-xs font-bold text-foreground">Courriel</span>
                </Link>
                <Link
                  href="/examens/demo-101-ee/ee?mode=training&task=2"
                  className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-brand-crimson/40 transition-colors"
                >
                  <span className="text-[10px] text-muted-foreground block">Tâche 2</span>
                  <span className="text-xs font-bold text-foreground">Récit</span>
                </Link>
                <Link
                  href="/examens/demo-101-ee/ee?mode=training&task=3"
                  className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-brand-crimson/40 transition-colors"
                >
                  <span className="text-[10px] text-muted-foreground block">Tâche 3</span>
                  <span className="text-xs font-bold text-foreground">Débat</span>
                </Link>
              </div>
            </div>

            <div className="pt-6">
              <Button asChild size="lg" className="w-full bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold shadow-md">
                <Link href="/examens/demo-101-ee/intro">
                  <span>Accéder au Hub Méthodologique & Entraînement</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* CARTE 2 : EXPRESSION ORALE */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-500/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
              <Sparkles className="h-3.5 w-3.5" /> Live · Studio Visio IA
            </span>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 p-1 transition-transform group-hover:scale-105">
                  <Image
                    src="/brand/icons-3d/expression-orale-microphone.png"
                    alt="Expression Orale"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain drop-shadow-sm"
                  />
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    Examinateur Live
                  </span>
                  <span className="text-xs text-muted-foreground">Studio 16:9</span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold">Expression Orale (EO)</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  Entretien en direct avec l&apos;examinateur officiel IA M. Laurent. Pré-test micro interactif, jeu de rôle (Tâche 2) et prise de position argumentée (Tâche 3).
                </p>
              </div>

              {/* Télémétrie EO */}
              <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500" /> 12 minutes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mic className="h-4 w-4 text-amber-500" /> 3 tâches officielles
                </span>
              </div>
            </div>

            <div className="pt-6">
              <Button asChild size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md">
                <Link href="/examens/demo-101-ce/eo/intro">
                  <span>Entrer dans la Salle d&apos;Oral IA</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section : Épreuves en cours de calibrage FEI (CE & CO) */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <span>Prochainement Disponibles</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              Calibrage FEI en cours
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ces deux modules QCM sont en cours de calibrage pour reproduire à 100% les banques officielles France Éducation International.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* CE */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted p-1">
                <Image
                  src="/brand/icons-3d/comprehension-ecrite-book.png"
                  alt="CE"
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain opacity-70"
                />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-foreground/80 flex items-center gap-1.5">
                  <span>Compréhension Écrite (CE)</span>
                  <Lock className="h-3 w-3 text-amber-500" />
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  39 questions · Écran scindé officiel FEI
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="shrink-0 text-xs border-dashed">
              <Link href="/examens/demo-101-ce/ce">
                <span>Voir statut</span>
              </Link>
            </Button>
          </div>

          {/* CO */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted p-1">
                <Image
                  src="/brand/icons-3d/comprehension-orale-headphones.png"
                  alt="CO"
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain opacity-70"
                />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-foreground/80 flex items-center gap-1.5">
                  <span>Compréhension Orale (CO)</span>
                  <Lock className="h-3 w-3 text-amber-500" />
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  39 questions · Mono-écoute studio HD
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="shrink-0 text-xs border-dashed">
              <Link href="/examens/demo-101-ce/co">
                <span>Voir statut</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 6. Widget Compte à Rebours & Objectif NCLC 7 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExamCountdownWidget />
        </div>

        <div className="rounded-3xl border bg-card p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Bonus Entrée Express
            </span>
            <h3 className="font-display text-xl font-bold text-foreground">
              +50 Points CRS à Portée de Main
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              En validant le NCLC 7 dans les 4 compétences, vous débloquez immédiatement les 50 points d&apos;adaptabilité linguistique francophone accordés par Immigration Canada.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold">
            <Link href="/nclc-calculator">
              <span>Ouvrir le simulateur de points CRS</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 7. Historique des Tentatives Récentes (si existantes) */}
      {hasAttempts && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold">Vos Dernières Tentatives Évaluées</h3>
            <span className="text-xs text-muted-foreground">{recentAttempts.length} enregistrée(s)</span>
          </div>

          <div className="rounded-2xl border bg-card divide-y overflow-hidden shadow-sm">
            {recentAttempts.map((attempt) => (
              <div key={attempt.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                    {attempt.discipline}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Simulation {attempt.discipline}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attempt.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-extrabold text-foreground">
                    NCLC {attempt.nclcLevel || "?"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +{attempt.crsPointsUnlocked || 0} CRS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
