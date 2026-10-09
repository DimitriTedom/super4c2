"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Monitor,
  Mic,
  PenTool,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Flame,
  Wand2,
  ChevronRight,
  RotateCcw,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"ce" | "eo" | "ee">("ce");

  // State for CE (Compréhension Écrite) interactive demo
  const [selectedCeAnswer, setSelectedCeAnswer] = useState<number | null>(1); // B
  const [activeQuestionNumber, setActiveQuestionNumber] = useState<number>(4);

  // State for EO (Expression Orale) interactive demo
  const [eoSpeaking, setEoSpeaking] = useState<boolean>(false);
  const [eoExchangeStep, setEoExchangeStep] = useState<number>(1);

  // State for EE (Expression Écrite) interactive demo
  const [showMagicRewrite, setShowMagicRewrite] = useState<boolean>(false);

  // Timer simulation
  const [secondsRemaining, setSecondsRemaining] = useState(3522); // ~58 min
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative mx-auto max-w-6xl space-y-8 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
          <span>Simulateur Interactif en Direct</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          Touchez l&apos;interface d&apos;examen,{" "}
          <span className="bg-gradient-to-r from-brand-crimson to-rose-500 bg-clip-text text-transparent">
            avant le jour J
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Testez directement ci-dessous les trois moteurs technologiques qui font la renommée de Super4C2. Cliquez sur les questions et les boutons pour interagir.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-3xl mx-auto p-1.5 rounded-2xl bg-muted/70 dark:bg-slate-900/80 border border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("ce")}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "ce"
              ? "bg-background text-foreground shadow-sm border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <Monitor className={`h-4 w-4 ${activeTab === "ce" ? "text-brand-crimson" : "text-muted-foreground"}`} />
          <span>1. Double Écran CBT (CE)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("eo")}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "eo"
              ? "bg-background text-foreground shadow-sm border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <Mic className={`h-4 w-4 ${activeTab === "eo" ? "text-brand-crimson" : "text-muted-foreground"}`} />
          <span>2. Examinateur IA Live (EO)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ee")}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "ee"
              ? "bg-background text-foreground shadow-sm border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <PenTool className={`h-4 w-4 ${activeTab === "ee" ? "text-brand-crimson" : "text-muted-foreground"}`} />
          <span>3. Magic Rewrite C1/C2 (EE)</span>
        </button>
      </div>

      {/* Interactive Simulator Shell (MacOS/CBT style) */}
      <div className="rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden transition-all duration-300">
        {/* Title bar / Top Bar */}
        <div className="bg-slate-900 text-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 text-xs select-none">
          {/* Traffic dots */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="font-mono text-slate-400 pl-2 text-[11px] hidden sm:inline">
              Super4C2 CBT Engine v3.4 • France Éducation International
            </span>
          </div>

          {/* Status pill & Timer */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Épreuve Conforme CBT
            </span>

            <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MODE 1 : COMPRÉHENSION ÉCRITE (DOUBLE ÉCRAN CBT + 39 QUESTIONS)
           ========================================================================= */}
        {activeTab === "ce" && (
          <div className="p-3 sm:p-5 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[460px] transition-colors">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-crimson">TCF CANADA CBT</span>
                <span className="text-slate-300 dark:text-slate-500">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Question {activeQuestionNumber} / 39 (Niveau B2)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                <button
                  type="button"
                  className="hover:text-amber-500 dark:hover:text-amber-400 flex items-center gap-1 transition-colors"
                  title="Marquer pour révision"
                >
                  <Flag className="h-3 w-3" />
                  <span>Marquer</span>
                </button>
              </div>
            </div>

            {/* Split Screen layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Document source à gauche */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[300px] text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 dark:text-slate-400">
                    Document Source
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                    Article de Presse
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Attractivité des provinces atlantiques canadiennes
                </h4>
                <p>
                  Depuis 2021, les provinces de l&apos;Atlantique (Nouveau-Brunswick, Nouvelle-Écosse) connaissent un afflux inédit de travailleurs qualifiés francophones. Face au coût de l&apos;immobilier dans les métropoles de Toronto et Vancouver, ces régions séduisent par leur qualité de vie et des voies d&apos;immigration facilitées.
                </p>
                <p className="bg-brand-crimson/10 border-l-2 border-brand-crimson pl-2 py-1 text-slate-800 dark:text-slate-200">
                  <em>
                    « L&apos;accès simplifié à la résidence permanente pour les francophones compense largement l&apos;éloignement géographique des grands centres urbains »
                  </em>
                  , souligne la sociologue québécoise Marcelle Dupont.
                </p>
                <p>
                  Toutefois, le principal défi demeure l&apos;intégration professionnelle rapide dans des secteurs spécialisés comme les technologies et la santé.
                </p>
              </div>

              {/* Questions et choix QCM à droite */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                      Question à Choix Unique
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">1 point</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Selon le document, quel facteur principal motive les candidats francophones à s&apos;installer en région atlantique ?
                  </p>

                  {/* Options A, B, C, D */}
                  <div className="space-y-2 pt-1">
                    {[
                      { id: 0, letter: "A", text: "Le climat tempéré des zones côtières." },
                      {
                        id: 1,
                        letter: "B",
                        text: "Les facilités d'obtention de la résidence permanente.",
                        isCorrect: true,
                      },
                      { id: 2, letter: "C", text: "La gratuité des logements urbains." },
                      { id: 3, letter: "D", text: "L'obligation formulée par les employeurs." },
                    ].map((opt) => {
                      const isSelected = selectedCeAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedCeAnswer(opt.id)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-brand-crimson bg-brand-crimson/10 dark:bg-brand-crimson/20 text-brand-crimson dark:text-white shadow-xs ring-1 ring-brand-crimson"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-5 w-5 rounded-full text-[11px] font-bold flex items-center justify-center font-mono ${
                                isSelected ? "bg-brand-crimson text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {opt.letter}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explication pédagogique instantanée */}
                {selectedCeAnswer !== null && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {selectedCeAnswer === 1
                        ? "Excellent ! Réponse exacte : Le passage « l'accès simplifié à la résidence permanente » valide le choix B."
                        : "Attention aux distracteurs : relisez le 2ème paragraphe sur les démarches d'immigration facilitées."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation 39 questions grid (Real CBT standard) */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Grille Officielle des 39 Questions (Cliquer pour naviguer) :</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">1 répondu • 38 en attente</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 39 }).map((_, idx) => {
                  const num = idx + 1;
                  const isActive = activeQuestionNumber === num;
                  const isAnswered = num === 4;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setActiveQuestionNumber(num)}
                      className={`h-6 w-6 rounded text-[10px] font-mono font-bold transition-all ${
                        isActive
                          ? "bg-brand-crimson text-white ring-1 ring-white"
                          : isAnswered
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2 : EXPRESSION ORALE EN DIRECT (STUDIO VIDÉO 16:9 + IA VOCALE)
           ========================================================================= */}
        {activeTab === "eo" && (
          <div className="p-4 sm:p-6 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[460px] transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Pod Visio Examinateur Laurent (16:9) */}
              <div className="md:col-span-6 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
                <Image
                  src="/brand/examiner-laurent.jpg"
                  alt="M. Laurent - Examinateur Officiel Super4C2"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                {/* Live indicators */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/85 dark:bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/20">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-500">🔴 EN DIRECT</span>
                  <span className="text-slate-700 dark:text-slate-400">• Tâche 2</span>
                </div>

                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                  <span className="font-semibold text-slate-200">M. Laurent (Examinateur FEI)</span>
                  {/* Waveform animation */}
                  <div className="flex items-center gap-0.5">
                    <span className="h-2 w-0.5 bg-cyan-400 animate-pulse" />
                    <span className="h-4 w-0.5 bg-cyan-400 animate-bounce" />
                    <span className="h-3 w-0.5 bg-cyan-400 animate-pulse" />
                    <span className="h-5 w-0.5 bg-cyan-400 animate-bounce" />
                    <span className="h-2 w-0.5 bg-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Panneau de dialogue interactif */}
              <div className="md:col-span-6 space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Consigne Officielle Tâche 2 (Jeu de rôle • 5 min)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Vous souhaitez inscrire votre enfant à une école de hockey sur glace à Montréal. Vous interrogez le directeur (M. Laurent) pour obtenir des précisions sur les horaires, les tarifs et l&apos;équipement.
                  </p>
                </div>

                {/* Réplique de M. Laurent */}
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" /> M. Laurent vous répond :
                    </span>
                    <span className="text-[10px] text-cyan-600/70 dark:text-cyan-300/60 font-mono">Audio HD</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic">
                    {eoExchangeStep === 1
                      ? "« Bonjour ! Absolument, les cours débutent à 8h le samedi. Cependant, nous exigeons un certificat médical complet avant toute inscription. Est-ce que votre fils a déjà patiné auparavant ? »"
                      : "« Très bien, c'est un point positif. Concernant l'équipement de protection, préférez-vous louer notre pack ou acheter votre propre matériel agréé ? »"}
                  </p>
                </div>

                {/* Actions candidat interactives */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Votre tour de parole :</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setEoSpeaking(true);
                        setTimeout(() => {
                          setEoSpeaking(false);
                          setEoExchangeStep((s) => (s === 1 ? 2 : 1));
                        }, 1200);
                      }}
                      className="bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-bold gap-1.5"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>{eoSpeaking ? "Enregistrement en cours..." : "Simuler ma réponse vocale"}</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEoExchangeStep((s) => (s === 1 ? 2 : 1))}
                      className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Relancer l&apos;examinateur</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 3 : EXPRESSION ÉCRITE (MAGIC REWRITE C1/C2 & CRITÈRES FEI)
           ========================================================================= */}
        {activeTab === "ee" && (
          <div className="p-4 sm:p-6 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[460px] transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-crimson">
                  Tâche 3 FEI • Prise de position argumentée (120-180 mots)
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200">
                  Sujet : Faut-il interdire la publicité ciblant les enfants sur les plateformes vidéo ?
                </h4>
              </div>

              {/* Magic Rewrite toggle switch */}
              <button
                type="button"
                onClick={() => setShowMagicRewrite(!showMagicRewrite)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  showMagicRewrite
                    ? "bg-gradient-to-r from-brand-crimson to-rose-500 text-white shadow-md shadow-brand-crimson/20"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>{showMagicRewrite ? "Afficher Brouillon Candidat (B1)" : "Activer Magic Rewrite C1/C2 ✨"}</span>
              </button>
            </div>

            {/* Split before / after showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Draft ou réécriture */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    {showMagicRewrite ? "Version Optimisée C1/C2 (Magic Rewrite)" : "Copie Brute du Candidat (Niveau B1)"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">142 mots</span>
                </div>

                {showMagicRewrite ? (
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-900 dark:text-slate-100 space-y-2">
                    <span className="bg-brand-crimson/15 dark:bg-brand-crimson/20 text-brand-crimson font-semibold px-1 rounded">En premier lieu</span>
                    , il convient de souligner que la vulnérabilité psychologique des jeunes publics commande une régulation intransigeante des algorithmes publicitaires.{" "}
                    <span className="bg-brand-crimson/15 dark:bg-brand-crimson/20 text-brand-crimson font-semibold px-1 rounded">Loin de constituer</span>{" "}
                    une simple incitation commerciale, ces spots formatent les comportements de consommation dès le plus jeune âge.{" "}
                    <span className="bg-brand-crimson/15 dark:bg-brand-crimson/20 text-brand-crimson font-semibold px-1 rounded">Par conséquent</span>
                    , la responsabilité des régulateurs canadiens est expressément engagée.
                  </p>
                ) : (
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                    Moi je pense que la publicité pour les enfants est très mauvaise. Les enfants ne comprennent pas ce que c&apos;est et ils demandent toujours à leurs parents d&apos;acheter des jouets. Il faut donc interdire les pubs sur Internet parce que c&apos;est dangereux pour eux.
                  </p>
                )}
              </div>

              {/* Barème FEI et retour analytique instantané */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      Évaluation Grille FEI (0 Seconde)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {showMagicRewrite ? "Score Estimé : NCLC 9 (C1)" : "Score Estimé : NCLC 5 (B1)"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Adéquation à la consigne :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">5 / 5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Cohérence &amp; Connecteurs :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{showMagicRewrite ? "5 / 5" : "3 / 5"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Richesse Lexicale :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{showMagicRewrite ? "5 / 5 (C1)" : "2.5 / 5"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Morphosyntaxe &amp; Accords :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{showMagicRewrite ? "5 / 5" : "3 / 5"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50/80 dark:bg-primary/10 border border-rose-200/60 dark:border-primary/20 text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-primary">Verdict du moteur Super4C2 : </span>
                  {showMagicRewrite
                    ? "Structure argumentative impeccable avec connecteurs logiques de niveau supérieur (NCLC 9 garanti)."
                    : "Texte compréhensible mais vocabulaire pauvre (répétitions de « enfants » et « parce que »). Cliquez sur Magic Rewrite pour voir la version C1/C2 !"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer banner with CTA */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Plus de 1 200 questions officielles disponibles en continu.</span>
          </div>

          <Button
            asChild
            size="sm"
            className="w-full sm:w-auto bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold px-4 py-2 text-xs rounded-full shadow-md gap-1.5"
          >
            <Link href="/examens?test=tcf">
              <span>Lancer un test complet gratuit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
