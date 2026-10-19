import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ListChecks, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { updateSeriesCeAction } from "../actions";

export const metadata = {
  title: "Modifier une Série CE — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface EditSeriesCePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSeriesCePage({ params }: EditSeriesCePageProps) {
  const { id } = await params;
  const series = await prisma.examSeries.findUnique({
    where: { id },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  });

  if (!series || series.discipline !== "COMPREHENSION_ECRITE") {
    notFound();
  }

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Back Link & Action Bar */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <Link href="/admin/series-ce">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la liste des séries</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5 font-bold text-xs">
            <Link href={`/admin/series-ce/${series.id}/questions`}>
              <ListChecks className="h-3.5 w-3.5 text-primary" />
              <span>Gérer les {series._count.questions} questions</span>
            </Link>
          </Button>
        </div>

        {/* Title Card */}
        <div className="border-b pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
            <BookOpen className="h-3 w-3" />
            Paramètres de la Série {series.seriesNumber}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Modifier la Série {series.seriesNumber}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Mettez à jour le titre, la durée ou les conditions de visibilité pour les candidats.
          </p>
        </div>

        {/* Form Container */}
        <form action={updateSeriesCeAction} className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <input type="hidden" name="id" value={series.id} />

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Numéro de Série <span className="text-primary">*</span>
                </label>
                <Input
                  type="number"
                  name="seriesNumber"
                  defaultValue={series.seriesNumber}
                  min={1}
                  required
                  className="h-10 text-xs rounded-xl bg-muted/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Durée Officielle (Minutes) <span className="text-primary">*</span>
                </label>
                <Input
                  type="number"
                  name="durationMinutes"
                  defaultValue={Math.round(series.durationSeconds / 60)}
                  min={10}
                  max={120}
                  required
                  className="h-10 text-xs rounded-xl bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Titre Complet de l&apos;Épreuve <span className="text-primary">*</span>
              </label>
              <Input
                type="text"
                name="title"
                defaultValue={series.title}
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
                  defaultChecked={series.isPublished}
                  className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <span className="font-bold text-foreground block">Série Publiée</span>
                  <span className="text-muted-foreground text-[11px]">
                    Visible et accessible dans le catalogue des épreuves.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                <input
                  type="checkbox"
                  name="isFreeDemo"
                  defaultChecked={series.isFreeDemo}
                  className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <span className="font-bold text-foreground block">Démo Gratuite</span>
                  <span className="text-muted-foreground text-[11px]">
                    Accessible sans pass candidat actif.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/series-ce">Annuler</Link>
            </Button>
            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>Enregistrer les modifications</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
