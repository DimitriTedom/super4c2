"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteUserAttemptAction(attemptId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) {
      return { ok: false, error: "Vous devez être connecté pour supprimer une correction." };
    }

    if (!attemptId || typeof attemptId !== "string") {
      return { ok: false, error: "Identifiant de correction invalide." };
    }

    // Vérification stricte de propriété : un candidat ne peut supprimer QUE ses propres copies
    const attempt = await prisma.userAttempt.findFirst({
      where: {
        id: attemptId,
        userId: user.id,
      },
    });

    if (!attempt) {
      return { ok: false, error: "Correction introuvable ou vous n'êtes pas autorisé à la supprimer." };
    }

    await prisma.userAttempt.delete({
      where: { id: attemptId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/historique");
    revalidatePath(`/dashboard/historique/${attemptId}`);

    return { ok: true, deletedId: attemptId };
  } catch (error) {
    console.error("Erreur suppression tentative utilisateur :", error);
    return { ok: false, error: "Une erreur est survenue lors de la suppression." };
  }
}

/**
 * Nettoie en 1 clic toutes les simulations non rédigées (score 0, copie blanche ou test sans texte).
 */
export async function batchDeleteEmptyAttemptsAction() {
  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) {
      return { ok: false, error: "Vous devez être connecté." };
    }

    // Sélectionne et supprime les copies à 0 point de ce candidat
    const result = await prisma.userAttempt.deleteMany({
      where: {
        userId: user.id,
        rawScore: 0,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/historique");

    return { ok: true, count: result.count };
  } catch (error) {
    console.error("Erreur nettoyage copies vides :", error);
    return { ok: false, error: "Impossible de nettoyer les copies vides." };
  }
}

/**
 * Supprime en lot une sélection de corrections spécifiques appartenant au candidat connecté.
 */
export async function batchDeleteUserAttemptsAction(attemptIds: string[]) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) {
      return { ok: false, error: "Vous devez être connecté pour effectuer cette action." };
    }

    if (!Array.isArray(attemptIds) || attemptIds.length === 0) {
      return { ok: false, error: "Aucune correction sélectionnée." };
    }

    // Sécurité stricte : supprime uniquement les copies appartenant à l'utilisateur connecté
    const result = await prisma.userAttempt.deleteMany({
      where: {
        id: { in: attemptIds },
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/historique");

    return { ok: true, count: result.count, deletedIds: attemptIds };
  } catch (error) {
    console.error("Erreur suppression groupée tentatives :", error);
    return { ok: false, error: "Impossible de supprimer les corrections sélectionnées." };
  }
}
