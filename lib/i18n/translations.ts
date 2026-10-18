export type Locale = "fr" | "en";

export const translations = {
  fr: {
    // Top Micro-bar
    topBar_simulatorStatus: "Simulateur FEI 100% Opérationnel",
    topBar_feiCompliance: "Conforme aux standards officiels France Éducation International (TCF / TEF)",
    topBar_blog: "Blog & Stratégies",
    topBar_vipCommunity: "Communauté VIP",
    topBar_targetNclc: "🇨🇦 Objectif NCLC 7+",
    topBar_crsCalculator: "Calculateur CRS",

    // Navigation & Header
    nav_home: "Accueil",
    nav_examSeries: "Séries & Examens",
    nav_simulatorsAi: "Simulateurs & IA",
    nav_resources: "Ressources",
    nav_pricing: "Tarifs",
    nav_login: "Connexion",
    nav_mySpace: "Mon Espace",
    nav_logout: "Déconnexion",
    nav_freeTrial: "Essai Gratuit",
    nav_trial: "Essai",

    // Header Mega-Menu
    menu_cbtExams: "Épreuves CBT Conformes",
    menu_feiStandard: "FEI Standard",
    menu_ceTitle: "Compréhension Écrite (CE)",
    menu_ceDesc: "Écran scindé conforme FEI, zoom de police & pièges décodés",
    menu_coTitle: "Compréhension Orale (CO)",
    menu_coDesc: "Lecteur CBT sans retour arrière & audio studio HD",
    menu_eoTitle: "Expression Orale IA",
    menu_eoDesc: "Examinateur IA M. Laurent & studio visio interactif",
    menu_eeTitle: "Expression Écrite FEI",
    menu_eeDesc: "3 tâches, barème conforme FEI & Magic Rewrite C1/C2",
    menu_accelerators: "Accélérateurs & Outils",
    menu_crsTitle: "Calculateur NCLC & CRS",
    menu_crsDesc: "Simulez vos points bonus Entrée Express Canada",
    menu_srsTitle: "Carnet d'Erreurs SRS",
    menu_srsDesc: "Répétition espacée scientifique pour ancrer vos pièges",
    menu_radarTitle: "Sujets Récents Examens",
    menu_radarDesc: "Questions réelles tombées ces dernières semaines",
    menu_fullSimulator: "Simulateur Complet Multidiscipline",

    // Hero Section
    hero_badge: "Préparation Complète Canada : TCF • TEF • IELTS",
    hero_h1_part1: "Décrochez vos",
    hero_h1_4c2: "4 C2",
    hero_h1_part2: "et Débloquez les",
    hero_h1_points: "+50 Points",
    hero_h1_part3: "d'Entrée Express.",
    hero_p_part1: "Le guide pour décrocher vos",
    hero_p_bold: "4 C2, surtout en Expression Écrite,",
    hero_p_part2: "la bête noire des candidats.",
    hero_btn_tcf: "Commencer le TCF",
    hero_btn_tef: "Commencer le TEF",
    hero_btn_ielts: "Préparer l'IELTS General",
    hero_crs_prompt: "Objectif Immigration Canada ?",
    hero_crs_link: "Calculer mes points CRS (+50 pts NCLC 7) →",

    // Language switcher
    lang_activeToast: "Langue active :",
    lang_subFr: "Épreuves TCF & TEF Canada",
    lang_subEn: "IRCC Express Entry / CLB Standards",
  },
  en: {
    // Top Micro-bar
    topBar_simulatorStatus: "FEI Simulator 100% Operational",
    topBar_feiCompliance: "Compliant with official France Éducation International standards (TCF / TEF)",
    topBar_blog: "Blog & Strategies",
    topBar_vipCommunity: "VIP Community",
    topBar_targetNclc: "🇨🇦 Target NCLC 7+",
    topBar_crsCalculator: "CRS Calculator",

    // Navigation & Header
    nav_home: "Home",
    nav_examSeries: "Series & Exams",
    nav_simulatorsAi: "Simulators & AI",
    nav_resources: "Resources",
    nav_pricing: "Pricing",
    nav_login: "Login",
    nav_mySpace: "Dashboard",
    nav_logout: "Logout",
    nav_freeTrial: "Free Trial",
    nav_trial: "Trial",

    // Header Mega-Menu
    menu_cbtExams: "CBT Compliant Tests",
    menu_feiStandard: "FEI Standard",
    menu_ceTitle: "Reading Comprehension (CE)",
    menu_ceDesc: "FEI-compliant split-screen, text zoom & traps decoded",
    menu_coTitle: "Listening Comprehension (CO)",
    menu_coDesc: "Realistic CBT player without rewind & studio HD audio",
    menu_eoTitle: "Speaking Test (EO) AI",
    menu_eoDesc: "AI Examiner Mr. Laurent & interactive video studio",
    menu_eeTitle: "Writing Test (EE) FEI",
    menu_eeDesc: "3 tasks, FEI-aligned rubric & Magic Rewrite C1/C2",
    menu_accelerators: "Accelerators & Tools",
    menu_crsTitle: "NCLC & CRS Calculator",
    menu_crsDesc: "Simulate your +50 Express Entry bonus points",
    menu_srsTitle: "SRS Error Vault",
    menu_srsDesc: "Scientific spaced repetition to conquer test traps",
    menu_radarTitle: "Recent Exam Topics",
    menu_radarDesc: "Real exam topics reported this week",
    menu_fullSimulator: "Full Multidisciplinary Simulator",

    // Hero Section
    hero_badge: "Complete Canada Test Prep: TCF • TEF • IELTS",
    hero_h1_part1: "Score Your",
    hero_h1_4c2: "4 C2s",
    hero_h1_part2: "and Unlock the",
    hero_h1_points: "+50 Points",
    hero_h1_part3: "in Express Entry.",
    hero_p_part1: "The guide to secure your",
    hero_p_bold: "4 C2s, especially in Written Expression,",
    hero_p_part2: "the hardest challenge for candidates.",
    hero_btn_tcf: "Start TCF Canada",
    hero_btn_tef: "Start TEF Canada",
    hero_btn_ielts: "Prepare IELTS General",
    hero_crs_prompt: "Targeting Canadian Immigration?",
    hero_crs_link: "Calculate my CRS score (+50 pts NCLC 7) →",

    // Language switcher
    lang_activeToast: "Active language:",
    lang_subFr: "TCF & TEF Canada tests",
    lang_subEn: "IRCC Express Entry / CLB Standards",
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;
