import { notFound } from "next/navigation";
import { WritingMethodologyHub } from "@/components/exam/writing-methodology-hub";
import { getWrittenSeries } from "@/lib/exam/mock-written-series";

export const metadata = {
  title: "Expression Écrite — Méthodologie, Entraînement & Examen Blanc | Super4C2",
  description:
    "Préparez l'épreuve d'Expression Écrite du TCF Canada avec votre mentor 3D : décryptage du barème FEI, ateliers guidés tâche par tâche et examen blanc chronométré 60 minutes.",
};

export default async function WrittenIntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getWrittenSeries(seriesId);

  if (!series) notFound();

  return <WritingMethodologyHub series={series} />;
}
