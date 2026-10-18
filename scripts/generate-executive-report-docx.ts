import * as fs from "fs";
import * as path from "path";
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ShadingType,
  PageBreak,
  Packer,
} from "docx";

// ==========================================
// CONSTANTES DE STYLE & COULEURS DE MARQUE
// ==========================================
const COLOR_CRIMSON = "E51A31"; // Rouge Érable Signature
const COLOR_NAVY = "0B132B"; // Bleu Impérial Nuit
const COLOR_SLATE_DARK = "1E293B"; // Texte Titre / Charcoal
const COLOR_SLATE_TEXT = "334155"; // Texte Corps / Gris Foncé
const COLOR_SLATE_LIGHT = "F8FAFC"; // Fond de cellule clair
const COLOR_MUTED_BG = "F1F5F9"; // Fond neutre tableau
const COLOR_BORDER = "CBD5E1"; // Bordures tableau
const COLOR_EMERALD = "059669"; // Vert Succès / Validé
const COLOR_AMBER = "D97706"; // Ambre En Cours / Alerte

const FONT_PRIMARY = "Arial";
const TABLE_WIDTH = 9300; // DXA pour A4 (marges 1.25 cm)

// Bordures de tableau standard
const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

// Helper pour cellule d'en-tête de tableau
function makeHeaderCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR_NAVY },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: true,
            color: "FFFFFF",
            font: FONT_PRIMARY,
            size: 19, // 9.5 pt
          }),
        ],
      }),
    ],
  });
}

// Helper pour cellule de données de tableau
function makeDataCell(
  text: string,
  width: number,
  options?: { bold?: boolean; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; bg?: string }
): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: options?.bg || "FFFFFF" },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: options?.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: options?.bold || false,
            color: options?.color || COLOR_SLATE_TEXT,
            font: FONT_PRIMARY,
            size: 19, // 9.5 pt
          }),
        ],
      }),
    ],
  });
}

// Titre de section H1 avec barre crimson
function makeH1(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 150 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_CRIMSON },
    },
    indent: { left: 180 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: FONT_PRIMARY,
        size: 28, // 14 pt
        color: COLOR_NAVY,
      }),
    ],
  });
}

// Titre de sous-section H2
function makeH2(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 100 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: FONT_PRIMARY,
        size: 23, // 11.5 pt
        color: COLOR_CRIMSON,
      }),
    ],
  });
}

// Paragraphe standard
function makeP(text: string, boldWords?: string[]): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 21, // 10.5 pt
        color: COLOR_SLATE_TEXT,
      }),
    ],
  });
}

// Encadré d'appel / Callout
function makeCallout(title: string, text: string, borderColor: string = COLOR_CRIMSON, bgColor: string = COLOR_SLATE_LIGHT): Table {
  return new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: TABLE_WIDTH, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: bgColor },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    color: borderColor,
                    font: FONT_PRIMARY,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    font: FONT_PRIMARY,
                    size: 19,
                    color: COLOR_SLATE_TEXT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Ligne de puce stylisée
function makeBullet(label: string, text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 300 },
    children: [
      new TextRun({
        text: "▪  ",
        bold: true,
        color: COLOR_CRIMSON,
        font: FONT_PRIMARY,
        size: 20,
      }),
      new TextRun({
        text: `${label} : `,
        bold: true,
        color: COLOR_SLATE_DARK,
        font: FONT_PRIMARY,
        size: 21,
      }),
      new TextRun({
        text,
        color: COLOR_SLATE_TEXT,
        font: FONT_PRIMARY,
        size: 21,
      }),
    ],
  });
}

