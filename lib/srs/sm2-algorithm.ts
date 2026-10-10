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

export const INITIAL_SRS_CARDS: SrsCard[] = [
  {
    id: "err-ce-1",
    discipline: "CE",
    questionNumber: 4,
    questionPrompt: "Que laisse entendre l'auteur à propos de la démission du ministre ?",
    documentSnippet:
      "Bien que la polémique enfle, le ministre n'a jamais franchi le pas décisif malgré les rumeurs persistantes d'un départ imminent.",
    candidateMistake: "A. Il a déjà officiellement quitté ses fonctions.",
    correctAnswer: "B. Il hésite ou repousse sa décision de départ sans l'avoir encore actée.",
    ruleExplanation:
      "L'expression « n'a jamais franchi le pas » exprime l'hésitation ou l'inachèvement d'une action, jamais son accomplissement.",
    trapType: "Confusion d'aspect verbal (accompli vs inachevé)",
    repetitions: 0,
    intervalDays: 1,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(), // Due now
    createdAt: new Date().toISOString(),
  },
  {
    id: "err-co-2",
    discipline: "CO",
    questionNumber: 2,
    questionPrompt: "Quelle annonce est diffusée dans le hall de la gare pour le TGV de Lyon ?",
    documentSnippet:
      "« Mesdames et messieurs, le TGV numéro 6604 à destination de Lyon Part-Dieu subira un retard d'environ quarante minutes suite à une vérification technique. »",
    candidateMistake: "A. Le train pour Lyon est supprimé et annulé.",
    correctAnswer: "C. Le train pour Lyon est retardé d'environ 40 minutes.",
    ruleExplanation:
      "Un retard partiel ne doit jamais être confondu avec une annulation ou une suppression du service. Attention aux distracteurs extrêmes du TCF.",
    trapType: "Distracteur d'amplification excessive",
    repetitions: 1,
    intervalDays: 3,
    easinessFactor: 2.4,
    nextReviewDate: new Date(Date.now() - 3600 * 1000).toISOString(), // Due now
    createdAt: new Date().toISOString(),
  },
  {
    id: "err-ee-3",
    discipline: "EE",
    questionNumber: 2,
    questionPrompt: "Tâche 2 — Récit d'expérience et courrier au journal",
    candidateMistake: "Volume insuffisant : 98 mots rédigés.",
    correctAnswer: "Fourchette obligatoire : 120 à 150 mots.",
    ruleExplanation:
      "En Tâche 2 du TCF, tout texte inférieur à 120 mots subit une pénalité sévère sur le critère 1 (Adéquation). Développez systématiquement au moins un exemple concret supplémentaire.",
    trapType: "Non-respect du seuil de volume officiel FEI",
    repetitions: 2,
    intervalDays: 6,
    easinessFactor: 2.6,
    nextReviewDate: new Date(Date.now() + 86400 * 1000 * 2).toISOString(), // In 2 days
    createdAt: new Date().toISOString(),
  },
  {
    id: "err-eo-4",
    discipline: "EO",
    questionNumber: 2,
    questionPrompt: "Tâche 2 — Formules de négociation en jeu de rôle commercial",
    candidateMistake: "« Vous avez des réductions pour les étudiants ? » (registre familier)",
    correctAnswer: "« Proposez-vous un tarif préférentiel ou dégressif pour les étudiants ? » (registre soutenu)",
    ruleExplanation:
      "Pour valider l'échelon B2/NCLC 7 à l'oral, bannissez les questions familières directes et utilisez des tournures soutenues avec le conditionnel de politesse.",
    trapType: "Registre de langue insuffisant pour NCLC 7",
    repetitions: 3,
    intervalDays: 14,
    easinessFactor: 2.7,
    nextReviewDate: new Date(Date.now() + 86400 * 1000 * 8).toISOString(), // Mastered
    createdAt: new Date().toISOString(),
  },
  {
    id: "err-ce-5",
    discipline: "CE",
    questionNumber: 24,
    questionPrompt: "Quelle est la visée principale de l'auteur concernant l'agriculture régénératrice ?",
    documentSnippet:
      "Loin d'être une panacée sans contraintes, la transition vers les couverts végétaux permanents exige un amortissement financier pluriannuel que les exploitations modestes peinent à assumer seules.",
    candidateMistake: "D. Condamner définitivement toute démarche écologique en milieu rural.",
    correctAnswer: "B. Nuancer l'enthousiasme général en soulignant les défis économiques réels des agriculteurs.",
    ruleExplanation:
      "La formule « Loin d'être une panacée » introduit une posture de nuance et de réalisme critique, et non un rejet catégorique.",
    trapType: "Sur-interprétation négative / Faux dilemme",
    repetitions: 0,
    intervalDays: 1,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(), // Due now
    createdAt: new Date().toISOString(),
  },
];

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
 * Charge les cartes depuis le stockage local (localStorage) en fusionnant avec le deck par défaut si vide.
 */
export function getSrsCardsFromVault(): SrsCard[] {
  if (typeof window === "undefined") return INITIAL_SRS_CARDS;
  try {
    const stored = localStorage.getItem("super4c2:srs_cards");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as SrsCard[];
      }
    }
    // Si rien en cache, initialiser
    localStorage.setItem("super4c2:srs_cards", JSON.stringify(INITIAL_SRS_CARDS));
    return INITIAL_SRS_CARDS;
  } catch {
    return INITIAL_SRS_CARDS;
  }
}

/**
 * Ajoute un lot de cartes au coffre SRS dans le localStorage sans doublon.
 * Déclenche un événement personnalisé `srs:vault_updated` pour synchroniser les composants ouverts.
 */
export function addCardsToSrsVault(newCards: SrsCard[]): { addedCount: number; totalCount: number } {
  if (typeof window === "undefined" || newCards.length === 0) {
    return { addedCount: 0, totalCount: 0 };
  }

  try {
    const existing = getSrsCardsFromVault();
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
      localStorage.setItem("super4c2:srs_cards", JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("srs:vault_updated", {
          detail: { addedCount, totalCount: updated.length },
        })
      );
    }

    return { addedCount, totalCount: updated.length };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans le carnet SRS :", error);
    return { addedCount: 0, totalCount: 0 };
  }
}

