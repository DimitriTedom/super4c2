export type CompanionId = "laurent" | "eleonore" | "marc" | "kodiak" | "aura" | "barnabe";

export interface Companion {
  id: CompanionId;
  name: string;
  title: string;
  role: string;
  badge: string;
  avatarUrl: string;
  tagline: string;
  audioPreviewUrl: string;
  tcfIntroAudioUrl: string;
  speechText: string;
  tcfWelcomeSpeech: string;
  pageTourSpeech: string;
  voiceStyle: string;
  accentColor: string;
  tips: {
    tcfGeneral: string;
    task1: string;
    task2: string;
    task3: string;
    exam: string;
  };
}

export const COMPANIONS: Record<CompanionId, Companion> = {
  laurent: {
    id: "laurent",
    name: "M. Laurent Mercier",
    title: "Examinateur Certifié France Éducation International (FEI)",
    role: "Lead Mentor & Examinateur Officiel",
    badge: "🏛️ Examinateur FEI",
    avatarUrl: "/brand/companions/laurent.jpg",
    tagline: "Rigueur institutionnelle, bienveillance et maîtrise absolue du barème officiel FEI.",
    audioPreviewUrl: "/audio/eo/laurent-step1.mp3",
    tcfIntroAudioUrl: "/audio/eo/laurent-step1.mp3",
    speechText:
      "Bonjour. Je suis Laurent Mercier, examinateur agréé FEI et lead mentor TCF Canada. 78% des candidats perdent leurs 50 points d'Entrée Express en Expression Écrite et Orale par manque de méthode. Ensemble, nous allons décortiquer chaque consigne pour sécuriser le seuil NCLC 7 et viser le C2.",
    tcfWelcomeSpeech:
      "Bienvenue sur Super4C2. Le TCF Canada est le test linguistique officiel administré par France Éducation International pour l'immigration et l'Entrée Express. Votre objectif prioritaire est d'atteindre le palier NCLC 7 dans les 4 épreuves afin de débloquer le bonus décisif de 50 points CRS. 78% des candidats trébuchent en Expression Écrite et Orale en raison de la gestion du temps et du respect des consignes. Avec notre simulateur, vous n'êtes plus seul face à l'épreuve : je vous guiderai pas à pas. Choisissez votre mentor pédagogique pour débuter l'entraînement.",
    pageTourSpeech:
      "Bonjour et bienvenue dans l'espace d'Expression Écrite du TCF Canada. Je suis votre mentor de formation. Voici la structure de votre préparation : d'abord, la présentation détaillée de l'épreuve et des 4 critères officiels de notation sur 5 points. Ensuite, la méthodologie étape par étape de chacune des 3 tâches avec exercices d'application concrets et corrigés de niveau C1/C2. Enfin, l'examen blanc officiel en 60 minutes réelles avec barre de temps. Commençons sans attendre par la présentation de l'épreuve.",
    voiceStyle: "Studio ElevenLabs · Posée, institutionnelle et bienveillante",
    accentColor: "from-blue-700 to-indigo-800",
    tips: {
      tcfGeneral:
        "L'examen dure 60 minutes pour 3 tâches. Votre mission n'est pas d'écrire un roman, mais de prouver aux correcteurs FEI que vous maîtrisez la langue avec 4 critères clés.",
      task1:
        "Tâche 1 (Message/Courriel) : Visez 80 à 100 mots. Adoptez un registre amical ou neutre, et respectez scrupuleusement la consigne de communication.",
      task2:
        "Tâche 2 (Récit d'expérience) : Visez 130 à 145 mots. Racontez une expérience vivante en mêlant sentiments et analyse réflexive.",
      task3:
        "Tâche 3 (Double opinion) : Visez 140 à 170 mots. Présentez obligatoirement les deux points de vue avant d'exprimer votre propre position nuancée.",
      exam:
        "Surveillez la barre de temps ! Accordez 15 min à la Tâche 1, 20 min à la Tâche 2 et 25 min à la Tâche 3.",
    },
  },

  eleonore: {
    id: "eleonore",
    name: "Mme Éléonore de Saint-Germain",
    title: "Formatrice Pédagogique & Spécialiste Stylistique C1/C2",
    role: "Mentor Stratégie & Stylistique C2",
    badge: "⭐ Experte NCLC 7+",
    avatarUrl: "/brand/companions/eleonore.jpg",
    tagline: "Élégance stylistique, richesse des connecteurs et décodage chirurgical du barème.",
    audioPreviewUrl: "/audio/eo/laurent-step1.mp3", // En dev : voix studio unifiée
    tcfIntroAudioUrl: "/audio/eo/laurent-step1.mp3",
    speechText:
      "Bonjour. Je suis Éléonore de Saint-Germain, formatrice et spécialiste des registres formels. Mon objectif est d'aiguiser votre syntaxe, de diversifier vos connecteurs logiques et d'enrichir votre lexique pour séduire le jury de France Éducation International.",
    tcfWelcomeSpeech:
      "Bienvenue sur la plateforme d'excellence Super4C2. Le TCF Canada requiert non seulement de la précision linguistique mais aussi une grande rigueur argumentative. Le seuil NCLC 7 est la clé qui valorise votre profil Entrée Express à hauteur de 50 points CRS. Nous allons calibrer ensemble votre expression pour transformer chaque tâche en un succès probant. Cliquez sur suivant pour débuter notre parcours.",
    pageTourSpeech:
      "Bonjour et bienvenue sur le module d'Expression Écrite. Nous aborderons d'abord le barème officiel FEI : Adéquation, Cohérence, Lexique et Morphosyntaxe. Nous travaillerons ensuite la méthode pas à pas des 3 tâches avec des exemples rédigés de niveau C1/C2. Enfin, vous vous entraînerez dans les conditions exactes de l'examen CBT de 60 minutes. Prête pour l'excellence ? Découvrons la présentation.",
    voiceStyle: "Studio ElevenLabs · Claire, distinguée et stimulante",
    accentColor: "from-purple-600 to-indigo-700",
    tips: {
      tcfGeneral:
        "Le barème FEI est divisé en 4 critères sur 5 : Adéquation, Cohérence, Lexique et Morphosyntaxe. Un texte équilibré score immédiatement NCLC 7+.",
      task1:
        "Attention au sous-calibrage : moins de 60 mots entraîne une pénalité sévère sur le critère d'Adéquation.",
      task2:
        "Intégrez au moins 3 articulateurs chronologiques variés (« Dans un premier temps », « Au-delà de cela », « Cette immersion a révélé »).",
      task3:
        "La concession est la clé du niveau C1 : utilisez des formules comme « Certes (...) néanmoins » ou « Si l'on ne peut nier que (...) il convient toutefois de ».",
      exam:
        "Le chronomètre est votre allié si vous commencez par un plan au brouillon de 2 minutes par tâche.",
    },
  },

  marc: {
    id: "marc",
    name: "Marc-Antoine Tremblay",
    title: "Pédagogue Bilingue & Coach Entrée Express (Montréal)",
    role: "Coach Pragmatique & Immersion Canada",
    badge: "🇨🇦 Spécialiste Canada",
    avatarUrl: "/brand/companions/marc.jpg",
    tagline: "Des structures de texte solides et une gestion chrono pragmatique pour le Canada.",
    audioPreviewUrl: "/audio/eo/laurent-step1.mp3", // En dev : voix studio unifiée
    tcfIntroAudioUrl: "/audio/eo/laurent-step1.mp3",
    speechText:
      "Bonjour ! Je suis Marc-Antoine Tremblay, coach pédagogique à Montréal. Le TCF Canada est une épreuve d'efficacité : pas de bavardage superflu, des paragraphes nets, des idées percutantes et une gestion chrono millimétrée. On bâtit ensemble votre immigration réussie !",
    tcfWelcomeSpeech:
      "Bienvenue ! Le TCF Canada est l'étape décisive de votre projet de résidence permanente. Atteindre le niveau NCLC 7 dans les 4 épreuves vous octroie immédiatement le bonus vital de 50 points CRS dans le bassin d'Entrée Express. C'est à l'écrit et à l'oral que se joue la différence. Avec notre méthode structurée, vous allez aborder l'examen avec sérénité et maîtrise. Choisissez votre mentor pour commencer !",
    pageTourSpeech:
      "Salut ! Bienvenue dans votre atelier d'Expression Écrite. Voici notre plan de match : 1, nous décortiquons les critères des examinateurs. 2, nous passons en revue la structure infaillible de chaque tâche avec des corrigés concrets. 3, nous passons à l'action avec l'examen blanc de 60 minutes avec compte à rebours officiel. Allons-y !",
    voiceStyle: "Studio ElevenLabs · Dynamique, directe et concrète",
    accentColor: "from-amber-600 to-orange-600",
    tips: {
      tcfGeneral:
        "Ne commencez jamais à rédiger sans avoir compté mentalement vos paragraphes. Chaque idée maîtresse mérite son propre paragraphe aéré.",
      task1:
        "Structure infaillible en 3 blocs : 1. Salutation & objet, 2. Développement de l'invitation ou description, 3. Formule finale chaleureuse.",
      task2:
        "Le plan idéal : 1. Mise en contexte spatio-temporelle, 2. Péripétie ou action concrète, 3. Bilan personnel et portée citoyenne.",
      task3:
        "Structure royale : 1. Présentation du dilemme, 2. Arguments du premier camp, 3. Arguments du second camp, 4. Prise de position personnelle.",
      exam:
        "Relisez-vous systématiquement 3 minutes avant la fin : vérifiez les accords pluriels, les accents et la ponctuation.",
    },
  },

  // Alias de rétrocompatibilité (évite tout crash avec les cookies/localStorage existants)
  kodiak: null as unknown as Companion,
  aura: null as unknown as Companion,
  barnabe: null as unknown as Companion,
};

// Rétrocompatibilité : lier les anciens alias animaux aux nouveaux mentors humains
COMPANIONS.kodiak = COMPANIONS.laurent;
COMPANIONS.aura = COMPANIONS.eleonore;
COMPANIONS.barnabe = COMPANIONS.marc;

export const HUMAN_COMPANION_IDS: CompanionId[] = ["laurent", "eleonore", "marc"];

export const DEFAULT_COMPANION_ID: CompanionId = "laurent";

export function getCompanionById(id?: string | null): Companion {
  if (id) {
    if (id === "laurent" || id === "eleonore" || id === "marc") {
      return COMPANIONS[id];
    }
    if (id === "kodiak") return COMPANIONS.laurent;
    if (id === "aura") return COMPANIONS.eleonore;
    if (id === "barnabe") return COMPANIONS.marc;
  }
  return COMPANIONS.laurent;
}
