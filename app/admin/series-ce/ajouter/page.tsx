import Link from "next/link";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSeriesCeAction } from "../actions";

export const metadata = {
  title: "Créer une Série CE — Back-Office | Super4C2",
};

export default function AjouterSeriesCePage() {
  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <Link href="/admin/series-ce">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la liste des séries</span>
            </Link>
          </Button>
        </div>

        {/* Title Card */}
        <div className="border-b pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
            <BookOpen className="h-3 w-3" />
            Nouvelle Série Compréhension Écrite
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Créer une Série d&apos;Examen CE
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Initialisez une nouvelle série de Compréhension Écrite avant d&apos;y ajouter ses 39 questions authentiques.
          </p>
        </div>

        {/* Form Container */}
        <form action={createSeriesCeAction} className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Numéro de Série <span className="text-primary">*</span>
                </label>
                <Input
                  type="number"
                  name="seriesNumber"
                  placeholder="Ex: 102"
                  min={1}
                  required
                  className="h-10 text-xs rounded-xl bg-muted/20"
                />
                <p className="text-[11px] text-muted-foreground">
                  Identifiant officiel (ex: 101, 102, 103...).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Durée Officielle (Minutes) <span className="text-primary">*</span>
                </label>
                <Input
                  type="number"
                  name="durationMinutes"
                  defaultValue={60}
                  min={10}
                  max={120}
                  required
                  className="h-10 text-xs rounded-xl bg-muted/20"
                />
                <p className="text-[11px] text-muted-foreground">
                  60 minutes pour l&apos;épreuve officielle de Compréhension Écrite.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Titre Complet de l&apos;Épreuve <span className="text-primary">*</span>
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Ex: TCF Canada — Compréhension Écrite, Série 102 (Officiel)"
                required
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            {/* Checkbox toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              <label className="flex items-start gap-3 p-3 rounded-xl border bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked
                  className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <span className="font-bold text-foreground block">Publier immédiatement</span>
                  <span className="text-muted-foreground text-[11px]">
                    Rendre la série visible dans le catalogue des candidats.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                <input
                  type="checkbox"
                  name="isFreeDemo"
                  className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <span className="font-bold text-foreground block">Démo Gratuite</span>
                  <span className="text-muted-foreground text-[11px]">
                    Accessible sans pass ni abonnement actif.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/series-ce">Annuler</Link>
            </Button>
            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>Créer la série et passer aux questions</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
