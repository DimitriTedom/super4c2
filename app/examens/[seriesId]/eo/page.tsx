import { notFound } from "next/navigation";
import { OralExamRoom } from "@/components/exam/oral-exam-room";
import { getOralSeries } from "@/lib/exam/oral-service";

export const metadata = {
  title: "Expression Orale — Salle d'Entretien IA Interactive",
};

export default async function OralExamPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = await getOralSeries(seriesId);

  if (!series) {
    notFound();
  }

  return <OralExamRoom series={series} />;
}
