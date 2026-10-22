"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  History,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Target,
  Trophy,
  PenTool,
  Mic,
  Lock,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Eye,
  FileText,
  User,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamCountdownWidget } from "./exam-countdown-widget";
import { CandidateCompanionWelcome } from "./candidate-companion-welcome";
import { AttemptHistoryTable } from "./attempt-history-table";
import { type UserAttemptFull } from "@/lib/dashboard/attempt-utils";

interface DashboardProViewProps {
  userDisplayName: string;
  userEmail: string;
  attempts: UserAttemptFull[];
}

export function DashboardProView({ userDisplayName, userEmail, attempts }: DashboardProViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  // Tentatives réelles ou démonstration
  const displayAttempts = attempts.length > 0 ? attempts : [];
  const latestAttempt = displayAttempts[0] || null;

  // Calcul du score moyen
  const avgNclc =
    displayAttempts.length > 0
      ? Math.round(
          displayAttempts.reduce((acc, a) => acc + a.nclcLevel, 0) / displayAttempts.length
        )
      : null;

  const avgScaledScore =
    displayAttempts.length > 0
      ? Math.round(
          displayAttempts.reduce((acc, a) => acc + a.tcfScaledScore, 0) / displayAttempts.length
        )
      : null;

  const isCrsUnlocked = displayAttempts.some((a) => a.nclcLevel >= 7);


  return (
    <div className="space-y-8 py-2">
      {/* 1. Cockpit Header Professionnel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Cockpit Candidat · TCF Canada
            </span>
            <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {userEmail}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Espace de Pilotage — {userDisplayName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Suivi temps réel de votre progression vers le <strong>NCLC 7+ (C1/C2)</strong> et vos <strong>+50 points CRS Entrée Express</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="gap-2 text-xs font-semibold">
            <Link href="/carnet-erreurs">
              <Image
                src="/brand/icons-3d/srs-memory-vault.png"
                alt="SRS"
                width={18}
                height={18}
                className="h-4 w-4 object-contain"
              />
              <span>Carnet SRS</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-2 text-xs font-semibold">
            <Link href="/account">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profil</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold gap-1.5 shadow-sm">
            <Link href="/examens?discipline=ee">
              <PenTool className="h-3.5 w-3.5" />
              <span>S&apos;entraîner</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Barre de Navigation interne du Dashboard */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Vue Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Historique &amp; Corrections</span>
            {displayAttempts.length > 0 && (
              <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.2 text-[10px] font-mono">
                {displayAttempts.length}
              </span>
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Mise à jour instantanée après chaque soumission</span>
        </div>
      </div>

      {/* 3. VUE 1 : COCKPIT GÉNÉRAL */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* KPI 1 : NCLC Estimé */}
            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Niveau NCLC Actuel
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black font-mono text-brand-crimson dark:text-brand-crimson-light">
                  {latestAttempt ? `NCLC ${latestAttempt.nclcLevel}` : "Non évalué"}
                </div>
                <span className="text-xs text-muted-foreground">Objectif : NCLC 7+</span>
              </div>
              <div className="pt-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-crimson"
                    style={{
                      width: latestAttempt ? `${Math.min(100, (latestAttempt.nclcLevel / 10) * 100)}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* KPI 2 : Score Échelonné FEI */}
            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Score TCF Échelonné
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black font-mono text-foreground">
                  {latestAttempt ? `${latestAttempt.tcfScaledScore}` : "—"}
                </div>
                <span className="text-xs text-muted-foreground font-mono">/ 699 pts</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Barème officiel France Éducation International
              </p>
            </div>

            {/* KPI 3 : Statut CRS Entrée Express */}
            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Bonus Entrée Express
              </span>
              <div className="flex items-baseline justify-between">
                <div
                  className={`text-2xl font-black font-mono ${
                    isCrsUnlocked
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isCrsUnlocked ? "+50 PTS CRS" : "0 / +50 PTS"}
                </div>
                <span className="text-[10px] font-bold">
                  {isCrsUnlocked ? "Validé" : "En cours"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isCrsUnlocked ? "Seuil NCLC 7+ atteint" : "Nécessite NCLC 7 sur les 4 épreuves"}
              </p>
            </div>

            {/* KPI 4 : Sessions Terminées */}
            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Sessions Évaluées
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black font-mono text-foreground">
                  {displayAttempts.length}
                </div>
                <span className="text-xs text-muted-foreground">Productions IA</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Corrections détaillées archivées
              </p>
            </div>
          </div>

          {/* Compagnon d'Entraînement 3D */}
          <CandidateCompanionWelcome userDisplayName={userDisplayName} />

          {/* Vos 2 Épreuves Actives (Expression Écrite & Expression Orale) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Vos Entraînements Phares
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  L&apos;Expression Écrite et l&apos;Expression Orale représentent le plus fort coefficient de progression au TCF Canada.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Prêt pour entraînement
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* CARTE 1 : EXPRESSION ÉCRITE */}
              <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-brand-crimson/30 bg-gradient-to-b from-card via-card to-brand-crimson/[0.03] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-crimson/10 p-1">
                      <Image
                        src="/brand/icons-3d/expression-ecrite-pen.png"
                        alt="Expression Écrite"
                        width={44}
                        height={44}
                        className="h-10 w-10 object-contain drop-shadow-xs"
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
                    <h3 className="font-display text-lg font-bold">Expression Écrite (EE)</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      3 tâches officielles FEI (Courriel 15m, Récit 20m, Argumentation 25m). Clavier spécialisé et Magic Rewrite C1/C2.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Link
                      href="/examens/101/ee/methodologie"
                      className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-brand-crimson/40 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground block">Tâche 1</span>
                      <span className="text-xs font-bold text-foreground">Courriel</span>
                    </Link>
                    <Link
                      href="/examens/101/ee/methodologie"
                      className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-brand-crimson/40 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground block">Tâche 2</span>
                      <span className="text-xs font-bold text-foreground">Récit</span>
                    </Link>
                    <Link
                      href="/examens/101/ee/methodologie"
                      className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-brand-crimson/40 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground block">Tâche 3</span>
                      <span className="text-xs font-bold text-foreground">Débat</span>
                    </Link>
                  </div>
                </div>

                <div className="pt-6">
                  <Button asChild size="default" className="w-full bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold shadow-xs">
                    <Link href="/examens?discipline=ee">
                      <span>Lancer l&apos;Épreuve Écrite (60 min)</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* CARTE 2 : EXPRESSION ORALE */}
              <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-card via-card to-amber-500/[0.03] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 p-1">
                      <Image
                        src="/brand/icons-3d/expression-orale-microphone.png"
                        alt="Expression Orale"
                        width={44}
                        height={44}
                        className="h-10 w-10 object-contain drop-shadow-xs"
                      />
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                        Examinateur IA
                      </span>
                      <span className="text-xs text-muted-foreground">Studio Vocal</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold">Expression Orale (EO)</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      3 tâches officielles (Entretien dirigé, Jeu de rôle formel/informel, Prise de position argumentée).
                    </p>
                  </div>

                  {/* Raccourcis Orale */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Link
                      href="/examens/101/eo?task=1"
                      className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-amber-500/40 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground block">Tâche 1</span>
                      <span className="text-xs font-bold text-foreground">Entretien</span>
                    </Link>
                    <Link
                      href="/examens/101/eo?task=2"
                      className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-amber-500/40 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground block">Tâche 2</span>
                      <span className="text-xs font-bold text-foreground">Jeu de Rôle</span>
                    </Link>
                    <Link
                      href="/examens/101/eo?task=3"
                      className="rounded-xl border border-border/80 bg-background/80 p-2 text-center hover:border-amber-500/40 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground block">Tâche 3</span>
                      <span className="text-xs font-bold text-foreground">Opinion</span>
                    </Link>
                  </div>
                </div>

                <div className="pt-6">
                  <Button asChild size="default" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs">
                    <Link href="/examens?discipline=eo">
                      <span>Lancer l&apos;Épreuve Orale (12 min)</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Épreuves QCM CE & CO (Calibrage FEI) */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <span>Épreuves QCM (Compréhension)</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Calibrage FEI
                </span>
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted p-1">
                    <Image
                      src="/brand/icons-3d/comprehension-ecrite-book.png"
                      alt="CE"
                      width={36}
                      height={36}
                      className="h-8 w-8 object-contain opacity-70"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground/80 flex items-center gap-1.5">
                      <span>Compréhension Écrite (CE)</span>
                      <Lock className="h-3 w-3 text-amber-500" />
                    </h4>
                    <p className="text-xs text-muted-foreground">39 questions · Écran scindé FEI</p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-muted-foreground bg-muted/60 border border-border/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-amber-500" />
                  <span>Bientôt</span>
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted p-1">
                    <Image
                      src="/brand/icons-3d/comprehension-orale-headphones.png"
                      alt="CO"
                      width={36}
                      height={36}
                      className="h-8 w-8 object-contain opacity-70"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground/80 flex items-center gap-1.5">
                      <span>Compréhension Orale (CO)</span>
                      <Lock className="h-3 w-3 text-amber-500" />
                    </h4>
                    <p className="text-xs text-muted-foreground">39 questions · Audio HD studio</p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-muted-foreground bg-muted/60 border border-border/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-amber-500" />
                  <span>Bientôt</span>
                </span>
              </div>
            </div>
          </div>

          {/* Compte à Rebours & Simulateur CRS */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ExamCountdownWidget />
            </div>

            <div className="rounded-3xl border bg-card p-6 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />
                  Bonus Entrée Express
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  +50 Points CRS à Portée de Main
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  En validant le NCLC 7 dans les 4 épreuves, vous activez automatiquement les 50 points d&apos;adaptabilité linguistique francophone accordés par Immigration Canada.
                </p>
              </div>

              <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold">
                <Link href="/nclc-calculator">
                  <span>Simulateur de points CRS</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VUE 2 : HISTORIQUE & CORRECTIONS (tableau style Studio) */}
      {activeTab === "history" && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Historique &amp; Corrections</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Retrouvez chaque épreuve passée, filtrez, triez et cliquez sur une ligne pour revoir votre copie et sa correction détaillée.
            </p>
          </div>
          <AttemptHistoryTable attempts={displayAttempts} />
        </div>
      )}
    </div>
  );
}
