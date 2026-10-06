import { notFound } from "next/navigation";
import { CbtExam } from "@/components/exam/cbt-exam";
import { getMockSeries } from "@/lib/exam/mock-series";

export const metadata = { title: "Compréhension orale — Simulateur CBT" };

export default async function CoPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getMockSeries(seriesId);
  if (!series || series.discipline !== "CO") notFound();
  return <CbtExam series={series} />;
}
