import { DisciplineComingSoon } from "@/components/exam/discipline-coming-soon";

export const metadata = {
  title: "Compréhension Orale — Bientôt disponible | Super4C2",
};

export default async function CoPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  return <DisciplineComingSoon discipline="CO" seriesId={seriesId} />;
}
