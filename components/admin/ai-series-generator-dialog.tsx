"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Wand2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface AiSeriesGeneratorDialogProps {
  initialSeriesId?: string;
  initialSeriesNumber?: number;
  triggerButton?: React.ReactNode;
}

type StepStatus = "idle" | "running" | "done" | "error";

interface StepState {
  tier: "tier_1_a1_a2" | "tier_2_b1_b2" | "tier_3_c1_c2";
  label: string;
  count: number;
  status: StepStatus;
  summary?: string;
}

const THEMES = [
  {
    id: "standard",
    label: "Standard Officiel Équilibré",
    desc: "Vie quotidienne, administration, travail, écologie et société contemporaine.",
  },
  {
    id: "canada_work",
    label: "Focus Marché du Travail Canadien",
    desc: "Télétravail, compétences professionnelles, intégration en entreprise au Québec et Canada.",
  },
  {
    id: "ecology",
    label: "Focus Transition Écologique & Climat",
    desc: "Économie circulaire, mobilités douces, énergies renouvelables et urbanisme vert.",
  },
  {
    id: "culture",
    label: "Focus Culture & Enjeux Sociétaux",
    desc: "Arts, sociologie, éducation numérique et éthique des nouvelles technologies.",
  },
];

export function AiSeriesGeneratorDialog({
  initialSeriesId,
  initialSeriesNumber,
  triggerButton,
}: AiSeriesGeneratorDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].label);
  const [seriesNumber, setSeriesNumber] = useState<number>(initialSeriesNumber || 102);
  const [seriesTitle, setSeriesTitle] = useState<string>(
    `TCF Canada — Compréhension Écrite, Série ${initialSeriesNumber || 102} (Officielle)`
  );

  const [steps, setSteps] = useState<StepState[]>([
    {
      tier: "tier_1_a1_a2",
      label: "Lot 1 · Paliers A1 & A2 (Q1 à Q12)",
      count: 12,
      status: "idle",
    },
    {
      tier: "tier_2_b1_b2",
      label: "Lot 2 · Paliers B1 & B2 (Q13 à Q28 — Seuil NCLC 7)",
      count: 16,
      status: "idle",
    },
    {
      tier: "tier_3_c1_c2",
      label: "Lot 3 · Paliers C1 & C2 (Q29 à Q39 — Maîtrise)",
      count: 11,
      status: "idle",
    },
  ]);

  const [completedSeriesId, setCompletedSeriesId] = useState<string | null>(initialSeriesId || null);
  const [recentLogs, setRecentLogs] = useState<string[]>([]);

  // Calcul du pourcentage d'avancement
  const completedCount = steps.reduce(
    (acc, s) => acc + (s.status === "done" ? s.count : 0),
    0
  );
  const progressPercent = Math.round((completedCount / 39) * 100);
  const isFinished = steps.every((s) => s.status === "done");

  const runSequentialGeneration = async () => {
    setIsGenerating(true);
    setRecentLogs([]);
    let currentSeriesId = initialSeriesId || completedSeriesId;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Mise à jour état de l'étape
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s))
      );

      try {
        const res = await fetch("/api/admin/generate-bulk-series", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seriesId: currentSeriesId || undefined,
            seriesNumber: currentSeriesId ? undefined : seriesNumber,
            seriesTitle: currentSeriesId ? undefined : seriesTitle,
            theme: selectedTheme,
            batch: step.tier,
          }),
        });

        if (!res.ok) {
          throw new Error(`Erreur lors de la génération du ${step.label}`);
        }

        const data = await res.json();
        currentSeriesId = data.seriesId;
        setCompletedSeriesId(data.seriesId);

        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? {
                  ...s,
                  status: "done",
                  summary: `${data.createdCount} questions insérées avec succès ✓`,
                }
              : s
          )
        );

        if (Array.isArray(data.questionsSummary)) {
          const sample = data.questionsSummary
            .slice(0, 3)
            .map(
              (q: { questionNumber: number; cefrLevel: string; documentTitle: string }) =>
                `Q${q.questionNumber} [${q.cefrLevel}] : ${q.documentTitle}`
            );
          setRecentLogs((prev) => [...prev, ...sample]);
        }
      } catch (error) {
        console.error("Échec génération:", error);
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "error" } : s))
        );
        toast.error(`Erreur sur ${step.label} : ${String(error)}`);
        setIsGenerating(false);
        return;
      }
    }

    setIsGenerating(false);
    toast.success("Série complète de 39 questions générée avec succès !");
    router.refresh();
  };

  const handleOpenChange = (open: boolean) => {
    if (isGenerating && !open) {
      if (
        !confirm(
          "Une génération est en cours. Voulez-vous vraiment fermer cette fenêtre ?"
        )
      ) {
        return;
      }
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            className="gap-2 font-bold shadow-md bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white"
          >
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>Générer Série 39Q avec IA</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-card border-border shadow-2xl p-6 sm:p-7">
        <DialogHeader className="space-y-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3 text-primary" />
              Moteur Aura C2™ · Calibration Officielle FEI
            </span>
          </div>

          <DialogTitle className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center justify-between">
            <span>Générateur IA de Série CE (39 Questions)</span>
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Concevez une série intégrale calibrée sur la matrice officielle France Éducation International (A1 à C2, NCLC 3 à 10+) en 1 clic.
          </DialogDescription>
        </DialogHeader>

        {/* Configuration Section (disabled during generation) */}
        {!isFinished && (
          <div className="space-y-4 pt-2">
            {!initialSeriesId && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-foreground">Numéro Série</label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={seriesNumber}
                    disabled={isGenerating}
                    onChange={(e) => {
                      const num = Number(e.target.value) || 102;
                      setSeriesNumber(num);
                      setSeriesTitle(`TCF Canada — Compréhension Écrite, Série ${num} (Officielle)`);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border bg-muted/30 text-xs font-bold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-foreground">Titre Officiel</label>
                  <input
                    type="text"
                    value={seriesTitle}
                    disabled={isGenerating}
                    onChange={(e) => setSeriesTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border bg-muted/30 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Orientation Thématique & Vocabulaire :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => setSelectedTheme(t.label)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                      selectedTheme === t.label
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="font-bold text-foreground">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Stepper & Live Status */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Progression de la Série : {completedCount} / 39 questions
            </span>
            <span className="font-mono font-bold text-primary">{progressPercent}%</span>
          </div>

          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            {steps.map((s, idx) => (
              <div
                key={s.tier}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                  s.status === "running"
                    ? "border-primary bg-primary/5 animate-pulse"
                    : s.status === "done"
                    ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                    : s.status === "error"
                    ? "border-rose-500/30 bg-rose-500/5 text-rose-600"
                    : "border-border/60 bg-muted/20 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {s.status === "running" && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                  {s.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {s.status === "error" && <AlertCircle className="h-4 w-4 text-rose-500" />}
                  {s.status === "idle" && (
                    <span className="h-4 w-4 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                  )}
                  <div>
                    <div className="font-bold text-foreground">{s.label}</div>
                    {s.summary && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {s.summary}
                      </div>
                    )}
                  </div>
                </div>

                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground">
                  +{s.count} Q
                </span>
              </div>
            ))}
          </div>

          {/* Real-time Question Preview Log */}
          {recentLogs.length > 0 && (
            <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-[11px] space-y-1 font-mono text-muted-foreground max-h-24 overflow-y-auto">
              <div className="font-bold text-foreground text-[10px] uppercase tracking-wider">
                Dernières questions rédigées par l&apos;IA :
              </div>
              {recentLogs.map((log, i) => (
                <div key={i} className="truncate">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground">
            {isFinished ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Série 39 questions prête pour la production !
              </span>
            ) : isGenerating ? (
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                Génération des questions et analyse des pièges en cours...
              </span>
            ) : (
              <span>Temps estimé : ~15 à 30 secondes pour 39 questions.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isFinished ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-xs"
                >
                  Fermer
                </Button>

                {completedSeriesId && (
                  <Button
                    asChild
                    size="sm"
                    className="gap-2 font-bold bg-primary hover:bg-primary/90 text-white text-xs"
                  >
                    <a href={`/admin/series-ce/${completedSeriesId}/questions`}>
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Ouvrir la Série ({seriesNumber})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isGenerating}
                  onClick={() => setIsOpen(false)}
                  className="text-xs"
                >
                  Annuler
                </Button>

                <Button
                  size="sm"
                  disabled={isGenerating}
                  onClick={runSequentialGeneration}
                  className="gap-2 font-bold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white text-xs"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>Lancer la Génération (39Q)</span>
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
