import { AdminDashboard, Candidate, ActivityItem } from "@/components/admin/admin-dashboard";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Console Direction & Administration — Super4C2",
  description:
    "Tableau de bord exécutif de supervision des candidats TCF & TEF Canada, suivi des scores NCLC 7 et gestion des contenus pédagogiques.",
};

export const revalidate = 0; // Données temps réel

function formatRelativeTime(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "À l'instant";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} j`;
}

export default async function AdminPage() {
  try {
    // 1. Récupération des candidats réels (hors Super Admin)
    const users = await prisma.user.findMany({
      where: { email: { not: "admin@super4c2.com" } },
      include: {
        profile: true,
        attempts: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Récupération de l'ensemble des tentatives de simulations
    const attempts = await prisma.userAttempt.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    // 3. Décompte réel des tables de contenu
    const [faqsCount, testimonialsCount, leadsCount, blogCount, examSeriesCount, writtenSeriesCount, oralSeriesCount] =
      await Promise.all([
        prisma.faq.count(),
        prisma.testimonial.count(),
        prisma.contactLead.count(),
        prisma.blogPost.count(),
        prisma.examSeries.count(),
        prisma.writtenSeries.count(),
        prisma.oralSeries.count(),
      ]);

    const seriesCount = examSeriesCount + writtenSeriesCount + oralSeriesCount;

    // Calcul des KPI en direct
    const totalCandidates = users.length;
    const totalSimulations = attempts.length;
    const successfulAttempts = attempts.filter(
      (a) => a.nclcLevel >= 7 || a.tcfScaledScore >= 453
    ).length;
    const passRate =
      totalSimulations > 0
        ? (successfulAttempts / totalSimulations) * 100
        : 0;
    const avgScore =
      totalSimulations > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + (a.tcfScaledScore || 0), 0) /
              totalSimulations
          )
        : 0;

    // Formatage des candidats pour la table administrative
    const formattedCandidates: Candidate[] = users.map((u) => {
      const p = u.profile;
      const bestCe = u.attempts.find(
        (a) => a.discipline === "COMPREHENSION_ECRITE"
      );
      const bestCo = u.attempts.find(
        (a) => a.discipline === "COMPREHENSION_ORALE"
      );
      const bestEe = u.attempts.find(
        (a) => a.discipline === "EXPRESSION_ECRITE"
      );
      const bestEo = u.attempts.find(
        (a) => a.discipline === "EXPRESSION_ORALE"
      );

      const ceScore = bestCe?.tcfScaledScore ?? 0;
      const coScore = bestCo?.tcfScaledScore ?? 0;
      const nclcLevel = bestCe?.nclcLevel ?? p?.targetNclc ?? 7;
      const hasNclc7 = ceScore >= 453 || nclcLevel >= 7;

      return {
        id: u.id,
        name: p?.displayName || u.email.split("@")[0],
        email: u.email,
        avatar: (p?.displayName || u.email).slice(0, 2).toUpperCase(),
        org: p?.country ? `${p.country}` : "Candidat Autonome",
        examDate: p?.examDate
          ? new Date(p.examDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Non fixée",
        testType: "TCF Canada" as const,
        ceScore,
        ceNclc: ceScore > 0 ? `NCLC ${nclcLevel}` : "—",
        coScore,
        coNclc: coScore > 0 ? `NCLC ${nclcLevel}` : "—",
        eeScore: bestEe ? `${bestEe.rawScore}/20` : "—",
        eeNclc: bestEe ? `NCLC ${bestEe.nclcLevel}` : "—",
        eoScore: bestEo ? `${bestEo.rawScore}/20` : "—",
        eoNclc: bestEo ? `NCLC ${bestEo.nclcLevel}` : "—",
        crsStatus: hasNclc7
          ? ("Objectif Canada Validé" as const)
          : ("En progression" as const),
        statusColor: hasNclc7
          ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400"
          : "text-amber-700 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
      };
    });

    // Formatage des activités récentes réelles
    const recentActivities: ActivityItem[] = attempts.slice(0, 5).map((a) => {
      const u = a.user;
      const displayName = u?.profile?.displayName || u?.email.split("@")[0] || "Candidat";
      const disciplineName =
        a.discipline === "EXPRESSION_ECRITE"
          ? "Rédaction (Écrit)"
          : a.discipline === "EXPRESSION_ORALE"
          ? "Oral (Visio IA)"
          : a.discipline === "COMPREHENSION_ECRITE"
          ? "Lecture (QCM)"
          : "Écoute (Audio)";

      const isPassing = a.nclcLevel >= 7 || a.tcfScaledScore >= 453;
      const noteLabel = a.rawScore ? `${a.rawScore}/20` : a.tcfScaledScore ? `${a.tcfScaledScore} pts` : "";

      return {
        id: a.id,
        student: displayName,
        org: u?.profile?.country || "Candidat",
        action: `a terminé l'épreuve ${disciplineName}${noteLabel ? ` (Note : ${noteLabel})` : ""}`,
        badge: isPassing ? "Objectif Validé" : "En progression",
        badgeColor: isPassing
          ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400"
          : "text-amber-700 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
        time: formatRelativeTime(new Date(a.createdAt)),
        initials: displayName.slice(0, 2).toUpperCase(),
      };
    });

    return (
      <AdminDashboard
        kpiStats={{
          totalCandidates,
          passRate,
          totalSimulations,
          avgScore,
        }}
        initialCandidates={formattedCandidates}
        recentActivities={recentActivities}
        liveCounts={{
          faqs: faqsCount,
          testimonials: testimonialsCount,
          leads: leadsCount,
          blog: blogCount,
          series: seriesCount,
        }}
      />
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des données admin :", error);
    return <AdminDashboard />;
  }
}
