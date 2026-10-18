import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AttemptDetailView } from "@/components/dashboard/attempt-detail-view";
import { DEMO_ATTEMPT, type UserAttemptFull } from "@/lib/dashboard/attempt-utils";

export const metadata = {
  title: "Détail de la correction | Super4C2",
  description: "Revoyez votre copie, la grille FEI et le modèle C2 de cette épreuve.",
};

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function AttemptDetailPage({ params }: PageProps) {
  const { attemptId } = await params;

  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect(`/auth/login?next=/dashboard/historique/${attemptId}`);
  }

  if (attemptId === "demo") {
    return (
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <AttemptDetailView attempt={DEMO_ATTEMPT} isDemo />
      </div>
    );
  }

  const row = await prisma.userAttempt.findFirst({
    where: { id: attemptId, userId: user.id },
  });

  if (!row) notFound();

  const attempt: UserAttemptFull = {
    id: row.id,
    discipline: row.discipline,
    nclcLevel: row.nclcLevel,
    tcfScaledScore: row.tcfScaledScore,
    rawScore: row.rawScore,
    crsPointsUnlocked: row.crsPointsUnlocked,
    answers: row.answers,
    feedback: row.feedback,
    completedAt: row.completedAt,
    createdAt: row.createdAt,
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-6">
      <AttemptDetailView attempt={attempt} />
    </div>
  );
}
