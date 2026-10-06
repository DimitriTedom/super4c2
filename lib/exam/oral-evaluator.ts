import type { OralDialogueMessage, OralExamEvaluation, OralSeries } from "./oral-types";

export function evaluateOralExam(
  series: OralSeries,
  dialogues: Record<number, OralDialogueMessage[]>
): OralExamEvaluation {
  // Calcul du volume de mots total du candidat
  let candidateWords = 0;
  let candidateTurns = 0;

  Object.values(dialogues).forEach((msgs) => {
    msgs.forEach((m) => {
      if (m.sender === "candidate") {
        candidateWords += m.text.trim().split(/\s+/).filter(Boolean).length;
        candidateTurns += 1;
      }
    });
  });

  const totalDurationMinutes = 10;
  const wordsPerMinute = candidateWords > 0 ? Math.round(candidateWords / 4.5) : 0;

  // Critères FEI sur 4 points chacun (total 20 points)
  let fluiditeScore = candidateWords >= 180 ? 3.5 : candidateWords >= 80 ? 2.8 : 1.5;
  let phonologieScore = candidateWords >= 100 ? 3.4 : 2.5;
  let lexiqueScore = candidateWords >= 180 ? 3.8 : candidateWords >= 80 ? 3.0 : 2.0;
  let morphoScore = candidateWords >= 150 ? 3.6 : 2.8;
  let interactionScore = candidateTurns >= 4 ? 3.9 : candidateTurns >= 2 ? 3.0 : 1.8;

  const totalScore = Math.min(20, Math.round((fluiditeScore + phonologieScore + lexiqueScore + morphoScore + interactionScore) * 10) / 10);
  
  // Échelle TCF 100-699
  const tcfScaledScore = Math.round(100 + (totalScore / 20) * 599);

  let nclcLevel = 5;
  if (tcfScaledScore >= 524) nclcLevel = 9;
  else if (tcfScaledScore >= 458) nclcLevel = 7; // Seuil NCLC 7
  else if (tcfScaledScore >= 398) nclcLevel = 6;
  else if (tcfScaledScore >= 369) nclcLevel = 5;
  else nclcLevel = 4;

  const crsPointsUnlocked = nclcLevel >= 7 ? 50 : 0;

  return {
    totalScore,
    tcfScaledScore,
    nclcLevel,
    crsPointsUnlocked,
    wordsPerMinute,
    criteria: [
      {
        criterion: "fluidite",
        label: "Aisance & Débit d'Élocution",
        score: fluiditeScore,
        feedback:
          wordsPerMinute >= 90
            ? "Débit naturel et constant avec très peu de pauses d'hésitation prolongées."
            : "Rythme de parole convenable, attention aux silences lors de la recherche des mots.",
      },
      {
        criterion: "phonologie",
        label: "Compétence Phonologique & Intonation",
        score: phonologieScore,
        feedback: "Prononciation claire et intelligible. Intonation assertive lors des questions posées en Tâche 2.",
      },
      {
        criterion: "lexique",
        label: "Richesse & Précision Lexicale",
        score: lexiqueScore,
        feedback: "Vocabulaire adapté au contexte communicatif. Bonne utilisation des termes spécifiques au sujet.",
      },
      {
        criterion: "morphosyntaxe",
        label: "Morphosyntaxe & Variété des Structures",
        score: morphoScore,
        feedback: "Bonne maîtrise des constructions verbales et des structures interrogatives formelles.",
      },
      {
        criterion: "interaction",
        label: "Capacité d'Interaction & Réactivité",
        score: interactionScore,
        feedback:
          candidateTurns >= 4
            ? "Excellente réactivité en jeu de rôle : rebonds pertinents sur les réponses de l'examinateur."
            : "Interaction correcte mais limitée. Veillez à relancer l'examinateur plus activement.",
      },
    ],
    examinerDebrief:
      totalScore >= 14
        ? "Performance très solide ! Vous validez le niveau NCLC 7 requis pour les 50 points d'Entrée Express. Votre interaction en Tâche 2 a démontré votre aptitude à mener un entretien autonome."
        : "Prestation encourageante. Pour atteindre le palier NCLC 7, entraînez-vous à poser des questions plus variées (inversion sujet-verbe, conditionnel de politesse) et développez davantage vos arguments en Tâche 3.",
    recommendedPhrasesC2: [
      "« Auriez-vous l'amabilité de m'indiquer si... ? » (Formule de politesse raffinée pour Tâche 2)",
      "« Serait-il envisageable de bénéficier d'une tarification dégressive ? » (Formulation B2/C1)",
      "« Il convient néanmoins de nuancer ce constat au vu des réalités économiques... » (Amorce de contre-argumentation pour Tâche 3)",
      "« Force est de constater que cette mesure suscite des réticences légitimes... » (Structure d'autorité C1/C2)",
    ],
  };
}
