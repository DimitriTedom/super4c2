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

- [x] Phase 1 — Moteur CBT CE & CO complet (QCM, lecteur audio mono-écoute, pastilles 1-39, scoring TCF & NCLC, navigation).
- [x] Phase 2 — Atelier d'Expression Écrite (EE) complet (Éditeur 3 tâches, compteur de mots FEI temps réel, grille FEI, Magic Rewrite C1/C2).
- [x] Phase 3 — Salle d'Expression Orale (EO) & Voice Agent IA complet (Entretien dirigé, Jeu de rôle Tâche 2 en direct, Monologue argumenté, notation FEI).
- [x] Phase 4 — Simulateur CRS, Carnet SRS & Dashboard complet (Calculateur CRS viral, carnet SRS J+1/J+3/J+7, hub candidat, grille tarifaire).
- [x] Phase 5 — Vitrine d'Acquisition (Landing Page `/`) : intégration du Globe 3D interactif WebGL centré en bas de la Hero section, barre de navigation avec pilule flottante et sélecteur de langue 🇨🇦 FR-CA.
- [x] Préservation intégrale des argumentaires, des blocs comparatifs et des thèmes Clair / Sombre.
- [x] Validation du build de production Next.js 15 (16/16 routes générées avec succès, 0 erreur).

## En Cours
- [ ] Revue visuelle utilisateur et finalisation de l'intégration base de données.

## À Venir
- [ ] Schéma de données Prisma (Exams, Questions, Answers, Submissions, AICorrections).
- [ ] Prototype du Simulateur CBT Compréhension Écrite & Orale.
- [ ] Moteur de correction d'Expression Écrite par IA (grille FEI + Magic Rewrite).
- [ ] Agent vocal interactif pour l'Expression Orale (Jeu de rôle Tâche 2).
- [ ] Simulateur de points CRS / Entrée Express & Dashboard de progression NCLC.
- [ ] Intégration paiement & onboarding.