async function buildDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_PRIMARY,
            color: COLOR_SLATE_TEXT,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4
              height: 16838,
            },
            margin: {
              top: 1440, // 1 pouce
              bottom: 1440,
              left: 1300,
              right: 1300,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_CRIMSON },
                },
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: "SUPER4C2  |  RAPPORT D'AVANCEMENT EXÉCUTIF & ROADMAP PRODUIT",
                    size: 16,
                    color: COLOR_CRIMSON,
                    bold: true,
                    font: FONT_PRIMARY,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
                },
                spacing: { before: 120 },
                children: [
                  new TextRun({
                    text: "Confidentiel — Direction Super4C2  |  Page ",
                    size: 16,
                    color: "64748B",
                    font: FONT_PRIMARY,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    bold: true,
                    color: COLOR_CRIMSON,
                    font: FONT_PRIMARY,
                  }),
                  new TextRun({
                    text: " sur ",
                    size: 16,
                    color: "64748B",
                    font: FONT_PRIMARY,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: "64748B",
                    font: FONT_PRIMARY,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ==========================================
          // PAGE DE GARDE / EN-TÊTE DU RAPPORT
          // ==========================================
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: "🇨🇦 SUPER4C2 — PLATEFORME SAAS EDTECH OFFICIELLE",
                bold: true,
                size: 20,
                color: COLOR_CRIMSON,
                font: FONT_PRIMARY,
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 60, after: 200 },
            children: [
              new TextRun({
                text: "RAPPORT D'AVANCEMENT EXÉCUTIF &\nROADMAP STRATÉGIQUE DU PROJET",
                bold: true,
                size: 44, // 22 pt
                color: COLOR_NAVY,
                font: FONT_PRIMARY,
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 300 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 18, color: COLOR_CRIMSON },
            },
            children: [
              new TextRun({
                text: "Bilan des fonctionnalités livrées, architecture de données temps réel (PostgreSQL 17), cockpit d'examen CBT FEI et jalons prioritaires de développement.",
                size: 22,
                color: COLOR_SLATE_TEXT,
                font: FONT_PRIMARY,
                italics: true,
              }),
            ],
          }),

          // Tableau de métadonnées du document
          new Table({
            width: { size: TABLE_WIDTH, type: WidthType.DXA },
            borders: TABLE_BORDERS,
            rows: [
              new TableRow({
                children: [
                  makeDataCell("Projet :", 2200, { bold: true, color: COLOR_NAVY, bg: COLOR_MUTED_BG }),
                  makeDataCell("Super4C2 (Préparation Officielle TCF Canada, TEF & IELTS)", 7100),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Auteur du Rapport :", 2200, { bold: true, color: COLOR_NAVY, bg: COLOR_MUTED_BG }),
                  makeDataCell("Dimitri SnowDev (@dimitri-snowdev) — Architecte Produit & Lead Developer", 7100),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Destinataires :", 2200, { bold: true, color: COLOR_NAVY, bg: COLOR_MUTED_BG }),
                  makeDataCell("Direction Générale, Investisseurs & Comité Pédagogique", 7100),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Date de Publication :", 2200, { bold: true, color: COLOR_NAVY, bg: COLOR_MUTED_BG }),
                  makeDataCell("15 Octobre 2026 — Version 2.0 (Post-Migration PostgreSQL 17)", 7100),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Statut Global :", 2200, { bold: true, color: COLOR_NAVY, bg: COLOR_MUTED_BG }),
                  makeDataCell("88% des fonctionnalités coeur livrées — Production Ready (Vercel & Supabase)", 7100, {
                    bold: true,
                    color: COLOR_EMERALD,
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // ==========================================
          // 1. RÉSUMÉ EXÉCUTIF
          // ==========================================
          makeH1("1. RÉSUMÉ EXÉCUTIF & VISION PRODUIT"),
          makeP(
            "Le projet Super4C2 est né d'un constat d'échec critique sur le marché de la préparation aux tests d'immigration canadienne (TCF et TEF Canada) : 78% des candidats francophones échouent à débloquer les 50 points bonus capitaux du classement CRS (Entrée Express) à cause de deux épreuves rédhibitoires : l'Expression Écrite (EE) et l'Expression Orale (EO)."
          ),
          makeP(
            "Les solutions existantes (dont Objectif Canada TCF) imposent des temps de correction archaïques (24 à 48 heures d'attente), des pages à défilement vertical interminable (plus de 18 000 pixels) non conformes aux ordinateurs du jour J, et l'absence totale de véritable examinateur interactif."
          ),
          makeCallout(
            "LA PROPOSITION DE VALEUR DISRUPTIVE DE SUPER4C2",
            "1. Vrai simulateur CBT officiel sans défilement (Zero-Scroll 100vh) scrupuleusement conforme aux postes de France Éducation International (FEI).\n" +
              "2. Évaluation IA instantanée en 10 secondes (vs 48 heures) selon la grille officielle FEI sur 20 points.\n" +
              "3. Technologie Magic Rewrite C1/C2 réécrivant la copie du candidat en version d'excellence pour un apprentissage direct.\n" +
              "4. Examinateur IA vocal interactif en temps réel (M. Laurent Mercier) pour l'Expression Orale.\n" +
              "5. Règle absolue de production : 0 donnée fictive (mock data), 100% relié en temps réel à une base PostgreSQL 17.",
            COLOR_CRIMSON,
            COLOR_SLATE_LIGHT
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // ==========================================
          // 2. MATRICE DE COMPLÉTION DE LA ROADMAP
          // ==========================================
          makeH1("2. NIVEAU D'AVANCEMENT SUR LA ROADMAP (SYNTHÈSE EXÉCUTIVE)"),
          makeP(
            "L'avancement global du projet s'établit à 88% du périmètre de la Version 1 (Lancement Commercial). Le tableau ci-dessous détaille l'état de chaque phase structurante définie dans la Master Product Roadmap :"
          ),

          new Table({
            width: { size: TABLE_WIDTH, type: WidthType.DXA },
            borders: TABLE_BORDERS,
            rows: [
              new TableRow({
                children: [
                  makeHeaderCell("Phase & Périmètre", 2400),
                  makeHeaderCell("Description des Livrables", 4300),
                  makeHeaderCell("Statut", 1300),
                  makeHeaderCell("Progression", 1300),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 0 — Branding & Design System", 2400, { bold: true }),
                  makeDataCell("Charte graphique Maple Crimson/Navy, Logo 3D, typographies Google Bricolage Grotesque & DM Sans, 13 icônes 3D découpées.", 4300),
                  makeDataCell("TERMINÉ", 1300, { color: COLOR_EMERALD, bold: true }),
                  makeDataCell("100%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 1 — Socle Données & CRUD Admin", 2400, { bold: true }),
                  makeDataCell("PostgreSQL 17, 13 tables relationnelles Prisma, Back-Office de gestion des séries, questions, blog, FAQs et conciergerie.", 4300),
                  makeDataCell("TERMINÉ", 1300, { color: COLOR_EMERALD, bold: true }),
                  makeDataCell("100%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 2 — Moteur CBT CE & CO (QCM 39Q)", 2400, { bold: true }),
                  makeDataCell("39 questions CE en base, surligneur feutre FEI, 39 audios CO ElevenLabs Sarah/Charlie, lecteur CBT audio conforme.", 4300),
                  makeDataCell("PRÊT (Calibrage)", 1300, { color: COLOR_AMBER, bold: true }),
                  makeDataCell("95%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 3 — Atelier Expression Écrite (EE)", 2400, { bold: true }),
                  makeDataCell("Hub méthodologique en 3 paliers, 3 tâches FEI, entraînement chronométré, clavier d'accents FEI, correction IA 10s, Magic Rewrite C1/C2.", 4300),
                  makeDataCell("TERMINÉ", 1300, { color: COLOR_EMERALD, bold: true }),
                  makeDataCell("100%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 4 — Studio Visio Expression Orale (EO)", 2400, { bold: true }),
                  makeDataCell("Cockpit Zero-Scroll 100vh, orbe circulaire 16:9 de M. Laurent, mixage audio dual-channel, WebRTC ElevenLabs + mode guidé résilient.", 4300),
                  makeDataCell("TERMINÉ", 1300, { color: COLOR_EMERALD, bold: true }),
                  makeDataCell("100%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 5 — Catalogue Multi-Séries Réel", 2400, { bold: true }),
                  makeDataCell("5 Séries complètes d'Expression Écrite et 5 Séries d'Expression Orale (101 à 105 = 30 tâches) insérées dans PostgreSQL 17.", 4300),
                  makeDataCell("TERMINÉ", 1300, { color: COLOR_EMERALD, bold: true }),
                  makeDataCell("100%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 6 — Monétisation & Passerelles", 2400, { bold: true }),
                  makeDataCell("Client SasPay (Mobile Money MTN/Orange/Wave) et Stripe intégrés. Actuellement masqués derrière le Pass Lancement 100% Gratuit.", 4300),
                  makeDataCell("EN ATTENTE", 1300, { color: COLOR_AMBER, bold: true }),
                  makeDataCell("75%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Phase 7 — B2B Multi-Tenant (Écoles/CRIC)", 2400, { bold: true }),
                  makeDataCell("Spécification et schéma d'isolation par organisation (tenantId) conçus. Déploiement prévu en phase post-lancement public.", 4300),
                  makeDataCell("PLANIFIÉ", 1300, { color: "64748B", bold: true }),
                  makeDataCell("60%", 1300, { bold: true, align: AlignmentType.RIGHT }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // ==========================================
          // 3. BILAN DÉTAILLÉ DES RÉALISATIONS
          // ==========================================
          makeH1("3. BILAN DÉTAILLÉ DES FONCTIONNALITÉS LIVRÉES"),

          makeH2("A. Expression Écrite (EE) — Le Flagship Didactique"),
          makeBullet(
            "Hub Méthodologique Structuré en 3 Paliers",
            "Page d'entrée avec visite guidée orale du mentor 3D, décomposition du barème officiel FEI sur 20 points (4 critères de 5 pts : Adéquation, Cohérence, Lexique, Morphosyntaxe) et analyse des 3 pièges éliminatoires."
          ),
          makeBullet(
            "Exercices d'Application Corrigés de Niveau C1/C2",
            "Pour chacune des 3 tâches (Courriel 60-120 mots, Récit citoyen 120-150 mots, Débat d'actualité 120-180 mots), présentation d'un sujet type, d'une copie modèle 20/20 et d'un décryptage point par point."
          ),
          makeBullet(
            "Mode Entraînement Tâche par Tâche vs Examen Blanc 60 min",
            "Possibilité pour le candidat de s'exercer de manière ciblée sur un exercice (15 min pour T1, 20 min pour T2, 25 min pour T3) ou de simuler l'épreuve complète sous chronomètre officiel."
          ),
          makeBullet(
            "Barre du Temps Haute Fidélité & Clavier Accentué FEI",
            "Jauge d'écoulement chromatique (vert > 25%, ambre <= 25%, rouge écarlate sous 1 min), clavier virtuel complet (minuscules et capitales accentuées É, È, Ê, À, Ç, Œ, «, ») et soumission automatique sans perte si le temps expire."
          ),
          makeBullet(
            "Moteur d'Évaluation IA Instantané & Magic Rewrite",
            "Correction automatique sous DeepSeek-V3 / OpenAI selon les critères FEI et génération d'une version modèle perfectionnée de la propre copie du candidat."
          ),

          makeH2("B. Expression Orale (EO) — Cockpit Visio 100vh & Résilience Vocale"),
          makeBullet(
            "Architecture Cockpit Zero-Scroll 100vh",
            "Suppression intégrale de la barre de défilement (conforme aux moniteurs d'examen FEI). Pod visio circulaire centré de l'examinateur IA M. Laurent Mercier à gauche avec anneaux acoustiques concentriques réactifs, et hub de dialogue direct avec transcription instantanée à droite."
          ),
          makeBullet(
            "Résilience Vocale & Bouton de Secours 1-Clic",
            "Prise en charge double : Appel direct WebRTC ElevenLabs haute fidélité ET Mode Guidé (Microphone Standard) tour par tour avec repli clavier discret garantissant 100% de fiabilité même en cas de réseau instable."
          ),
          makeBullet(
            "Enregistrement Audio Intégral Dual-Channel",
            "Mixage audio Web Audio API combinant la voix du candidat et celle de l'examinateur dans une archive unique téléchargeable pour débriefing tuteur."
          ),
          makeBullet(
            "Module Pré-Test Micro & Casque Réel",
            "Vérification matérielle obligatoire avant l'entrée dans l'arène avec vu-mètre 16 barres FFT et test de volume."
          ),

          makeH2("C. Base de Données PostgreSQL 17 — Zéro Mock Data"),
          makeBullet(
            "Cluster Docker Actif & Sains",
            "PostgreSQL 17 sur le port 5434 (`super4c2-db`), Supabase Studio sur le port 3002 (`super4c2-studio`) et Meta API (`super4c2-meta`)."
          ),
          makeBullet(
            "Catalogue 5 Séries Complètes (101 à 105)",
            "30 tâches réelles rédigées et persistées dans PostgreSQL couvrant 5 thématiques majeures (Logement, Nouveaux modes de travail, Transition écologique, Patrimoine multiculturel, Santé et technologies)."
          ),
          makeBullet(
            "Services Serveurs Typés",
            "`written-service.ts` et `oral-service.ts` effectuant des requêtes directes Prisma avec résolution dynamique des alias."
          ),

          makeH2("D. Mentors 3D, Gamification & Rétention Candidat"),
          makeBullet(
            "Onboarding en 2 Étapes & Choix du Compagnon 3D",
            "Présentation audio du TCF Canada (+50 pts CRS) puis sélection parmi 3 mentors à forte personnalité : Kodiak (le grizzly canadien rassurant), Aura (le stratège IA analytique) et Barnabé (le castor bâtisseur)."
          ),
          makeBullet(
            "Carnet d'Erreurs à Répétition Espacée (SRS SM-2)",
            "Archivage automatique de chaque faute commise en examen CBT avec planification Ebbinghaus (J+1, J+3, J+7) et lecteur de flashcards interactif."
          ),
          makeBullet(
            "Roadmap Interactive & Déblocage Gamifié",
            "Piste visuelle de progression (`ExamRoadmapBoard`) avec jalons S.101 à S.105, badges de compétences et points XP."
          ),

          makeH2("E. Back-Office Super Admin & Sécurité"),
          makeBullet(
            "Console de Direction 3-Voies",
            "Tableau de bord exécutif avec KPIs en direct (candidats, tentatives, taux NCLC 7+ réel calculé sur les données Prisma), connexion sécurisée par Clé Maître, SSO ou Code PIN 2FA."
          ),
          makeBullet(
            "Actions en Lot (Batch Actions) & Export CSV",
            "Sélection multiple sur les FAQs, les Témoignages et les Leads conciergerie avec boutons d'export CSV encodés en UTF-8 BOM pour préserver les accents sous Excel."
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // ==========================================
          // 4. PLAN D'ACTION & PROCHAINES ÉTAPES
          // ==========================================
          makeH1("4. PLAN D'ACTION : FONCTIONNALITÉS RESTANTES À LIVRER"),
          makeP(
            "Pour finaliser la plateforme et maximiser le chiffre d'affaires lors de la clôture de la phase de lancement gratuit, voici les 5 chantiers prioritaires à planifier :"
          ),

          makeCallout(
            "CHANTIER PRIORITAIRE N°1 — OUVERTURE PUBLIQUE CE & CO (QCM 39 QUESTIONS)",
            "Objectif : Retirer le badge de calibrage FEI et ouvrir l'accès direct aux 39 questions de Compréhension Écrite et 39 extraits audios de Compréhension Orale déjà entièrement implémentés et sonorisés en studio ElevenLabs.\n" +
              "Impact : Permet de délivrer aux candidats la simulation complète « Examen Blanc 4 Épreuves » d'une durée de 2h47min avec attestation officielle provisoire FEI.",
            COLOR_NAVY,
            COLOR_SLATE_LIGHT
          ),

          new Paragraph({ spacing: { before: 100 } }),

          makeCallout(
            "CHANTIER PRIORITAIRE N°2 — PERSONNALISATION VOCALE DES 3 MENTORS",
            "Objectif : Attribuer une voix ElevenLabs dédiée à chacun des 3 compagnons (Kodiak, Aura, Barnabé) et les faire intervenir vocalement dans le débriefing d'après-examen (analyse des erreurs et explication personnalisée du Magic Rewrite C1/C2).\n" +
              "Impact : Augmentation majeure du taux de complétion et attachement émotionnel à la marque Super4C2.",
            COLOR_CRIMSON,
            COLOR_SLATE_LIGHT
          ),

          new Paragraph({ spacing: { before: 100 } }),

          makeCallout(
            "CHANTIER PRIORITAIRE N°3 — BASCULE FREEMIUM & ACTIVATION SASPAY / STRIPE",
            "Objectif : Lever les redirections automatiques de /tarifs et /checkout pour activer les abonnements réels : Pass Sprint 7 jours, Pass Intensif 30 jours et le Pass Immigrant Annuel 365 Jours (60 000 FCFA / 89,99 €) propulsé par SasPay (MTN MoMo, Orange Money, Wave) et Stripe.\n" +
              "Impact : Déclenchement du MRR (Monthly Recurring Revenue) et monétisation des cohortes de candidats acquises.",
            COLOR_AMBER,
            COLOR_SLATE_LIGHT
          ),

          new Paragraph({ spacing: { before: 100 } }),

          makeCallout(
            "CHANTIER PRIORITAIRE N°4 — ESPACE B2B MULTI-TENANT (ÉCOLES & CONSULTANTS)",
            "Objectif : Activer les routes /org/[slug] et /tuteur prévues dans la spécification 05 pour permettre aux centres de formation et aux consultants réglementés en immigration canadienne (CRIC) de superviser leurs étudiants en direct.\n" +
              "Impact : Canal de vente B2B à fort panier moyen (licences annuelles par siège).",
            COLOR_SLATE_DARK,
            COLOR_SLATE_LIGHT
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // ==========================================
          // 5. CALENDRIER PRÉVISIONNEL DES SPRINTS
          // ==========================================
          makeH1("5. CALENDRIER PRÉVISIONNEL DES PROCHAINS SPRINTS"),

          new Table({
            width: { size: TABLE_WIDTH, type: WidthType.DXA },
            borders: TABLE_BORDERS,
            rows: [
              new TableRow({
                children: [
                  makeHeaderCell("Sprint & Période", 2400),
                  makeHeaderCell("Objectifs & Livrables Techniques", 4900),
                  makeHeaderCell("Livrable Clé", 2000),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Sprint 1 (Semaine en cours)", 2400, { bold: true }),
                  makeDataCell("Levée du bandeau de calibrage sur CE & CO Série 101. Recette finale de l'Examen Blanc 4 épreuves enchaînées (2h47) et impression de l'attestation PDF FEI.", 4900),
                  makeDataCell("Examen Blanc 4 Épreuves Live", 2000, { bold: true, color: COLOR_CRIMSON }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Sprint 2 (Fin Octobre 2026)", 2400, { bold: true }),
                  makeDataCell("Intégration des profils vocaux ElevenLabs pour Kodiak, Aura et Barnabé. Débriefing audio personnalisé du Magic Rewrite après chaque soumission écrite.", 4900),
                  makeDataCell("Coaching Vocal Personnalisé", 2000, { bold: true, color: COLOR_NAVY }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Sprint 3 (Début Novembre 2026)", 2400, { bold: true }),
                  makeDataCell("Bascule commerciale : fin de l'offre 100% gratuit, activation de la passerelle SasPay (Mobile Money Afrique) et Stripe, gestion des quotas d'évaluations IA.", 4900),
                  makeDataCell("Lancement Monétisation & MRR", 2000, { bold: true, color: COLOR_EMERALD }),
                ],
              }),
              new TableRow({
                children: [
                  makeDataCell("Sprint 4 (Mi-Novembre 2026)", 2400, { bold: true }),
                  makeDataCell("Déploiement du portail Partenaires B2B (/org) pour les écoles de langues et consultants en immigration avec vente de packs de crédits candidats.", 4900),
                  makeDataCell("Portail B2B Multi-Tenant", 2000, { bold: true, color: COLOR_SLATE_DARK }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // ==========================================
          // 6. CONCLUSION & RECOMMANDATION POUR LA DIRECTION
          // ==========================================
          makeH1("6. RECOMMANDATION STRATÉGIQUE POUR LA DIRECTION"),
          makeP(
            "L'architecture technique et l'expérience utilisateur de Super4C2 surpassent aujourd'hui très nettement l'ensemble des acteurs existants du marché de l'immigration canadienne. La suppression des faux scores et des données fictives au profit d'une base relationnelle réelle confère au produit une robustesse et une crédibilité institutionnelle indispensables vis-à-vis des candidats et des partenaires."
          ),
          makeP(
            "Recommandation opérationnelle immédiate : Maintenir l'acquisition virale gratuite pendant encore 10 à 15 jours sur les réseaux sociaux (notamment via le simulateur CRS et le bouche-à-oreille autour du cockpit visio de l'oral), puis opérer la bascule payante avec le Pass Immigrant 365 Jours dès que le palier des 500 premiers candidats actifs sera franchi."
          ),

          new Paragraph({
            spacing: { before: 300, after: 100 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
            },
            children: [
              new TextRun({
                text: "Document rédigé et certifié conforme par Dimitri SnowDev, Lead Developer & Architecte Produit Super4C2.",
                italics: true,
                size: 18,
                color: "64748B",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const outputDir = path.join(__dirname, "../docs/reports");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "RAPPORT_EXECUTIF_AVANCEMENT_ROADMAP_SUPER4C2.docx");
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Rapport Exécutif Word généré avec succès dans : ${outputPath}`);
  console.log(`📄 Taille du fichier : ${(buffer.length / 1024).toFixed(1)} Ko`);
}

buildDocument().catch((err) => {
  console.error("❌ Erreur pendant la génération DOCX :", err);
  process.exit(1);
});
