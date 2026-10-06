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
- [x] Phase 5 — Vitrine d'Acquisition (Landing Page `/`) complète (Hero Bricolage Grotesque, BentoGrid des 4 épreuves, comparatif direct Super4C2 vs Objectif Canada, statistiques clés).
- [x] Résolution de l'erreur de build SSR (`next/headers` découplé via slot prop dans `AppShell`) — Build de production 16/16 pages 100% validé avec 0 erreur.
- [x] Dépannage du serveur de dev local : libération du port 3000, réinitialisation de l'instance Next.js, toutes les 16 routes opérationnelles avec réponse HTTP 200.
- [x] Correction des redirections d'introduction EE & EO dans `/examens` et configuration de l'autorisation microphone dans `next.config.ts`.

## En Cours
- [ ] Validation visuelle et parcours utilisateur complets dans le navigateur.

## À Venir
- [ ] Schéma de données Prisma (Exams, Questions, Answers, Submissions, AICorrections).
- [ ] Prototype du Simulateur CBT Compréhension Écrite & Orale.
- [ ] Moteur de correction d'Expression Écrite par IA (grille FEI + Magic Rewrite).
- [ ] Agent vocal interactif pour l'Expression Orale (Jeu de rôle Tâche 2).
- [ ] Simulateur de points CRS / Entrée Express & Dashboard de progression NCLC.
- [ ] Intégration paiement & onboarding.
