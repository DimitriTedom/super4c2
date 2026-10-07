export type TestType = "tcf" | "tef" | "ielts";
export type DisciplineType = "all" | "ce" | "co" | "ee" | "eo";
export type SeriesStatus = "COMPLETED" | "UNLOCKED" | "LOCKED";

export interface SeriesDisciplineInfo {
  type: "ce" | "co" | "ee" | "eo";
  name: string;
  badge: string;
  questionsOrTasks: string;
  duration: string;
  url: string;
}

export interface ProgressionSeries {
  id: string;
  seriesNumber: number;
  testType: TestType;
  title: string;
  subtitle: string;
  levelBadge: string;
  targetNclc: string;
  status: SeriesStatus;
  progressPercent: number; // 0 to 100
  bestScore?: string;
  unlockCondition?: string;
  recommended?: boolean;
  xpReward: number;
  crsBonusPoints?: number;
  disciplines: SeriesDisciplineInfo[];
  description: string;
  focusTopics: string[];
}

export const TEST_CATALOG: Record<
  TestType,
  {
    name: string;
    fullName: string;
    officialAuthority: string;
    badge: string;
    description: string;
    nclcTarget: string;
    crsBonusLabel: string;
  }
> = {
  tcf: {
    name: "TCF Canada",
    fullName: "Test de Connaissance du Français — Canada",
    officialAuthority: "France Éducation International (FEI) & IRCC",
    badge: "🇨🇦 Standard Fédéral Officiel",
    description:
      "Épreuve standardisée d'immigration canadienne et Entrée Express. Atteignez le seuil NCLC 7 dans les 4 compétences pour débloquer jusqu'à 50 points de bonus CRS.",
    nclcTarget: "NCLC 7+ (B2 Supérieur)",
    crsBonusLabel: "+50 pts CRS débloqués",
  },
  tef: {
    name: "TEF Canada",
    fullName: "Test d'Évaluation de Français — Canada",
    officialAuthority: "Chambre de Commerce et d'Industrie de Paris (CCI)",
    badge: "🇨🇦 Reconnu IRCC & MIDI Québec",
    description:
      "Test officiel reconnu pour l'immigration fédérale et la citoyenneté canadienne. Même barème NCLC/CLB avec système de notation gradué spécifique CCI.",
    nclcTarget: "NCLC 7+ (Niveau B2)",
    crsBonusLabel: "+50 pts CRS débloqués",
  },
  ielts: {
    name: "IELTS General",
    fullName: "International English Language Testing System (General Training)",
    officialAuthority: "British Council & IDP Education",
    badge: "🇬🇧 Premier Langue / Second Langue",
    description:
      "Épreuve linguistique d'anglais officielle acceptée par IRCC pour l'Entrée Express. Visez le palier CLB 9 (Listening 8.0, Reading 7.0, Writing 7.0, Speaking 7.0) pour maximiser vos points.",
    nclcTarget: "CLB 9 (8777)",
    crsBonusLabel: "+50 pts CRS max",
  },
};

