import { notFound } from "next/navigation";
import { OralExamRoom } from "@/components/exam/oral-exam-room";
import { getOralSeries } from "@/lib/exam/oral-service";

export const metadata = {
  title: "Expression Orale — Salle d'Entretien IA Interactive",
};

export default async function OralExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ seriesId: string }>;
  searchParams?: Promise<{ mode?: string; task?: string; start?: string }>;
}) {
  const { seriesId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const series = await getOralSeries(seriesId);

  if (!series) {
    notFound();
  }

  const initialMode = resolvedSearchParams.mode === "practice" ? "practice" : "exam";
  const taskParam = resolvedSearchParams.task ? parseInt(resolvedSearchParams.task, 10) : 1;
  const initialTaskIndex = (taskParam >= 1 && taskParam <= 3 ? (taskParam - 1) : 0) as 0 | 1 | 2;

  return (
    <OralExamRoom
      series={series}
      initialMode={initialMode}
      initialTaskIndex={initialTaskIndex}
    />
  );
}
