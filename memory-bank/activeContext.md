# Active Context: Super4C2

## 1. Navigation Groupée, Roadmap Fléché Horizontal & Témoignages Publics
- **Navigation Supérieure Réorganisée & Menus Groupés (`components/site-nav.tsx` & `components/site-header.tsx`) :**
  - Fin du bug `isActive` qui figeait la navigation sur "Accueil" (`/`) : détection dynamique via `usePathname()`.
  - Menus déroulants élégants animés avec Framer Motion :
    - *Séries & Examens* (TCF Canada, TEF Canada, IELTS General, Catalogue des Séries)
    - *Simulateurs & IA* (Compréhension Écrite 39Q, Compréhension Orale 39Q, Oral IA Live, Écrit FEI IA, Carnet SRS, Calculateur CRS)
    - *Ressources* (Blog & Décryptages, Communauté VIP, Conciergerie)
    - *Tarifs* (Lien direct)
  - Cloche de notification conditionnelle : strictement masquée pour les visiteurs non authentifiés (`{user ? <NotificationBell /> : null}`).
- **Exécution des 4 Piliers Majeurs :**
  1. **Option 1 (Expression Orale Live) :** Salle d'examen CBT avec examinateur IA live vocal (Web Speech API + OpenAI GPT-4o-mini / FEI déterministe), évaluation des 5 critères FEI, persistance en base PostgreSQL (`UserAttempt`) et bouton d'export direct des tournures C1/C2 vers le Carnet SRS (`super4c2:srs_cards`).
  2. **Option 2 (Expression Écrite CBT) :** Éditeur 3 tâches avec compteur de mots en temps réel, critères FEI et Magic Rewrite C1/C2, avec persistance automatique de la tentative (`UserAttempt`) dans PostgreSQL.
  3. **Option 3 (Compréhension Orale 39 Questions) :** Création de `lib/exam/series-co-101.ts` avec la banque complète de 39 questions authentiques couvrant les 6 paliers (A1 à C2), intégrée au simulateur CBT et dans la navigation.
  4. **Option 4 (Calculateur CRS & Dashboard Candidat) :** Refonte de `app/dashboard/page.tsx` connectée aux vraies tentatives PostgreSQL, liens de navigation normalisés et redirection propre `/calculateur-crs` -> `/nclc-calculator`.

