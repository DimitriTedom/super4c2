import { notFound } from "next/navigation";
import { WrittenExamEditor } from "@/components/exam/written-exam-editor";
import { getWrittenSeries } from "@/lib/exam/mock-written-series";

export const metadata = {
  title: "Expression Écrite — Simulateur CBT Officiel",
};

export default async function WrittenExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ seriesId: string }>;
  searchParams?: Promise<{ mode?: string; task?: string }>;
}) {
  const { seriesId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const series = getWrittenSeries(seriesId);

  if (!series) {
    notFound();
  }

  const initialMode = resolvedSearchParams.mode === "practice" ? "practice" : "exam";
  const taskParam = resolvedSearchParams.task ? parseInt(resolvedSearchParams.task, 10) : 1;
  const initialTaskIndex = (taskParam >= 1 && taskParam <= 3 ? (taskParam - 1) : 0) as 0 | 1 | 2;

  return (
    <WrittenExamEditor
      series={series}
      initialMode={initialMode}
      initialTaskIndex={initialTaskIndex}
    />
  );
}
