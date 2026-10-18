import { notFound } from "next/navigation";
import { MockExamOrchestrator } from "@/components/exam/mock-exam-orchestrator";
import { getSeriesById } from "@/lib/exam/series-progression";

interface MockExamPageProps {
  params: Promise<{
    seriesId: string;
  }>;
}

export const metadata = {
  title: "Examen Blanc Complet TCF Canada — Simulation Complète 4 Épreuves | Super4C2",
  description:
    "Simulation intégrale chronométrée : CO (35 min) + CE (60 min) + EE (60 min) + EO (12 min). Relevé d'attestation simulée et calcul du bonus +50 points CRS.",
};

export default async function MockExamPage({ params }: MockExamPageProps) {
  const { seriesId } = await params;
  const series = getSeriesById(seriesId);

  // If series not found or default to tcf-blanc-1
  const title = series?.title || "Examen Blanc N°1 — Simulation Complète 4 Épreuves";

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <MockExamOrchestrator seriesId={seriesId} seriesTitle={title} />
    </div>
  );
}