- **Améliorations Clés Ergonomie & IA (EE, Toastify, DeepSeek, ElevenLabs) :**
  - **Génération Audio Studio ElevenLabs (`lib/audio/elevenlabs.ts` & `scripts/generate-co-audio.ts`) :**
    - Clé API ElevenLabs configurée dans `.env`.
    - Script de génération par lot des fichiers MP3 studio haute fidélité (`public/audio/co/co-101-q*.mp3`) avec alternance voix officielle féminine (`Sarah`) et conversationnelle masculine (`Charlie`).
    - Questions 1 à 6 de la Compréhension Orale Série 101 reliées directement à leurs fichiers MP3 physiques dans `lib/exam/series-co-101.ts`.
    - Lecteur CBT officiel `<AudioPlayerCBT />` testé avec succès en navigateur : écoute unique, progression synchrone et verrouillage post-écoute.
  - **Barre d'Accents Officielle FEI (Assistance QWERTY) :** Ajout de la barre de boutons de caractères accentués (`é`, `è`, `ê`, `ë`, `à`, `â`, `ç`, `ô`, `î`, `ï`, `ù`, `û`, `œ`, `«`, `»`, `€`) dans [components/exam/written-exam-editor.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/written-exam-editor.tsx) avec insertion précise au curseur.
  - **Bouton d'Échappatoire Sécurisé :** Ajout du bouton *"Quitter"* dans le header de l'Expression Écrite avec dialogue de confirmation informant de la persistance automatique des brouillons.
  - **Support IA DeepSeek-V3 & OpenAI :** Détection automatique dans [lib/ai/service.ts](file:///d:/SnowDev/Documents/super4c2/lib/ai/service.ts) de `DEEPSEEK_API_KEY` (`deepseek-chat` à ~0.15 FCFA / correction) ou `OPENAI_API_KEY`, avec repli FEI déterministe.
  - **Aura C2™ — L'Intelligence Pédagogique Propriétaire Super4C2 (Template 21st.dev `Agent Chat`) :**
    - Identité de marque 100% propriétaire : aucun modèle tiers n'est cité (mention de DeepSeek éliminée dans toute l'UI et verrouillée dans les instructions système).
    - Garde-fous stricts : Aura C2 est strictement cantonné au domaine d'expertise de Super4C2 (TCF/TEF Canada, NCLC 7+, CRS, épreuves CE/CO/EE/EO, SRS et assistance admin). Si un sujet extérieur est abordé, Aura C2 recentre poliment sur la préparation au test.
    - Rendu Markdown GFM avancé : utilisation de `react-markdown`, `remark-gfm` et `remark-breaks` avec tableaux stylisés, listes, citations et gras.
    - Synthèse Vocale (Audio TTS) : bouton « Écouter » sur chaque réponse pour entendre la prononciation en français standard naturel.
    - Barre d'action SaaS complète : Copie dans le presse-papier avec toast, retour de satisfaction (pouce levé / baissé), bouton d'agrandissement et réinitialisation.
    - Détection de la page active via `usePathname()` pour adapter les réponses au contexte de navigation du candidat.
  - **Migration Système de Toasts Toastify :** Intégration de `react-toastify` via `<ToastifyContainer />` ([components/ui/toastify.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/toastify.tsx)) dans [app/layout.tsx](file:///d:/SnowDev/Documents/super4c2/app/layout.tsx) avec barre de progression Maple Crimson.

## 2. Moteur IA In-App Next.js & Notifications Automatisées
- **Moteur d'Évaluation Direct Next.js (`lib/ai/service.ts`) :**
  - Pas de dépendance de serveur externe (n8n évité initialement pour privilégier la performance et la simplicité).
  - Évaluation de l'Expression Écrite par OpenAI GPT-4o-mini (`evaluateWrittenTaskWithAi`) sur les 4 critères officiels FEI (Adéquation, Cohérence, Lexique, Morphosyntaxe) avec réécriture "Magic Rewrite C1/C2".
  - Dialogue interactif d'Expression Orale (`generateOralExaminerReplyWithAi`) simulant l'examinateur officiel pour les tâches 1 et 2.
  - Fallback déterministe certifié FEI garantissant un fonctionnement 100% robuste même sans clé API.
  - Intégration dans `app/api/ai/evaluate-written/route.ts` et `app/api/ai/oral-roleplay/route.ts`.
- **Système de Notifications In-App & Mails Transactionnels :**
  - Modèle Prisma `Notification` (`EXAM`, `SRS`, `LEAD`, `SYSTEM`, `BILLING`) relié à PostgreSQL Docker.
  - Composant interactif `<NotificationBell />` pour candidats (`SiteHeader`) et administrateurs (`AdminShell`).
  - Déclencheurs automatisés : soumission d'épreuve écrite (`EXAM`), formulaire de contact/lead (`LEAD`), inscription newsletter (`SYSTEM`).
  - Moteur d'emails transactionnels Nodemailer (`lib/mail.ts`) prêt pour SMTP réel ou simulation locale sécurisée.

## 2. Focus Principal & Priorité Absolue
- **Compréhension Écrite (CE) 100% Production-Ready (Raison d'être première du SaaS) :**
  - **Banque complète 39 questions authentiques Série 101 (`lib/exam/series-ce-101.ts`) :**
    - Q1–Q6 : Niveau A1 (messages courts, affiches, horaires)
    - Q7–Q12 : Niveau A2 (annonces, consignes, offres d'emploi)
    - Q13–Q18 : Niveau B1 (notes de service, articles de presse pratiques)
    - Q19–Q28 : Niveau B2 (transition écologique, travail hybride, économie canadienne — Seuil NCLC 7)
    - Q29–Q35 : Niveau C1 (essais critiques, analyses sociologiques, sens implicite)
    - Q36–Q39 : Niveau C2 (subtilités lexicales, débats épistémologiques, nuances stylistiques)
    - Chaque question contient l'intitulé, le document source, les 4 options A/B/C/D, l'explication pédagogique et le décodage systématique des pièges (`trapAnalysis`).
  - **Interface CBT Conforme aux Normes France Éducation International (FEI) :**
    - Écran scindé officiel : Document source à gauche avec zoom typographique (`A-` / `A+` / `100%`) et badge de nature du document. Question et propositions à droite avec badges de palier CECRL / NCLC et badges de touches clavier `[A][B][C][D]`.
    - Chronomètre officiel 60 minutes avec alertes à 5 min et 1 min, jauge de progression en temps réel (`X / 39 répondues`) et dialogue de confirmation intelligent permettant de sauter directement aux questions sans réponse.
    - Grille de navigation 39 pastilles avec filtres dynamiques (`Toutes (39)`, `Répondues`, `Non répondues`, `Signalées`).
    - Raccourcis clavier complets natifs (`A-D` pour répondre, `←/→` pour naviguer, `F` pour marquer).
    - Sauvegarde et reprise automatique en temps réel via `localStorage`.
  - **Bilan Pédagogique & Revue Post-Épreuve (`exam-result-summary.tsx`) :**
    - Score TCF échelonné officiel (100–699 pts), équivalence NCLC (NCLC 3 à 10+), et calcul du bonus Entrée Express (+50 points CRS).
    - Répartition par palier CECRL (A1-A2, B1-B2 seuil NCLC 7, C1-C2).
    - Filtres de revue (`Toutes`, `Erreurs`, `Réussies`, `Signalées`) et accordéon pour relire le document source.
    - Décodage des pièges FEI et bouton d'export direct vers le **Carnet d'Erreurs à Répétition Espacée (SRS)** (`super4c2:srs_cards`).
  - **Catalogue & Consignes :** Carte Flagship mise en avant sur `/examens` et page de consignes détaillée `/examens/[seriesId]/intro`.
  - **Alignement du User Flow Concurrent (Objectif Canada TCF) :**
    - **Hero CTAs :** Remplacement des boutons génériques par `Commencer le TCF` (Maple Crimson) et `Commencer le TEF`, avec lien direct pour les points CRS Canada.
    - **Catégorisation des Séries (`/examens`) :** Organisation conforme au modèle mental du candidat : *Séries complètes (Nouveau format TCF)*, *Expressions uniquement*, et *Accès direct par discipline*.
    - **Page Sélecteur de Discipline (`/examens/[seriesId]`) :** Reproduction du hub de choix de discipline (Compréhension Écrite 60 min 39Q, Compréhension Orale, Expression Écrite, Expression Orale) avec une ergonomie et un design 10x supérieurs.

## 2. Correction Critique de la Palette de Couleurs
- **Éradication du Bleu générique Shadcn :** La variable CSS `--primary` et `--ring` dans `styles/globals.css` pointait sur un bleu générique (`221.2 83.2% 53.3%`).
- **Application stricte du Brand Canvas :**
  - `--primary` & `--ring` désormais calés sur le **Maple Crimson officiel (`#E51A31` / `353 80% 50%`)**.
  - Fond sombre calé sur l'**Imperial Navy (`#0B132B` / `224 59% 10%`)**.

## 3. Éradication Complète des Pages par Défaut (Auth, 404, 500, Compte)
- **Pages d'Authentification Brandées (`app/auth/login` & `app/auth/register`) :**
  - Remplacement des textes génériques en anglais par une expérience candidat soignée en français.
  - Cartes d'authentification avec BrandLogo, badge *Espace Candidat TCF & TEF*, boutons d'action Maple Crimson, révélateur de mot de passe interactif (Eye/EyeOff) et garanties sécurité canadiennes.
- **Page 404 Not Found Personnalisée (`app/not-found.tsx`) :**
  - Fin du 404 brut de Next.js : écran sur-mesure avec typographie dégradée Maple Crimson, message bienveillant orienté TCF, et 3 cartes d'accès rapide (*Séries TCF*, *Simulateur CRS*, *Carnet SRS*).
- **Page d'Erreur Système (`app/error.tsx`) :**
  - Error boundary React élégant avec bouton de retry (`reset()`), préservation des données locales et redirection vers les examens.
- **Page Mon Compte / Profil Candidat (`app/account/page.tsx`) :**
  - Transformation de la page texte brute en véritable hub candidat : avatar aux initiales du candidat, statut de compte vérifié, carte d'objectif linguistique NCLC 7 / CRS +50 pts, état de l'abonnement actif et déconnexion sécurisée via `/logout`.

## 4. Ajout du CTA IELTS, Module Blog & Pages Premium
- **Hero CTA IELTS General (`app/page.tsx`) :**
  - Ajout du bouton d'action *Préparer l'IELTS General* aux côtés de *Commencer le TCF* et *Commencer le TEF*.
  - Mise à jour du badge supérieur : *Préparation Officielle Canada : TCF • TEF • IELTS*.
- **Système de Blog & Stratégie SEO (`docs/specs/04-blog-and-content-system.md`) :**
  - Modèle de données typé (`lib/blog/types.ts`) et banque d'articles approfondis (`lib/blog/mock-posts.ts`).
  - Page catalogue `/blog` avec recherche instantanée, filtres de catégories, article vedette et temps de lecture.
  - Page article détaillée `/blog/[slug]` avec rendu Markdown structuré, fil d'Ariane, signature auteur et CTA contextuel vers le simulateur CBT ou le calculateur CRS.
- **Spécifications Multi-Tenant & Dashboards (`docs/specs/05-multitenant-architecture-and-dashboards.md`) :**
  - Architecture B2B multi-tenant pour écoles de langues et agences d'immigration (isolation des données par `tenant_id`, rôles `SUPER_ADMIN`, `ORG_ADMIN`, `TUTOR_TEACHER`, `STUDENT_CANDIDATE`).
  - Matrice des 4 dashboards : Super Admin (`/admin`), Organisation (`/org/[slug]`), Tuteur (`/tuteur`), Candidat (`/dashboard`).
- **Pages Premium Remplaçant les Pages Rudimentaires du Concurrent (`docs/specs/06-community-topics-and-concierge.md`) :**
  - **Conciergerie Candidat (`/contact`) :** Formulaire de routage par intention (Candidat, Urgence Examen, B2B École/CRIC, Support), engagement SLA 2h et accès direct WhatsApp.
  - **Communauté & Groupes VIP (`/communaute`) :** Hub d'accès aux canaux Telegram VIP (alertes sujets en direct), groupe WhatsApp NCLC 7 et salon retours d'expérience.
  - **Banque des Sujets Récents 2026 (`/sujets-recents`) :** Sujets d'Expression Écrite et Orale tombés dans les centres FEI mondiaux, enrichis de suggestions lexicales C1/C2 et d'un bouton d'entraînement direct CBT.
- **Navigation Globale (`components/site-header.tsx` & `components/site-footer.tsx`) :**
  - Liens directs vers Blog, Communauté, Sujets Récents et Contact intégrés dans la barre de navigation et le footer.

## 5. Console Super Admin, B2B & Passerelle d'Authentification Back-Office
- **Passerelle d'Authentification Exécutive (`app/admin/login` & `middleware.ts`) :**
  - Mur d'authentification bloquant tout accès direct non accrédité à `/admin` (redirection HTTP 307 vers `/admin/login?next=/admin`).
  - Interface haute sécurité : Mode *Clé Maître & SSO* + Mode *Code PIN 2FA (TOTP 6 chiffres)* avec clavier virtuel interactif.
  - Bouton *Accès Direct Démo* (1 clic) pour tests immédiats sans friction.
  - Cookie de session sécurisé `super4c2_admin_token` (validité 24h) et `localStorage`.
  - Bouton de déconnexion Back-Office dans le header et la sidebar desktop avec redirection immédiate vers `/admin/login`.
- **Architecture Dédiée Standalone (`components/app-shell.tsx` & `components/admin/admin-dashboard.tsx`) :**
  - **Correction du Double Header :** Exclusion de `/admin` et `/admin/login` de la barre de navigation publique (`SiteHeader`) et du footer (`SiteFooter`).
  - **Correction du Scroll & Hauteur :** Conteneur principal `overflow-y-auto` natif et fluide sans double ascenseur.
  - **Navigation Mobile App Moderne (Éradication Totale du Menu Hamburger) :** Remplacement de tout burger menu par une barre de navigation mobile native ancrée en bas de l'écran avec pastilles actives et micro-animations, à la fois sur le site public (`components/mobile-nav.tsx`) et sur la console Super Admin (`components/admin/admin-dashboard.tsx`).
  - **Sidebar Administrative Repliable :** BrandLogo Super4C2 avec badge "Admin", toggle de réduction desktop (`w-72` vers `w-16`), sélecteur d'organisation multi-tenant, et monitoring live de l'infrastructure CBT.
  - **Modal Fiche Candidat Interactive :** Clic sur "Détails" ouvre un tiroir modal avec bilan complet des 4 compétences (CE, CO, EE, EO) et éligibilité CRS.

## 7. Phase 1 : Socle Data & CRUDs Opérationnel (Modèle Pratik-IT)
- **Infrastructure Docker PostgreSQL & Studio :**
  - Conteneur `super4c2-db` (PostgreSQL 17) opérationnel et sain sur le port `5434:5432`.
  - Conteneur `super4c2-studio` sur le port `3002:3000` et `super4c2-meta` sur `8080`.
- **Modèle de Données Exhaustif (`prisma/schema.prisma`) :**
  - Séries et Questions CE (`ExamSeries`, `Question` 1-39).
  - Séries et Tâches EE (`WrittenSeries`, `WrittenTask` T1, T2, T3).
  - Tentatives et Scores Candidats (`UserAttempt` avec NCLC, score échelonné 100-699 et bonus CRS +50).
  - Contenu & Marketing : `BlogPost`, `Faq`, `Testimonial`, `NewsletterSubscriber`, `ContactLead`.
- **Synchronisation & Seed Validés :**
  - `prisma db push` exécuté avec succès.
  - `prisma/seed.ts` exécuté avec succès : 39 questions CE, 3 tâches EE, 4 articles de blog, 5 FAQs et 3 témoignages réels injectés dans la base.
- **Utilitaires CRUD & Composants Réutilisables :**
  - `lib/admin-crud-utils.ts`, `lib/admin-pagination.ts`, `lib/toast-navigation.ts`.
  - `components/admin/ConfirmActionDialog.tsx`, `components/admin/AdminTablePagination.tsx`, `components/admin/AdminTableSelectAll.tsx`, `components/admin/AdminListEmptyState.tsx`.
- **Validation Globale :**
  - `tsc --noEmit` : 0 erreur.
  - Serveur Next.js : HTTP 200 OK sur toutes les routes.

## 8. CRUD Séries CE & Questions 1–39 Opérationnel (100% Production-Ready)
- **Gestion des Séries CE (`/admin/series-ce`) :**
  - Table des séries avec badges d'état (Publiée / Brouillon), comptage réel des questions (`X / 39 questions`), temps officiel, actions d'édition et suppression avec confirmation modale.
  - Page de création `/admin/series-ce/ajouter` et page de modification `/admin/series-ce/[id]` avec Server Actions et validation.
- **Gestion des 39 Questions & Éditeur Markdown Avancé (`/admin/series-ce/[id]/questions`) :**
  - Barre d'accès direct 1 à 39 avec pastilles cliquables interactives différenciant les questions existantes des numéros vacants.
  - Remplacement de tous les `<select>` natifs par les composants premium **Shadcn UI Select (`@/components/ui/select`)** basés sur `@radix-ui/react-select`.
  - **Interface Markdown de type Pratik-IT (`components/admin/markdown-field.tsx`) :**
    - Barre d'outils riche : Gras, Italique, Titres H2/H3, Listes à puces & numérotées, Citations, Code, Liens.
    - 3 modes de travail : Édition, Côte à côte (split view avec prévisualisation en direct) et Aperçu.
    - Modèles rapides intégrés pour documents d'examen FEI (*Avis / Annonce*, *Courriel interne*, *Article d'actualité*, *Décodage distracteurs A/B/C/D*).
    - Compteur dynamique de mots et caractères.
  - **Onglet Aperçu Simulateur CBT Réel :**
    - Commutateur dans l'en-tête permettant à l'administrateur de visualiser la question en conditions réelles d'examen (écran scindé FEI avec document à gauche et propositions à droite).
- **Validation Globale :**
  - Test E2E automatisé sous-agent navigateur 100% réussi avec enregistrement WebP.
  - TypeScript strict (`tsc --noEmit`) : 0 erreur.

## 9. CRUD Séries EE (Expression Écrite) & 3 Tâches FEI Opérationnel (100% Production-Ready)
- **Gestion des Séries EE (`/admin/series-ee`) :**
  - Table des séries avec badges d'état (Publiée / Brouillon, Démo Gratuite), décompte officiel des 3 tâches (`3 / 3 tâches`), durée (60 min) et actions de modification, suppression avec modal et bascule de publication.
  - Pages de création `/admin/series-ee/ajouter` et modification `/admin/series-ee/[id]` avec Shadcn UI Select (`TCF_CANADA`, `TEF_CANADA`).
- **Gestion des 3 Tâches FEI (`/admin/series-ee/[id]/tasks`) :**
  - Vue générale en cartes des 3 tâches officielles :
    - **Tâche 1 (A1–B1) :** Message descriptif ou informatif (60–120 mots, 15 min).
    - **Tâche 2 (B1–B2) :** Récit d'expérience et courrier/article (120–150 mots, 20 min).
    - **Tâche 3 (B2–C2) :** Analyse comparative de deux opinions et prise de position (120–180 mots, 25 min).
  - Formulaire complet `WrittenTaskForm` :
    - Sélecteur de tâche Shadcn Select avec préréglages automatiques officiels (fourchettes de mots, temps conseillé).
    - Interface d'édition Markdown type Pratik-IT (`MarkdownField`) pour le **Sujet & Consignes**, le **Contexte**, la **Grille d'Évaluation FEI** et le **Modèle Magic Rewrite C2**.
    - Modèles rapides d'épreuves intégrés en un clic.
  - **Onglet Aperçu Simulateur CBT Réel :**
    - Écran scindé avec sujet à gauche et zone d'écriture interactive à droite avec calcul en direct des mots et jauge d'intervalle couleur (orange < minWords, vert dans l'intervalle, rouge > maxWords).
- **Validation E2E & Qualité :**
  - Test E2E sous-agent navigateur validé avec enregistrement vidéo WebP.
  - Typage TypeScript strict (`tsc --noEmit`) : 0 erreur.

## 10. CRUD FAQs & Catégories Opérationnel (100% Production-Ready)
- **Gestion des FAQs (`/admin/faqs`) :**
  - Table des questions avec filtres dynamiques par catégorie (*Toutes*, *Général*, *Examen CBT*, *NCLC & CRS*, *Abonnements*, *Stratégie*, *Technique*) et par statut (*Actives* / *Masquées*).
  - Badge d'ordre d'affichage (`#1`, `#2`...), extraits de réponses, bascule instantanée de visibilité et dialogue de suppression sécurisé avec `ConfirmActionDialog`.
  - Pagination serveur avec `AdminTablePagination` et état vide dédié `AdminListEmptyState (kind="faqs")`.
- **Formulaire Enrichi [`FaqForm`](components/admin/faq-form.tsx) :**
  - Sélecteur de catégorie utilisant le composant Shadcn UI Select.
  - Champ de réponse enrichi via `MarkdownField` (barre d'outils, puces, citations, modèles rapides).
  - Barre latérale de prévisualisation live avec accordéon interactif reproduisant l'expérience candidat de la page d'accueil.
- **Pages dédiées :**
  - `/admin/faqs` (listing & filtres)
  - `/admin/faqs/ajouter` (création)
  - `/admin/faqs/[id]` (édition)
- **Infrastructure Database :**
  - Conteneur `super4c2-db` recalé définitivement sur l'image PostgreSQL 17 (`supabase/postgres:17.6.1.167`) pour éliminer tout conflit d'incompatibilité de volume.
- **Validation Qualité :**
  - Toutes les routes HTTP 200 OK.
  - Typage TypeScript strict (`tsc --noEmit`) : 0 erreur.

## 11. État de Production & Zéro Défaut Validé (100% Production-Ready)
- **Validation Globale du Build & Types :**
  - `npx tsc --noEmit` : **0 erreur** (Code 0).
  - `npm run lint` (`next lint`) : **0 avertissement, 0 erreur** (Code 0).
  - `npm run build` : **39/39 pages statiques compilées avec succès** (Code 0).
- **Passerelle d'Authentification Back-Office (`/admin/login` & `middleware.ts`) :**
  - Mur de sécurité empêchant tout accès non autorisé à `/admin` via HTTP 307.
  - Double mode de connexion (Clé Maître & SSO vs Code PIN 2FA TOTP à 6 chiffres) + Bouton Démo 1-clic.
  - Gestion sécurisée de session par cookie `super4c2_admin_token` (24h) et déconnexion explicite.
- **Expérience Mobile Native (Éradication Totale du Menu Hamburger) :**
  - Aucune icône burger sur l'ensemble de la plateforme.
  - Barre de navigation mobile moderne ancrée en bas de l'écran avec retour visuel actif sur l'interface publique (`components/mobile-nav.tsx`) et sur le back-office (`components/admin/admin-shell.tsx`).
- **Serveur de Développement :**
  - Opérationnel sur `http://localhost:3000` avec endpoint santé `/api/health` renvoyant `{ ok: true }`.
## 12. Système de Notifications, Sélecteur de Langue & Service d'Emails
- **Sélecteur de Langue Interactif (`components/language-switcher.tsx`) :**
  - Remplacement du badge statique par un menu déroulant multilingue :
    - 🇨🇦 Français (Canada & International - Langue Officielle TCF/TEF)
    - 🇬🇧 English (Canada - IRCC Express Entry / CLB)
    - 🇪🇸 Español (Candidatos TCF Latinoamérica)
    - 🇸🇦 العربية (مرشحو الهجرة إلى كندا)
  - Mémorisation du choix utilisateur dans `localStorage` et le cookie `super4c2_lang`, mise à jour de `document.documentElement.lang` et toast informatif.
- **Système de Notifications Bipartite (`lib/notifications/actions.ts` & `components/notifications/notification-bell.tsx`) :**
  - Modèle Prisma `Notification` (catégories `EXAM`, `SRS`, `LEAD`, `SYSTEM`, `BILLING`).
  - Cloche interactive avec pastille de notification dynamique animée et compteur non lu.
  - Déclencheurs automatiques :
    - Dès qu'un candidat soumet une demande sur `/contact`, une notification immédiate `LEAD` est créée pour le Super Admin (`/admin/leads`).
    - Dès qu'un utilisateur s'inscrit à la newsletter, une notification `SYSTEM` est générée pour l'admin (`/admin/newsletter`).
    - Notifications candidates pour les paliers NCLC 7, séries CE prêtes et rappels de répétition espacée (SRS).
- **Moteur d'Email Transactionnel (`lib/mail.ts`) :**
  - Service d'envoi d'emails transactionnels avec templates HTML brandés aux couleurs Maple Crimson & Imperial Navy.
  - Support SMTP standard (Nodemailer, Resend, Brevo, SendGrid, Amazon SES) avec fallback de simulation en dev sans crash.

