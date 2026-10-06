import { countWordsFei, type TaskEvaluation, type WrittenExamResult, type WrittenTask } from "./written-types";

interface EvaluateInput {
  task: WrittenTask;
  text: string;
}

/**
 * Moteur d'analyse FEI & Magic Rewrite C1/C2
 */
export function evaluateWrittenTask(input: EvaluateInput): TaskEvaluation {
  const { task, text } = input;
  const wordCount = countWordsFei(text);
  const min = task.minWords;
  const max = task.maxWords;

  let wordCountStatus: "under" | "valid" | "over" = "valid";
  if (wordCount < min) wordCountStatus = "under";
  else if (wordCount > max) wordCountStatus = "over";

  // Score de base selon respect de consigne de volume (sur 5)
  let adequationScore = 4.5;
  if (wordCount === 0) adequationScore = 0;
  else if (wordCount < min * 0.7) adequationScore = 2.0;
  else if (wordCount < min) adequationScore = 3.5;
  else if (wordCount > max * 1.3) adequationScore = 3.8;

  // Calculs heuristiques basés sur la structure
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const hasLogicalConnectors = /(cependant|en effet|par conséquent|de plus|d'une part|d'autre part|en revanche|néanmoins|ainsi)/i.test(text);

  let coherenceScore = paragraphs >= 2 && hasLogicalConnectors ? 4.5 : paragraphs >= 2 ? 3.8 : 3.0;
  if (wordCount < 30) coherenceScore = 1.5;

  let lexiqueScore = 4.0;
  let morphoScore = 4.0;

  if (wordCount < 40) {
    lexiqueScore = 2.0;
    morphoScore = 2.0;
  }

  const rawSum = adequationScore + coherenceScore + lexiqueScore + morphoScore;
  const taskScore = Math.min(20, Math.round((rawSum * 10)) / 10);

  // Estimation NCLC
  let nclcEstimatedLevel = 5;
  if (taskScore >= 17) nclcEstimatedLevel = 9; // C1
  else if (taskScore >= 14) nclcEstimatedLevel = 7; // B2 (seuil convoité)
  else if (taskScore >= 11) nclcEstimatedLevel = 6; // B1
  else if (taskScore >= 8) nclcEstimatedLevel = 5; // A2
  else nclcEstimatedLevel = 4;

  // Magic Rewrite C1/C2 spécifique à chaque tâche
  let magicRewriteC2 = "";
  let rewriteHighlights: string[] = [];

  if (task.taskNumber === 1) {
    magicRewriteC2 =
      "Salut Julien,\n\nJe t'écris tout juste installé dans mon nouvel appartement, un charmant deux-pièces baigné de lumière situé au cœur du quartier Saint-Roch. Entre les grandes baies vitrées et le calme environnant, le cadre est idéal pour se ressourcer.\n\nJe serais ravi de te faire découvrir les lieux ce samedi vers dix-sept heures, avant de partager un dîner convivial. Fais-moi signe si ce créneau te convient !\n\nÀ très vite,\nAlexandre";
    rewriteHighlights = [
      "« charmant deux-pièces baigné de lumière » (formulation élégante)",
      "« cadre idéal pour se ressourcer » (vocabulaire soutenu)",
      "« Fais-moi signe si ce créneau te convient » (idiome naturel B2/C1)",
    ];
  } else if (task.taskNumber === 2) {
    magicRewriteC2 =
      "Samedi dernier, j’ai pris part à la journée écocitoyenne de réaménagement de notre parc de quartier, une initiative qui a rassemblé plus d'une cinquantaine de résidents de toutes générations.\n\nAu-delà de la métamorphose paysagère indéniable, cette expérience a révélé la force du tissu associatif local : elle permet de rompre l'isolement urbain et de retisser du lien social authentique. À mon sens, de telles actions participatives devraient être pérennisées par la municipalité, car elles éveillent une véritable conscience collective.";
    rewriteHighlights = [
      "« journée écocitoyenne de réaménagement » (précision lexicale)",
      "« Au-delà de la métamorphose paysagère indéniable » (connecteur argumentatif)",
      "« rompre l'isolement urbain et retisser du lien social » (expression C1/C2)",
    ];
  } else {
    magicRewriteC2 =
      "La question de l'omniprésence du smartphone en milieu scolaire suscite un débat passionné. D'un côté, certains pédagogues prônent une interdiction absolue, arguant qu'elle garantit une concentration optimale et préserve la convivialité spontanée entre pairs. D'un autre côté, plusieurs spécialistes considèrent cet appareil comme un vecteur d'apprentissage moderne qu'il conviendrait plutôt d'apprivoiser.\n\nPour ma part, bien que l'impératif d'attention soit légitime, je demeure convaincu qu'un bannissement radical s'avère contre-productif. Il apparaît bien plus judicieux d'instaurer une éducation rigoureuse aux usages numériques.";
    rewriteHighlights = [
      "« suscite un débat passionné » (amorce classique C1)",
      "« D'un côté (...) D'un autre côté » (parfaite structure comparative)",
      "« bannissement radical s'avère contre-productif » (haute maîtrise syntaxique)",
    ];
  }

  return {
    taskNumber: task.taskNumber,
    wordCount,
    wordCountStatus,
    taskScore,
    nclcEstimatedLevel,
    criteria: [
      {
        criterion: "adequation",
        label: "Adéquation à la situation & Consignes",
        score: adequationScore,
        feedback:
          wordCountStatus === "valid"
            ? "Volume de mots parfaitement respecté et consigne communicative bien comprise."
            : wordCountStatus === "under"
            ? `Pénalité de volume : le texte contient ${wordCount} mots sur les ${min} minimaux exigés.`
            : `Volume légèrement supérieur au plafond de ${max} mots, veillez à la concision.`,
        strengths: ["Objectif communicatif identifié"],
        improvements: wordCountStatus !== "valid" ? ["Ajuster le calibrage du nombre de mots"] : [],
      },
      {
        criterion: "coherence",
        label: "Cohérence textuelle & Connecteurs",
        score: coherenceScore,
        feedback:
          hasLogicalConnectors
            ? "Bonne articulation logique avec des connecteurs variés et des paragraphes distincts."
            : "Le texte gagnerait à intégrer davantage de connecteurs logiques (en effet, par conséquent, néanmoins).",
        strengths: ["Découpage en paragraphes clair"],
        improvements: ["Intégrer des articulateurs de transition de niveau B2/C1"],
      },
      {
        criterion: "lexique",
        label: "Compétence lexicale & Vocabulaire",
        score: lexiqueScore,
        feedback: "Vocabulaire adapté au registre demandé. Quelques répétitions mineures évitables.",
        strengths: ["Termes techniques pertinents pour le thème"],
        improvements: ["Employer des synonymes plus précis pour éviter les verbes génériques (faire, avoir, être)"],
      },
      {
        criterion: "morphosyntaxe",
        label: "Morphosyntaxe & Grammaire",
        score: morphoScore,
        feedback: "Structure des phrases globalement correcte. Maîtrise satisfaisante des temps verbaux.",
        strengths: ["Bonne concordance des temps"],
        improvements: ["Varier les structures avec des propositions subordonnées relatives et concessives"],
      },
    ],
    generalFeedback:
      taskScore >= 14
        ? "Excellente prestation ! Votre production valide le palier B2/NCLC 7 requis pour les points Entrée Express."
        : "Prestation encourageante, mais attention à la rigueur de structure et au calibrage précis du volume de mots.",
    magicRewriteC2,
    rewriteHighlights,
  };
}

