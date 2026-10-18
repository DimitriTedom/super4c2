import { prisma } from "@/lib/prisma";

/**
 * Synchronise de façon atomique un utilisateur Supabase Auth avec la base de données PostgreSQL.
 * Résout automatiquement les conflits d'unicité d'e-mail si un utilisateur existait
 * sous un identifiant local hérité ou temporaire.
 */
export async function syncPrismaUser(
  userId: string,
  email: string,
  displayName?: string | null
) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Chercher si un utilisateur existe déjà avec cet ID Supabase exact
  const userById = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (userById) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: normalizedEmail,
        profile: {
          upsert: {
            create: { displayName: displayName?.trim() || null, targetNclc: 7 },
            update: displayName ? { displayName: displayName.trim() } : {},
          },
        },
      },
    });
    return;
  }

  // 2. Si non trouvé par ID, vérifier s'il existe déjà un utilisateur avec ce même e-mail
  // (ex: créé initialement avec un ancien UUID temporaire lors des tests précédents)
  const userByEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profile: true },
  });

  if (userByEmail) {
    if (userByEmail.id !== userId) {
      // Conflit d'ID : réassigner proprement vers le véritable userId Supabase
      await prisma.$transaction(async (tx) => {
        // Re-lier les tentatives de l'ancien ID vers le nouvel ID Supabase
        await tx.userAttempt.updateMany({
          where: { userId: userByEmail.id },
          data: { userId: userId },
        });

        // Supprimer l'ancien profil et l'ancien user portant l'ancien ID
        await tx.profile.deleteMany({ where: { userId: userByEmail.id } });
        await tx.user.delete({ where: { id: userByEmail.id } });

        // Créer l'enregistrement avec le nouvel ID Supabase officiel
        await tx.user.create({
          data: {
            id: userId,
            email: normalizedEmail,
            profile: {
              create: {
                displayName: displayName?.trim() || userByEmail.profile?.displayName || null,
                targetNclc: userByEmail.profile?.targetNclc || 7,
              },
            },
          },
        });
      });
      return;
    }
  }

  // 3. Cas nominal : création initiale d'un nouvel utilisateur
  await prisma.user.create({
    data: {
      id: userId,
      email: normalizedEmail,
      profile: {
        create: {
          displayName: displayName?.trim() || null,
          targetNclc: 7,
        },
      },
    },
  });
}
