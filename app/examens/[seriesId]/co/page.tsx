import { notFound } from "next/navigation";
import { CbtExam } from "@/components/exam/cbt-exam";
import { getMockSeries, MOCK_SERIES_CO_101 } from "@/lib/exam/mock-series";

export const metadata = { title: "Compréhension orale — Simulateur CBT" };

export default async function CoPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const requested = getMockSeries(seriesId);
  const series =
    requested && requested.discipline === "CO"
      ? requested
      : getMockSeries(seriesId.replace(/-ce$/, "-co")) || MOCK_SERIES_CO_101;

  if (!series) notFound();
  return <CbtExam series={series} />;
}
