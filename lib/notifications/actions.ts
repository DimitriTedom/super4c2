"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin/auth";

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

/**
 * Récupère les notifications de façon strictement cloisonnée et sécurisée.
 * - Candidat : Uniquement ses propres notifications (userId) et les annonces générales diffusées (userId: null).
 * - Admin : Uniquement si l'utilisateur est authentifié et vérifié comme administrateur de confiance.
 */
export async function getNotificationsAction(options?: {
  recipient?: "CANDIDATE" | "ADMIN";
  unreadOnly?: boolean;
}): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  const recipient = options?.recipient || "CANDIDATE";

  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (recipient === "ADMIN") {
      // Sécurité stricte : Aucun visiteur ou candidat ne peut espionner les alertes admin
      if (!user || !isAdminUser(user)) {
        return { notifications: [], unreadCount: 0 };
      }

      const whereClause = {
        recipient: "ADMIN",
        ...(options?.unreadOnly ? { isRead: false } : {}),
      };

      const [notifications, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
        prisma.notification.count({
          where: { recipient: "ADMIN", isRead: false },
        }),
      ]);

      return {
        notifications: notifications.map((n) => ({
          ...n,
          recipient: n.recipient as "CANDIDATE" | "ADMIN",
        })),
        unreadCount,
      };
    }

    // Espace Candidat : Utilisateur authentifié requis pour voir ses alertes personnelles
    if (!user) {
      return { notifications: [], unreadCount: 0 };
    }

    const whereClause = {
      recipient: "CANDIDATE",
      OR: [{ userId: user.id }, { userId: null }],
      ...(options?.unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.notification.count({
        where: {
          recipient: "CANDIDATE",
          OR: [{ userId: user.id }, { userId: null }],
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
    return {
      notifications: [],
      unreadCount: 0,
    };
  }
}

/**
 * Marque une notification comme lue en vérifiant les droits d'accès du demandeur.
 */
export async function markNotificationAsReadAction(id: string) {
  if (!id) return { ok: false };

  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!user) return { ok: false, error: "Non autorisé" };

    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return { ok: false, error: "Notification introuvable" };

    if (notif.recipient === "ADMIN" && !isAdminUser(user)) {
      return { ok: false, error: "Accès refusé" };
    }

    if (notif.recipient === "CANDIDATE" && notif.userId && notif.userId !== user.id) {
      return { ok: false, error: "Accès refusé" };
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[Notifications] Erreur markNotificationAsReadAction:", err);
    return { ok: false };
  }
}

/**
 * Marque toutes les notifications du demandeur comme lues de façon cloisonnée.
 */
export async function markAllNotificationsAsReadAction(recipient: "CANDIDATE" | "ADMIN" = "CANDIDATE") {
  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!user) return { ok: false };

    if (recipient === "ADMIN") {
      if (!isAdminUser(user)) return { ok: false };
      await prisma.notification.updateMany({
        where: { recipient: "ADMIN", isRead: false },
        data: { isRead: true },
      });
    } else {
      // Cloisonnement strict : n'affecte que les notifications du candidat connecté
      await prisma.notification.updateMany({
        where: {
          recipient: "CANDIDATE",
          isRead: false,
          OR: [{ userId: user.id }, { userId: null }],
        },
        data: { isRead: true },
      });
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[Notifications] Erreur markAllNotificationsAsReadAction:", err);
    return { ok: false };
  }
}

/**
 * Supprime définitivement une notification appartenant à l'utilisateur.
 */
export async function deleteNotificationAction(id: string) {
  if (!id) return { ok: false };

  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!user) return { ok: false, error: "Non autorisé" };

    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return { ok: false, error: "Notification introuvable" };

    if (notif.recipient === "ADMIN" && !isAdminUser(user)) {
      return { ok: false, error: "Accès refusé" };
    }

    if (notif.recipient === "CANDIDATE" && notif.userId && notif.userId !== user.id) {
      return { ok: false, error: "Accès refusé" };
    }

    await prisma.notification.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[Notifications] Erreur deleteNotificationAction:", err);
    return { ok: false };
  }
}

/**
 * Supprime en masse toutes les notifications déjà lues pour le demandeur connecté.
 */
export async function clearReadNotificationsAction(recipient: "CANDIDATE" | "ADMIN" = "CANDIDATE") {
  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!user) return { ok: false, count: 0 };

    if (recipient === "ADMIN") {
      if (!isAdminUser(user)) return { ok: false, count: 0 };
      const { count } = await prisma.notification.deleteMany({
        where: { recipient: "ADMIN", isRead: true },
      });
      revalidatePath("/", "layout");
      return { ok: true, count };
    }

    const { count } = await prisma.notification.deleteMany({
      where: {
        recipient: "CANDIDATE",
        userId: user.id,
        isRead: true,
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, count };
  } catch (err) {
    console.error("[Notifications] Erreur clearReadNotificationsAction:", err);
    return { ok: false, count: 0 };
  }
}

/**
 * Crée une notification ciblée (par exemple pour un candidat spécifique ou les administrateurs).
 */
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
