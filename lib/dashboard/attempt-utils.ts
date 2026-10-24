import type { TaskEvaluation, WrittenExamResult } from "@/lib/exam/written-types";
import type {
  OralDialogueMessage,
  OralExamEvaluation,
  OralCriterionScore,
} from "@/lib/exam/oral-types";

export interface UserAttemptFull {
  id: string;
  discipline: string;
  nclcLevel: number;
  tcfScaledScore: number;
  rawScore: number;
  crsPointsUnlocked: number;
  answers: unknown;
  feedback: unknown;
  completedAt: Date | string | null;
  createdAt: Date | string;
}

export const DISCIPLINE_META: Record<string, { label: string; short: string; emoji: string }> = {
  EXPRESSION_ECRITE: { label: "Expression Écrite", short: "EE", emoji: "✍️" },
  EXPRESSION_ORALE: { label: "Expression Orale", short: "EO", emoji: "🎙️" },
  COMPREHENSION_ECRITE: { label: "Compréhension Écrite", short: "CE", emoji: "📖" },
  COMPREHENSION_ORALE: { label: "Compréhension Orale", short: "CO", emoji: "🎧" },
};

export function getDisciplineMeta(discipline: string) {
  return DISCIPLINE_META[discipline] ?? { label: discipline, short: "?", emoji: "📝" };
}

export function getAttemptDate(attempt: UserAttemptFull): Date {
  return new Date(attempt.completedAt || attempt.createdAt);
}

export function parseFeedback(attempt: UserAttemptFull): WrittenExamResult | null {
  try {
    const raw = typeof attempt.feedback === "string" ? JSON.parse(attempt.feedback) : attempt.feedback;
    if (raw && typeof raw === "object" && Array.isArray((raw as WrittenExamResult).taskEvaluations)) {
      return raw as WrittenExamResult;
    }
  } catch {
    // feedback illisible → fallback
  }
  return null;
}

export function parseAnswers(attempt: UserAttemptFull): [string, string, string] {
  let arr: unknown = attempt.answers;
  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch {
      arr = [];
    }
  }
  const list = Array.isArray(arr) ? arr : [];
  return [String(list[0] ?? ""), String(list[1] ?? ""), String(list[2] ?? "")];
}

export function getTaskEvaluations(attempt: UserAttemptFull): TaskEvaluation[] {
  const fb = parseFeedback(attempt);
  if (fb && fb.taskEvaluations.length > 0) return fb.taskEvaluations;
  return [1, 2, 3].map((n) => ({
    taskNumber: n as 1 | 2 | 3,
    wordCount: 0,
    wordCountStatus: "under" as const,
    taskScore: 0,
    nclcEstimatedLevel: attempt.nclcLevel || 4,
    criteria: [
      { criterion: "adequation" as const, label: "Adéquation à la situation", score: 0, feedback: "Production absente.", strengths: [], improvements: [] },
      { criterion: "coherence" as const, label: "Cohérence et cohésion", score: 0, feedback: "Aucun enchaînement textuel.", strengths: [], improvements: [] },
      { criterion: "lexique" as const, label: "Compétence lexicale", score: 0, feedback: "Aucun vocabulaire produit.", strengths: [], improvements: [] },
      { criterion: "morphosyntaxe" as const, label: "Morphosyntaxe", score: 0, feedback: "Aucune phrase construite.", strengths: [], improvements: [] },
    ],
    generalFeedback: "Épreuve non rédigée ou soumission vide.",
    magicRewriteC2: "",
    rewriteHighlights: [],
  }));
}

export function getTotalWords(attempt: UserAttemptFull): number {
  return getTaskEvaluations(attempt).reduce((acc, t) => acc + (t.wordCount || 0), 0);
}

export function getTasksWritten(attempt: UserAttemptFull): number {
  return getTaskEvaluations(attempt).filter((t) => (t.wordCount || 0) > 0).length;
}

const crit = (criterion: "adequation" | "coherence" | "lexique" | "morphosyntaxe", label: string, score: number, feedback: string) => ({
  criterion,
  label,
  score,
  feedback,
  strengths: [] as string[],
  improvements: [] as string[],
});

