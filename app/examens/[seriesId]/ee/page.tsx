import { notFound } from "next/navigation";
import { WrittenExamEditor } from "@/components/exam/written-exam-editor";
import { getWrittenSeries } from "@/lib/exam/mock-written-series";

export const metadata = {
  title: "Expression Écrite — Simulateur CBT Officiel",
};

export default async function WrittenExamPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getWrittenSeries(seriesId);

  if (!series) {
    notFound();
  }

  return <WrittenExamEditor series={series} />;
}
