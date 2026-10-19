"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Target,
  Calendar,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Sparkles,
  X,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FirstLoginSetupModalProps {
  userId: string;
  initialDisplayName?: string | null;
  hasExamDate?: boolean;
  initialTargetNclc?: number;
}

const NCLC_GOALS = [
  { level: 7, label: "NCLC 7", sub: "B2 Avancé", bonus: "+50 pts CRS", desc: "Seuil critique fédéral" },
  { level: 8, label: "NCLC 8", sub: "C1 Interm.", bonus: "+56 pts CRS", desc: "Tirages ciblés" },
  { level: 9, label: "NCLC 9", sub: "C1 Avancé", bonus: "+62 pts CRS", desc: "Score maximisé" },
  { level: 10, label: "NCLC 10", sub: "C2 Expert", bonus: "Max CRS", desc: "Bilinguisme parfait" },
];

type DateMode = "1_month" | "2_months" | "3_months" | "custom" | "unknown";

export function FirstLoginSetupModal({
  userId,
  initialDisplayName,
  hasExamDate,
  initialTargetNclc = 7,
}: FirstLoginSetupModalProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [targetNclc, setTargetNclc] = React.useState<number>(initialTargetNclc);
  const [dateMode, setDateMode] = React.useState<DateMode>("2_months");
  const [customDate, setCustomDate] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const dismissed = localStorage.getItem(`super4c2:onboarding_dismissed:${userId}`);
    if (!dismissed && !hasExamDate) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [userId, hasExamDate]);

  const handleSkip = () => {
    try {
      localStorage.setItem(`super4c2:onboarding_dismissed:${userId}`, "true");
    } catch {
      // Ignored if local storage unavailable
    }
    setOpen(false);
    toast.info("Étape passée", {
      description: "Vous pourrez définir votre date et votre objectif à tout moment sur votre profil.",
    });
  };

  const computeSelectedDate = (): string | undefined => {
    if (dateMode === "unknown") return undefined;
    if (dateMode === "custom") {
      return customDate ? new Date(customDate).toISOString() : undefined;
    }
    const d = new Date();
    const months = dateMode === "1_month" ? 1 : dateMode === "2_months" ? 2 : 3;
    d.setMonth(d.getMonth() + months);
    return d.toISOString();
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const computedDate = computeSelectedDate();

      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetNclc,
          examDate: computedDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Impossible d'enregistrer le profil.");
      }

      try {
        localStorage.setItem(`super4c2:onboarding_dismissed:${userId}`, "true");
      } catch {
        // Ignored
      }

      toast.success("Objectif enregistré avec succès !", {
        description: `Simulateur calibré sur NCLC ${targetNclc}. Bon entraînement !`,
      });

      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erreur de configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleSkip()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* Header Premium avec bouton Skip haut droit */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
              <Compass className="h-3.5 w-3.5" />
              Personnalisation rapide
            </span>
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-xs font-semibold px-2 py-1 rounded-lg hover:bg-muted/60 transition-colors"
            >
              Passer (Skip)
            </button>
          </div>
          <DialogTitle className="mt-2.5 font-display text-xl sm:text-2xl font-black tracking-tight">
            Bienvenue sur Super4C2 🇨🇦
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Calibrez votre plan d&apos;entraînement en 20 secondes. Tout est modifiable plus tard sur votre profil.
          </DialogDescription>
        </div>

        {/* Corps - 1 seul écran synthétique */}
        <div className="p-6 space-y-5">
          {/* 1. Choix du palier NCLC */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                1. Votre objectif linguistique (Entrée Express)
              </label>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Bonus fédéral
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NCLC_GOALS.map((goal) => {
                const isSelected = targetNclc === goal.level;
                return (
                  <button
                    key={goal.level}
                    type="button"
                    onClick={() => setTargetNclc(goal.level)}
                    className={`text-left p-2.5 rounded-2xl border transition-all relative ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">{goal.label}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{goal.sub}</div>
                    <div className="mt-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                      {goal.bonus}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Échéance d'examen */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              2. Date prévisionnelle de passage (TCF / TEF)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDateMode("1_month")}
                className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all ${
                  dateMode === "1_month"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Dans 1 mois (Urgence)
              </button>
              <button
                type="button"
                onClick={() => setDateMode("2_months")}
                className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all ${
                  dateMode === "2_months"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Dans 2 mois (Idéal)
              </button>
              <button
                type="button"
                onClick={() => setDateMode("3_months")}
                className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all ${
                  dateMode === "3_months"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Dans 3 mois
              </button>
              <button
                type="button"
                onClick={() => setDateMode("custom")}
                className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all ${
                  dateMode === "custom"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Date exacte...
              </button>
              <button
                type="button"
                onClick={() => setDateMode("unknown")}
                className={`col-span-2 sm:col-span-2 py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all ${
                  dateMode === "unknown"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Pas encore fixé (décision plus tard)
              </button>
            </div>

            {/* Input spécifique si date exacte */}
            {dateMode === "custom" && (
              <div className="pt-1">
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="h-10 rounded-xl"
                  placeholder="Sélectionnez le jour de votre test"
                />
              </div>
            )}

            {dateMode === "unknown" && (
              <p className="text-[11px] text-muted-foreground italic bg-muted/30 p-2.5 rounded-xl border border-border/40">
                💡 Vous pourrez vous entraîner librement et ajouter votre date dès que votre centre agréé vous aura confirmé votre inscription.
              </p>
            )}
          </div>

          {/* Actions : CTA primaire et Skip explicite */}
          <div className="pt-3 border-t border-border/60 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground h-10 rounded-xl"
            >
              Passer et aller au tableau de bord
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting || (dateMode === "custom" && !customDate)}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enregistrement...
                </>
              ) : (
                <>
                  Valider mon objectif
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
