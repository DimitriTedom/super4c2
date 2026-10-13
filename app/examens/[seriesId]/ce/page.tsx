import { DisciplineComingSoon } from "@/components/exam/discipline-coming-soon";

export const metadata = {
  title: "Compréhension Écrite — Bientôt disponible | Super4C2",
};

export default async function CePage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  return <DisciplineComingSoon discipline="CE" seriesId={seriesId} />;
}
