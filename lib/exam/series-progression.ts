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
  ieltsTrack?: "general" | "academic";
  isMockExam?: boolean;
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
    fullName: "Pack TCF Canada — Préparation NCLC 7+",
    officialAuthority: "Conforme aux grilles NCLC / IRCC",
    badge: "🇨🇦 Objectif Entrée Express",
    description:
      "Entraînement ciblé pour l'immigration canadienne et l'Entrée Express. Atteignez le seuil NCLC 7 dans les épreuves clés pour débloquer jusqu'à 50 points de bonus CRS.",
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
    id: "tcf-blanc-1",
    seriesNumber: 1,
    testType: "tcf",
    title: "Examen Blanc Officiel N°1 — Simulation Complète 4 Épreuves",
    subtitle: "Conditions réelles FEI : CO (35 min) ➔ CE (60 min) ➔ EE (60 min) ➔ EO (12 min)",
    levelBadge: "Simulation Certifiante NCLC 7+",
    targetNclc: "NCLC 7 à 10 (+50 pts CRS)",
    status: "UNLOCKED",
    progressPercent: 0,
    isMockExam: true,
    recommended: true,
    xpReward: 1000,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "co",
        name: "Compréhension Orale",
        badge: "Épreuve 1/4 (35 min)",
        questionsOrTasks: "39 questions officielles",
        duration: "35 min",
        url: "/examens/tcf-blanc-1/examen-blanc",
      },
      {
        type: "ce",
        name: "Compréhension Écrite",
        badge: "Épreuve 2/4 (60 min)",
        questionsOrTasks: "39 questions documents FEI",
        duration: "60 min",
        url: "/examens/tcf-blanc-1/examen-blanc",
      },
      {
        type: "ee",
        name: "Expression Écrite",
        badge: "Épreuve 3/4 (60 min)",
        questionsOrTasks: "3 tâches rédactionnelles",
        duration: "60 min",
        url: "/examens/101/ee/intro",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Épreuve 4/4 (12 min)",
        questionsOrTasks: "3 tâches avec M. Laurent",
        duration: "12 min",
        url: "/examens/101/eo/intro",
      },
    ],
    description:
      "La grande simulation officielle certifiante de Super4C2. Vous enchaînez les 4 compétences dans l'ordre exact du jour J sous chronomètre strict, avec pauses réglementaires et relevé d'attestation globale FEI.",
    focusTopics: [
      "Endurance cognitive sur 2h47min de session continue",
      "Épreuve reine CO & CE sous chronomètre officiel",
      "Rédaction des 3 tâches EE avec critères FEI",
      "Grand entretien d'Expression Orale avec examinateur IA",
      "Calcul immédiat de l'admissibilité Entrée Express (+50 pts CRS)",
    ],
  },
  {
    id: "demo-101-ce",
    seriesNumber: 101,

    testType: "tcf",
    title: "Sujet 101 — Diagnostic & Seuil Initial",
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
        url: "/examens/101/ee/intro",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Jeu de Rôle Live",
        questionsOrTasks: "3 tâches conversationnelles",
        duration: "12 min",
        url: "/examens/101/eo/intro",
      },
    ],
    description:
      "Le sujet fondamental recommandé par l'Académie Super4C2. Couvre l'intégralité du spectre avec analyse approfondie des pièges FEI et synchronisation avec le Carnet SRS.",
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
    title: "Sujet 102 — Vocabulaire Socio-Politique Canadien",
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
        url: "/examens/102/ee/intro",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Examinateur IA",
        questionsOrTasks: "3 échanges dirigés",
        duration: "12 min",
        url: "/examens/102/eo/intro",
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
    title: "Sujet 103 — Déjouer les Pièges B2 / C1",
    subtitle: "Désamorçage des distracteurs et faux-amis sur les questions 22 à 35",
    levelBadge: "Objectif NCLC 7-8",
    targetNclc: "NCLC 7 - 8 (+50 pts CRS)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Compléter le Sujet 101 ou atteindre NCLC 6+",
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
        url: "/examens/103/ee/intro",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Contradiction IA",
        questionsOrTasks: "3 scénarios de négociation",
        duration: "12 min",
        url: "/examens/103/eo/intro",
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
    title: "Sujet 104 — Immersion Académique & C1 Supérieur",
    subtitle: "Essais critiques, analyses sociologiques et registre soutenu",
    levelBadge: "Maîtrise C1",
    targetNclc: "NCLC 9 (Score 524+)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Valider le Sujet 102 ou débloquer le palier supérieur",
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
        url: "/examens/104/ee/intro",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Éloquence IA",
        questionsOrTasks: "Défense de thèse complexe",
        duration: "12 min",
        url: "/examens/104/eo/intro",
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
    title: "Sujet 105 — Sommet C2 Élite (699 Points)",
    subtitle: "L'épreuve ultime pour maîtriser la totalité des subtilités du français",
    levelBadge: "Élite C2",
    targetNclc: "NCLC 10+ (Score 600-699)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Obtenir NCLC 8+ sur un sujet précédent",
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
        url: "/examens/105/ee/intro",
      },
      {
        type: "eo",
        name: "Expression Orale",
        badge: "Jury d'Élite",
        questionsOrTasks: "Grand oral interactif",
        duration: "12 min",
        url: "/examens/105/eo/intro",
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
    title: "Sujet TEF 201 — Diagnostic Format CCI",
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
    title: "Sujet TEF 202 — Accélération Points Entrée Express",
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
    title: "Sujet TEF 203 — Perfectionnement Supérieur",
    subtitle: "Textes denses et argumentation haute intensité",
    levelBadge: "Niveau C1+",
    targetNclc: "CLB 9+",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Compléter le Sujet TEF 201 ou 202",
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
      "Le sujet de perfectionnement pour garantir un CLB 9 ou 10 et maximiser les classements au bassin Entrée Express.",
    focusTopics: [
      "Textes polémiques et sous-entendus",
      "Réfutation d'objections en jeu de rôle",
      "Maîtrise des registres formels",
    ],
  },
];

