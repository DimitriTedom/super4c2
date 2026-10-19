"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Calendar,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Clock,
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
  { level: 7, label: "NCLC 7 (B2 Avancé)", bonus: "+50 pts CRS", desc: "Seuil critique fédéral Entrée Express" },
  { level: 8, label: "NCLC 8 (C1 Intermédiaire)", bonus: "+56 pts CRS", desc: "Profil prioritaire tirages ciblés" },
  { level: 9, label: "NCLC 9 (C1 Avancé)", bonus: "+62 pts CRS", desc: "Score maximisé pour candidat seul" },
  { level: 10, label: "NCLC 10 (C2 Maîtrise)", bonus: "Score Max", desc: "Bilinguisme parfait garanti" },
];

export function FirstLoginSetupModal({
  userId,
  initialDisplayName,
  hasExamDate,
  initialTargetNclc = 7,
}: FirstLoginSetupModalProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [displayName, setDisplayName] = React.useState(initialDisplayName || "");
  const [targetNclc, setTargetNclc] = React.useState<number>(initialTargetNclc);
  const [examDate, setExamDate] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    // Vérifier si déjà dismissé ou si la date d'examen est déjà configurée
    const dismissed = localStorage.getItem(`super4c2:onboarding_dismissed:${userId}`);
    if (!dismissed && !hasExamDate) {
      // Petite temporisation pour une ouverture fluide après le premier rendu
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [userId, hasExamDate]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(`super4c2:onboarding_dismissed:${userId}`, "true");
    } catch {
      // localStorage indisponible
    }
    setOpen(false);
  };

  const setQuickDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    setExamDate(d.toISOString().split("T")[0]);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || undefined,
          targetNclc,
          examDate: examDate ? new Date(examDate).toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Impossible d'enregistrer le profil.");
      }

      try {
        localStorage.setItem(`super4c2:onboarding_dismissed:${userId}`, "true");
      } catch {
        // localStorage indisponible
      }

      toast.success("Objectif enregistré avec succès !", {
        description: `Votre plan de travail personnalisé vers le NCLC ${targetNclc} est prêt.`,
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
    <Dialog open={open} onOpenChange={(val) => !val && handleDismiss()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* En-tête avec dégradé subtil */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Compass className="h-3.5 w-3.5" />
              Configuration initiale • Étape {step}/2
            </span>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
            >
              Passer pour l&apos;instant
            </button>
          </div>
          <DialogTitle className="mt-3 font-display text-xl sm:text-2xl font-black tracking-tight">
            Bienvenue sur Super4C2 ! 🇨🇦
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            Personnalisez votre simulateur en 30 secondes pour calibrer vos épreuves CBT et vos alertes NCLC.
          </DialogDescription>
        </div>

        {/* Corps avec transition animée */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label htmlFor="onboarding-name" className="text-xs font-semibold text-foreground">
                    Comment préférez-vous qu&apos;on vous appelle ?
                  </label>
                  <Input
                    id="onboarding-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Votre prénom ou nom d'usage"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-primary" />
                      Quel est votre palier NCLC visé ?
                    </label>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Entrée Express Fédérale
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {NCLC_GOALS.map((goal) => {
                      const isSelected = targetNclc === goal.level;
                      return (
                        <button
                          key={goal.level}
                          type="button"
                          onClick={() => setTargetNclc(goal.level)}
                          className={`text-left p-3 rounded-2xl border transition-all relative ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                              : "border-border/60 hover:border-border hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{goal.label}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {goal.bonus}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                            {goal.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="gap-2 h-11 px-5 rounded-xl font-bold"
                  >
                    Suivant : Date d&apos;examen
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label htmlFor="onboarding-date" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    Quand prévoyez-vous de passer votre test (TCF / TEF) ?
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Cette date calibre votre compte à rebours et active les révisions SRS prioritaires.
                  </p>
                  <Input
                    id="onboarding-date"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="h-11 rounded-xl"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Raccourcis rapides d&apos;échéance :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickDate(1)}
                      className="rounded-xl text-xs h-8"
                    >
                      Dans 1 mois (Urgence)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickDate(2)}
                      className="rounded-xl text-xs h-8"
                    >
                      Dans 2 mois (Recommandé)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickDate(3)}
                      className="rounded-xl text-xs h-8"
                    >
                      Dans 3 mois
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Récapitulatif de votre objectif
                  </div>
                  <p className="text-muted-foreground">
                    Palier : <strong className="text-foreground">NCLC {targetNclc}</strong> (+50 pts CRS) •{" "}
                    Échéance :{" "}
                    <strong className="text-foreground">
                      {examDate
                        ? new Date(examDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "À définir plus tard"}
                    </strong>
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="gap-2 rounded-xl text-xs"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDismiss}
                      disabled={isSubmitting}
                      className="rounded-xl text-xs"
                    >
                      Plus tard
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="gap-2 h-11 px-5 rounded-xl font-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          Valider mon objectif
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