/** Tentative d'exemple affichée via /dashboard/historique/demo (aucune écriture en base). */
export const DEMO_ATTEMPT: UserAttemptFull = {
  id: "demo",
  discipline: "EXPRESSION_ECRITE",
  nclcLevel: 8,
  tcfScaledScore: 540,
  rawScore: 16,
  crsPointsUnlocked: 50,
  createdAt: new Date("2026-10-10T18:29:00").toISOString(),
  completedAt: new Date("2026-10-10T19:21:00").toISOString(),
  answers: [
    "Objet : Proposition de créneau pour la visite de l'appartement\n\nBonjour Madame,\n\nJe fais suite à votre annonce concernant le studio meublé situé en centre-ville. Je serais vivement intéressé par une visite ce vendredi à partir de 17h30 si cela vous convient.\n\nRestant à votre disposition,\nBien cordialement.",
    "Il y a deux ans, j'ai participé pour la première fois à un semi-marathon humanitaire. Cette expérience a profondément marqué ma vision de l'engagement associatif.\n\nAu départ, l'intensité de l'effort physique me semblait insurmontable. Cependant, l'énergie collective et les encouragements du public m'ont permis de dépasser mes limites. Cette aventure m'a enseigné que la détermination est la clé de toute réussite.",
    "Faut-il bannir le télétravail intégral au profit d'un modèle strictement présentiel ? Cette question suscite des avis contrastés.\n\nD'un côté, le premier document souligne à juste titre que la présence physique favorise la cohésion d'équipe et la sérendipité créative. En effet, les échanges informels renforcent le sentiment d'appartenance.\n\nToutefois, comme le relève le second auteur, la flexibilité offerte par le télétravail améliore considérablement l'équilibre de vie des collaborateurs. En conclusion, un modèle hybride équilibré demeure la solution la plus pertinente.",
  ],
  feedback: {
    totalScore: 16.2,
    tcfScaledScore: 540,
    nclcLevel: 8,
    crsPointsUnlocked: 50,
    taskEvaluations: [
      {
        taskNumber: 1,
        wordCount: 78,
        wordCountStatus: "valid",
        taskScore: 17,
        nclcEstimatedLevel: 9,
        generalFeedback: "Excellent message, ton formel très bien respecté, formulation polie et claire.",
        magicRewriteC2:
          "Madame,\n\nJe fais suite avec grand intérêt à la parution de votre offre locative. Étant particulièrement séduit par les prestations du bien, je sollicite l'opportunité de convenir d'un rendez-vous vendredi dès 17h30 selon vos disponibilités.\n\nVeuillez agréer mes salutations distinguées.",
        rewriteHighlights: ["formule protocolaire C2", "vocabulaire soutenu", "concision"],
        criteria: [
          crit("adequation", "Adéquation à la situation", 4.8, "Respect scrupuleux du sujet."),
          crit("coherence", "Cohérence et cohésion", 4.5, "Enchaînement fluide."),
          crit("lexique", "Compétence lexicale", 4.2, "Vocabulaire adapté."),
          crit("morphosyntaxe", "Morphosyntaxe", 4.5, "Aucune erreur grammaticale."),
        ],
      },
      {
        taskNumber: 2,
        wordCount: 135,
        wordCountStatus: "valid",
        taskScore: 16,
        nclcEstimatedLevel: 8,
        generalFeedback: "Récit bien articulé, les sensations et émotions sont bien retranscrites.",
        magicRewriteC2: "Participer à cette initiative caritative constitua pour moi un véritable tournant existentiel…",
        rewriteHighlights: ["passé simple maîtrisé", "connecteurs temporels variés"],
        criteria: [
          crit("adequation", "Adéquation à la situation", 4.5, "Récit vivant et personnel."),
          crit("coherence", "Cohérence et cohésion", 4.2, "Transitions logiques naturelles."),
          crit("lexique", "Compétence lexicale", 4.0, "Champ lexical de l'effort bien mobilisé."),
          crit("morphosyntaxe", "Morphosyntaxe", 4.3, "Bonne maîtrise des temps du passé."),
        ],
      },
      {
        taskNumber: 3,
        wordCount: 155,
        wordCountStatus: "valid",
        taskScore: 15.5,
        nclcEstimatedLevel: 8,
        generalFeedback: "Synthèse équilibrée des deux opinions avec prise de position nuancée.",
        magicRewriteC2: "Si l'émulation collective inhérente au présentiel demeure irremplaçable, force est de constater…",
        rewriteHighlights: ["tournure concessive", "subjonctif", "nuance argumentative"],
        criteria: [
          crit("adequation", "Adéquation à la situation", 4.2, "Documents 1 et 2 bien exploités."),
          crit("coherence", "Cohérence et cohésion", 4.4, "Paragraphes très bien articulés."),
          crit("lexique", "Compétence lexicale", 3.9, "Quelques répétitions de connecteurs."),
          crit("morphosyntaxe", "Morphosyntaxe", 4.0, "Structure de phrase complexe bien gérée."),
        ],
      },
    ],
  } satisfies WrittenExamResult,
};

