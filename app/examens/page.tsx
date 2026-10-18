import { Suspense } from "react";
import { ExamRoadmapBoard } from "@/components/exam/exam-roadmap-board";
import type { Metadata } from "next";
import type { TestType, DisciplineType } from "@/lib/exam/series-progression";

export const metadata: Metadata = {
  title: "Sujets d'Examens & Parcours de Déblocage CBT — TCF • TEF • IELTS | Super4C2",
  description:
    "Explorez notre banque officielle de sujets d'entraînement pour le TCF Canada, TEF et IELTS General. Débloquez les niveaux jusqu'au seuil NCLC 7+ (+50 pts CRS).",
  openGraph: {
    title: "Sujets d'Examens & Parcours CBT | Super4C2",
    description:
      "Banque de sujets d'entraînement officiels TCF Canada & IELTS : simulateur CBT officiel, 4 épreuves chronométrées et correction IA immédiate.",
    images: ["/brand/og-image-simulator.jpg"],
  },
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


  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-64 rounded-3xl border bg-muted/20 animate-pulse" />}>
        <ExamRoadmapBoard
          initialTest={validTest}
          initialDiscipline={validDiscipline}
          initialView={validView}
        />
      </Suspense>
    </div>
  );
}
