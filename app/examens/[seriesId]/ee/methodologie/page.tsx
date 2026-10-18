import { notFound } from "next/navigation";
import { WritingMethodologyHub } from "@/components/exam/writing-methodology-hub";
import { getWrittenSeries } from "@/lib/exam/written-service";

export const metadata = {
  title: "Méthodologie d'Expression Écrite — TCF Canada | Super4C2",
  description:
    "Organigramme de formation, décryptage des 3 tâches officielles et corrigés types C1/C2.",
};

export default async function WrittenMethodologyPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = await getWrittenSeries(seriesId);

  if (!series) notFound();

  return <WritingMethodologyHub series={series} initialTab="methodologie" />;
}
