import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DashboardProView } from "@/components/dashboard/dashboard-pro-view";
import type { UserAttemptFull } from "@/lib/dashboard/attempt-utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tableau de Bord Candidat — Objectif NCLC 7 / C2 | Super4C2",
  description:
    "Votre centre de pilotage personnalisé pour réussir le TCF Canada C2 : Historique de corrections, statistiques de compétences FEI et admissibilité Entrée Express (+50 pts CRS).",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  // Récupération de l'historique complet des tentatives de l'utilisateur
  const rawAttempts = await prisma.userAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const attempts: UserAttemptFull[] = rawAttempts.map((a) => ({
    id: a.id,
    discipline: a.discipline,
    nclcLevel: a.nclcLevel,
    tcfScaledScore: a.tcfScaledScore,
    rawScore: a.rawScore,
    crsPointsUnlocked: a.crsPointsUnlocked,
    answers: a.answers,
    feedback: a.feedback,
    completedAt: a.completedAt,
    createdAt: a.createdAt,
  }));

  const userDisplayName =
    user.user_metadata?.displayName ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Candidat";

  const userEmail = user.email || "";

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <DashboardProView
        userDisplayName={userDisplayName}
        userEmail={userEmail}
        attempts={attempts}
      />
    </div>
  );
}
