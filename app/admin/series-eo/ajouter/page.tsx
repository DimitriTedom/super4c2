import Link from "next/link";
import { ArrowLeft, Mic, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOralSeriesAction } from "../actions";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Créer une Série EO — Back-Office | Super4C2",
};

export default async function AddOralSeriesPage() {
  let suggestedNumber = 101;
  try {
    const lastSeries = await prisma.oralSeries.findFirst({
      orderBy: { seriesNumber: "desc" },
      select: { seriesNumber: true },
    });
    suggestedNumber = (lastSeries?.seriesNumber ?? 100) + 1;
  } catch {
    suggestedNumber = 101;
  }

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <Link href="/admin/series-eo">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux séries d&apos;Expression Orale</span>
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="border-b pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
            <Mic className="h-3 w-3" />
            Nouvelle Épreuve · Expression Orale
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Créer une Série d&apos;Expression Orale
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Définissez les paramètres de la série. Vous pourrez ensuite configurer les 3 tâches orales officielles FEI et leurs prompts d&apos;examinateur IA.
          </p>
        </div>

        {/* Form */}
        <form action={createOralSeriesAction} className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Numéro de Série <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="seriesNumber"
                defaultValue={suggestedNumber}
                required
                min={1}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Ex: 101, 102, 103 (doit être unique).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Type d&apos;Épreuve <span className="text-primary">*</span>
              </label>
              <Select name="examType" defaultValue="TCF_CANADA">
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="TCF_CANADA">TCF Canada (Format Officiel)</SelectItem>
                  <SelectItem value="TEF_CANADA">TEF Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Titre de la Série <span className="text-primary">*</span>
            </label>
            <Input
              type="text"
              name="title"
              placeholder="Ex: TCF Canada — Expression Orale, Série 101"
              defaultValue={`TCF Canada — Expression Orale, Série ${suggestedNumber}`}
              required
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Durée Officielle (en minutes)
            </label>
            <Input
              type="number"
              name="durationMinutes"
              defaultValue={12}
              min={5}
              max={30}
              className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              12 minutes réglementaires pour les 3 tâches orales (720 secondes).
            </p>
          </div>

          <div className="pt-2 border-t space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">Publiée immédiatement</p>
                <p className="text-[11px] text-muted-foreground">
                  Visible par les candidats dès l&apos;ajout des 3 tâches.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isFreeDemo"
                value="true"
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">Démo Gratuite</p>
                <p className="text-[11px] text-muted-foreground">
                  Accessible aux candidats sans abonnement Premium actif.
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/series-eo">Annuler</Link>
            </Button>

            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>Créer &amp; Configurer les Tâches</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
