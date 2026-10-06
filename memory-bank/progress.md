# Progress Tracking: Super4C2

## Ce qui est Réalisé
- [x] Clonage et configuration du repo `git@github.com:DimitriTedom/super4c2.git`.
- [x] Audit concurrentiel complet d'Objectif Canada TCF (architecture, structure des épreuves, modèle de correction, délais).
- [x] Initialisation du système Memory Bank (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`).
- [x] Définition des règles et compétences mémoires pérennes.
- [x] Création du Brand Canvas (`docs/brand/brand-canvas.md`) et du Guide Canva (`docs/brand/canva-branding-guide.md`).
- [x] Intégration des assets de marque réels créés par Dimitri (`public/brand/` et `public/favicon_io/`).
- [x] Création du composant dynamique `<BrandLogo />` adaptatif Thème Clair / Thème Sombre (`components/brand-logo.tsx`).
- [x] Injection de Bricolage Grotesque, DM Sans et Space Mono via `next/font/google` dans `app/layout.tsx` et `tailwind.config.js`.
- [x] Intégration du Header officiel avec BrandLogo et ThemeToggle (`components/site-header.tsx`).
- [x] Installation des dépendances et validation du build de production Next.js 15 (`npm run build` : 100% succès sans erreur).

- [x] Schéma Prisma CBT (ExamSeries, Question, UserAttempt) — `prisma generate` OK, migration prête.
- [x] Moteur CBT CE & CO complet :
  - Catalogue des épreuves (`/examens`).
  - Consignes officielles & test casque (`/examens/[seriesId]/intro`).
  - Simulateur CE (`/examens/demo-101/ce`).
  - Simulateur CO avec lecteur audio mono-écoute (`/examens/demo-101-co/co`).
  - Grille de 39 pastilles avec filtres et drapeaux de révision.
  - Masquage automatique du header en examen via `AppShell`.
  - Logomarks mis à jour avec asset haute définition pour Favicon (`public/brand/favicon-source-1024.png`).

## En Cours
- [ ] Atelier d'Expression Écrite (EE) : Rédaction 3 tâches officielles FEI avec compteur de mots dynamique et jauges de tolérance (`docs/specs/02-written-expression-engine.md`).
- [ ] Moteur de correction IA selon les 4 critères FEI + Magic Rewrite C1/C2.

## À Venir
- [ ] Schéma de données Prisma (Exams, Questions, Answers, Submissions, AICorrections).
- [ ] Prototype du Simulateur CBT Compréhension Écrite & Orale.
- [ ] Moteur de correction d'Expression Écrite par IA (grille FEI + Magic Rewrite).
- [ ] Agent vocal interactif pour l'Expression Orale (Jeu de rôle Tâche 2).
- [ ] Simulateur de points CRS / Entrée Express & Dashboard de progression NCLC.
- [ ] Intégration paiement & onboarding.