export const IELTS_PROGRESSION_SERIES: ProgressionSeries[] = [
  // 🇨🇦 SECTION GÉNÉRALE (IELTS GENERAL TRAINING) — IMMIGRATION & ENTRÉE EXPRESS
  {
    id: "ielts-gen-18-1",
    seriesNumber: 301,
    testType: "ielts",
    ieltsTrack: "general",
    title: "IELTS General 18 — Test 1 (Standard Cambridge)",
    subtitle: "Étalonnage initial 4 compétences conforme aux normes British Council & IDP",
    levelBadge: "Band 6.5 → 7.0",
    targetNclc: "CLB 7 à 8",
    status: "UNLOCKED",
    progressPercent: 20,
    recommended: true,
    xpReward: 350,
    disciplines: [
      {
        type: "ce",
        name: "Reading (General Training)",
        badge: "40 Questions",
        questionsOrTasks: "Sections 1, 2 & 3 (Workplace & General)",
        duration: "60 min",
        url: "/examens/ielts-gen-18-1-ce/ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "4 Sections",
        questionsOrTasks: "40 questions (Écoute unique officielle)",
        duration: "30 min",
        url: "/examens/ielts-gen-18-1-co/co",
      },
      {
        type: "ee",
        name: "Writing (General)",
        badge: "Task 1 & 2",
        questionsOrTasks: "Formal Letter (150w) + Argumentative Essay (250w)",
        duration: "60 min",
        url: "/examens/ielts-gen-18-1/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "3 Parties",
        questionsOrTasks: "Entretien, Cue Card 2 min, Discussion abstraite",
        duration: "14 min",
        url: "/examens/ielts-gen-18-1/eo",
      },
    ],
    description:
      "Visez le palier décisif CLB 7/8 pour valider vos prérequis de base pour le bassin Entrée Express et les programmes provinciaux.",
    focusTopics: [
      "Notices du quotidien et brochures d'entreprise",
      "Lettre formelle de réclamation ou demande (Task 1)",
      "Cohérence et ressource lexicale en essai d'opinion",
    ],
  },
  {
    id: "ielts-gen-18-2",
    seriesNumber: 302,
    testType: "ielts",
    ieltsTrack: "general",
    title: "IELTS General 18 — Test 2 (Sprint CLB 9 / 8777)",
    subtitle: "Le palier d'élite (Listening 8.0, Reading 7.0, Writing 7.0, Speaking 7.0)",
    levelBadge: "Band 7.5 → 8.5",
    targetNclc: "CLB 9+ (Points CRS Max)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Compléter le Test 1 ou disposer d'un abonnement actif",
    xpReward: 700,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Reading (General)",
        badge: "Chronomètre serré",
        questionsOrTasks: "Textes d'information professionnelle denses",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "Multi-accents",
        questionsOrTasks: "Accents britannique, australien et nord-américain",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing (General)",
        badge: "Grille Band 8+",
        questionsOrTasks: "Structure d'essai nuancée et lexique académique",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "Fluency IA",
        questionsOrTasks: "Entraînement à la fluidité et prononciation naturelle",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Le standard indispensable pour décrocher le score magique 8777 qui maximise les points de capital humain du système Entrée Express.",
    focusTopics: [
      "Maîtrise des questions True / False / Not Given",
      "Repérage de plans, schémas et pièges audio rapides",
      "Évitement des structures toutes faites en Writing Task 2",
    ],
  },
  {
    id: "ielts-gen-17-1",
    seriesNumber: 303,
    testType: "ielts",
    ieltsTrack: "general",
    title: "IELTS General 17 — Test 1 (Milieu Professionnel)",
    subtitle: "Contrats de travail, politiques d'entreprise et correspondance officielle",
    levelBadge: "Band 7.0 → 8.0",
    targetNclc: "CLB 8 à 9",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Valider le sujet 302",
    xpReward: 650,
    disciplines: [
      {
        type: "ce",
        name: "Reading (General)",
        badge: "40 Questions",
        questionsOrTasks: "Articles syndicaux et guides de formation",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "4 Sections",
        questionsOrTasks: "Discussions de groupe et tutorats",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing (General)",
        badge: "Task 1 & 2",
        questionsOrTasks: "Courrier semi-formel et essai sociétal",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "Jury Virtuel",
        questionsOrTasks: "Argumentation d'opinion sur sujets d'actualité",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Perfectionnement sur des contextes de travail réalistes pour consolider la vitesse de lecture et la justesse de syntaxe.",
    focusTopics: [
      "Sentence Completion avec contrainte de nombre de mots",
      "Nuances lexicales et registres formels/informels",
      "Gestion du temps en écriture sous pression",
    ],
  },
  {
    id: "ielts-gen-blanc-1",
    seriesNumber: 304,
    testType: "ielts",
    ieltsTrack: "general",
    title: "Examen Blanc IELTS General — Simulation Intégrale",
    subtitle: "Les 4 épreuves d'affilée en conditions réelles British Council / IDP",
    levelBadge: "Examen Blanc Officiel",
    targetNclc: "Cible CLB 9 (8777)",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Réservé aux abonnés Pass Objectif C2 / VIP",
    xpReward: 1200,
    crsBonusPoints: 50,
    disciplines: [
      {
        type: "ce",
        name: "Reading",
        badge: "Épreuve Complète",
        questionsOrTasks: "40 questions en temps réel strict",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "Épreuve Complète",
        questionsOrTasks: "40 questions audio sans pause",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing",
        badge: "Task 1 + Task 2",
        questionsOrTasks: "Évaluation IA instantanée selon grille IDP",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "Entretien Complet",
        questionsOrTasks: "Simulation orale en 3 parties avec examinateur",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "La répétition générale avant votre date d'examen officiel. Score Band 1.0-9.0 global estimé et rapport de diagnostic détaillé.",
    focusTopics: [
      "Endurance cognitive sur 2h45 d'examen cumulé",
      "Évitement des pénalités d'orthographe et de grammaire",
      "Rapport complet de points faibles par compétence",
    ],
  },

  // 🎓 SECTION ACADÉMIQUE (IELTS ACADEMIC) — ÉTUDES SUPÉRIEURES & ORDRES PROFESSIONNELS
  {
    id: "ielts-acad-19-1",
    seriesNumber: 351,
    testType: "ielts",
    ieltsTrack: "academic",
    title: "IELTS Academic 19 — Test 1 (Diagnostic Universitaire)",
    subtitle: "Articles scientifiques, dissertations et synthèse de données complexes",
    levelBadge: "Band 6.5 → 7.5",
    targetNclc: "C1 Académique",
    status: "UNLOCKED",
    progressPercent: 0,
    recommended: true,
    xpReward: 400,
    disciplines: [
      {
        type: "ce",
        name: "Reading (Academic)",
        badge: "3 Longs Textes",
        questionsOrTasks: "Extraits de revues scientifiques et essais critiques",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "4 Sections",
        questionsOrTasks: "Cours magistraux et séminaires universitaires",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing (Academic)",
        badge: "Graphique + Essai",
        questionsOrTasks: "Description graphique/tableau (150w) + Essai (250w)",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "3 Parties",
        questionsOrTasks: "Dialogue académique et concepts abstraits",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Conçu spécifiquement pour les étudiants visant une université canadienne ou les professionnels (médecins, infirmiers, ingénieurs) en démarche d'équivalence d'ordre.",
    focusTopics: [
      "Analyse de tendances de graphiques en courbes et histogrammes",
      "Matching Headings et repérage de thèses d'auteurs",
      "Vocabulaire académique formel (Academic Word List)",
    ],
  },
  {
    id: "ielts-acad-19-2",
    seriesNumber: 352,
    testType: "ielts",
    ieltsTrack: "academic",
    title: "IELTS Academic 19 — Test 2 (Analyse Statistique & Procédés)",
    subtitle: "Writing Task 1 : Description de diagrammes de flux et cartes comparatives",
    levelBadge: "Band 7.5 → 8.5",
    targetNclc: "C1/C2 Élite",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Compléter le Test Academic 1",
    xpReward: 750,
    disciplines: [
      {
        type: "ce",
        name: "Reading (Academic)",
        badge: "40 Questions",
        questionsOrTasks: "Textes denses de recherche sociologique et historique",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "Conférences",
        questionsOrTasks: "Présentations techniques avec terminologie experte",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing (Academic)",
        badge: "Process & Maps",
        questionsOrTasks: "Description de procédé industriel + Essai critique",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "Débat Thématique",
        questionsOrTasks: "Élocution continue et nuances hypothétiques",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "Pour sécuriser un Band 7.5 ou 8.0 requis par les universités de premier plan (McGill, Toronto, UBC) et les collèges médicaux.",
    focusTopics: [
      "Verbes de variation statistique (surge, plummet, plateau)",
      "Résumé de passages denses sans paraphrase fautive",
      "Connecteurs logiques complexes et concession rhétorique",
    ],
  },
  {
    id: "ielts-acad-blanc-1",
    seriesNumber: 353,
    testType: "ielts",
    ieltsTrack: "academic",
    title: "Examen Blanc IELTS Academic — Simulation Intégrale",
    subtitle: "Simulation complète en 4 épreuves sous le barème strict Cambridge Academic",
    levelBadge: "Examen Blanc Officiel",
    targetNclc: "Cible Band 8.0+",
    status: "LOCKED",
    progressPercent: 0,
    unlockCondition: "Réservé aux abonnés Pass Objectif C2 / VIP",
    xpReward: 1200,
    disciplines: [
      {
        type: "ce",
        name: "Reading (Academic)",
        badge: "60 min Strict",
        questionsOrTasks: "3 textes académiques intégraux avec 40 questions",
        duration: "60 min",
        url: "/examens/demo-101-ce",
      },
      {
        type: "co",
        name: "Listening",
        badge: "Audio Studio",
        questionsOrTasks: "4 sections en conditions d'amphithéâtre",
        duration: "30 min",
        url: "/examens/demo-101-co/co",
      },
      {
        type: "ee",
        name: "Writing (Academic)",
        badge: "Double Épreuve",
        questionsOrTasks: "Task 1 (Données) + Task 2 (Essai argumentatif)",
        duration: "60 min",
        url: "/examens/demo-101-ee/ee",
      },
      {
        type: "eo",
        name: "Speaking",
        badge: "Jury IA Live",
        questionsOrTasks: "Entretien vidéo/audio interactif en 3 parties",
        duration: "14 min",
        url: "/examens/demo-101-eo/eo",
      },
    ],
    description:
      "La répétition générale académique avec notation complète sur les 4 critères officiels IDP et prédiction de score Band global.",
    focusTopics: [
      "Endurance sur textes académiques de plus de 2 500 mots",
      "Évaluation détaillée de la Task Achievement en Task 1",
      "Audit phonétique et correction des faux-amis fréquents",
    ],
  },
];

const DISCIPLINE_SORT_WEIGHT: Record<string, number> = {
  ee: 1,
  eo: 2,
  co: 3,
  ce: 4,
};

export function sortDisciplines(disciplines: SeriesDisciplineInfo[]): SeriesDisciplineInfo[] {
  return [...disciplines].sort(
    (a, b) => (DISCIPLINE_SORT_WEIGHT[a.type] ?? 99) - (DISCIPLINE_SORT_WEIGHT[b.type] ?? 99)
  );
}

export function getSeriesForTest(testType: TestType = "tcf"): ProgressionSeries[] {
  const raw =
    testType === "tef"
      ? TEF_PROGRESSION_SERIES
      : testType === "ielts"
      ? IELTS_PROGRESSION_SERIES
      : TCF_PROGRESSION_SERIES;

  return raw.map((s) => ({
    ...s,
    disciplines: sortDisciplines(s.disciplines),
  }));
}

export function getSeriesById(id: string): ProgressionSeries | undefined {
  const allSeries = [
    ...TCF_PROGRESSION_SERIES,
    ...TEF_PROGRESSION_SERIES,
    ...IELTS_PROGRESSION_SERIES,
  ];
  const found = allSeries.find((s) => s.id === id);
  if (!found) return undefined;
  return {
    ...found,
    disciplines: sortDisciplines(found.disciplines),
  };
}