export const TCF_PROGRESSION_SERIES: ProgressionSeries[] = [
  {
    id: "demo-101-ce",
    seriesNumber: 101,
    testType: "tcf",
    title: "Série 101 — Diagnostic & Seuil Initial",
    subtitle: "Étalonnage initial du niveau A1 à C2 en conditions réelles FEI",
    levelBadge: "Fondations → B1/B2",
    targetNclc: "NCLC 5 à 7",
    status: "UNLOCKED",
    progressPercent: 45,
    bestScore: "441 pts (NCLC 6)",
    recommended: true,
    xpReward: 350,
    crsBonusPoints: 0,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "Flagship 39Q",
        questionsOrTasks: "39 questions officielles",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Audio CBT",
        questionsOrTasks: "39 questions sonores",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "IA FEI 10s",
        questionsOrTasks: "3 tâches rédactionnelles",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Jeu de Rôle Live",
        questionsOrTasks: "3 tâches conversationnelles",
        duration: "12 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "La série fondamentale recommandée par l'Académie Super4C2. Couvre l'intégralité du spectre avec analyse approfondie des pièges FEI et synchronisation avec le Carnet SRS.",
    focusTopics: [
      "Horaires et petites annonces (A1-A2)",
      "Vie pratique et démarches d'installation (B1)",
      "Articles de presse et transition écologique (B2)",
    ],
  },
  {
    id: "serie-102",
    seriesNumber: 102,
    testType: "tcf",
    title: "Série 102 — Vocabulaire Socio-Politique Canadien",
    subtitle: "Renforcement lexique et tournures institutionnelles du Québec et du Canada",
    levelBadge: "Accélération B2",
    targetNclc: "NCLC 7 Critique",
    status: "UNLOCKED",
    progressPercent: 0,
    xpReward: 500,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "39 Questions",
        questionsOrTasks: "39 questions CBT",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Audio Express",
        questionsOrTasks: "39 extraits audios",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Sujets Immigration",
        questionsOrTasks: "3 tâches rédactionnelles",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Examinateur IA",
        questionsOrTasks: "3 échanges dirigés",
        duration: "12 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Spécialement conçue pour sécuriser le seuil NCLC 7 (+50 points CRS). Textes axés sur l'actualité fédérale, le système de santé canadien, le logement et le marché du travail.",
    focusTopics: [
      "Marché de l'emploi & intégration professionnelle",
      "Écologie et préservation des parcs canadiens",
      "Débats citoyens & conciliation travail-famille",
    ],
  },
  {
    id: "serie-103",
    seriesNumber: 103,
    testType: "tcf",
    title: "Série 103 — Déjouer les Pièges B2 / C1",
    subtitle: "Désamorçage des distracteurs et faux-amis sur les questions 22 à 35",
    levelBadge: "Objectif NCLC 7-8",
    targetNclc: "NCLC 7 - 8 (+50 pts CRS)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Compléter la Série 101 ou atteindre NCLC 6+",
    xpReward: 650,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "Mode Expert",
        questionsOrTasks: "39 questions haute complexité",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Débits Rapides",
        questionsOrTasks: "39 audios avec bruit ambiant",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Argumentation B2+",
        questionsOrTasks: "3 sujets polémiques",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Contradiction IA",
        questionsOrTasks: "3 scénarios de négociation",
        duration: "12 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Le palier charnière pour transformer les hésitations en certitudes. Tous les distracteurs récurrents des épreuves FEI sont décortiqués avec notre moteur d'explication pédagogique.",
    focusTopics: [
      "Nuances lexicales et connecteurs complexes",
      "Subtilités de la voix passive et subjonctif",
      "Lecture rapide et élimination des faux indices",
    ],
  },
  {
    id: "serie-104",
    seriesNumber: 104,
    testType: "tcf",
    title: "Série 104 — Immersion Académique & C1 Supérieur",
    subtitle: "Essais critiques, analyses sociologiques et registre soutenu",
    levelBadge: "Maîtrise C1",
    targetNclc: "NCLC 9 (Score 524+)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Valider la Série 102 ou souscrire au Pack Pro",
    xpReward: 850,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "39 Questions C1",
        questionsOrTasks: "Textes d'opinion & essais",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Débats Radio",
        questionsOrTasks: "Émissions culturelles",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Style C1",
        questionsOrTasks: "Synthèse & point de vue étayé",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Éloquence IA",
        questionsOrTasks: "Défense de thèse complexe",
        duration: "12 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Réservé aux candidats visant l'excellence ou postulant à des ordres professionnels exigeants (avocats, médecins, ingénieurs au Canada).",
    focusTopics: [
      "Épistémologie et progrès technologique",
      "Analyses sociologiques contemporaines",
      "Argumentation nuancée et concession rhétorique",
    ],
  },
  {
    id: "serie-105",
    seriesNumber: 105,
    testType: "tcf",
    title: "Série 105 — Sommet C2 Élite (699 Points)",
    subtitle: "L'épreuve ultime pour maîtriser la totalité des subtilités du français",
    levelBadge: "Élite C2",
    targetNclc: "NCLC 10+ (Score 600-699)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Obtenir NCLC 8+ sur une série précédente",
    xpReward: 1200,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "39 Questions C2",
        questionsOrTasks: "Textes littéraires & scientifiques",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Conférences",
        questionsOrTasks: "Conférences universitaires",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Magic Rewrite C2",
        questionsOrTasks: "Essai philosophique & sociétal",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Jury d'Élite",
        questionsOrTasks: "Grand oral interactif",
        duration: "12 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Le graal des 4 C2. Conçu pour hisser le candidat au sommet de la distribution statistique des scores TCF avec une aisance stylistique absolue.",
    focusTopics: [
      "Ironie, implicite et registres de langue",
      "Éthique de l'IA et mutations économiques",
      "Maîtrise stylistique et élégance syntaxique",
    ],
  },
];

