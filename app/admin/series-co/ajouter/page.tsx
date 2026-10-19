import Link from "next/link";
import { ArrowLeft, Headphones, Lock, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSeriesCoAction } from "../actions";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Créer une Série CO — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

export default async function AddSeriesCoPage() {
  let suggestedNumber = 101;
  try {
    const lastSeries = await prisma.examSeries.findFirst({
      where: {
        examType: "TCF_CANADA",
        discipline: "COMPREHENSION_ORALE",
      },
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
            <Link href="/admin/series-co">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux séries de Compréhension Orale</span>
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="border-b pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1.5">
            <Lock className="h-3 w-3" />
            Module en Préparation · Coming Soon
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Headphones className="h-6 w-6 text-primary" />
            <span>Créer une Série de Compréhension Orale</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Préparez une nouvelle série de 39 questions avec pistes audio officielles pour l&apos;écoute TCF Canada.
          </p>
        </div>

        {/* Form */}
        <form action={createSeriesCoAction} className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
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
                Ex: 101, 102 (identifiant unique pour la discipline CO).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Durée d&apos;Écoute Officielle (minutes)
              </label>
              <Input
                type="number"
                name="durationMinutes"
                defaultValue={35}
                min={15}
                max={60}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                35 minutes réglementaires FEI (2100 secondes).
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Titre de la Série CO <span className="text-primary">*</span>
            </label>
            <Input
              type="text"
              name="title"
              placeholder="Ex: TCF Canada — Compréhension Orale, Série 101"
              defaultValue={`TCF Canada — Compréhension Orale, Série ${suggestedNumber}`}
              required
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
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
                <p className="text-xs font-bold text-foreground">Publier dans le back-office</p>
                <p className="text-[11px] text-muted-foreground">
                  Marquée disponible pour les tests internes (reste étiquetée Coming Soon pour les candidats).
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
                <p className="text-xs font-bold text-foreground">Accès Démo Gratuite</p>
                <p className="text-[11px] text-muted-foreground">
                  Autorise l&apos;écoute et la passation sans abonnement actif.
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/series-co">Annuler</Link>
            </Button>

            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>Créer &amp; Ajouter les Questions</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
