import Link from "next/link";
import { Suspense } from "react";
import { Clock, ListChecks, PenTool, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamRoadmapBoard } from "@/components/exam/exam-roadmap-board";
import { listWrittenSeries } from "@/lib/exam/mock-written-series";
import type { TestType, DisciplineType } from "@/lib/exam/series-progression";

export const metadata = {
  title: "Séries d'Examens & Parcours de Déblocage CBT — TCF • TEF • IELTS | Super4C2",
  description:
    "Explorez notre roadmap interactif de séries d'entraînement officielles pour le TCF Canada, TEF et IELTS General. Débloquez les niveaux jusqu'au seuil NCLC 7+ (+50 pts CRS).",
};

interface ExamCataloguePageProps {
  searchParams: Promise<{
    test?: string;
    discipline?: string;
    view?: string;
  }>;
}

export default async function ExamCataloguePage({ searchParams }: ExamCataloguePageProps) {
  const resolvedParams = await searchParams;
  const testParam = (resolvedParams.test as TestType) || "tcf";
  const validTest: TestType = ["tcf", "tef", "ielts"].includes(testParam) ? testParam : "tcf";

  const disciplineParam = (resolvedParams.discipline as DisciplineType) || "all";
  const validDiscipline: DisciplineType = ["all", "ce", "co", "ee", "eo"].includes(disciplineParam)
    ? disciplineParam
    : "all";

  const viewParam = (resolvedParams.view as "roadmap" | "grid") || "roadmap";
  const validView: "roadmap" | "grid" = ["roadmap", "grid"].includes(viewParam) ? viewParam : "roadmap";

  const writtenSeries = listWrittenSeries();

  return (
    <div className="space-y-16">
      {/* 🌟 1. Interactive Roadmap Board (Hero & Sequence Unlocking with Light Beams) */}
      <Suspense fallback={<div className="h-96 rounded-3xl border bg-muted/20 animate-pulse" />}>
        <ExamRoadmapBoard
          initialTest={validTest}
          initialDiscipline={validDiscipline}
          initialView={validView}
        />
      </Suspense>

      {/* ✍️ 2. Entraînement Ciblé aux Expressions (EE & EO avec IA) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold">
                Packs Expressions Uniquement (EE & EO)
              </h2>
              <p className="text-xs text-muted-foreground">
                Correction IA FEI instantanée en 10 secondes & dialogue interactif en jeu de rôle
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-mono self-start sm:self-auto">
            Correction IA temps réel
          </span>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {writtenSeries.map((s, idx) => (
            <li
              key={s.id}
              className="group flex flex-col justify-between gap-5 rounded-3xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    Série {201 + idx}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">3 Tâches officielles FEI</p>
                </div>

                <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4 text-primary" /> 3 tâches FEI
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" /> 60 min (EE) & 12 min (EO)
                  </span>
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Entraînement ciblé à la rédaction et au jeu de rôle oral avec scoring critérié (Adéquation, Cohérence, Lexique, Morphosyntaxe) et Magic Rewrite C1/C2.
                </p>
              </div>

              <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground font-bold shadow-xs">
                <Link href={`/examens/${s.id}/ee/intro`}>
                  <span>Lancer l&apos;Épreuve Écrite</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* 🛡️ 3. Engagement Qualité & Conformité CBT Officielle */}
      <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-muted/30 via-muted/10 to-transparent p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Pourquoi notre parcours de déblocage garantit votre succès
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Reproduction exacte des conditions officielles France Éducation International (FEI) et IRCC
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-primary block">01 • Écran Scindé CBT</span>
            <h4 className="font-display font-bold text-base">Aucun scroll infini</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le document reste ancré à gauche avec zoom typographique, les 4 options à droite. Vous ne perdez aucune seconde le jour J.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-primary block">02 • Décodage des Pièges</span>
            <h4 className="font-display font-bold text-base">Explication pédagogique FEI</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chaque question dispose d&apos;une analyse de piège dédiée pour comprendre immédiatement pourquoi les 3 autres options sont fausses.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-primary block">03 • Seuil NCLC 7 Automatisé</span>
            <h4 className="font-display font-bold text-base">Calculateur CRS en direct</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dès que vous validez les paliers B2/C1 sur une série, votre tableau de bord débloque instantanément la série supérieure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
