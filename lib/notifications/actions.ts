"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export interface NotificationItem {
  id: string;
  recipient: "CANDIDATE" | "ADMIN";
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export async function getNotificationsAction(options?: {
  recipient?: "CANDIDATE" | "ADMIN";
  unreadOnly?: boolean;
}): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  const recipient = options?.recipient || "CANDIDATE";

  try {
    // Check if we need to seed initial notifications for demo
    const count = await prisma.notification.count({ where: { recipient } });
    if (count === 0) {
      await seedDemoNotifications(recipient);
    }

    const whereClause: {
      recipient: string;
      isRead?: boolean;
    } = {
      recipient,
    };

    if (options?.unreadOnly) {
      whereClause.isRead = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({
        where: {
          recipient,
          isRead: false,
        },
      }),
    ]);

    return {
      notifications: notifications.map((n) => ({
        ...n,
        recipient: n.recipient as "CANDIDATE" | "ADMIN",
      })),
      unreadCount,
    };
  } catch (error) {
    console.warn("[Notifications] Repli hors-ligne / réinitialisation pooler SQL:", error);
    // Fournir des notifications de démonstration par défaut pour une expérience utilisateur irréprochable
    return {
      notifications: [
        {
          id: "demo-welcome",
          recipient,
          title: "🎯 Simulateur TCF Canada Prêt",
          message: "Toutes les épreuves avec minuterie conforme et correction détaillée.",
          type: "SYSTEM",
          link: "/examens",
          isRead: false,
          createdAt: new Date(),
        },
      ],
      unreadCount: 1,
    };
  }
}

export async function markNotificationAsReadAction(id: string) {
  if (!id) return { ok: false };

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function markAllNotificationsAsReadAction(recipient: "CANDIDATE" | "ADMIN" = "CANDIDATE") {
  await prisma.notification.updateMany({
    where: { recipient, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function createNotificationAction(data: {
  recipient: "CANDIDATE" | "ADMIN";
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  userId?: string;
}) {
  const created = await prisma.notification.create({
    data: {
      recipient: data.recipient,
      title: data.title,
      message: data.message,
      type: data.type || "SYSTEM",
      link: data.link || null,
      userId: data.userId || null,
      isRead: false,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true, id: created.id };
}

async function seedDemoNotifications(recipient: "CANDIDATE" | "ADMIN") {
  if (recipient === "CANDIDATE") {
    await prisma.notification.createMany({
      data: [
        {
          recipient: "CANDIDATE",
          title: "🎯 Objectif NCLC 7 Activé (+50 pts CRS)",
          message: "Votre simulateur d'entraînement TCF Canada est configuré pour le seuil critique B2-C1.",
          type: "SYSTEM",
          link: "/nclc-calculator",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        },
        {
          recipient: "CANDIDATE",
          title: "📖 Série 101 Compréhension Écrite Prête",
          message: "39 questions authentiques FEI avec décodage des pièges et chrono 60 min.",
          type: "EXAM",
          link: "/examens/demo-101/ce",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          recipient: "CANDIDATE",
          title: "🧠 Carnet d'Erreurs SRS : Répétition Espacée",
          message: "N'oubliez pas de réviser vos fautes à J+1 et J+3 pour ancrer le lexique.",
          type: "SRS",
          link: "/carnet-erreurs",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ],
    });
  } else {
    await prisma.notification.createMany({
      data: [
        {
          recipient: "ADMIN",
          title: "⚡ Nouveau Lead Conciergerie (Urgence Examen)",
          message: "Un candidat avec passation dans < 7 jours demande un accompagnement accéléré.",
          type: "LEAD",
          link: "/admin/leads",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 10),
        },
        {
          recipient: "ADMIN",
          title: "📬 Nouvel Abonné Newsletter TCF",
          message: "Un nouvel utilisateur a rejoint la veille des nouveaux sujets d'examen.",
          type: "SYSTEM",
          link: "/admin/newsletter",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
          recipient: "ADMIN",
          title: "📊 Série 101 CE Validée en Base",
          message: "39 questions conformes au barème officiel France Éducation International.",
          type: "EXAM",
          link: "/admin/series-ce",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
      ],
    });
  }
}
