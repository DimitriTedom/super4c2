import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Headphones, ListOrdered, Save, Lock } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { updateSeriesCoAction } from "../actions";

export const metadata = {
  title: "Modifier une Série CO — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface EditSeriesCoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSeriesCoPage({ params }: EditSeriesCoPageProps) {
  const { id } = await params;
  const series = await prisma.examSeries.findUnique({
    where: { id },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  });

  if (!series || series.discipline !== "COMPREHENSION_ORALE") {
    notFound();
  }

  const durationMinutes = Math.round(series.durationSeconds / 60);

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <Link href="/admin/series-co">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux séries CO</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5 font-bold text-xs">
            <Link href={`/admin/series-co/${series.id}/questions`}>
              <ListOrdered className="h-3.5 w-3.5 text-primary" />
              <span>Gérer les {series._count.questions} / 39 questions</span>
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="border-b pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1.5">
            <Lock className="h-3 w-3" />
            Paramètres de la Série CO {series.seriesNumber} (Coming Soon)
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Headphones className="h-6 w-6 text-primary" />
            <span>Modifier la Série CO #{series.seriesNumber}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Mettez à jour le titre, le minutage ou la visibilité démo de la série.
          </p>
        </div>

        {/* Form Container */}
        <form action={updateSeriesCoAction} className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <input type="hidden" name="id" value={series.id} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Numéro de Série <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="seriesNumber"
                defaultValue={series.seriesNumber}
                required
                min={1}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Durée d&apos;Écoute (minutes)
              </label>
              <Input
                type="number"
                name="durationMinutes"
                defaultValue={durationMinutes}
                min={15}
                max={60}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Titre de la Série CO <span className="text-primary">*</span>
            </label>
            <Input
              type="text"
              name="title"
              defaultValue={series.title}
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
                defaultChecked={series.isPublished}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">Publiée</p>
                <p className="text-[11px] text-muted-foreground">
                  Visible dans l&apos;espace d&apos;administration avec badge Coming Soon.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isFreeDemo"
                value="true"
                defaultChecked={series.isFreeDemo}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">Accès Démo Gratuite</p>
                <p className="text-[11px] text-muted-foreground">
                  Accessible aux candidats sans abonnement.
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
              <span>Enregistrer les Modifications</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
