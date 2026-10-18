/**
 * ============================================================
 * SUPER4C2 — SM-2 SPACED REPETITION ENGINE
 * Mathematical implementation of the SuperMemo-2 (SM-2) algorithm.
 * ============================================================
 */

export type Sm2Rating = 1 | 3 | 4 | 5; // 1: Again, 3: Hard, 4: Good, 5: Easy

export interface SrsCard {
  id: string;
  discipline: "CE" | "CO" | "EE" | "EO";
  questionNumber: number;
  questionPrompt: string;
  documentSnippet?: string;
  candidateMistake: string;
  correctAnswer: string;
  ruleExplanation: string;
  trapType: string;

  // Paramètres algorithmiques SM-2
  repetitions: number;
  intervalDays: number;
  easinessFactor: number; // commence à 2.5, min 1.3
  nextReviewDate: string; // ISO 8601 string
  lastReviewDate?: string;

  // Métadonnées
  createdAt: string;
  sourceExamId?: string;
}

/**
 * Deck initial vierge pour garantir qu'un nouveau candidat démarre de zéro
 * et ne voit que ses propres erreurs réelles commises lors des simulations.
 */
export const INITIAL_SRS_CARDS: SrsCard[] = [];

/**
 * Calcule les nouveaux paramètres SM-2 après une évaluation de carte.
 */
export function calculateNextSm2Review(card: SrsCard, rating: Sm2Rating): SrsCard {
  const q = rating;
  let { repetitions, intervalDays, easinessFactor } = card;

  // 1. Mise à jour de l'Easiness Factor
  const newEf =
    easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  easinessFactor = Math.max(1.3, Number(newEf.toFixed(2)));

  // 2. Mise à jour des répétitions et de l'intervalle
  if (q < 3) {
    // Échec (Again) : on repart à zéro
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Succès (Hard: 3, Good: 4, Easy: 5)
    repetitions += 1;

    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      if (q === 3) {
        // Hard : progression plus prudente
        intervalDays = Math.max(intervalDays + 1, Math.round(intervalDays * 1.2));
      } else if (q === 4) {
        // Good : progression nominale
        intervalDays = Math.round(intervalDays * easinessFactor);
      } else {
        // Easy : progression accélérée
        intervalDays = Math.round(intervalDays * easinessFactor * 1.3);
      }
    }
  }

  // 3. Calcul de la prochaine date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    ...card,
    repetitions,
    intervalDays,
    easinessFactor,
    nextReviewDate: nextDate.toISOString(),
    lastReviewDate: new Date().toISOString(),
  };
}

/**
 * Détermine si une carte est échue (due pour révision aujourd'hui ou en retard).
 */
export function isCardDueToday(card: SrsCard): boolean {
  if (!card.nextReviewDate) return true;
  const dueDate = new Date(card.nextReviewDate);
  const now = new Date();
  return dueDate <= now;
}

/**
 * Retourne le statut de maîtrise d'une carte.
 */
export function getCardMasteryStatus(card: SrsCard): "DUE" | "LEARNING" | "MASTERED" {
  if (isCardDueToday(card)) {
    return "DUE";
  }
  if (card.intervalDays >= 14 && card.repetitions >= 3) {
    return "MASTERED";
  }
  return "LEARNING";
}

/**
 * Calcule les statistiques complètes d'un deck SRS.
 */
export function calculateDeckStats(cards: SrsCard[]) {
  const total = cards.length;
  const due = cards.filter(isCardDueToday).length;
  const learning = cards.filter((c) => !isCardDueToday(c) && (c.intervalDays < 14 || c.repetitions < 3)).length;
  const mastered = cards.filter((c) => !isCardDueToday(c) && c.intervalDays >= 14 && c.repetitions >= 3).length;

  return {
    total,
    due,
    learning,
    mastered,
  };
}

/**
 * Crée une SrsCard standardisée pour une erreur commise lors d'un entraînement ou d'un examen blanc.
 * Initialisée avec l'intervalle J+1 d'Ebbinghaus.
 */
