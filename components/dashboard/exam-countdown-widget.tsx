"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Edit2, Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "super4c2:exam_date";

export function ExamCountdownWidget() {
  const [examDate, setExamDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputDate, setInputDate] = useState("");
  const [targetExam, setTargetExam] = useState("TCF Canada");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setExamDate(saved);
        setInputDate(saved);
      } else {
        // Default suggestion: 45 days from today
        const d = new Date();
        d.setDate(d.getDate() + 45);
        setInputDate(d.toISOString().split("T")[0]);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveDate = () => {
    if (!inputDate) return;
    try {
      localStorage.setItem(STORAGE_KEY, inputDate);
      setExamDate(inputDate);
      setDialogOpen(false);
    } catch {
      // Ignore
    }
  };

  // Calculate days remaining
  let daysLeft: number | null = null;
  if (examDate) {
    const target = new Date(examDate).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  }

  // Get phase metadata based on remaining days
  const getPhaseMeta = (days: number) => {
    if (days < 0) {
      return {
        label: "Examen passé",
        desc: "Félicitations pour votre session ! Consultez votre bilan.",
        color: "bg-muted text-muted-foreground border-border",
      };
    }
    if (days <= 14) {
      return {
        label: "Sprint Final",
        desc: "Dernière ligne droite : révisez vos pièges récurrents dans le Carnet SRS.",
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      };
    }
    if (days <= 45) {
      return {
        label: "Phase Intensive",
        desc: "Enchaînez les séries complètes en mode Examen Strict 60 min.",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      };
    }
    return {
      label: "Phase d'Apprentissage",
      desc: "Maîtrisez les structures B2/C1 et le vocabulaire administratif FEI.",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    };
  };

  return (
    <>
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Objectif Examen Officiel</span>
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Modifier la date cible"
          >
            <Edit2 className="h-3 w-3 mr-1" />
            <span>{examDate ? "Modifier" : "Définir"}</span>
          </Button>
        </div>

        {daysLeft !== null && daysLeft >= 0 && examDate ? (
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-foreground tabular-nums">
                J-{daysLeft}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {daysLeft > 1 ? "jours restants" : "jour restant"}
              </span>
            </div>

            {/* Phase badge */}
            {(() => {
              const meta = getPhaseMeta(daysLeft);
              return (
                <div className="space-y-1.5">
                  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold", meta.color)}>
                    {meta.label}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              );
            })()}

            <p className="text-[11px] text-muted-foreground font-mono">
              Date ciblée : {new Date(examDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vous n&apos;avez pas encore défini votre date de passage d&apos;examen officiel.
            </p>
            <Button
              type="button"
              onClick={() => setDialogOpen(true)}
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/5"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Fixer ma date d&apos;examen officiel</span>
            </Button>
          </div>
        )}
      </div>

      {/* Dialog: Éditer la date cible */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Définir votre date d&apos;examen officiel</DialogTitle>
            <DialogDescription>
              Cette échéance permet d&apos;adapter votre rythme d&apos;entraînement quotidien et d&apos;optimiser votre progression vers le palier NCLC 7.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="exam-date-input" className="text-xs font-bold text-foreground">
                Date de passation de votre test :
              </label>
              <input
                id="exam-date-input"
                type="date"
                value={inputDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="target-exam-select" className="text-xs font-bold text-foreground">
                Examen visé :
              </label>
              <select
                id="target-exam-select"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              >
                <option value="TCF Canada">TCF Canada (Immigration Fédérale)</option>
                <option value="TEF Canada">TEF Canada (CCI Paris)</option>
                <option value="TCF Québec">TCF Québec</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveDate} className="bg-primary text-white font-bold">
              Enregistrer mon objectif
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
