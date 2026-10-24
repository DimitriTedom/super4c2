import { notFound } from "next/navigation";
import { getOralSeries } from "@/lib/exam/oral-service";
import { OralMethodologyHub } from "@/components/exam/oral-methodology-hub";

export const metadata = { title: "Consignes, Méthodologie & Calibrage Oral — TCF Canada" };

export default async function OralIntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = await getOralSeries(seriesId);

  if (!series) notFound();

  return <OralMethodologyHub series={series} />;
}
