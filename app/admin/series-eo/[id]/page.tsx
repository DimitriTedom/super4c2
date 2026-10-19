import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mic, ListOrdered, Save } from "lucide-react";
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
import { prisma } from "@/lib/prisma";
import { updateOralSeriesAction } from "../actions";

export const metadata = {
  title: "Modifier une Série EO — Back-Office | Super4C2",
};

interface EditOralSeriesPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOralSeriesPage({ params }: EditOralSeriesPageProps) {
  const { id } = await params;
  const series = await prisma.oralSeries.findUnique({
    where: { id },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  if (!series) {
    notFound();
  }

  const durationMinutes = Math.round(series.durationSeconds / 60);

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Back Link & Action Bar */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <Link href="/admin/series-eo">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la liste des séries EO</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5 font-bold text-xs">
            <Link href={`/admin/series-eo/${series.id}/tasks`}>
              <ListOrdered className="h-3.5 w-3.5 text-primary" />
              <span>Gérer les {series._count.tasks} / 3 tâches</span>
            </Link>
          </Button>
        </div>

        {/* Title Card */}
        <div className="border-b pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
            <Mic className="h-3 w-3" />
            Paramètres de la Série {series.seriesNumber}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Modifier la Série {series.seriesNumber}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Mettez à jour le titre, la durée ou le type d&apos;examen officiel.
          </p>
        </div>

        {/* Form Container */}
        <form action={updateOralSeriesAction} className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
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
                Type d&apos;Épreuve <span className="text-primary">*</span>
              </label>
              <Select name="examType" defaultValue={series.examType}>
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
              defaultValue={series.title}
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
              defaultValue={durationMinutes}
              min={5}
              max={30}
              className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              {series.durationSeconds} secondes configurées pour les 3 tâches orales (~12 minutes).
            </p>
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
                  Accessible aux candidats sur le catalogue.
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
                <p className="text-xs font-bold text-foreground">Démo Gratuite</p>
                <p className="text-[11px] text-muted-foreground">
                  Accessible aux candidats non abonnés.
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
              <span>Enregistrer les Modifications</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