export function parseOralFeedback(attempt: UserAttemptFull): OralExamEvaluation | null {
  try {
    const raw = typeof attempt.feedback === "string" ? JSON.parse(attempt.feedback) : attempt.feedback;
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, any>;
      if (Array.isArray(obj.criteria) || typeof obj.totalScore === "number" || typeof obj.examinerDebrief === "string") {
        return {
          totalScore: typeof obj.totalScore === "number" ? obj.totalScore : attempt.rawScore || 0,
          tcfScaledScore: typeof obj.tcfScaledScore === "number" ? obj.tcfScaledScore : attempt.tcfScaledScore || 100,
          nclcLevel: typeof obj.nclcLevel === "number" ? obj.nclcLevel : attempt.nclcLevel || 4,
          crsPointsUnlocked: typeof obj.crsPointsUnlocked === "number" ? obj.crsPointsUnlocked : attempt.crsPointsUnlocked || 0,
          wordsPerMinute: typeof obj.wordsPerMinute === "number" ? obj.wordsPerMinute : 0,
          criteria: Array.isArray(obj.criteria) ? obj.criteria : [],
          examinerDebrief: typeof obj.examinerDebrief === "string" ? obj.examinerDebrief : (obj.generalFeedback || ""),
          recommendedPhrasesC2: Array.isArray(obj.recommendedPhrasesC2) ? obj.recommendedPhrasesC2 : [],
        };
      }
    }
  } catch {
    // fallback
  }
  return null;
}

export function parseOralDialogues(attempt: UserAttemptFull): Record<number, OralDialogueMessage[]> {
  try {
    let raw: any = attempt.answers;
    if (typeof raw === "string") {
      raw = JSON.parse(raw);
    }
    if (raw && typeof raw === "object") {
      const result: Record<number, OralDialogueMessage[]> = {};
      if (Array.isArray(raw)) {
        result[1] = raw;
      } else {
        [1, 2, 3].forEach((taskNum) => {
          if (Array.isArray(raw[taskNum]) || Array.isArray(raw[String(taskNum)])) {
            result[taskNum] = raw[taskNum] || raw[String(taskNum)];
          }
        });
      }
      return result;
    }
  } catch {
    // fallback
  }
  return {};
}

export function parseOralAudioUrl(attempt: UserAttemptFull): string | null {
  try {
    const feedback = typeof attempt.feedback === "string" ? JSON.parse(attempt.feedback) : attempt.feedback;
    if (feedback && typeof feedback === "object" && typeof feedback.audioUrl === "string" && feedback.audioUrl.trim()) {
      return feedback.audioUrl;
    }
    const answers = typeof attempt.answers === "string" ? JSON.parse(attempt.answers) : attempt.answers;
    if (answers && typeof answers === "object" && typeof answers.audioUrl === "string" && answers.audioUrl.trim()) {
      return answers.audioUrl;
    }
  } catch {}
  return null;
}

