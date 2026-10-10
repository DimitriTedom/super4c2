import { notFound } from "next/navigation";
import { CbtExam } from "@/components/exam/cbt-exam";
import { getMockSeries } from "@/lib/exam/mock-series";

export const metadata = { title: "Compréhension écrite — Simulateur CBT" };

export default async function CePage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const requested = getMockSeries(seriesId);
  const series =
    requested && requested.discipline === "CE"
      ? requested
      : getMockSeries(`${seriesId}-ce`) ||
        getMockSeries(seriesId.replace(/-co$/, "-ce"));

  if (!series || series.discipline !== "CE") notFound();
  return <CbtExam series={series} />;
}