export const TEF_PROGRESSION_SERIES: ProgressionSeries[] = [
  {
    id: "tef-201",
    seriesNumber: 201,
    testType: "tef",
    title: "Série TEF 201 — Diagnostic Format CCI",
    subtitle: "Entraînement officiel calqué sur les spécifications de la CCI Paris",
    levelBadge: "Niveau B1/B2",
    targetNclc: "CLB 7 Standard",
    status: "UNLOCKED",
    progressPercent: 10,
    recommended: true,
    xpReward: 350,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "40 Questions CCI",
        questionsOrTasks: "40 questions à choix multiple",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "40 Audios",
        questionsOrTasks: "Extraits de messages et reportages",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "2 Sections",
        questionsOrTasks: "Fait divers & Lettre argumentative",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "2 Épreuves",
        questionsOrTasks: "Obtenir des infos & Convaincre un ami",
        duration: "15 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Préparez le TEF Canada avec la grille officielle de 40 questions en Compréhension Écrite et les 2 épreuves emblématiques d'expression.",
    focusTopics: [
      "Articles de presse et offres d'emploi",
      "Fait divers narratif (Section A Expression Écrite)",
      "Lettre d'opinion et réfutation (Section B)",
    ],
  },
  {
    id: "tef-202",
    seriesNumber: 202,
    testType: "tef",
    title: "Série TEF 202 — Accélération Points Entrée Express",
    subtitle: "Consolidation des compétences rédactionnelles et conversationnelles",
    levelBadge: "Niveau B2/C1",
    targetNclc: "CLB 7 à 9",
    status: "UNLOCKED",
    progressPercent: 0,
    xpReward: 500,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "40 Questions",
        questionsOrTasks: "40 questions chronométrées",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Format Rapide",
        questionsOrTasks: "40 questions écoute unique",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Correction IA",
        questionsOrTasks: "2 sujets type examen",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Jeu de Rôle",
        questionsOrTasks: "Section A & B avec examinateur",
        duration: "15 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Optimisée pour les candidats qui doivent décrocher leurs 50 points de bonus dans les 30 prochains jours.",
    focusTopics: [
      "Gestion du temps en lecture rapide",
      "Convaincre et argumenter avec diplomatie",
      "Syntaxe soutenue et évitement des calques",
    ],
  },
  {
    id: "tef-203",
    seriesNumber: 203,
    testType: "tef",
    title: "Série TEF 203 — Perfectionnement Supérieur",
    subtitle: "Textes denses et argumentation haute intensité",
    levelBadge: "Niveau C1+",
    targetNclc: "CLB 9+",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Compléter la Série TEF 201 ou 202",
    xpReward: 750,
    disciplines: [
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "Intensif",
        questionsOrTasks: "40 questions niveau expert",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Audios Complexes",
        questionsOrTasks: "40 questions sons multiples",
        duration: "40 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Style Avancé",
        questionsOrTasks: "2 productions rédigées",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Débat Ouvert",
        questionsOrTasks: "Argumentation soutenue",
        duration: "15 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "La série de perfectionnement pour garantir un CLB 9 ou 10 et maximiser les classements au bassin Entrée Express.",
    focusTopics: [
      "Textes polémiques et sous-entendus",
      "Réfutation d'objections en jeu de rôle",
      "Maîtrise des registres formels",
    ],
  },
];

export const IELTS_PROGRESSION_SERIES: ProgressionSeries[] = [
  {
    id: "ielts-301",
    seriesNumber: 301,
    testType: "ielts",
    title: "IELTS General 301 — Foundation & Diagnostic",
    subtitle: "Complete 4-skill mock test matching British Council & IDP standards",
    levelBadge: "Band 6.0 → 7.0",
    targetNclc: "CLB 7 to 8",
    status: "UNLOCKED",
    progressPercent: 20,
    recommended: true,
    xpReward: 350,
    disciplines: [
      {
        type: "ce",
        name: "Reading (General Training)",
        badge: "40 Questions",
        questionsOrTasks: "Section 1, 2 & 3",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "4 Sections",
        questionsOrTasks: "40 questions (Single play)",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing",
        badge: "Task 1 & Task 2",
        questionsOrTasks: "Letter (150w) + Essay (250w)",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "3 Parts",
        questionsOrTasks: "Interview, Cue Card, Discussion",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Target the crucial 8777 threshold (Listening 8.0, Reading 7.0, Writing 7.0, Speaking 7.0) to unlock maximum Express Entry Comprehensive Ranking System (CRS) points.",
    focusTopics: [
      "Everyday notices & workplace handbooks",
      "Formal & semi-formal letters (Writing Task 1)",
      "Coherence and lexical resource in essays",
    ],
  },
  {
    id: "ielts-302",
    seriesNumber: 302,
    testType: "ielts",
    title: "IELTS General 302 — CLB 9 Masterclass (8777)",
    subtitle: "Targeting the high-score band for Canadian Express Entry",
    levelBadge: "Band 7.5 → 8.5",
    targetNclc: "CLB 9+ (Full CRS Points)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Complete Series 301 or upgrade to Pro",
    xpReward: 700,
    disciplines: [
      {
        type: "ce",
        name: "Reading",
        badge: "Academic Style",
        questionsOrTasks: "40 questions with time pressure",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "Multiple Accents",
        questionsOrTasks: "Australian, British & North American",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing",
        badge: "Band 8+ Rubric",
        questionsOrTasks: "Advanced essay structures",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "Fluency AI",
        questionsOrTasks: "Fluency and pronunciation coaching",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Advanced practice materials designed to push your Listening past 8.0 and lock in Band 7.5+ across all other subtests.",
    focusTopics: [
      "True / False / Not Given mastery",
      "Handling map labelling & multi-speaker debates",
      "Avoiding template penalties in Writing Task 2",
    ],
  },
];

export function getSeriesForTest(testType: TestType = "tcf"): ProgressionSeries[] {
  if (testType === "tef") return TEF_PROGRESSION_SERIES;
  if (testType === "ielts") return IELTS_PROGRESSION_SERIES;
  return TCF_PROGRESSION_SERIES;
}