export const DEMO_ORAL_ATTEMPT: UserAttemptFull = {
  id: "demo-oral",
  discipline: "EXPRESSION_ORALE",
  nclcLevel: 8,
  tcfScaledScore: 512,
  rawScore: 16.5,
  crsPointsUnlocked: 50,
  createdAt: new Date("2026-10-12T14:30:00").toISOString(),
  completedAt: new Date("2026-10-12T14:42:00").toISOString(),
  answers: {
    audioUrl: "/audio/eo/laurent-step1.mp3",
    1: [
      { id: "1", sender: "examiner", text: "Bonjour et bienvenue. Je m'appelle Laurent et je serai votre examinateur. Pour cette première tâche, pouvez-vous vous présenter et me parler de votre parcours professionnel ?", timestamp: 0 },
      { id: "2", sender: "candidate", text: "Bonjour monsieur. Je m'appelle David, je suis ingénieur logiciel depuis six ans. J'ai commencé ma carrière en France dans une société de conseil, puis j'ai rejoint une start-up spécialisée dans l'éducation numérique.", timestamp: 8000 },
      { id: "3", sender: "examiner", text: "Très intéressant. Quels sont vos projets d'immigration au Canada ?", timestamp: 25000 },
      { id: "4", sender: "candidate", text: "Mon objectif est de m'installer au Québec ou en Ontario pour apporter mon expertise technique dans le secteur de l'intelligence artificielle.", timestamp: 35000 },
    ],
    2: [
      { id: "5", sender: "examiner", text: "Passons à la tâche 2. Vous avez lu l'annonce pour le club de randonnée. Vous m'appelez pour obtenir des informations pratiques. Je vous écoute.", timestamp: 0 },
      { id: "6", sender: "candidate", text: "Bonjour monsieur, je vous contacte au sujet des sorties en montagne organisées par votre club. Pourriez-vous m'indiquer si le matériel d'escalade est fourni ?", timestamp: 7000 },
      { id: "7", sender: "examiner", text: "Oui, le matériel technique est fourni, mais vous devez apporter vos propres chaussures de marche adaptées.", timestamp: 18000 },
      { id: "8", sender: "candidate", text: "D'accord, c'est très clair. Serait-il également possible de connaître les modalités d'inscription pour un groupe de trois personnes ?", timestamp: 28000 },
    ],
    3: [
      { id: "9", sender: "examiner", text: "Pour la tâche 3, certains estiment que les transports en commun devraient être totalement gratuits dans les métropoles. Quel est votre avis sur cette proposition ?", timestamp: 0 },
      { id: "10", sender: "candidate", text: "C'est un sujet complexe. D'une part, la gratuité incite indéniablement les citoyens à délaisser la voiture individuelle au profit de mobilités plus écologiques. D'autre part, cela pose la question cruciale du financement de l'entretien des réseaux. Je préconise plutôt une tarification solidaire modulée selon les revenus.", timestamp: 12000 },
    ],
  },
  feedback: {
    audioUrl: "/audio/eo/laurent-step1.mp3",
    totalScore: 16.5,
    tcfScaledScore: 512,
    nclcLevel: 8,
    crsPointsUnlocked: 50,
    wordsPerMinute: 115,
    criteria: [
      { criterion: "fluidite", label: "Aisance & Débit d'Élocution", score: 3.5, feedback: "Débit naturel et constant avec un rythme soutenu (115 mots/min). Très peu d'hésitations." },
      { criterion: "phonologie", label: "Compétence Phonologique & Intonation", score: 3.4, feedback: "Prononciation nette et intonation affirmative convaincante lors du jeu de rôle." },
      { criterion: "lexique", label: "Richesse & Précision Lexicale", score: 3.3, feedback: "Vocabulaire précis et soutenu (« mobilités écologiques », « tarification solidaire »)." },
      { criterion: "morphosyntaxe", label: "Morphosyntaxe & Variété des Structures", score: 3.2, feedback: "Bonne maîtrise du conditionnel de politesse et des propositions subordonnées complexes." },
      { criterion: "interaction", label: "Capacité d'Interaction & Réactivité", score: 3.1, feedback: "Réactivité immédiate face aux relances de l'examinateur Laurent." },
    ],
    examinerDebrief: "Prestation remarquable ! Vous validez avec brio le niveau NCLC 8, largement au-dessus du seuil critique NCLC 7 requis pour les 50 points de bonus CRS. Votre argumentation en Tâche 3 était particulièrement structurée et nuancée.",
    recommendedPhrasesC2: [
      "« Auriez-vous l'obligeance de me préciser... ? » (Raffinement d'interaction pour Tâche 2)",
      "« Force est de reconnaître que cette initiative comporte des retombées contrastées... » (Structure d'autorité pour Tâche 3)",
      "« Il conviendrait dès lors de privilégier une approche pragmatique... » (Formulation de synthèse C2)",
    ],
  },
};

