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
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ExamCountdownWidget } from "@/components/dashboard/exam-countdown-widget";

export const metadata = {
  title: "Tableau de Bord Candidat — Objectif NCLC 7 / C2",
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

  // Récupération des dernières tentatives d'examen en base
  const recentAttempts: AttemptSummary[] = await prisma.userAttempt.findMany({
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

  // Profil des 4 compétences clés avec icônes 3D officielles
  const currentSkills = [
    {
      code: "CE",
      name: "Compréhension Écrite",
      disciplineKey: "COMPREHENSION_ECRITE",
      level: latestByDiscipline.COMPREHENSION_ECRITE ?? null,
      target: 7,
      ok: (latestByDiscipline.COMPREHENSION_ECRITE ?? 0) >= 7,
      href: "/examens/demo-101-ce/intro",
      icon3d: "/brand/icons-3d/comprehension-ecrite-book.png",
      icon: BookOpenText,
    },
    {
      code: "CO",
      name: "Compréhension Orale",
      disciplineKey: "COMPREHENSION_ORALE",
      level: latestByDiscipline.COMPREHENSION_ORALE ?? null,
      target: 7,
      ok: (latestByDiscipline.COMPREHENSION_ORALE ?? 0) >= 7,
      href: "/examens/demo-101-ce/co",
      icon3d: "/brand/icons-3d/comprehension-orale-headphones.png",
      icon: Headphones,
    },
    {
      code: "EE",
      name: "Expression Écrite",
      disciplineKey: "EXPRESSION_ECRITE",
      level: latestByDiscipline.EXPRESSION_ECRITE ?? null,
      target: 7,
      ok: (latestByDiscipline.EXPRESSION_ECRITE ?? 0) >= 7,
      href: "/examens/demo-101-ce/ee/intro",
      icon3d: "/brand/icons-3d/expression-ecrite-pen.png",
      icon: PenTool,
    },
    {
      code: "EO",
      name: "Expression Orale",
      disciplineKey: "EXPRESSION_ORALE",
      level: latestByDiscipline.EXPRESSION_ORALE ?? null,
      target: 7,
      ok: (latestByDiscipline.EXPRESSION_ORALE ?? 0) >= 7,
      href: "/examens/demo-101-ce/eo/intro",
      icon3d: "/brand/icons-3d/expression-orale-microphone.png",
      icon: Mic,
    },
  ];

  const testedCount = currentSkills.filter((s) => s.level !== null).length;
  const validatedCount = currentSkills.filter((s) => s.ok).length;
  const allNclc7 = currentSkills.length > 0 && currentSkills.every((s) => s.ok);
  const userDisplayName = user.email?.split("@")[0] || "Candidat";

  return (
    <div className="space-y-10 py-2">
      {/* Header candidat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Espace d&apos;Entraînement TCF Canada
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mt-1">
            Bienvenue, {userDisplayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Objectif : <strong>NCLC 7 dans les 4 épreuves</strong> pour valider les +50 points bonus Entrée Express.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="gap-2.5">
            <Link href="/carnet-erreurs" className="flex items-center gap-2">
              <Image
                src="/brand/icons-3d/srs-memory-vault.png"
                alt="SRS"
                width={22}
                height={22}
                className="h-5 w-5 object-contain"
              />
              <span>Carnet d&apos;Erreurs SRS</span>
            </Link>
          </Button>
          <Button asChild className="bg-[#E51A31] hover:bg-[#B31224] text-white gap-2 shadow-sm">
            <Link href="/examens" className="flex items-center gap-2">
              <Image
                src="/brand/icons-3d/cbt-dual-screen-simulator.png"
                alt="CBT"
                width={22}
                height={22}
                className="h-5 w-5 object-contain"
              />
              <span>Simulateur d&apos;Examen</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* CAS 1 : NOUVEAU CANDIDAT SANS TENTATIVE (ONBOARDING ENGAGEANT) */}
      {!hasAttempts ? (
        <div className="space-y-10">
          {/* Grille Hero Onboarding & Countdown Widget */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Carte Bienvenue & Diagnostic */}
            <div className="lg:col-span-2 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-sm">
              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Nouveau candidat — Étape Initiale</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Évaluez votre niveau de départ en 15 minutes
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                  Bienvenue sur votre cockpit TCF Canada ! Avant de débuter votre entraînement intensif, passez un premier test diagnostique pour mesurer précisément votre niveau de départ sur l&apos;échelle officielle FEI (A1 à C2).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 pt-2">
                <Button asChild size="lg" className="bg-[#E51A31] hover:bg-[#B31224] text-white gap-2 shadow-md">
                  <Link href="/examens/demo-101-ce/intro?mode=practice">
                    <Play className="h-4 w-4 fill-white" />
                    <span>Lancer le Test Diagnostique (CE Série 101)</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/nclc-calculator">
                    <span>Simulateur de Points CRS</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>

              {/* Halo décoratif subtil en arrière-plan */}
              <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            </div>

            {/* Widget Compte à Rebours J-X */}
            <div className="h-full">
              <ExamCountdownWidget />
            </div>
          </div>

          {/* Checklist d'Onboarding en 3 étapes */}
          <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                <span>Guide de Démarrage Rapide</span>
              </span>
              <h3 className="font-display text-xl font-bold text-foreground">
                Votre Plan d&apos;Action vers les +50 Points Entrée Express
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-extrabold text-primary">
                    1
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Priorité 1
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-foreground">
                  Test Diagnostique Rapide
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complétez une première série en Compréhension Écrite ou Orale pour cartographier vos pièges récurrents.
                </p>
                <Link
                  href="/examens/demo-101-ce/intro?mode=practice"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                >
                  <span>Démarrer le test</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-extrabold text-primary">
                    2
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    Planification
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-foreground">
                  Fixer votre Date d&apos;Examen
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Renseignez la date de votre session officielle dans le widget ci-dessus pour adapter votre rythme de révision hebdomadaire.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-extrabold text-primary">
                    3
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Progression
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-foreground">
                  Carnet SRS & Ancrage
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Chaque question ratée est automatiquement archivée avec son explication détaillée pour être révisée au moment opportun.
                </p>
                <Link
                  href="/carnet-erreurs"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                >
                  <span>Voir le coffre SRS</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Grille des 4 compétences (État Non Évalué) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">Les 4 Épreuves Officielles</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aucun score enregistré pour l&apos;instant. Passez votre premier test pour étalonner votre niveau.
                </p>
              </div>
              <Link
                href="/nclc-calculator"
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1.5"
              >
                <Image
                  src="/brand/icons-3d/crs-calculator-compass.png"
                  alt="CRS"
                  width={18}
                  height={18}
                  className="h-4 w-4 object-contain"
                />
                <span>Simulateur CRS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentSkills.map((sk) => (
                <div
                  key={sk.code}
                  className="group rounded-2xl border bg-card p-5 space-y-4 shadow-sm transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 p-1 transition-transform group-hover:scale-105">
                      <Image
                        src={sk.icon3d}
                        alt={sk.name}
                        width={44}
                        height={44}
                        className="h-10 w-10 object-contain drop-shadow-sm"
                      />
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
                      Non évalué
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">{sk.name}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-display text-2xl font-extrabold text-muted-foreground">
                        --
                      </span>
                      <span className="text-xs text-muted-foreground">Cible : NCLC {sk.target}+</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5">
                    <Link href={sk.href}>
                      <Play className="h-3 w-3 fill-foreground" />
                      <span>Passer le test</span>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* CAS 2 : CANDIDAT AVEC HISTORIQUE DE TENTATIVES (ANALYTIQUE RÉELLE) */
        <div className="space-y-10">
          {/* Top section : Synthèse Progression & Widget Compte à Rebours */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Statut Global NCLC 7 */}
            <div className="lg:col-span-2 rounded-3xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />
                  Progression Entrée Express Canada
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  {validatedCount === 4
                    ? "Objectif 4 C2 Atteint ! Prêt pour les +50 Pts CRS."
                    : `${validatedCount} sur 4 épreuves au niveau NCLC 7+`}
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                  {validatedCount === 4
                    ? "Toutes vos épreuves enregistrées atteignent ou dépassent le seuil NCLC 7. Vos 50 points bonus francophones pour Entrée Express sont pleinement validés."
                    : `Il vous reste ${4 - validatedCount} épreuve(s) à hisser au niveau NCLC 7 pour débloquer automatiquement le bonus maximal de 50 points au bassin Entrée Express.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-foreground">
                    {validatedCount} validée{validatedCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-foreground">
                    {4 - validatedCount} restante{4 - validatedCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="ml-auto">
                  <Link
                    href="/nclc-calculator"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Simuler le score CRS global</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Widget Compte à Rebours J-X */}
            <div className="h-full">
              <ExamCountdownWidget />
            </div>
          </div>

          {/* Radar des 4 compétences NCLC */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Votre Niveau par Épreuve (NCLC)</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Calculé à partir de vos dernières tentatives enregistrées.
                </p>
              </div>
              <Link
                href="/nclc-calculator"
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1.5"
              >
                <Image
                  src="/brand/icons-3d/crs-calculator-compass.png"
                  alt="CRS"
                  width={18}
                  height={18}
                  className="h-4 w-4 object-contain"
                />
                <span>Calculateur de points CRS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentSkills.map((sk) => {
                const isEvaluated = sk.level !== null;

                return (
                  <div
                    key={sk.code}
                    className="group rounded-2xl border bg-card p-5 space-y-4 shadow-sm transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 p-1 transition-transform group-hover:scale-105">
                        <Image
                          src={sk.icon3d}
                          alt={sk.name}
                          width={44}
                          height={44}
                          className="h-10 w-10 object-contain drop-shadow-sm"
                        />
                      </div>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${
                          !isEvaluated
                            ? "bg-muted text-muted-foreground border-border"
                            : sk.ok
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {!isEvaluated
                          ? "Non évalué"
                          : sk.ok
                          ? "Seuil NCLC 7 atteint ✓"
                          : "Priorité de révision ⚠"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">{sk.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display text-3xl font-black text-foreground">
                          {isEvaluated ? `NCLC ${sk.level}` : "--"}
                        </span>
                        <span className="text-xs text-muted-foreground">Cible : NCLC {sk.target}</span>
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
                      <Link href={sk.href}>
                        {isEvaluated ? "S'entraîner en conditions réelles" : "Passer le test"}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historique des Dernières Tentatives Récentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <span>Dernières Tentatives d&apos;Épreuve</span>
              </h2>
              <span className="text-xs text-muted-foreground">Enregistrées dans votre dossier</span>
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden shadow-xs">
              <div className="divide-y">
                {recentAttempts.map((attempt) => {
                  const disciplineName =
                    attempt.discipline === "COMPREHENSION_ECRITE"
                      ? "Compréhension Écrite"
                      : attempt.discipline === "COMPREHENSION_ORALE"
                      ? "Compréhension Orale"
                      : attempt.discipline === "EXPRESSION_ECRITE"
                      ? "Expression Écrite"
                      : "Expression Orale";

                  const isNclc7 = attempt.nclcLevel >= 7;

                  return (
                    <div
                      key={attempt.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-muted/40 transition-colors gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {disciplineName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isNclc7
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            }`}
                          >
                            NCLC {attempt.nclcLevel}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-foreground">
                            {attempt.tcfScaledScore} / 699
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            Score échelonné TCF
                          </span>
                        </div>

                        {attempt.crsPointsUnlocked > 0 && (
                          <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            +50 pts CRS
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bannière Défi Entrée Express */}
          <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-cyan-500/10 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />
                  Impact Entrée Express Canada
                </span>
                <h3 className="font-display text-2xl font-black text-foreground">
                  {allNclc7
                    ? "Félicitations ! Vous validez le seuil NCLC 7 dans les 4 épreuves !"
                    : `Plus que ${4 - validatedCount} épreuve(s) à hisser au niveau NCLC 7 !`}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  {allNclc7
                    ? "Toutes vos compétences linguistiques sont au niveau requis. Vous débloquez les +50 points bonus CRS francophone pour maximiser vos chances d'invitation à la résidence permanente."
                    : "En validant le seuil NCLC 7 sur l'ensemble des 4 épreuves grâce à nos sessions de simulation officielles et de jeu de rôle IA, vous débloquerez instantanément les +50 points CRS francophones."}
                </p>
              </div>

              <Button asChild size="lg" className="bg-[#E51A31] hover:bg-[#B31224] text-white shrink-0">
                <Link href="/examens/demo-101-ce/eo/intro" className="gap-2">
                  <Mic className="h-4 w-4" />
                  Lancer l&apos;Oral IA maintenant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

