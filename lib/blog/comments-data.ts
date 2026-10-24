export interface PedagogicalAnswer {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  isVerifiedMentor: boolean;
  publishedAt: string;
  content: string;
  feiReference?: string;
}

export interface PedagogicalComment {
  id: string;
  slug?: string;
  category?: string;
  authorName: string;
  authorEmail?: string;
  authorBadge?: string;
  publishedAt: string;
  question: string;
  upvotes: number;
  status: "verified" | "pending";
  officialAnswer?: PedagogicalAnswer;
}

export const SEED_PEDAGOGICAL_COMMENTS: PedagogicalComment[] = [
  // --- Post: comprehension-ecrite-tcf-5-pieges-redoutables-france-education-international
  {
    id: "qa-ce-01",
    slug: "comprehension-ecrite-tcf-5-pieges-redoutables-france-education-international",
    category: "METHODE_TCF",
    authorName: "Marc-André B.",
    authorBadge: "Candidat TCF Canada (Session Nov. 2026)",
    publishedAt: "Il y a 3 jours",
    question:
      "Sur les questions de niveau B2 en Compréhension Écrite, j'hésite souvent entre deux options très proches. Si un mot clé rare apparaît dans l'option A et dans le texte, faut-il systématiquement l'éliminer comme piège ?",
    upvotes: 24,
    status: "verified",
    officialAnswer: {
      id: "ans-ce-01",
      authorName: "Dimitri Tedom",
      authorRole: "Concepteur Pédagogique Super4C2 • Spécialiste TCF",
      isVerifiedMentor: true,
      publishedAt: "Il y a 3 jours",
      content:
        "Excellente question Marc-André. La règle empirique chez France Éducation International est la suivante : aux niveaux A1 et A2, la réponse exacte reprend souvent le mot du texte car l'épreuve teste le repérage simple. En revanche, à partir du niveau B2 (questions 24 à 39), FEI teste la compréhension fine du sens implicite. Si une option recopie mot pour mot une formule complexe du texte, c'est un distracteur lexical dans plus de 80% des cas. La réponse correcte sera une reformulation synonymique (ex: « hausse sensible » formulée en « progression notable »). Fiez-vous au sens global de la phrase plutôt qu'à l'identité visuelle du mot.",
      feiReference: "Guide Officiel du Concepteur d'Items FEI — Rubrique Distracteurs Lexicaux B2/C1",
    },
  },
  {
    id: "qa-ce-02",
    slug: "comprehension-ecrite-tcf-5-pieges-redoutables-france-education-international",
    category: "METHODE_TCF",
    authorName: "Sonia K.",
    authorBadge: "Objectif NCLC 9",
    publishedAt: "Il y a 5 jours",
    question:
      "Est-il vrai qu'on peut revenir en arrière sur les questions déjà validées en Compréhension Écrite lors de l'examen réel sur ordinateur (CBT) ?",
    upvotes: 18,
    status: "verified",
    officialAnswer: {
      id: "ans-ce-02",
      authorName: "Laurent Mercier",
      authorRole: "Formateur Référent TCF Canada",
      isVerifiedMentor: true,
      publishedAt: "Il y a 5 jours",
      content:
        "Oui, absolument ! Contrairement à la Compréhension Orale où chaque document audio n'est joué qu'une seule fois et où la validation est irréversible, la Compréhension Écrite vous permet de naviguer librement entre les 39 questions pendant les 60 minutes. Vous disposez d'une grille récapitulative en bas d'écran. C'est pourquoi nous recommandons de marquer les questions incertaines, de sécuriser toutes les questions faciles en 35 minutes, puis de revenir à tête reposée sur les textes denses du niveau C1/C2.",
      feiReference: "Manuel du Candidat TCF sur Ordinateur (CBT) — Section Navigation CE",
    },
  },

  // --- Post: comment-valider-nclc-7-tcf-canada-50-points-crs
  {
    id: "qa-crs-01",
    slug: "comment-valider-nclc-7-tcf-canada-50-points-crs",
    category: "ENTREE_EXPRESS",
    authorName: "Amina T.",
    authorBadge: "Bassin Entrée Express 2026",
    publishedAt: "Il y a 4 jours",
    question:
      "Si j'obtiens NCLC 9 en Compréhension Écrite, NCLC 8 en Orale, mais 9/20 en Expression Écrite (qui correspond à NCLC 6), est-ce que je perds la totalité des 50 points bonus francophones d'IRCC ?",
    upvotes: 37,
    status: "verified",
    officialAnswer: {
      id: "ans-crs-01",
      authorName: "Dimitri Tedom",
      authorRole: "Concepteur Pédagogique Super4C2 • Expert CRS",
      isVerifiedMentor: true,
      publishedAt: "Il y a 4 jours",
      content:
        "Malheureusement oui Amina, c'est l'un des pièges les plus cruels du système de classement global (SCG/CRS). Le décret d'IRCC pour l'octroi des 50 points additionnels exige que le candidat atteigne au minimum le niveau NCLC 7 dans CHACUNE des 4 compétences linguistiques (CE ≥ 453, CO ≥ 458, EE ≥ 10/20, EO ≥ 10/20). Avec 9/20 en Expression Écrite, vous ne touchez aucun des 50 points bonus, même avec d'excellents scores ailleurs. C'est pour cela qu'il faut absolument sécuriser un 12/20 minimal à l'écrit avec notre méthode des 3 tâches.",
      feiReference: "Ministère IRCC — Critères d'Admissibilité aux Points Additionnels de Langue (Section 23 C-1)",
    },
  },
  {
    id: "qa-crs-02",
    slug: "comment-valider-nclc-7-tcf-canada-50-points-crs",
    category: "ENTREE_EXPRESS",
    authorName: "Kevin L.",
    authorBadge: "Candidat Programme Bilingue",
    publishedAt: "Il y a 1 semaine",
    question:
      "Quel est l'impact réel des tirages ciblés francophones par rapport aux tirages généraux ? Est-ce que le seuil de points baisse vraiment ?",
    upvotes: 29,
    status: "verified",
    officialAnswer: {
      id: "ans-crs-02",
      authorName: "Laurent Mercier",
      authorRole: "Formateur Référent TCF Canada",
      isVerifiedMentor: true,
      publishedAt: "Il y a 1 semaine",
      content:
        "L'écart est colossal. En 2025-2026, les tirages tous programmes (généraux) oscillent généralement entre 510 et 535 points, ce qui est quasi inatteignable sans diplôme canadien ou offre d'emploi réservée. En revanche, les tirages de la catégorie « Compétences linguistiques en français » ont des seuils qui descendent régulièrement entre 390 et 420 points ! Dès que vous validez le NCLC 7 dans les 4 épreuves, vous devenez éligible à ces rondes exclusives. Le TCF Canada est littéralement la voie royale pour être extrait du bassin.",
      feiReference: "Statistiques Officielles des Tirages Entrée Express IRCC 2025/2026",
    },
  },

  // --- Post: expression-ecrite-tcf-canada-les-sujets-frequents-et-formules-c1-c2
  {
    id: "qa-ee-01",
    slug: "expression-ecrite-tcf-canada-les-sujets-frequents-et-formules-c1-c2",
    category: "METHODE_TCF",
    authorName: "Fatoumata D.",
    authorBadge: "Candidat TCF Canada",
    publishedAt: "Il y a 2 jours",
    question:
      "Si dans la Tâche 1 (message d'information 60-120 mots) j'écris 128 mots, est-ce que je reçois une pénalité éliminatoire par le correcteur FEI ?",
    upvotes: 42,
    status: "verified",
    officialAnswer: {
      id: "ans-ee-01",
      authorName: "Dimitri Tedom",
      authorRole: "Concepteur Pédagogique Super4C2 • Spécialiste TCF",
      isVerifiedMentor: true,
      publishedAt: "Il y a 2 jours",
      content:
        "Rassurez-vous Fatoumata, les correcteurs de France Éducation International appliquent une marge de tolérance bienveillante de plus ou moins 10% sur les bornes de longueur. Pour une consigne de 60 à 120 mots, un texte de 128 mots se situe parfaitement dans la marge de tolérance et n'entraînera aucune pénalité de longueur. Le vrai danger est d'écrire moins de 50 mots ou plus de 150 mots. Attention également : sur l'ordinateur, le décompte automatique de mots est affiché en direct. Surveillez-le pour consacrer votre énergie à la syntaxe et aux accords de participes passés plutôt qu'à compter vos lignes !",
      feiReference: "Grille d'Évaluation de la Production Écrite TCF — Critère 1 : Respect de la Consigne & Longueur",
    },
  },
  {
    id: "qa-ee-02",
    slug: "expression-ecrite-tcf-canada-les-sujets-frequents-et-formules-c1-c2",
    category: "METHODE_TCF",
    authorName: "Youssef M.",
    authorBadge: "Candidat NCLC 8 Venu du Maroc",
    publishedAt: "Il y a 6 jours",
    question:
      "Dans la Tâche 3 (débat d'idées), est-ce obligatoire de donner les deux points de vue (pour et contre) même si le sujet demande mon avis personnel ?",
    upvotes: 31,
    status: "verified",
    officialAnswer: {
      id: "ans-ee-02",
      authorName: "Laurent Mercier",
      authorRole: "Formateur Référent TCF Canada",
      isVerifiedMentor: true,
      publishedAt: "Il y a 6 jours",
      content:
        "Oui, c'est l'essence même de la Tâche 3 ! La consigne vous demande d'exprimer votre point de vue sur un sujet de controverse en confrontant deux opinions divergentes. Si vous ne présentez qu'une seule thèse sans mentionner les arguments adverses, vous serez sanctionné sur le critère « Cohérence et structuration de l'argumentation ». La structure gagnante est : (1) Introduction posant le problème, (2) Synthèse nuancée de la thèse adverse avec connecteur concessif (« Certes... »), (3) Déploiement de votre thèse personnelle avec exemples concrets, (4) Conclusion brève d'ouverture.",
      feiReference: "Cadre Européen CECRL — Évaluation du Discours Argumentatif Niveau B2/C1",
    },
  },

  // --- Post: tcf-canada-vs-ielts-general-lequel-choisir-immigration-2026
  {
    id: "qa-ielts-01",
    slug: "tcf-canada-vs-ielts-general-lequel-choisir-immigration-2026",
    category: "IELTS_CANADA",
    authorName: "Patrick O.",
    authorBadge: "Profil Ingénieur Informatique",
    publishedAt: "Il y a 5 jours",
    question:
      "J'ai déjà un CLB 8 à l'IELTS General (Listening 8.5, Reading 7.5, Writing 6.5, Speaking 7.5). Est-ce que ça vaut vraiment la peine de passer le TCF Canada alors que je pourrais juste repasser l'IELTS pour monter mon Writing à 7.0 ?",
    upvotes: 21,
    status: "verified",
    officialAnswer: {
      id: "ans-ielts-01",
      authorName: "Dimitri Tedom",
      authorRole: "Concepteur Pédagogique Super4C2 • Expert CRS",
      isVerifiedMentor: true,
      publishedAt: "Il y a 5 jours",
      content:
        "Faites le calcul mathématique Patrick : si vous montez votre Writing IELTS de 6.5 à 7.0, vous atteignez le CLB 9 et gagnez environ 30 à 38 points CRS grâce aux aptitudes combinées. C'est bien, mais souvent insuffisant si votre score de départ est sous les 470 points. En revanche, si vous préparez le TCF Canada et décrochez le NCLC 7 en français (très accessible pour un francophone avec 4 à 6 semaines de pratique ciblée), vous débloquez immédiatement 50 points bonus francophones nets, PLUS l'accès automatique aux tirages ciblés francophones où le seuil tombe à 400 points ! La rentabilité du TCF Canada est infiniment supérieure.",
      feiReference: "Simulateur Officiel CRS IRCC — Tableau des Compétences Linguistiques Croisées",
    },
  },
];

export function getCommentsForSlug(slug: string, category?: string): PedagogicalComment[] {
  const directMatches = SEED_PEDAGOGICAL_COMMENTS.filter((c) => c.slug === slug);
  if (directMatches.length > 0) {
    return directMatches;
  }

  // Fallback to category comments if no direct slug match
  if (category) {
    const categoryMatches = SEED_PEDAGOGICAL_COMMENTS.filter((c) => c.category === category);
    if (categoryMatches.length > 0) {
      return categoryMatches;
    }
  }

  // Fallback to top 2 general comments
  return SEED_PEDAGOGICAL_COMMENTS.slice(0, 2);
}