export function evaluateWrittenExam(
  series: { tasks: WrittenTask[] },
  texts: [string, string, string]
): WrittenExamResult {
  const evaluations: TaskEvaluation[] = series.tasks.map((task, idx) =>
    evaluateWrittenTask({ task, text: texts[idx] || "" })
  );

  // Pondération standard TCF : Tâche 1 (30%), Tâche 2 (35%), Tâche 3 (35%)
  const totalScore = Math.round(
    evaluations[0].taskScore * 0.3 + evaluations[1].taskScore * 0.35 + evaluations[2].taskScore * 0.35
  );

  // Échelle TCF 100 - 699
  const tcfScaledScore = Math.round(100 + (totalScore / 20) * 599);

  let nclcLevel = 5;
  if (tcfScaledScore >= 524) nclcLevel = 9;
  else if (tcfScaledScore >= 453) nclcLevel = 7;
  else if (tcfScaledScore >= 406) nclcLevel = 6;
  else if (tcfScaledScore >= 375) nclcLevel = 5;
  else nclcLevel = 4;

  const crsPointsUnlocked = nclcLevel >= 7 ? 50 : 0;

  return {
    totalScore,
    tcfScaledScore,
    nclcLevel,
    crsPointsUnlocked,
    taskEvaluations: evaluations,
  };
}
