"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Target,
  Calendar,
  Globe,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerGlobalLoading } from "@/components/ui/top-body-loader";
import { cn } from "@/lib/utils";

interface ProfileData {
  displayName?: string | null;
  targetNclc?: number | null;
  examDate?: string | null;
  country?: string | null;
  phone?: string | null;
}

interface ProfileEditFormProps {
  initialProfile: ProfileData;
  userEmail: string;
}

const NCLC_OPTIONS = [
  { value: 7, label: "NCLC 7 (Seuil Express +50 pts)", desc: "Niveau B2 avancé" },
  { value: 8, label: "NCLC 8 (Sécurité Maximale)", desc: "Niveau B2+/C1" },
  { value: 9, label: "NCLC 9 (Score d'Excellence)", desc: "Niveau C1 supérieur" },
  { value: 10, label: "NCLC 10 (C2 Bilingue)", desc: "Maîtrise totale" },
];

export function ProfileEditForm({ initialProfile, userEmail }: ProfileEditFormProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(
    initialProfile.displayName || userEmail.split("@")[0] || ""
  );
  const [targetNclc, setTargetNclc] = useState<number>(initialProfile.targetNclc || 7);
  const [examDate, setExamDate] = useState<string>(
    initialProfile.examDate ? initialProfile.examDate.split("T")[0] : ""
  );
  const [country, setCountry] = useState<string>(initialProfile.country || "");
  const [phone, setPhone] = useState<string>(initialProfile.phone || "");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    triggerGlobalLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          targetNclc,
          examDate: examDate || null,
          country: country || null,
          phone: phone || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Impossible d'enregistrer le profil.");
      }

      // Synchroniser également la date cible dans le localStorage pour le widget J-X
      if (examDate) {
        try {
          localStorage.setItem("super4c2:exam_date", examDate);
        } catch {
          // Ignore storage error
        }
      }

      setSuccessMsg("Votre profil candidat a été mis à jour avec succès !");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsLoading(false);
      triggerGlobalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border bg-card p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Paramètres Candidat
          </span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Édition du Profil & Objectifs
          </h2>
          <p className="text-xs text-muted-foreground">
            Personnalisez vos préférences pour adapter les simulations et le suivi de vos scores.
          </p>
        </div>

        {successMsg && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Enregistré</span>
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Nom d'affichage */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>Nom ou Pseudo Candidat</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ex: Alexandre T."
            required
            className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Apparaîtra sur votre tableau de bord et dans vos fiches de débriefing officiel.
          </p>
        </div>

        {/* Date d'examen officiel */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Date Prévue de l&apos;Examen TCF</span>
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Alimente automatiquement le compte à rebours J-X du tableau de bord.
          </p>
        </div>

        {/* Pays de résidence */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>Pays de Résidence</span>
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ex: Cameroun, Sénégal, Maroc, France..."
            className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Permet de vous proposer les centres d&apos;examen agréés FEI les plus proches.
          </p>
        </div>

        {/* Téléphone / WhatsApp */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span>Numéro WhatsApp (Optionnel)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: +237 6XX XX XX XX"
            className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Pour recevoir les notifications d&apos;alertes sur les sujets d&apos;examen récents.
          </p>
        </div>
      </div>

      {/* Palier NCLC cible */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-primary" />
          <span>Palier d&apos;Ambition NCLC Cible</span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NCLC_OPTIONS.map((opt) => {
            const isSelected = targetNclc === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTargetNclc(opt.value)}
                className={cn(
                  "flex flex-col text-left p-3.5 rounded-2xl border transition-all text-xs space-y-1",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border bg-background hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-display font-bold text-sm text-foreground">
                    NCLC {opt.value}
                  </span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground">
          Les modifications sont enregistrées sur votre espace personnel.
        </span>

        <Button
          type="submit"
          loading={isLoading}
          loadingText="Enregistrement en cours..."
          className="gap-2 font-semibold shadow-xs"
        >
          <Save className="h-4 w-4" />
          <span>Enregistrer mon profil</span>
        </Button>
      </div>
    </form>
  );
}