export function createSrsCardFromMistake(params: {
  id?: string;
  discipline: "CE" | "CO" | "EE" | "EO";
  questionNumber: number;
  questionPrompt: string;
  documentSnippet?: string;
  candidateMistake: string;
  correctAnswer: string;
  ruleExplanation?: string;
  trapType?: string;
  sourceExamId?: string;
}): SrsCard {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1); // Intervalle initial J+1

  return {
    id:
      params.id ||
      `err-${params.discipline.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    discipline: params.discipline,
    questionNumber: params.questionNumber,
    questionPrompt: params.questionPrompt,
    documentSnippet: params.documentSnippet,
    candidateMistake: params.candidateMistake,
    correctAnswer: params.correctAnswer,
    ruleExplanation:
      params.ruleExplanation ||
      "Consolidation recommandée : analysez attentivement la structure et les distracteurs FEI.",
    trapType: params.trapType || "Distracteur d'ambiguïté lexicale ou syntaxique",
    repetitions: 0,
    intervalDays: 1,
    easinessFactor: 2.5,
    nextReviewDate: nextDate.toISOString(),
    createdAt: new Date().toISOString(),
    sourceExamId: params.sourceExamId,
  };
}

/**
 * Détecte de façon synchrone l'identifiant de l'utilisateur actif via le token Supabase en localStorage.
 */
export function getActiveUserIdSync(): string {
  if (typeof window === "undefined") return "anonymous";
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed?.user?.id) return parsed.user.id;
        }
      }
    }
  } catch {
    // ignore
  }
  return "anonymous";
}

/**
 * Génère la clé de stockage isolée par utilisateur pour garantir un cloisonnement strict multi-tenant.
 */
export function getSrsStorageKey(userId?: string): string {
  const uid = userId || getActiveUserIdSync();
  return `super4c2:srs_cards:${uid}`;
}

/**
 * Charge les cartes depuis le stockage local (localStorage) cloisonné par utilisateur.
 * Retourne un tableau vide pour tout nouvel utilisateur (zéro mock data).
 */
export function getSrsCardsFromVault(userId?: string): SrsCard[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getSrsStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as SrsCard[];
      }
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Enregistre directement le deck de cartes pour l'utilisateur spécifié.
 */
export function saveSrsCardsToVault(cards: SrsCard[], userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getSrsStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(cards));
    window.dispatchEvent(
      new CustomEvent("srs:vault_updated", {
        detail: { totalCount: cards.length, userId: userId || getActiveUserIdSync() },
      })
    );
  } catch (error) {
    console.error("Erreur lors de la sauvegarde SRS :", error);
  }
}

/**
 * Ajoute un lot de cartes au coffre SRS dans le localStorage sans doublon pour l'utilisateur actif.
 * Déclenche un événement personnalisé `srs:vault_updated` pour synchroniser les composants ouverts.
 */
export function addCardsToSrsVault(
  newCards: SrsCard[],
  userId?: string
): { addedCount: number; totalCount: number } {
  if (typeof window === "undefined" || newCards.length === 0) {
    return { addedCount: 0, totalCount: 0 };
  }

  try {
    const key = getSrsStorageKey(userId);
    const existing = getSrsCardsFromVault(userId);
    let addedCount = 0;
    const updated = [...existing];

    for (const card of newCards) {
      // Vérifier si la carte existe déjà par ID ou par discipline + numéro + énoncé
      const exists = updated.some(
        (c) =>
          c.id === card.id ||
          (c.discipline === card.discipline &&
            c.questionNumber === card.questionNumber &&
            c.questionPrompt === card.questionPrompt)
      );

      if (!exists) {
        updated.push(card);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("srs:vault_updated", {
          detail: { addedCount, totalCount: updated.length, userId: userId || getActiveUserIdSync() },
        })
      );
    }

    return { addedCount, totalCount: updated.length };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans le carnet SRS :", error);
    return { addedCount: 0, totalCount: 0 };
  }
}

