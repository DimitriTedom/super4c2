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

- [x] Schéma Prisma CBT (ExamSeries, Question, UserAttempt) — `prisma generate` OK, migration NON appliquée (DB/Docker indisponible).
- [x] Moteur CBT CE : `lib/exam/*` (types, scoring NCLC/CRS, mock série 101 de 5 questions), `hooks/use-exam-session.ts` (timer par deadline + autosave localStorage), `components/exam/*`, route `/examens/demo-101/ce`.

## En Cours
- [ ] Vérification visuelle navigateur de `/examens/demo-101/ce` (light/dark).
- [ ] Compléter la série à 39 questions réelles ; lecteur audio CO (`AudioPlayerCBT`).
- [ ] Docker/WSL cassé (service WSL RPC) : Dimitri doit redémarrer LxssManager/Windows, puis supprimer conteneurs du portfolio.
- Note : `npx shadcn add` a échoué (timeout réseau vers ui.shadcn.com) → composants custom sans Radix radio-group.

## À Venir
- [ ] Schéma de données Prisma (Exams, Questions, Answers, Submissions, AICorrections).
- [ ] Prototype du Simulateur CBT Compréhension Écrite & Orale.
- [ ] Moteur de correction d'Expression Écrite par IA (grille FEI + Magic Rewrite).
- [ ] Agent vocal interactif pour l'Expression Orale (Jeu de rôle Tâche 2).
- [ ] Simulateur de points CRS / Entrée Express & Dashboard de progression NCLC.
- [ ] Intégration paiement & onboarding.
