export type CompanionId = "kodiak" | "aura" | "barnabe";

export interface Companion {
  id: CompanionId;
  name: string;
  species: string;
  role: string;
  badge: string;
  avatarUrl: string;
  tagline: string;
  speechText: string;
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
  kodiak: {
    id: "kodiak",
    name: "Kodiak",
    species: "Grizzly Canadien",
    role: "Le Coach Protecteur & Rassurant",
    badge: "🇨🇦 Coach Boreal",
    avatarUrl: "/brand/companions/kodiak.jpg",
    tagline: "Calme, endurance et méthode pour dompter les 60 minutes de l'examen.",
    speechText:
      "Bienvenue dans l'espace Expression Écrite du TCF Canada ! Je suis Kodiak, votre compagnon de route. 78% des candidats perdent leurs 50 points d'Entrée Express ici faute de méthode. Respirez : ensemble, nous allons décomposer chaque consigne pas à pas pour atteindre le C1/C2 !",
    voiceStyle: "Chaleureuse, posée et bienveillante",
    accentColor: "from-amber-600 to-rose-600",
    tips: {
      tcfGeneral:
        "L'examen dure 60 minutes pour 3 tâches. Votre mission n'est pas d'écrire un roman, mais de prouver aux correcteurs FEI que vous maîtrisez la langue.",
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
  aura: {
    id: "aura",
    name: "Aura",
    species: "Intelligence Artificielle C2",
    role: "Le Mentor Stratège & Méthodique",
    badge: "⚡ Mentor IA C2",
    avatarUrl: "/brand/companions/aura.jpg",
    tagline: "Optimisation millimétrée du barème officiel FEI pour maximiser chaque point CRS.",
    speechText:
      "Salutations ! Je suis Aura, votre système de guidage analytique. Mon algorithme calibre votre syntaxe, vos connecteurs logiques et la richesse de votre lexique selon la grille exacte des examinateurs de France Éducation International.",
    voiceStyle: "Claire, articulée et stimulante",
    accentColor: "from-cyan-500 to-blue-600",
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
  barnabe: {
    id: "barnabe",
    name: "Barnabé",
    species: "Castor Bâtisseur Canadien",
    role: "L'Architecte & Pragmatique",
    badge: "📐 Bâtisseur de Succès",
    avatarUrl: "/brand/companions/barnabe.jpg",
    tagline: "Des structures de texte solides comme un barrage pour ne laisser passer aucune erreur.",
    speechText:
      "Salut à vous ! Moi c'est Barnabé. Un texte d'examen, ça se bâtit avec rigueur : une introduction claire, des paragraphes bien étanches et une conclusion percutante. On va construire ensemble votre réussite au TCF !",
    voiceStyle: "Dynamique, enthousiaste et concrète",
    accentColor: "from-amber-500 to-orange-600",
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
};

export const DEFAULT_COMPANION_ID: CompanionId = "kodiak";
