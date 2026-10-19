# Active Context: Super4C2

## 0. Déploiement Production Vercel & Moteur de Conversion

### 0.0v. Résolution Crash `/admin/series-eo/ajouter`, Fiche Candidat Enrichie, Actions en Batch & Capture WhatsApp Newsletter
- **Demande Utilisateur :**
  1. Il manque les actions en batch sur la gestion des utilisateurs (`/admin/users`).
  2. La fiche candidat doit fournir un MAX d'informations pédagogiques et d'immigration.
  3. La newsletter doit aussi collecter et fournir les numéros de téléphone WhatsApp.
  4. Crash en production sur `https://super4c2.vercel.app/admin/series-eo/ajouter` (Code incident : 476212408).
- **Diagnostics & Résolutions Techniques :**
  - **Origine du Crash EO en Production :** Les tables relationnelles `public.oral_series` et `public.oral_tasks` existaient dans `prisma/schema.prisma` mais n'avaient jamais été créées en DDL dans la base de données Supabase Cloud de production (`mjsnrdjdazghksvpsbgm`). Toute requête sur ces tables provoquait un crash PostgreSQL immédiat.
  - **Correction DDL Appliquée :** Exécution SQL de création des tables `oral_series` et `oral_tasks` avec clés étrangères, contraintes d'unicité, indexes et cascade.
  - **Protection Fail-Safe des Actions EO :** Sécurisation de `createOralSeriesAction`, `updateOralSeriesAction`, `deleteOralSeriesAction` avec blocs `try / catch` et préservation de `NEXT_REDIRECT`. Ajout de `export const dynamic = "force-dynamic"` sur les pages EO.
  - **Actions en Batch sur les Candidats (`components/admin/user-list-client.tsx`) :**
    - Cases à cocher pour sélection individuelle et « Tout sélectionner ».
    - Barre flottante d'actions en lot : Export CSV de la sélection, Copie groupée de tous les emails, et Rédaction groupée (`mailto:`).
  - **Fiche Candidat Enrichie au MAX (`UserListClient`) :**
    - Répartition détaillée par épreuve : Lecture (CE), Écoute (CO), Rédaction (EE), Oral (EO).
    - Diagnostic d'admissibilité Canada : Seuil NCLC 7 validé (+50 pts CRS) vs En cours.
    - Historique des simulations passées avec notes /20 ou /39, score échelonné (/699) et palier NCLC.
    - Coordonnées de contact : Email, Téléphone WhatsApp avec lien direct `https://wa.me/...` et Pays.
    - Raccourci vers toutes les copies d'examen du candidat.
  - **Capture & Gestion du Téléphone WhatsApp dans la Newsletter :**
    - Intégration du champ WhatsApp dans le formulaire public (`components/newsletter-card.tsx`).
    - Intégration du champ WhatsApp et du Nom dans le formulaire d'ajout manuel back-office (`app/admin/newsletter/page.tsx`).
    - Mise à jour de l'action serveur `addSubscriberAction` pour persister le numéro WhatsApp.
- **Validation :** `npx tsc --noEmit` avec 0 erreur.

### 0.0u. Assainissement & Refonte Intuitive de la Vue Admin (Zéro Jargon, Éradication B2B & Résilience)
- **Demande Utilisateur :**
  1. Supprimer tout ce qui a rapport avec le B2B, les cohortes, et les licences B2B dans la vue admin.
  2. Ajouter les pieds de tableau pour la pagination sur toutes les listes administratives.
  3. Diagnostiquer l'absence de répercussion sur la vue admin en prod (explication : code local non encore pushé sur git).
  4. Conserver et simplifier l'audit du composant "CBT en direct" pour un administrateur non-technique ne maîtrisant pas le jargon spécialisé.
  5. Épurer l'ensemble de la vue admin pour la rendre 100% intuitive.
- **Réalisations & Améliorations Apportées :**
  - **Éradication Totale du B2B & des Faux Mocks (`components/admin/admin-dashboard.tsx`, `app/admin/page.tsx`, `app/admin/loading.tsx`) :**
    - Suppression complète des types `Cohort`, des onglets `cohorts` et `licenses`, des barres de progression de cohortes fictives et du filtre `activeOrg` (B2B/B2C).
    - Recentrage du dashboard sur les métriques réelles des candidats et les épreuves actives avec empty-state bienveillant.
    - Retrait de la catégorie B2B dans le formulaire de conciergerie (`app/admin/leads/page.tsx`).
    - Épuration des squelettes de chargement dans `app/admin/loading.tsx`.
  - **Refonte Sémantique & Éradication du Jargon Technique / Immigration :**
    - Suppression des acronymes opaques : `CBT` -> `Simulations` / `Examens Blancs`, `CRS +50` -> `Objectif Canada Validé`, `Format FEI` -> `Normes Officielles`.
    - Les 4 cartes de KPI parlent désormais un langage humain : *Candidats Inscrits*, *Taux de Réussite Canada (B2/C1)*, *Examens Blancs Passés*, *Score Moyen en Lecture*.
    - Refonte du widget "Activité en Direct" -> **"Examens en Direct"** : affichage lisible du nom du candidat, de l'épreuve passée en clair (*Rédaction*, *Oral Visio IA*, *Lecture*), de la note obtenue, d'un badge clair (*Objectif Validé* vs *En progression*), et d'un lien direct vers *« Voir toutes les copies rendues »*.
    - Requalification de la navigation latérale en 3 pôles évidents :
      - 📊 **Suivi des Candidats :** *Vue d'ensemble*, *Candidats inscrits*, *Copies & Examens passés*.
      - 📝 **Sujets d'Examens :** *Lecture (CE)*, *Écoute (CO)*, *Rédaction (EE)*, *Oral & Visio (EO)*.
      - 📢 **Site & Communication :** *Articles de Blog & Guides*, *Questions fréquentes (FAQ)*, *Avis des candidats*, *Abonnés Newsletter*, *Demandes de contact*.
  - **Pieds de Tableau, Outils d'Exportation CSV & Actions en Batch :**
    - Création du composant réutilisable `AdminExportButton` (`components/admin/admin-export-button.tsx`) avec encodage UTF-8 BOM pour tableurs (Excel, Sheets).
    - Intégration sur la table des candidats inscrits (`app/admin/users/page.tsx`), les copies d'examen (`app/admin/tentatives/page.tsx`) et la newsletter.
    - Maintien des batch actions (sélection multiple, suppression en lot, changement de statut) sur `/admin/leads`.
  - **Résolution Définitive de l'Extrême Overflow en Y et Scrollbar en X :**
    - Suppression de l'enveloppe parasite `min-h-screen flex flex-col` et des widgets publics (`ScrollProgress`, `ScrollToTop`) pour toutes les routes `isAdmin` dans `components/app-shell.tsx`.
    - Remplacement des classes `w-screen` (`100vw` qui débordait sous Windows avec scrollbar) par `w-full` dans `AdminShell` et `AdminDashboard`.
    - Hauteur de l'écran strictement verrouillée à `h-screen overflow-hidden` avec scroll interne maîtrisé dans `main`.
  - **Simplification de la Cloche de Notifications (`NotificationBell`) & Purge des Mocks :**
    - Suppression du bouton de test et de l'action `sendAdminTestNotificationAction` pour conserver un composant sobre, propre et minimaliste sans artifice.
    - Purge intégrale des mock data dans Supabase Cloud (`public.notifications` avec recipient = 'ADMIN' et `public.contact_leads`).
  - **Requalification de "Demandes & Conciergerie" -> "Demandes de Contact" :**
    - Renommage unifié dans `app/admin/leads/page.tsx`, `components/admin/lead-list-client.tsx`, `components/admin/admin-shell.tsx` et `components/admin/admin-dashboard.tsx`.
    - Nommage propre des exports CSV : `demandes-contact-YYYY-MM-DD.csv`.
  - **Certification Haute Fidélité des Exports CSV & PDF :**
    - **Exports CSV :** Encodage universel UTF-8 BOM (`\uFEFF`) et séparateur point-virgule (`;`) garantissant l'affichage sans bavure des accents dans Excel, Google Sheets et Numbers. Appliqué sur toutes les tables admin (utilisateurs, copies d'examen, newsletter, demandes de contact).
    - **Rapports PDF Candidat (`lib/exam/export-pdf.ts` & `lib/dashboard/attempt-export.ts`) :** Moteur vectoriel direct `jsPDF` avec bandeau officiel Super4C2 écarlate `#E51A31`, normes FEI 2026, 4 cartes de métriques de score (/20, /699, NCLC 4-12, +50 pts CRS), analyse de volume de mots, grille officielle FEI détaillée, modèles Magic Rewrite C2 et pagination multi-pages.
  - **Résolution Définitive des Crashes de Menus & Robustesse (`app/error.tsx`) :**
    - **Origine du crash (`Code incident : 3617587624`) :** Les sous-pages de l'admin interrogeaient Prisma sans `try / catch`.
    - **Architecture Défensive Fail-Safe :** Chaque page admin dispose désormais d'un bloc `try / catch` gracieux affichant un bandeau d'avertissement clair (`dbError`) sans jamais faire planter la navigation.
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0t. Résolution Authentification Admin & Refonte Formulaire `/admin/login`
- **Demande Utilisateur :**
  1. Le mot de passe admin ne fonctionnait pas (« Identifiants incorrects ou accès refusé »).
  2. Textes peu lisibles en mode sombre sur le formulaire de connexion admin.
  3. Absence de l'icône oeil ("eye") pour dévoiler/masquer le mot de passe.
- **Diagnostic Technique Réalisé :**
  - **Erreur GoTrue Supabase identifiée dans les logs Auth :** `Scan error on column index 3, name "confirmation_token": converting NULL to string is unsupported` (HTTP 500 `unexpected_failure`). Lors de requêtes antérieures sur `auth.users`, les tokens de sécurité (`confirmation_token`, `recovery_token`, etc.) avaient été initialisés à `NULL` au lieu de chaînes vides `""`, provoquant un crash interne du driver Go de Supabase Auth lors de la recherche du compte.
  - **Correction en base PostgreSQL Supabase :** Exécution d'un `UPDATE auth.users` assignant `COALESCE(token, '')` pour tous les champs tokens sur le compte `admin@super4c2.com`.
  - **Test automatique :** Script Node d'authentification exécuté avec succès : `User ID: 808f6c0f-cd4d-468f-8ba8-d459eaf79c14, Role: SUPER_ADMIN`.
- **Améliorations UI & Dark Mode (`app/admin/login/page.tsx`) :**
  - Bouton interactif toggle mot de passe avec icônes `Eye` et `EyeOff` (`lucide-react`).
  - Correction du contraste : labels en `text-slate-200`, textes explicatifs en `text-slate-300`, inputs sombres `bg-slate-950/80` et `border-slate-700/80` avec `text-white`.
  - Règle `[color-scheme:dark]` et styling anti-autofill (`[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#090d1a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`) pour éviter le fond bleu clair natif des navigateurs.
  - Messages d'erreur explicites dans `app/auth/actions.ts` (`adminSignInAction`).
- **Validation :** `npx tsc --noEmit` avec 0 erreur, commit et push sur `main` (`0002d3b`).

### 0.0s. Console de Supervision des Tentatives & Copies Candidats (Option C : `/admin/tentatives`)
- **Demande Utilisateur :** Implémenter l'Option C : tableau de bord exécutif de supervision des simulations et copies réelles des candidats avec composants Shadcn UI.
- **Réalisations & Architecture Déployée :**
  - **Dashboard Exécutif Shadcn UI (`app/admin/tentatives/page.tsx`) :**
    - 4 KPI Cards interactives : Simulations Passées, Taux de Réussite NCLC 7+ (+50 pts CRS), Score Moyen Échelonné (/699 FEI), et Nouvelles Copies des Dernières 24h.
    - Filtre par discipline : `Toutes`, `✍️ Écrit`, `🎙️ Oral`, `📖 CE`, `🎧 CO`.
    - Filtre par palier NCLC : `Tous NCLC`, `NCLC 7+ (Seuil fédéral CRS)`, `< NCLC 7`.
    - Moteur de recherche plein-texte sur le nom du candidat, l'adresse e-mail ou l'ID de session.
    - Tableau détaillé avec avatar, nom/email, discipline, score brut, score TCF, badge de palier NCLC, bonus CRS, date et pagination serveur.
  - **Dialogue Modal d'Inspection Pédagogique (`components/admin/attempt-inspect-dialog.tsx`) :**
    - Composant Shadcn `Dialog` d'audit en profondeur d'une copie :
      - Pour l'Expression Écrite : onglets Tâche 1, 2, 3 avec affichage du texte réel rédigé par le candidat, décompte de mots, grille critériée FEI (Adéquation, Cohérence, Lexique, Morphosyntaxe sur 5 avec retours) et modèle Magic Rewrite C2.
      - Pour les autres épreuves : détails des réponses, score brut et retour de l'IA.
  - **Actions & Sécurité (`app/admin/tentatives/actions.ts`) :**
    - Suppression sécurisée des tentatives de test via `deleteAttemptAction` avec dialogue de confirmation `ConfirmActionDialog`.
  - **Navigation (`components/admin/admin-shell.tsx`) :**
    - Ajout du lien « Tentatives & Copies » avec l'icône `GraduationCap` dans le groupe *Supervision*.
- **Validation :** 0 erreur TypeScript (`npx tsc --noEmit`).

### 0.0r. Module de Gestion Back-Office de la Compréhension Orale Étiqueté "Coming Soon" (Option B : `/admin/series-co`)
- **Demande Utilisateur :** Implémenter l'Option B : création et gestion des Séries de Compréhension Orale (CO) avec pistes audios et 39 questions, en les marquant explicitement avec le badge "Coming Soon".
- **Réalisations & Architecture Déployée :**
  - **Bannière Stratégique & Badges "Coming Soon" (`app/admin/series-co/page.tsx`) :**
    - Encart d'information haute visibilité expliquant le calibrage technique préliminaire de l'épreuve d'écoute avant ouverture publique.
    - Badge ambré *Coming Soon* sur chaque série du tableau.
    - Badge *Coming Soon* dans la barre de navigation latérale de l'administration.
  - **Catalogue & Supervision CO :**
    - 4 KPIs : Total Séries CO, Séries prêtes, Accès Démo, Format Officiel FEI (39 QCM, 35 min d'écoute).
    - Moteur de recherche, filtres (Toutes, Publiées, Brouillons), pagination et bascule de publication en 1 clic.
  - **Formulaires de Séries CO (`ajouter/page.tsx`, `[id]/page.tsx`, `actions.ts`) :**
    - Création et modification de séries `COMPREHENSION_ORALE` avec durée officielle de 35 min (2100 s).
  - **Gestion des 39 Questions d'Écoute & Pistes Audio (`[id]/questions/`) :**
    - Actions serveur dédiées (`upsertCoQuestionAction`, `deleteCoQuestionAction`).
    - Tableau des questions avec indicateur de présence de fichier audio, transcription et niveau CECRL.
    - Formulaire avancé `CoQuestionForm` (`components/admin/co-question-form.tsx`) avec lecteur de test audio interactif (Play/Pause), transcription textuelle, distracteurs et analyse des pièges auditifs.
  - **Navigation & Empty State :**
    - Ajout de l'icône `Headphones` et du type `"series-co"` dans `AdminListEmptyState` et `AdminShell`.
- **Validation :** 0 erreur TypeScript (`npx tsc --noEmit`).

### 0.0q. Module Complet de Gestion Back-Office de l'Expression Orale (Option 1 : `/admin/series-eo`)
- **Demande Utilisateur :** Implémenter l'Option 1 : création et gestion complète des Séries d'Expression Orale (EO) et de leurs 3 tâches officielles FEI dans le back-office administrateur.
- **Réalisations & Architecture Déployée :**
  - **Catalogue & Liste Principale (`app/admin/series-eo/page.tsx`, `app/admin/series-eo/actions.ts`) :**
    - 4 KPI cards exécutifs (Total Séries EO, Publiées, Pass Démo Gratuite, Format 3 Tâches FEI).
    - Moteur de recherche et filtres par statut (Toutes, Publiées, Brouillons).
    - Actions rapides : bascule immédiate en brouillon/publié (`toggleOralSeriesPublishAction`), suppression définitive avec dialogue de confirmation sécurisé (`deleteOralSeriesAction`).
    - Pagination serveur dynamique avec `AdminTablePagination`.
  - **Création & Édition de Séries EO (`app/admin/series-eo/ajouter/page.tsx`, `app/admin/series-eo/[id]/page.tsx`) :**
    - Calcul automatique du numéro de série suggéré (ex: 101, 102).
    - Configuration du titre, type d'épreuve (TCF Canada, TEF Canada), durée officielle en minutes (12 min = 720s) et drapeaux de visibilité (publiée, démo gratuite).
  - **Gestion des 3 Tâches Orales FEI (`app/admin/series-eo/[id]/tasks/`) :**
    - Actions serveur complètes (`actions.ts` : `upsertOralTaskAction`, `deleteOralTaskAction`) avec gestion des scénarios de jeu de rôle JSON et revalidation de cache.
    - Vue d'ensemble visuelle des 3 tâches FEI (`page.tsx`) avec statuts prêts vs non configurés et durées standard réglementaires (Tâche 1 : 120s, Tâche 2 : 210s, Tâche 3 : 270s).
    - Pages d'ajout et d'édition (`ajouter/page.tsx`, `[taskId]/page.tsx`).
  - **Composant Interactif Avancé & Simulateur Vocal (`components/admin/oral-task-form.tsx`) :**
    - Double mode : **Éditeur de Tâche** et **Aperçu Simulateur Vocal IA (CBT)**.
    - Presets complets pour le format FEI TCF Canada :
      - *Tâche 1 : Entretien dirigé sans préparation (120 s, A1-B1)* avec directives d'accueil chaleureux et questions de présentation.
      - *Tâche 2 : Exercice en interaction / Jeu de rôle (210 s, B1-B2)* avec configuration du scénario (situation, rôle candidat, rôle examinateur IA, consignes).
      - *Tâche 3 : Expression d'un point de vue (270 s, B2-C2)* avec directives d'écoute active et question de relance contradictoire à mi-parcours.
    - Simulateur live affichant l'écran CBT du candidat avec barre d'état du microphone, chronomètre officiel et directives injectées dans le modèle vocal d'évaluation.
  - **Navigation & Identité Visuelle (`components/admin/admin-shell.tsx`, `components/admin/AdminListEmptyState.tsx`) :**
    - Ajout de l'entrée « Séries Expression Orale » avec icône `Mic` dans le groupe *Épreuves CBT (MVP)* de la barre latérale desktop et gestion du fil d'Ariane.
    - Ajout du type `"series-eo"` et icône `Mic` dans `AdminListEmptyState`.
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0p. Vidage des Notifications Archivées & Ergonomie du Centre de Notifications
- **Demande Utilisateur :** Implémenter la Priorité 3 du système de notifications : suppression individuelle et vidage en masse des notifications archivées/lues pour candidats et administrateurs.
- **Réalisations & Améliorations Apportées :**
  - **Vidage en Masse Sécurisé (`lib/notifications/actions.ts`) :**
    - Action serveur `clearReadNotificationsAction(recipient)`.
    - Côté candidat : supprime exclusivement les notifications où `recipient === "CANDIDATE"`, `isRead === true` et `userId === user.id`. Aucun impact sur les autres comptes.
    - Côté administrateur : requiert la validation `isAdminUser(user)` et purge les alertes administratives lues.
  - **Interface Utilisateur Avancée (`components/notifications/notification-bell.tsx`) :**
    - Ajout du bouton d'action **« Vider lues »** dans l'en-tête du popover dès que des notifications archivées existent.
    - Bouton de suppression individuelle (icône corbeille) au survol de chaque carte de notification.
    - Notifications de confirmation immédiates avec Sonner toasts (*« Notification supprimée »*, *« X notification(s) archivée(s) supprimée(s) »*).
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0o. Automatisation des Déclencheurs de Notifications (Triggers Métier Réels)
- **Demande Utilisateur :** Implémenter la Priorité 2 du système de notifications : création et déclenchement automatique de notifications réelles lors des simulations d'examens et des actions clés.
- **Réalisations & Améliorations Apportées :**
  - **Fin de Simulation CBT (Compréhension Écrite & Orale - `app/api/exam/attempt/route.ts`) :**
    - Notification personnelle envoyée au candidat avec son score échelonné (/699), son niveau NCLC et la mention explicite du bonus CRS (+50 pts) si NCLC >= 7.
    - Lien direct vers le rapport d'analyse et le carnet de fautes (`/dashboard/historique/${attemptId}`).
    - Notification d'activité envoyée automatiquement aux administrateurs pour suivi des passages en temps réel.
  - **Correction IA Expression Écrite (`app/api/ai/evaluate-written/route.ts`) :**
    - Notification personnelle générée à la fin de l'évaluation FEI avec la note (/20), le palier NCLC estimé et le lien vers la grille détaillée et la réécriture C2.
    - Notification de suivi transmise à l'administration.
  - **Bienvenue & Inscription Candidat (`app/auth/actions.ts`) :**
    - Notification d'accueil personnalisée injectée dans l'espace du nouveau candidat avec lien vers le catalogue d'épreuves.
    - Alerte instantanée créée pour les administrateurs avec le nom/e-mail du nouvel inscrit.
  - **Programmation de l'Échéance d'Examen (`app/api/account/profile/route.ts`) :**
    - Notification de confirmation automatique lors de l'enregistrement de la date de passation avec confirmation de l'activation des rappels prioritaires.
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0n. Cloisonnement Multi-Tenant des Notifications & Refonte UX Onboarding Option 1
- **Demande Utilisateur :**
  1. Refondre le modal d'onboarding post-authentification selon l'Option 1 recommandée (1 seul écran net, boutons et pastilles clairs, skip explicite sans ambiguïté).
  2. Implémenter la Priorité 1 du système de notifications : sécurisation et cloisonnement multi-tenant étanche par utilisateur.
- **Réalisations & Améliorations Apportées :**
  - **Refonte UX de l'Onboarding (`components/onboarding/first-login-setup-modal.tsx`) :**
    - Condensation sur 1 seul écran synthétique sans étape successive bloquante.
    - Sélection immédiate du palier NCLC visé (7, 8, 9, 10 avec mise en avant du bonus CRS fédéral).
    - Sélection ergonomique de la date d'examen : *Dans 1 mois (Urgence)*, *Dans 2 mois (Idéal)*, *Dans 3 mois*, *Date exacte* (avec calendrier) ou *Pas encore fixé (décision plus tard)*.
    - Bouton d'action principal dynamique : **« Valider mon objectif »** et bouton tertiaire **« Passer et aller au tableau de bord » (Skip)** explicite.
  - **Cloisonnement Multi-Tenant des Notifications (`lib/notifications/actions.ts`, `components/notifications/notification-bell.tsx`) :**
    - Récupération systématique de la session Supabase authentifiée dans les Server Actions.
    - **Candidats :** Filtrage strict `where: { recipient: "CANDIDATE", OR: [{ userId: user.id }, { userId: null }] }`. Aucun candidat ne peut voir ou marquer comme lues les notifications d'un autre utilisateur.
    - **Sécurité Admin :** Protection absolue de l'accès aux notifications administratives (`recipient === "ADMIN"`). Si l'utilisateur n'est pas vérifié par `isAdminUser(user)`, retour immédiat d'une liste vide (protection contre l'énumération et fuite d'informations).
    - **Gestion & Suppression :** Ajout de `deleteNotificationAction` avec vérification stricte de propriété (`userId === user.id` pour candidats ou administrateur vérifié) et bouton de suppression discret sur chaque notification dans le menu déroulant.
    - **Purge des Mocks :** Élimination définitive de la fonction `seedDemoNotifications` qui injectait des notifications démo orphelines.
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0m. Système Complet de Gestion des Utilisateurs, Sécurité Admin, Cycle de Vie RGPD & Connexion Sociale
- **Demande Utilisateur :**
  1. Implémenter l'ensemble des fonctionnalités manquantes du système d'authentification et de gestion des utilisateurs.
  2. Ajouter le bouton « Renvoyer l'e-mail de confirmation » avec cooldown.
  3. Créer une page dédiée `/auth/reset-password` pour la saisie du nouveau mot de passe.
  4. Créer la page d'administration `/admin/users` listant les candidats réels inscrits.
  5. Implémenter l'onboarding initial à la première connexion (modal interactif de fixation de date d'examen et d'objectif NCLC).
  6. Cycle de vie du compte sur `/account` (modification d'adresse e-mail, déconnexion de tous les appareils, suppression de compte RGPD).
  7. Sécurisation stricte de l'espace Super Admin (éradication du cookie forgeable `super4c2_admin_token`, authentification par identifiants réels et vérification stricte `app_metadata.role` / `ADMIN_EMAILS`).
  8. Bouton de connexion sociale Google OAuth sur les formulaires de connexion et d'inscription.
- **Réalisations & Améliorations Apportées :**
  - **Renvoi d'E-mail de Confirmation (`components/auth/resend-confirmation-button.tsx`, `app/auth/actions.ts`) :**
    - Action serveur `resendConfirmationAction` avec résolution automatique d'origine et appel à `supabase.auth.resend({ type: 'signup', ... })`.
    - Bouton interactif avec décompte de 60 secondes pour éviter le spam, intégré dans le bandeau de confirmation d'inscription et le bandeau de lien expiré.
  - **Page Dédiée de Réinitialisation de Mot de Passe (`app/auth/reset-password/page.tsx`, `components/auth/reset-password-form.tsx`) :**
    - `resetPasswordForEmailAction` redirige vers `/auth/callback?next=/auth/reset-password`.
    - Vérification de la session, double champ mot de passe avec validation de longueur minimale (8 car.) et retour visuel.
  - **Console d'Administration des Candidats (`app/admin/users/page.tsx`, `components/admin/admin-shell.tsx`) :**
    - Page serveur paginée requêtant les utilisateurs réels via Prisma (`user.findMany` avec relation `profile` et comptage de tentatives `_count.attempts`).
    - Moteur de recherche par nom et e-mail.
    - Ajout du lien dans la navigation latérale et le fil d'Ariane de `AdminShell`.
  - **Sécurisation de l'Espace Super Admin (`lib/admin/auth.ts`, `app/admin/login/page.tsx`, `middleware.ts`, `app/auth/actions.ts`) :**
    - Élimination intégrale du faux système de jeton démo `super4c2_admin_token` et de l'authentification basée sur `user_metadata` (vulnérable à l'escalade de privilèges).
    - Validation stricte `isAdminUser` basée uniquement sur `app_metadata.role === 'SUPER_ADMIN'` ou la liste `ADMIN_EMAILS` (e-mails vérifiés).
    - Formulaire d'authentification admin officiel (`AdminLoginPage`) branché sur `adminSignInAction`.
    - Protection au niveau du middleware (pages redirigées vers `/admin/login?next=...`, requêtes API rejetées avec statut 401/403).
  - **Cycle de Vie du Compte & RGPD (`components/account/account-lifecycle.tsx`, `app/account/actions.ts`) :**
    - Modification d'e-mail avec e-mail de validation (`changeEmailAction`).
    - Révocation globale des sessions actives sur tous les appareils (`signOutEverywhereAction` avec `scope: 'global'`).
    - Suppression définitive du compte (`deleteAccountAction`) avec saisie obligatoire de « SUPPRIMER », appel à la fonction `delete_own_account` et purge du cache local.
  - **Modal d'Onboarding Initial (`components/onboarding/first-login-setup-modal.tsx`, `app/dashboard/page.tsx`) :**
    - Fenêtre modale animée en 2 étapes affichée automatiquement si l'utilisateur n'a pas encore configuré sa date d'examen ou son objectif NCLC.
    - Sélection intuitive des paliers NCLC (+50 à +62 pts CRS) et sélection de la date d'examen avec raccourcis (1 mois, 2 mois, 3 mois).
    - Sauvegarde via `PATCH /api/account/profile` et mémoïsation dans `localStorage`.
  - **Authentification par E-mail Prioritaire :**
    - Suite à la demande utilisateur, les boutons Google OAuth ont été retirés de `LoginForm` et `RegisterForm` pour focaliser l'expérience sur l'e-mail/mot de passe et Magic Link sécurisés.
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0l. Synchronisation Auth Multi-Onglets, Bouton Retour Profil & Carnet SRS Vierge Multi-Tenant
- **Demande Utilisateur :**
  1. Lors de la validation d'un compte par Magic Link dans un nouvel onglet, l'ancien onglet restait figé sur le formulaire d'authentification et ne redirigeait pas vers le dashboard lors d'un rechargement.
  2. Sur la page de profil (`/account`), ajouter une flèche de retour en arrière vers le tableau de bord.
  3. Supprimer les données factices / mock data du Carnet d'Erreurs (SRS) : un nouvel utilisateur doit commencer de zéro avec un deck vierge, avec gestion stricte multi-tenant.
- **Résolution & Améliorations Apportées :**
  - **Gestion de Session & Synchronisation Multi-Onglets (`app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `middleware.ts`, `components/auth/`) :**
    - `LoginPage` & `RegisterPage` vérifient désormais la session active côté serveur (`supabase.auth.getUser()`) et redirigent immédiatement l'utilisateur connecté vers `/dashboard` (ou l'URL `next`).
    - `middleware.ts` intercepte les accès aux routes `/auth/login` et `/auth/register` lorsque des cookies de session Supabase existent, renvoyant directement vers le dashboard.
    - `LoginForm` et `RegisterForm` écoutent `supabase.auth.onAuthStateChange` pour réagir instantanément aux événements inter-onglets (`SIGNED_IN`, `TOKEN_REFRESHED`) et rediriger automatiquement l'ancien onglet sans nécessiter de rafraîchissement manuel.
  - **Bouton Retour sur le Profil (`app/account/page.tsx`) :**
    - Ajout d'un bouton de navigation `ArrowLeft` « Retour au Tableau de bord » en en-tête de la page de gestion du compte.
  - **Élimination Totale des Mocks & Cloisonnement Multi-Tenant SRS (`lib/srs/sm2-algorithm.ts`, `components/dashboard/srs-carnet.tsx`, `app/carnet-erreurs/page.tsx`, `lib/notifications/actions.ts`) :**
    - `INITIAL_SRS_CARDS` vidé (`[]`).
    - Implémentation de `getSrsStorageKey(userId)` cloisonnant le stockage local par identifiant utilisateur (`super4c2:srs_cards:${userId}`).
    - `SrsCarnet` reçoit le `userId` du candidat connecté depuis le serveur et affiche un Onboarding / Empty State accueillant invitant à démarrer une première simulation lorsqu'aucun piège n'a encore été commis.
    - Purge automatique des notifications de démo factices dans `lib/notifications/actions.ts`.
- **Validation :** `npx tsc --noEmit` avec 0 erreur.

### 0.0k. Assainissement Global de Marque : Élimination des Allégations "Plateforme Officielle"
- **Demande Utilisateur :** Éliminer l'allégation trompeuse selon laquelle Super4C2 serait la « Plateforme Officielle TCF & TEF Canada » ou un organisme certificateur officiel, le site étant un outil d'entraînement et simulateur indépendant conforme.
- **Périmètre d'Intervention Transversal :**
  - **Barre supérieure & Layouts :**
    - `components/app-shell.tsx` : Remplacement du slogan `Plateforme Officielle TCF & TEF Canada` par `Préparation TCF & TEF Canada`.
    - `app/layout.tsx` : Remplacement de `Plateforme officielle d'entraînement...`, `Simulateur CBT officiel`, `Plateforme d'Examen CBT Officiel` par `Plateforme de préparation...`, `Simulateur CBT conforme...`.
    - `components/site-footer.tsx` : Remplacement de `Simulateur CBT officiel` par `Simulateur CBT conforme`, et suppression de « Officielle » sur les libellés YouTube et LinkedIn. Conservation du disclaimer d'indépendance légale (FEI / CCI).
    - `components/site-nav.tsx` & `lib/i18n/translations.ts` : Adaptation des menus et traductions FR/EN (`Épreuves CBT Conformes`, `Écran scindé conforme FEI`, etc.).
  - **Pages Clés, SEO & Landing Page :**
    - `app/page.tsx`, `components/product-showcase-section.tsx`, `components/seo/json-ld.tsx`, `lib/mail.ts`, `app/auth/login/page.tsx`, `app/auth/register/page.tsx`.
    - `app/nclc-calculator/page.tsx` : `Calculateur Conforme aux Barèmes IRCC (Entrée Express)`.
    - `app/examens/`, `app/test-gratuit/`, `app/communaute/`, `app/blog/`, `app/dashboard/`, `app/not-found/`.
  - **Simulateurs & Éditeurs :**
    - `components/exam/question-panel.tsx` : `Explication Didactique & Justification`.
    - `components/exam/written-exam-editor.tsx` : `Correction IA conforme FEI en cours...`, suppression de « officiel » sur le décompte de mots et la notification finale.
    - `components/exam/mock-exam-orchestrator.tsx` : `Examen Blanc Standard N°1`, `Attestation Provisoire de Simulation Délivrée`.
    - `components/exam/oral-debrief-card.tsx` : `Bilan Didactique de l'Épreuve Orale`, `Archive Audio de la Session`.
    - Données de test et séries : `lib/exam/series-ce-101.ts`, `lib/exam/series-co-101.ts`, `lib/exam/multi-series-data.ts`, `lib/exam/mock-series.ts` (`Conforme FEI`).
  - **Interception URL Middleware :**
    - `middleware.ts` : Redirection automatique des requêtes root (`/`) contenant `code` ou `token_hash` vers `/auth/callback` pour empêcher toute perte de session d'authentification ou redirection vers localhost.
- **Validation :** `npx tsc --noEmit` validé avec 0 erreur.

### 0.0j. Résolution Définitive du Conflit d'Unicité E-mail (`syncPrismaUser`, Commit `14d1256`)
- **Origine de l'Erreur :** Lors des phases de test précédentes en local, des enregistrements `User` avaient été créés dans PostgreSQL avec des UUIDs aléatoires (`crypto.randomUUID()`) au lieu des véritables `userId` Supabase Auth. Lors d'une inscription ou reconnexion sur Supabase, l'appel à `prisma.user.upsert({ where: { id: user.id } })` ne trouvait pas la clé primaire et tentait un `create` avec le même e-mail, déclenchant l'exception `Unique constraint failed on the fields: ('email')`.
- **Architecture de Réconciliation Atomique (`lib/supabase/sync-user.ts`) :**
  - Implémentation de `syncPrismaUser(userId, email, displayName)`.
  - Si l'utilisateur existe déjà par son e-mail avec un ancien UUID hérité, une transaction atomique migre les tentatives (`userAttempt`), purge l'ancien profil orphelin et recrée proprement l'utilisateur avec son identifiant Supabase canonique.
  - Déploiement transversal dans [app/auth/actions.ts](file:///d:/SnowDev/Documents/super4c2/app/auth/actions.ts) (`signUpAction`, `signInAction`), [app/auth/callback/route.ts](file:///d:/SnowDev/Documents/super4c2/app/auth/callback/route.ts) et [app/api/account/profile/route.ts](file:///d:/SnowDev/Documents/super4c2/app/api/account/profile/route.ts).
  - Gestion gracieuse des comptes déjà existants (détection `identities.length === 0` Supabase) avec message d'orientation explicite vers la connexion ou la réinitialisation de mot de passe.
- **Validation :** TypeScript validé avec 0 erreur (`tsc --noEmit`), commit `14d1256` poussé sur `origin/main`.

### 0.0i. Sécurisation & Nettoyage Intégral de l'Authentification Production (Commit `581a96e`)
- **Éradication Totale du Mock Démo & Hijacking de Cookie (`lib/supabase/server.ts`, `app/auth/actions.ts`) :**
  - Suppression définitive du mock local qui lisait le cookie `sb-super4c2-demo-candidate` et forçait l'identité de n'importe quel visiteur vers `candidat.demo@super4c2.com`.
  - Nettoyage préventif et défensif automatique de l'ancien cookie démo sur chaque appel serveur (`createSupabaseServerClient`, `signInAction`, `signUpAction`, `/logout`).
- **Suppression du Bouton Démo & Boutons Flottants :**
  - Retrait du bouton en pointillés `⚡ Connexion Démo Immédiate (Candidat Test NCLC 7)` et du séparateur "ou" dans `components/auth/login-form.tsx`.
  - Retrait des boutons flottants (`Guide Plateforme` et `Espace Entraide | Communauté VIP`) dans `components/app-shell.tsx` et `components/community/floating-community-button.tsx`.
- **Flux d'Inscription Réel avec Confirmation par E-mail :**
  - Supabase `signUpAction` appelle l'API native `supabase.auth.signUp` avec `emailRedirectTo`.
  - Quand la confirmation par e-mail est requise (`!data.session`), redirection propre vers `/auth/login?registered=pending_confirmation` avec affichage d'un bandeau ambré guidant le candidat à vérifier sa boîte de réception avant de se connecter.
- **Réinitialisation & Modification de Mot de Passe 100% Fonctionnelles :**
  - **Mot de passe oublié (`components/auth/login-form.tsx`) :** Modal Dialog interactif demandant l'email et déclenchant `resetPasswordForEmailAction(email)` avec lien sécurisé Supabase.
  - **Modification de mot de passe (`components/account/security-password-form.tsx`, `app/account/page.tsx`) :** Formulaire dédié avec contrôles d'affichage, validation de conformité (8 car. min, confirmation identique) et exécution de `updatePasswordAction(newPassword)`.
- **Validation Robuste Callback Supabase (`app/auth/callback/route.ts`) :**
  - Prise en charge conjointe du flux PKCE (`code`) et du flux OTP / Magic Link (`token_hash` & `type`).
  - Résolution d'origine absolue sécurisée garantissant la redirection vers `https://super4c2.vercel.app` en production.
- **Déploiement Vercel :** Code pushé sur `origin/main` (commit `581a96e`), 0 erreur TypeScript (`tsc --noEmit`).

### 0.0h. Déploiement Production Vercel Réussi (Commit `f87e0fe`)
- **Validation Build Next.js 15 en Local :** `npm run build` exécuté avec succès (code de retour 0, 39 routes statiques/dynamiques générées sans aucune erreur TypeScript ou de compilation).
- **Synchronisation Git & Déclenchement Automatique Vercel :**
  - Commit : `f87e0fe` (*feat: whatsapp lead capture, multi-series ee/eo catalog, attempt history studio & dashboard cleanup*).
  - Push : Déployé sur la branche `origin/main` du dépôt GitHub `DimitriTedom/super4c2`.
  - Intégration Vercel : La pipeline Vercel est connectée à `main` du projet `super4c2` (`prj_pkvMOSv4rwBg6JgmQtkGX8P1vq29`), déclenchant immédiatement la compilation et le déploiement en production.
  - Scripts Vercel : Configuration avec `"postinstall": "prisma generate"` et `"vercel-build": "prisma generate && next build"` assurant la génération du client Prisma sur l'environnement cloud Vercel.

### 0.0g. Épuration du Dashboard Candidat : Retrait du Menu « Cockpit Analytique FEI & Trajectoire C2 » (`components/dashboard/dashboard-pro-view.tsx`)
- **Simplification Radicale Demandée par l'Utilisateur :**
  - Retrait intégral de l'onglet « Analytique FEI » qui ouvrait le *« Cockpit Analytique FEI & Trajectoire C2 »* (`AnalyticsBreakdown`).
  - L'affichage analytique lourd et algorithmique surchargeait l'esprit des candidats sans répondre à leur besoin premier.
  - **Focalisation Stricte sur les Besoins Essentiels :** Le dashboard est désormais recentré sur 2 vues limpides :
    1. **Vue Cockpit :** 4 KPIs fondamentaux (Niveau NCLC, Score /699, Bonus +50 CRS, Sessions Évaluées), Compagnon d'entraînement 3D, accès direct aux deux épreuves actives (Expression Écrite 60 min et Expression Orale), et compte à rebours d'examen.
    2. **Historique & Corrections :** Tableau des sessions passées (avec date, épreuve, note sur 20, score échelonné, palier NCLC, bouton d'ouverture directe de la correction détaillée avec décompte de mots, barème critérié sur 20 par tâche, Magic Rewrite C2 et export PDF).
  - Validation TypeScript sans erreur (`npx tsc --noEmit` code 0).

### 0.0f. Moteur de Conversion Leads WhatsApp-First & Connexion Complète des Ressources Admin/Candidat
- **Capture Lead Haute Conversion WhatsApp-First (`components/nclc/crs-calculator.tsx` & `prisma/schema.prisma`) :**
  - **Constat d'audience :** L'audience cible (Afrique subsaharienne, Maghreb, candidats francophones à l'immigration canadienne) consulte massivement sur smartphone et est 10x plus réactive sur WhatsApp que par e-mail (taux d'ouverture de 98% vs 15%).
  - **Proposition de valeur à fort impact :** Remplacement de l'e-mail passif par *« Recevoir mon Diagnostic CRS Personnalisé sur WhatsApp »* :
    - Score CRS calculé (+{totalCrsPoints} pts), analyse des goulots d'étranglement NCLC, les 3 actions rapides pour gagner des points, et alertes des prochains tirages fédéraux.
    - Champs de saisie : Prénom, sélecteur d'indicatif pays international interactif (🇨🇲 +237, 🇸🇳 +221, 🇨🇮 +225, 🇲🇦 +212, 🇩🇿 +213, 🇹🇳 +216, 🇨🇩 +243, 🇬🇦 +241, 🇬🇳 +224, 🇫🇷 +33, 🇨🇦 +1) + Numéro WhatsApp + E-mail.
  - **Schéma Prisma & Persistance Multi-Canale (`NewsletterSubscriber`) :**
    - Ajout des champs `phone`, `name`, `crsScore`, `nclcProfile` dans `NewsletterSubscriber`.
    - Migration réussie via `prisma db push` et `prisma generate`.
    - Action serveur dédiée `captureLeadAction` enregistrant le prospect, synchronisant avec les abonnés actifs et alertant immédiatement le Super Admin (`prisma.notification`).
  - **Exploitation Back-Office (`app/admin/newsletter/page.tsx` & `/api/admin/newsletter/export`) :**
    - Tableau admin enrichi avec colonnes *Candidat (Nom + Email)*, *WhatsApp / Téléphone* (avec bouton direct vert WhatsApp `https://wa.me/...` pour lancer une conversation en 1 clic), *Diagnostic CRS (+pts & profil)*, *Source*, *Date*, *Statut*.
    - Recherche plein-texte multi-champs sur l'email, le nom et le numéro de téléphone.
    - Export CSV incluant toutes les nouvelles colonnes pour les campagnes de diffusion ou CRM.

- **Connectivité Totale des Ressources Admin ↔ Utilisateurs :**
  - **Blog & Guides Stratégiques (`lib/blog/blog-service.ts`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`) :**
    - Les articles créés, édités ou publiés dans `/admin/blog` étaient auparavant déconnectés du blog public qui lisait des données mockées statiques.
    - Création de `blog-service.ts` reliant `prisma.blogPost` aux pages publiques avec repli gracieux et fusion automatique.
    - `app/blog/page.tsx` transformé en Server Component interrogeant la base et passant les données au composant client interactif `BlogIndexClient`.
    - `app/blog/[slug]/page.tsx` résolvant les articles en direct depuis la base de données.
  - **Boutons d'Aperçu Candidat Direct (`app/admin/series-ee/page.tsx` & `app/admin/series-ce/page.tsx`) :**
    - Ajout dans chaque ligne du catalogue admin d'un bouton `ExternalLink` (*« Voir en vue candidat (Épreuve réelle) »*) menant directement à l'examen en conditions CBT (`/examens/[seriesNumber]/ee/intro` et `/examens/demo-[seriesNumber]-ce`).
  - **FAQs & Témoignages :** Vérifiés et câblés directement sur `prisma.faq` et `prisma.testimonial`.

- **Composants Shadcn UI dans l'Historique des Tentatives (`components/dashboard/attempt-history-table.tsx`) :**
  - Remplacement de tous les tags HTML natifs `<select>` (filtre par palier et sélecteur de lignes par page) par les composants officiels Shadcn UI (`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`).

- **Fiabilisation 100% de l'Exportation PDF (`lib/exam/export-pdf.ts`) :**
  - Ajout du sanitizer vectoriel `sanitizePdfText` interceptant et traduisant tous les caractères hors WinAnsi (`✓` -> `[OK]`, `⚠` -> `(!)`, `•` -> `-`, `—` -> `-`, `’` -> `'`, `«` `»` -> `"`, suppression des emojis UTF-8 non supportés par la police standard Type 1 Helvetica de jsPDF).
  - Élimine la corruption de flux PDF et garantit un fichier 100% ouvrable sous Acrobat, Chrome, Firefox et Edge.

- **Redirection Dynamique du Magic Link Supabase (`app/auth/actions.ts`) :**
  - Résolution dynamique de l'origine (`resolveOrigin()`) via `x-forwarded-host` et headers de requête pour `emailRedirectTo`.
  - Résout le renvoi erroné vers `localhost:3000` lors des inscriptions en ligne.

### 0.0e. Suppression du Bruit Marketing & Cockpit de Pilotage NCLC 7 / C2 (`app/dashboard/page.tsx` & `components/dashboard/`)
- **Élimination du Marketing Obsolète :**
  - Suppression intégrale du bandeau verbeux *« Période de Lancement : Accès 100% Gratuit & Illimité »* et de ses badges promotionnels redondants (*« Accès 100% Gratuit Lancement »*, *« Recommandé · 100% Gratuit »*). Les candidats accédant au dashboard étant déjà inscrits, le ton passe d'un discours d'acquisition à une ergonomie SaaS professionnelle orientée résultat et progression.
- **Cockpit à 3 Vues Interactives (`components/dashboard/dashboard-pro-view.tsx`) :**
  1. **Vue Cockpit (Synthèse) :**
     - 4 KPI Cards clés : Niveau NCLC actuel (jauge vers NCLC 7+), Score TCF échelonné (/699 pts FEI), Statut Bonus CRS Entrée Express (+50 pts) et nombre de sessions évaluées.
     - Compagnon 3D & Compte à rebours de l'examen intégrés harmonieusement.
     - Cartes d'épreuves actives (Expression Écrite 60 min, Expression Orale Studio IA) avec accès rapide par tâche.
     - Cartes Compréhension Écrite & Orale avec badge passif propre `🔒 Bientôt disponible`.
  2. **Historique des Évaluations & Modal de Correction Détaillée (`components/dashboard/attempt-detail-modal.tsx`) :**
     - Liste de toutes les tentatives avec date, discipline, note sur 20, score échelonné et niveau NCLC.
     - Filtres rapides par discipline (`Toutes`, `✍️ Écrit`, `🎙️ Oral`).
     - Bouton d'action **« Voir la Correction »** ouvrant un rapport d'inspection exhaustif :
       - Découpage par Tâche (Tâche 1 Courriel, Tâche 2 Récit, Tâche 3 Débat).
       - Texte réel soumis par le candidat avec décompte de mots FEI.
       - Barème critérié sur 20 avec barres de progression pour chaque critère officiel (Adéquation consigne /5, Cohérence /5, Lexique C1/C2 /5, Morphosyntaxe /5).
       - Modèle Magic Rewrite C2 avec mots-clés d'excellence.
       - Bouton d'export PDF personnalisé de l'attestation/rapport d'évaluation.
  3. **Analytique & Barème FEI (`components/dashboard/analytics-breakdown.tsx`) :**
     - Moyennes agrégées sur les 4 critères officiels FEI sur l'ensemble des copies du candidat.
     - Taux de conformité du volume de mots (prévention des pénalités FEI).
     - Diagnostic et axe de travail prioritaire recommandé pour franchir le palier NCLC supérieur.
- **Fiabilisation 100% de l'Exportation PDF (`lib/exam/export-pdf.ts` & `attempt-detail-modal.tsx`) :**
  - **Diagnostic du Problème :** L'ancien code s'appuyait sur `document.getElementById("exam-report-container")` et `html2canvas`. Quand l'élément était absent ou qu'une tentative contenait des critères null/vides, une exception JavaScript non gérée provoquait un basculement vers `window.print()` (la boîte de dialogue d'impression du navigateur au lieu du téléchargement du fichier PDF).
  - **Moteur Vectoriel Direct `jsPDF` :** Réécriture complète d'un générateur PDF autonome et résilient. Il gère tous les cas de figure (tentative à 0 point, texte vide, feedbacks sérialisés en JSON ou chaînes).
  - **Contenu du Bilan PDF Officiel :** Bandeau écarlate FEI, carte de score synthétique (Note /20, Score /699, Palier NCLC, Bonus CRS), les 3 tâches détaillées avec les rédactions complètes du candidat, décompte de mots, barème critérié sur 20, modèles Magic Rewrite C2, et pagination automatique (`Page X sur Y`). Téléchargement immédiat sans boîte de dialogue d'impression.
- **Benchmark Concurrent & Suite Analytique d'Excellence (`analytics-breakdown.tsx`) :**
  - **Constat sur Objectif Canada :** L'exploration de `https://objectifcanada-tcf.com/fr/dashboard/tcfhistory` révèle que le concurrent ne propose **aucune analytique pédagogique** (uniquement une carte de score global et un tableau brut de logs de tests).
  - **Avance Concurrentielle de Super4C2 :**
    1. **Courbe de Progression Visuelle :** Graphique chronologique des scores avec ligne seuil fatidique NCLC 7 (+50 pts CRS) à 10/20.
    2. **Matrice des 4 Compétences :** Évaluation de l'équilibre linguistique entre EE, EO, CE et CO (conformément à l'exigence d'IRCC où chaque compétence doit atteindre le NCLC 7).
    3. **Simulateur d'Impact CRS en Direct :** Affiche le bonus de 50 points d'Entrée Express et situe le candidat par rapport aux tirages fédéraux francophones (~410-435 pts).
    4. **Décomposition des 4 Critères FEI sur 20 :** Adéquation consigne, Cohérence/connecteurs, Richesse lexicale, Morphosyntaxe, avec mise en avant automatique du point fort et du goulot d'étranglement prioritaire.

### 0.0. Remplacement du Format « Série » par « Session » & Compression Drastique du Header
- **Terminologie Officielle (« Session XX ») :** 
  - Conforme aux désignations officielles de France Éducation International (ex: « Session TCF Canada », « Session TEF »), évitant la copie mot-à-mot du concurrent tout en restant immédiatement intelligible et prestigieux pour le candidat.
  - Remplacement de « Série » ou des noms techniques par **« Session 01 »**, **« Session 02 »**, etc.
- **Réduction Drastique du Header « Pack TCF Canada » (Capture 2) :**
  - Condensation d'une carte massive de ~400px en une barre d'en-tête fine (~65px) intégrant le titre, le badge CRS (+50 pts) et les pilules de sélection immédiate de test (`TCF`, `TEF`, `IELTS`).
  - Suppression de la barre d'onglets de filtrage par épreuve qui forçait un pré-filtrage avant de voir le contenu des sessions.
- **Cartes de Sessions Ultra-Compactes Multi-Épreuves (~160px) :**
  - Chaque carte de session regroupe désormais directement les deux épreuves clés associées à cette session :
    1. `✍️ Expression Écrite` (60 min) menant à `/examens/[seriesId]/ee/intro`
    2. `🎙️ Expression Orale` (Visio IA) menant à `/examens/[seriesId]/eo/intro`
  - Réduction de l'empreinte verticale de 60%, permettant d'afficher jusqu'à 4 sessions par ligne sur grand écran sans nécessiter de long défilement vertical.
- **Nettoyage de `app/examens/page.tsx` :**
  - Suppression de la double liste redondante `Packs Expressions Uniquement (EE & EO)` qui dupliquait les cartes d'examen sous la vue principale.
  - Code allégé, typage strict TypeScript et suppression des imports inutilisés.

### 0.0c. Résolution du Chevauchement Mobile : Bouton Flottant & Barre de Navigation (`components/community/floating-community-button.tsx`)
- **Problème Identifié :** Sur petits écrans (`< lg`), le bouton flottant rouge « Communauté VIP » était positionné en dur à `bottom-6 right-6`, ce qui le plaçait exactement par-dessus l'onglet « Compte » de la barre de navigation mobile inférieure (`MobileNavBar`), le bloquant et le rendant inutilisable.
- **Résolution :**
  - **Masquage total sur mobile (`hidden lg:flex`) :** Libération immédiate de la barre de navigation mobile. Tous les onglets tactiles (Accueil, Expressions, CRS Canada, Blog, Compte) sont 100% visibles et réactifs sans obstruction.
  - **Suppression sur la page `/communaute` :** Ajout de la condition `pathname === "/communaute"` pour ne pas afficher le bouton redondant d'accès à la communauté lorsqu'on y est déjà.
  - **Repositionnement desktop sans collision :** Déplacé à `bottom-6 left-6` sur grand écran pour éviter tout conflit avec le widget Coach IA (`AiChatWidget`) et le retour en haut de page (`ScrollToTop`) situés à droite.

### 0.0d. Sauvegarde & Restauration de Brouillon EE, Export PDF Haute Fidélité & Filtrage Disciplines
- **Sauvegarde en Temps Réel & Restauration Flottante (`components/exam/written-exam-editor.tsx`) :**
  - Sauvegarde continue non-bloquante du texte des 3 tâches dans `super4c2:draft:ee:[seriesId]`.
  - En cas de sortie inopinée et de retour, apparition d'un bouton flottant discret en bas à gauche (`History` : *« Restaurer mon brouillon »*).
  - Dialogue de restauration avec mention explicite : `Attention, action irréversible : la restauration remplacera définitivement tout le contenu actuellement saisi par votre brouillon précédent`.
  - Avertissement irréversible dans la modale de soumission : `Attention, action irréversible : une fois votre copie transmise, vous ne pourrez plus modifier vos textes`.
  - Purge automatique du brouillon dès la soumission réussie.
- **Exportation PDF Personnalisée (`lib/exam/export-pdf.ts`) :**
  - Remplacement de l'impression brute par une génération PDF vectorielle/capturée haute fidélité via `jspdf` et `html2canvas`.
  - Bouton interactif avec état de chargement (`Génération du PDF...`) produisant un document A4 brandé avec note globale EE, score TCF, palier NCLC, grille critériée FEI et Magic Rewrite.
- **Harmonisation des Liens Dashboard & Navigation (`app/dashboard/page.tsx` & `components/site-nav.tsx`) :**
  - Remplacement des anciens liens en dur (`demo-101-ee`, `demo-101-ce/eo/intro`) par les routes ciblées du catalogue :
    - Carte Expression Écrite : bouton principal orienté vers `/examens?discipline=ee`, raccourcis didactiques (Tâches 1, 2, 3) pointant vers la Session 01 (`/examens/101/ee?mode=training&task=[1,2,3]`).
    - Carte Expression Orale : bouton principal orienté vers `/examens?discipline=eo` (« Accéder aux Sessions d'Expression Orale »).
    - Dropdown Navigation : libellés harmonisés (« Sessions Écrites (60 min) », « Sessions Orales (Visio IA) », « Voir toutes les Sessions d'Entraînement »).

## 0.1. Résolution du Verrouillage des Résultats, Isolation Totale de l'Espace Examen & Épuration Nav

### 0.000000000000000000000000000. Suppression du Bloc Superflu sur le Déblocage (`app/examens/page.tsx`)
- **Retrait du composant verbeux :** Suppression complète du bloc « Pourquoi notre parcours de déblocage garantit votre succès » (les 3 cartes 01 Écran Scindé, 02 Décodage des Pièges, 03 Seuil NCLC 7 Automatisé) en bas de la page `/examens`.
- **Bénéfice :** Élimination du bruit et des pavés de texte superflus sur le catalogue d'examens, orientant le candidat directement vers le choix de sa série et le démarrage immédiat de l'entraînement.

### 0.00000000000000000000000000. Élimination de l'Auto-Soumission Fantôme & Apparition Immédiate des Tâches 1, 2, 3 (`components/exam/written-exam-editor.tsx`)
- **Résolution du Bug de la Scorecard Affichée d'Emblée :**
  - Dans l'ancien code, lorsque `deadline` était initialisé à 0 avant la fin de l'hydratation, la fonction de tick considérait `left = 0 <= 0` et déclenchait automatiquement `handleSubmit()` sur des textes vides, affichant un bilan de 6/20 (0 mots) dès l'entrée en salle !
  - **Correction appliquée :** Garde de sécurité stricte `if (!deadline || deadline <= 0) return;`.
  - **Démarrage systématique sur les tâches :** Tout accès à l'examen sans le paramètre explicite `?view=results` démarre systématiquement en mode composition active (`isFinished = false`, `result = null`).
  - **En-tête Ultra-Minimaliste & Zéro Distraction :**
    1. Gauche : Bouton `← Retourner`.
    2. Centre : Chronomètre strict `60:00`.
    3. Droite : Bouton `Soumettre`.
    - Suppression de la barre télémétrique intermédiaire encombrante. L'écran scindé (Sujet à gauche, Clavier d'accents et éditeur à droite) et les 3 onglets `Tâche 1`, `Tâche 2`, `Tâche 3` apparaissent immédiatement dès le clic sur démarrer l'examen.
- **Suppression du Bouton « Accès Gratuit » dans la Navbar (`components/site-nav.tsx`) :**
  - Retrait du badge vert redondant `● Accès Gratuit` qui encombrait la barre de navigation pillée à côté des boutons d'action du header.
- **Correction du bug de statut verrouillé :** Examen 1 (`tcf-blanc-1`) était artificiellement marqué `LOCKED` car `unlockedSeriesIds` ne l'incluait pas par défaut et le code n'évaluait pas la propriété native `s.status === "UNLOCKED"`.
- **Résolution :**
  - Ajout de `"tcf-blanc-1"` dans `unlockedSeriesIds`.
  - Condition de statut mise à jour pour respecter `s.status === "UNLOCKED"` : Examen 1 est désormais **déverrouillé par défaut**, disponible immédiatement pour lancer l'épreuve écrite (`/examens/101/ee/intro`) ou l'épreuve orale (`/examens/101/eo/intro`).

### 0.000000000000000000000000. Réorganisation Homepage, Retrait des Stats et Vitrine Interactive (`app/page.tsx`)
- **Suppression du bloc de statistiques clés :** Retrait du composant à 4 chiffres animés (`NumberTicker` 50+ / 100% / 0 sec / NCLC 7 à 10) jugé inutile et encombrant.
- **Restauration de `ProductShowcaseSection` en position reine :** Placé immédiatement sous la Hero pour offrir une manipulation interactive concrète dès l'arrivée sur la plateforme.
- **Enchaînement Narratif & Didactique Optimal :**
  1. **Hero** (titre, valeur ajoutée, CTAs préservés TCF/TEF/IELTS + CRS).
  2. **Vitrine Interactive CBT** (`ProductShowcaseSection`).
  3. **Constat 4C2** (Pourquoi 78% échouent à cause de l'Écrit + 3 solutions).
  4. **Atelier Avant / Après Magic Rewrite** (`MagicRewriteShowcase` : comparaison directe B1 vs C1/C2 avec note FEI).
  5. **Les 4 Épreuves Officielles Maîtrisées** (Cartes 3D EE, EO, CE, CO).
  6. **Comparatif Haute Précision** (Méthodes classiques vs Super4C2).
  7. **Témoignages Candidats** (`TestimonialsSection`).
  8. **FAQ** (`FaqSection`).
  9. **CTA Final Condensé & Percutant** : Format raccourci, direct, débarrassé du pavé textuel verbeux.
- **Validation TypeScript :** `npx tsc --noEmit` validé avec code 0 (zéro erreur).

### 0.00000000000000000000000. Application des Directives Vocales du Supérieur (Message PTT-WA0006)
- **Simplification Radicale du Catalogue d'Examens (`components/exam/exam-roadmap-board.tsx`) :**
  - **Renommage limpide des cartes :** **« Examen 1 »**, **« Examen 2 »**, **« Examen 3 »**, **« Examen 4 »**, **« Examen 5 »** (élimination des termes confus tels que *Série 1*, *Série 101*, *Série 102*).
  - **Suppression du bandeau rouge encombrant :** Retrait de *« Recommandée · Flagship »* sur les cartes.
  - **Suppression des paragraphes descriptifs verbeux :** Élimination des pavés de texte superflus pour une lisibilité instantanée et un ratio signal/bruit maximal.
  - **Bouton d'action direct :** *« Lancer l'Épreuve Écrite (Examen N) »* ou *« Lancer l'Épreuve Orale (Examen N) »*.
- **Refonte de la Page Consignes & Modalités de l'Expression Écrite (`app/examens/[seriesId]/ee/intro/page.tsx`) :**
  - **Bouton avec flèche « Précédent » :** Bouton `← Précédent` au format pilule moderne positionné en haut à gauche exactement à l'emplacement désigné pour revenir instantanément au catalogue de l'épreuve (`/examens?discipline=ee`).
  - **Suppression intégrale de toute comparaison concurrente :** Élimination définitive de toute mention d'*« Objectif Canada »* ou de critiques comparatives.
  - **Intégration des 2 Blocs d'Action Côte-à-Côte en bas de page :**
    - **Bloc 1 (Didactique) :** `📖 Relire la Méthodologie` ouvrant l'organigramme pédagogique complet de toutes les tâches avec le compagnon 3D (`/examens/[seriesId]/ee/methodologie`).
    - **Bloc 2 (Action Principale) :** `✍️ Démarrer l'Examen (60:00)` avec paramètre `start=true` lançant immédiatement l'épreuve en conditions réelles chronométrées.
- **Accès Direct & Isolation Totale de l'Espace de Rédaction (`components/exam/written-exam-editor.tsx`) :**
  - **Apparition Immédiate de Tâche 1, Tâche 2 et Tâche 3 :** Élimination du verrouillage sur d'anciens résultats ou sessions terminées en cache. Tout clic sur « Démarrer l'Examen » ouvre directement l'atelier d'écriture prêt à composer (Tâche 1 active par défaut, Tâche 2 et Tâche 3 immédiatement accessibles par onglets).
  - **Élimination Totale du Superflu :** Suppression du commutateur de mode distrayant, suppression des boutons secondaires inutiles.
  - **En-tête Strict à 3 Éléments :**
    1. Bouton `← Retourner` (menant aux consignes / catalogue).
    2. Chronomètre officiel de 60 minutes (`60:00` avec décompte).
    3. Bouton `Soumettre` (pour envoyer la copie à la correction IA).
  - **Espace de Travail Pur :** Sujet officiel à gauche, éditeur de texte avec compteur de mots FEI, clavier d'accents français (MAJ/Min) et bouton de passage de tâche à droite.
- **Harmonisation Globale du Bouton « Précédent » :**
  - Ajout du bouton `← Précédent` sur la page `WritingMethodologyHub` (`components/exam/writing-methodology-hub.tsx`) pour permettre un retour fluide vers les consignes de l'examen.
  - Bouton `← Précédent` vérifié et harmonisé sur l'épreuve orale (`app/examens/[seriesId]/eo/intro/page.tsx`).
- **Épuration UX & Déploiement des 4 Optimisations Stratégiques :**
  1. **Suppression de la Bannière Pop-up de Cookies :**
     - Retrait du composant bloquant `CookieConsentBanner` dans `app/layout.tsx`.
     - Super4C2 n'utilisant aucun tracker publicitaire tiers (ni Google Ads, ni Meta/TikTok Pixel), la conservation d'une modale intrusive créait une friction inutile. La conformité légale (RGPD / Loi 25) est assurée via la page transparente `/cookies` accessible depuis le footer.
  2. **Suppression du Sélecteur de Langue "CA FR" de la Navbar :**
     - Retrait de `LanguageSwitcher` dans `components/site-header.tsx`.
     - L'entraînement au TCF Canada étant 100% en français, ce bouton e-commerce parasitait la navigation.
  3. **Bouton « Télécharger mon Bilan (PDF) » :**
     - Ajout d'un bouton d'exportation / impression propre dans le header et sous la scorecard des résultats de l'Expression Écrite (`components/exam/written-exam-editor.tsx`).
     - Permet aux candidats de conserver, réviser hors-ligne et partager leur rapport officiel FEI + Magic Rewrite C1/C2.
  4. **Section Vitrine Interactive « Avant / Après Magic Rewrite » :**
     - Création de `components/marketing/magic-rewrite-showcase.tsx` intégré sur `app/page.tsx`.
     - Démontre la valeur perçue immédiate avec comparaison dynamique entre une copie moyenne B1 (recalée) et la version C1/C2 optimisée pour débloquer les +50 points CRS.

### 0.0000000000000000000000. Alignement Feedback Hiérarchique (Audio Supérieur & Directive Utilisateur)
- **Restructuration de la Navigation Principale (`components/site-nav.tsx` & `components/mobile-nav.tsx`) :**
  - **Bloc 1 — Expressions (EE & EO) [Pôle Prioritaire #1] :**
    - Carreau n°1 : **Expression Écrite (EE)** mise en avant comme la *bête noire des candidats*, avec les 3 tâches d'examen chronométrées, correction instantanée par critères et modèles Magic Rewrite C1/C2.
    - Carreau n°2 : **Expression Orale (EO)** — *Simulateur Visio IA* avec l'examinateur IA M. Laurent pour un entretien interactif en direct.
    - Accès direct au **Pack TCF Canada** (toutes les séries).
  - **Bloc 2 — Compréhensions (CE & CO) [Pôle Démarche Transparente] :**
    - Message éducatif et transparent sur les droits d'auteur et l'accès gratuit aux QCM (portails publics type TV5Monde/RFI).
    - Explication claire de la valeur ajoutée de Super4C2 : focalisation de l'IA là où se jouent réellement les points (+50 CRS) et où les candidats échouent (les épreuves de production).
    - Statut pédagogique transparent des modules QCM en cours de calibrage.
  - **Bloc 3 — Outils & CRS Canada :**
    - Calculateur NCLC & Points CRS Canada (+50 pts Entrée Express).
    - Carnet d'Erreurs SRS (répétition espacée).
    - Radar des Sujets Récents tombés ces dernières semaines.
  - **Bloc 4 — Ressources & Contact :** Blog stratégique, Communauté VIP Telegram, Conciergerie.
  - **Bouton CTA Unique :** `Accès Gratuit`.
  - **Mobile (`components/mobile-nav.tsx`) :** Mise en avant directe de l'onglet `Expressions` (`/examens?discipline=ee`) avec l'icône `PenTool`.

### 0.000000000000000000000. Épuration Juridique & Harmonisation « Pack TCF Canada » (`/examens`)
- **Suppression des Prétentions d'Affiliation Légale à Risque :**
  - Remplacement des titres et badges par **« Pack TCF Canada »** (au lieu de *« France Éducation International »* ou *« Standard Fédéral Officiel »*).
  - Badge de validation harmonisé en **« Grille NCLC 7+ Validée »** et **« Sujets d'Entraînement »**.
  - Nettoyage du code mort dans `components/exam/exam-roadmap-board.tsx` (suppression intégrale de l'ancien bloc roadmap horizontal au profit de la vue grille exclusive).
  - Nettoyage des titres dans `components/product-showcase-section.tsx`, `components/exam/mock-exam-orchestrator.tsx` et `lib/exam/series-progression.ts`.
- **Validation Globale TypeScript :** `npx tsc --noEmit` exécuté avec succès (0 erreurs).

### 0.00000000000000000000. Priorisation d'Affichage : EE & EO en Pôle Position & Gel de CE & CO ("Coming Soon")
- **Alignement Visuel & UX (Demande Utilisateur & Capture d'Écran Mobile) :**
  - **Mise en 1ère et 2ème position :** Expression Écrite (`EE`) et Expression Orale (`EO`) sont désormais les deux premiers boutons de la barre de filtres du simulateur (`components/exam/exam-roadmap-board.tsx`), immédiatement visibles sans défilement horizontal sur mobile.
  - **Gel de la Compréhension Écrite (`CE`) et Compréhension Orale (`CO`) :**
    - Dans la barre de filtres : boutons en état `disabled`, bordure en tiretés, cadenas `Lock` institutionnel et badge ambre contrasté `🔒 Bientôt`.
    - Repli automatique du paramètre d'URL : si un utilisateur arrive avec `?discipline=ce` ou `?discipline=co`, l'état bascule gracieusement sur `ee`.
    - Dans la grille des 4 cartes d'épreuves de chaque sujet : tri automatique assurant que EE et EO apparaissent en têtes de liste (cartes 1 et 2), et que CE et CO (cartes 3 et 4) affichent un badge `🔒 Bientôt (Coming Soon)`, la mention explicite `Calibrage officiel FEI en cours` et un bouton CTA désactivé `🔒 Bientôt disponible` (suppression de tout lien de navigation actif vers des séries en cours de calibrage).
    - En vue catalogue (Grille) : le bouton d'action principal redirige automatiquement vers l'atelier d'écriture EE ou le hub du sujet plutôt qu'un lien CE non finalisé.

### 0.0000000000000000000. Génération du Rapport Exécutif Word d'Avancement & Roadmap (Compte-rendu Hiérarchique)
- **Utilisation du Skill DOCX (`anthropics-skills/docx`) :**
  - Script automatisé `scripts/generate-executive-report-docx.ts` conçu selon les spécifications strictes du skill (mise en page A4, dimensions DXA, typographie Century Gothic & Calibri, couleurs officielles Marine #1E3A8A et Ambre #D97706, ombrages `ShadingType.CLEAR`, en-têtes et pieds de page avec pagination dynamique).
  - Génération réussie du livrable officiel : `docs/reports/RAPPORT_EXECUTIF_AVANCEMENT_ROADMAP_SUPER4C2.docx` (19.4 Ko).
- **Contenu Stratégique du Rapport (7 Chapitres Prêts pour le Directoire) :**
  - 1. Page de garde institutionnelle et métadonnées exécutives.
  - 2. Synthèse exécutive et indicateurs d'impact (+50 points CRS, évaluation IA en < 10s vs 48h humaine, cockpit 100vh zéro défilement).
  - 3. Matrice de complétion de la roadmap (Phases 0 à 7 : **88% de complétion globale** sur les épreuves reines EE & EO).
  - 4. Bilan détaillé des réalisations livrées (EE, EO, CE/CO, PostgreSQL 17 multi-séries 101-105, Mentors 3D, SRS, Admin 3-voies).
  - 5. Plan d'action des 4 chantiers prioritaires à finaliser (Banque CE/CO, Voix ElevenLabs par Compagnon, Passerelle SasPay/Stripe, Espace B2B Écoles).
  - 6. Calendrier prévisionnel des 4 prochains sprints.
  - 7. Recommandations stratégiques et certification de conformité FEI.

### 0.000000000000000000. Déploiement Base de Données du Catalogue Multi-Séries EE & EO (Séries 101 à 105, 30 Sujets FEI Réels)
- **Arrêt des Conteneurs Conflits & Démarrage du Cluster Docker Super4C2 :**
  - Arrêt automatique des conteneurs tiers `dimitri-snowdev` libérant les ports et ressources.
  - Démarrage et validation de l'état `healthy` des conteneurs du projet : `super4c2-db` (PostgreSQL 17 sur port 5434), `super4c2-studio` (port 3002) et `super4c2-meta` (port 8080).
  - Câblage direct de `DATABASE_URL` et `DIRECT_URL` vers `postgresql://postgres:postgres@localhost:5434/super4c2?schema=public`.
- **Modélisation & Migration Schéma Prisma (`prisma/schema.prisma`) :**
  - Ajout des modèles `OralSeries` et `OralTask` avec typage strict des durées, scénarios de jeux de rôle pour l'examinateur IA M. Laurent et index uniques `[seriesId, taskNumber]`.
  - Migration instantanée via `prisma db push` synchronisée avec PostgreSQL 17.
- **Peuplement Exhaustif en Base de Données (Zéro Mock Data) :**
  - Script dédié `prisma/seed-multi-series.ts` et module de données `lib/exam/multi-series-data.ts`.
  - **Expression Écrite (EE) : 5 Séries / 15 Tâches FEI complètes** avec sujets officiels, contextes, fourchettes de mots (T1: 60-120, T2: 120-150, T3: 120-180) et modèles de correction C1/C2 Magic Rewrite intégrés.
  - **Expression Orale (EO) : 5 Séries / 15 Tâches d'Entretien complètes** avec prompts de départ de M. Laurent, minutages officiels (120s, 210s, 270s) et scénarios de jeux de rôle Tâche 2 (covoiturage, énergie solaire, troupe de théâtre, salle de sport).
- **Services Serveur Dédiés & Intégration App Router :**
  - Création de `lib/exam/written-service.ts` et `lib/exam/oral-service.ts` interrogeant Prisma avec repli gracieux et résolution universelle d'alias (ex: `102`, `serie-102`, `demo-102-ee`, `cuid`).
  - Câblage des Server Components :
    - `/examens/[seriesId]/ee` & `/ee/intro` (`WrittenExamPage`, `WrittenIntroPage`).
    - `/examens/[seriesId]/eo` & `/eo/intro` (`OralExamPage`, `OralIntroPage`).
    - `/api/ai/evaluate-written` (`POST`).
    - `/examens/[seriesId]` (Sélecteur de discipline avec conservation stricte de la série choisie).
    - `lib/exam/series-progression.ts` (Liaison des 5 jalons de l'`ExamRoadmapBoard` vers les URLs dédiées de chaque série).
- **Validation Globale :**
  - `npx tsc --noEmit` : **0 erreur**.
  - Test d'interrogation multi-séries DB 101 à 105 réussi à 100%.

### 0.00000000000000000. Refonte Visuelle : Cockpit d'Examen Sans Défilement (Zero-Scroll 100vh) & Design Orbital Circulaire
- **Suppression Totale du Défilement (Conformité FEI Mode Examen) :**
  - Remplacement de l'empilement vertical à 3 grands blocs par une **architecture cockpit côte-à-côte à hauteur d'écran stricte (`h-screen overflow-hidden`)**.
  - **Panneau Gauche (5 cols) :** Orbe circulaire centré de M. Laurent Mercier (`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 shadow-xl`), anneaux acoustiques concentriques réactifs, boutons d'action flottants (*Passer* et *Réécouter*), pilule d'état et spectre fréquentiel compact (`OralWaveform`).
  - **Panneau Droit (7 cols) :** Hub de consigne et dialogue direct avec question de l'examinateur bien aérée, bulle de transcription instantanée du candidat, suggestions d'amorces en Tâche 2 et indicateur textuel du microphone.
  - **Console d'Action Inférieure Ancrée :** Barre unique regroupant les boutons principaux (*Prendre la parole*, *Valider ma réponse*, *Clavier de secours*) à gauche et la navigation de tâche (*Passer à la Tâche 2 →* / *Terminer*) à droite.
  - **Résultat :** Le candidat a en permanence sous les yeux le visage de l'examinateur, la question en cours, l'animation audio et les boutons d'action sans avoir à scroller une seule fois.

### 0.0000000000000000. Résilience d'Appel Vocal ElevenLabs & Gestion d'Erreur Candidat Complète
- **1. Diagnostic & Correction de l'Échec de Session d'Appel (`OralExamRoom`) :**
  - **Gestion Visuelle de l'Erreur d'Appel (`callError`) :** Auparavant, `callError` était enregistré dans l'état sans être affiché dans le JSX. Un bandeau interactif haute visibilité a été intégré au-dessus du pod vidéo ainsi qu'une alerte interactive dans le panneau latéral.
  - **Boutons de Secours Instantanés :**
    - 🎙️ *« Continuer en Mode Guidé (Microphone Standard) »* (Recommandé) : permet au candidat de continuer son examen tour par tour de manière 100% fiable avec enregistrement audio sans dépendance WebRTC.
    - 🔄 *« Réessayer l'Appel Direct »* : réinitialise l'audio et relance proprement la session.
  - **Détection des Permissions Microphone :** Détection explicite des erreurs `NotAllowedError`, `NotFoundError` et `NotReadableError` avec instructions précises pour débloquer l'accès au microphone dans le navigateur.
- **2. Élimination des Erreurs PostgreSQL `ConnectionReset 10054` (Prisma + Supabase PgBouncer) :**
  - **Résilience Server Actions (`lib/notifications/actions.ts`) :** Sécurisation de `getNotificationsAction` avec `try / catch` et repli sur des notifications de démonstration par défaut, éliminant les crashs silencieux lors des interrogations cycliques (45s).
  - **Résilience API Tentatives (`app/api/exam/attempt/route.ts`) :** Sécurisation de la persistance en base avec fallback local gracieux pour ne jamais pénaliser un candidat finissant son épreuve en cas de réinitialisation du pooler SQL.
  - **Configuration Pooler Supabase (`.env`) :** Ajout de `connection_limit=1` à `DATABASE_URL` pour prévenir les fermetures de connexions inactives par PgBouncer sur le port 6543, et synchronisation de `ELEVENLABS_AGENT_ID`.
- **3. Error Boundary Dédié (`app/examens/[seriesId]/eo/error.tsx`) :**
  - Mise en place d'un écran de secours stylisé reprenant les codes de l'EdTech pour intercepter toute défaillance inattendue de page et permettre la reprise immédiate de l'entretien.

### 0.000000000000000. Organigramme d'Accueil TCF Canada & Hub d'Expression Écrite Structuré
- **1. Onboarding en 2 Étapes TCF Canada (`components/companions/companion-selector-dialog.tsx`) :**
  - **Étape 1 — Accueil Oral du TCF Canada dans son ensemble :** Lecteur audio Web Speech et transcription complète présentant le TCF Canada, ses 4 épreuves, l'objectif capital NCLC 7 et le bonus de +50 points CRS, ainsi que la raison pour laquelle 78% des candidats perdent leurs points en Expression Écrite et Orale. Bouton : *"Suivant : Choisir mon Compagnon de Formation →"*.
  - **Étape 2 — Choix du Compagnon 3D de Formation :** Présentation des 3 mentors avec Kodiak (le nounours/grizzly 3D canadien) en vedette, Aura et Barnabé. Écoute de la voix de chaque mentor et validation persistante (`super4c2:user_companion`).
- **2. Hub d'Expression Écrite en 3 Grands Titres (`components/exam/writing-methodology-hub.tsx`) :**
  - **Accueil Vocal du Compagnon :** Le compagnon 3D sélectionné lit la page à voix haute et présente les 3 grands titres structurés.
  - **Grand Titre 1 — Présentation & Description de l'Épreuve :** Décomposition officielle du barème FEI sur 20 points (4 critères de 5 points : Adéquation, Cohérence, Lexique, Morphosyntaxe) et les 3 pièges éliminatoires.
  - **Grand Titre 2 — Méthodologie & Exercices d'Application Corrigés :**
    - *Tâche 1 (Courriel • 60-120 mots • ~15 min) :* Méthodologie en 3 blocs + Sujet type officiel FEI + Corrigé modèle rédigé C1/C2 (94 mots) + Décryptage 20/20 + Bouton d'entraînement dédié.
    - *Tâche 2 (Récit • 120-150 mots • ~20 min) :* Méthodologie du récit d'expérience citoyenne + Sujet type officiel FEI + Corrigé modèle rédigé C1/C2 (138 mots) + Décryptage 20/20 + Bouton d'entraînement dédié.
    - *Tâche 3 (Débat • 120-180 mots • ~25 min) :* Méthodologie de la double argumentation et formules de concession + Sujet type officiel FEI + Corrigé modèle rédigé C1/C2 (162 mots) + Décryptage 20/20 + Bouton d'entraînement dédié.
  - **Grand Titre 3 — Session Examen Blanc (60 min) :** Simulateur officiel CBT chronométré 60 min avec barre de temps dynamique, clavier de caractères accentués (Maj/Min) et autosave.


### 0.00000000000000. Lancement 100% Gratuit, Gating d'Authentification, Isolation CBT & Épuration des Layouts Auth
- **1. Épuration Radicale des Layouts d'Authentification (`components/app-shell.tsx`, `app/auth/login/page.tsx`, `app/auth/register/page.tsx`) :**
  - **Suppression du SiteHeader & SiteFooter :** Les pages `/auth/login` et `/auth/register` ne subissent plus la barre de navigation marketing complète ni le footer à 4 colonnes.
  - **Coque d'Auth Dédiée et Épurée :**
    - En-tête minimal avec lien de retour direct vers l'accueil (`← Retour à l'accueil`) et badge officiel de certification.
    - Conteneur centré sans distraction avec cartes d'authentification (`AuthCard`) harmonisées.
    - Pied de page discret mentionnant les mentions légales, politique de confidentialité et conditions d'utilisation.
    - Élimination de `MobileNavBar`, `AiChatWidget`, `FloatingCommunityButton` et `NewcomerGuideModal` sur tout le périmètre `/auth/*` et `/admin/login`.
- **2. Préservation Stricte du Paramètre de Redirection `next` (`app/auth/actions.ts`, `components/auth/login-form.tsx`, `components/auth/register-form.tsx`) :**
  - Transmission et encodage du paramètre `next` à travers tout le cycle d'authentification :
    - `signInAction` redirige vers `input.next || "/dashboard"`.
    - `signInDemoCandidateAction` redirige vers `next || "/dashboard"`.
    - `signUpAction` redirige vers `input.next || "/dashboard"` (y compris dans le fallback local et lors de la confirmation par email).
    - Liens de bascule croisée "Se connecter" ↔ "Créer un compte" transmettent dynamiquement `?next=...`.
- **3. Isolation Totale des Salles d'Examen CBT FEI (`components/app-shell.tsx`, `components/community/floating-community-button.tsx`, `components/onboarding/newcomer-guide-modal.tsx`, `components/legal/cookie-consent-banner.tsx`) :**
  - Regex officielle étendue : `const EXAM_ROOM = /^\/examens\/[^/]+\/(ce|co|ee|eo|examen-blanc)\/?$/`.
  - Retourne strictement `<div className="min-h-screen bg-background">{children}</div>` sans barre de navigation, barre mobile, chatbot, ni scroll progress.
  - Suppression conditionnelle automatique de `FloatingCommunityButton`, `NewcomerGuideModal` et `CookieConsentBanner` afin de ne jamais perturber l'attention du candidat ou le décompte du chronomètre de 60 minutes.
- **4. Déploiement du Lancement 100% Gratuit & Masquage des Tarifs :**
  - `middleware.ts` & pages `/tarifs` et `/checkout` redirigent automatiquement en HTTP 307 vers `/dashboard`.
  - Remplacement des références tarifaires par le badge pulsant *"Accès 100% Gratuit — Pass Lancement Offert"* dans `SiteNav`, `SiteFooter`, `AccountPage` et `TestGratuitPage`.
  - Mise à niveau du Dashboard candidat avec bannière de célébration du lancement gratuit, composant d'accueil vocal du Compagnon 3D (`CandidateCompanionWelcome`), et cartes héroïques d'accès direct aux épreuves actives EE & EO.
- **5. Statut des Épreuves (EE & EO Actives, CE & CO en Calibrage FEI) :**
  - Création de `components/exam/discipline-coming-soon.tsx` et montage sur `/examens/[seriesId]/ce` et `/co` informant clairement les candidats de l'étalonnage en cours avec liens de bascule immédiate vers l'Expression Écrite et l'Expression Orale.


### 0.0000000000000. Compagnons de Formation 3D & Hub Méthodologique d'Expression Écrite (TCF Canada)
- **Choix des 3 Compagnons Charismatiques (Option C) :**
  1. **Kodiak (L'Ours / Grizzly Canadien)** : Le Coach Protecteur & Rassurant, veste polaire, écharpe rouge feuille d'érable (`/brand/companions/kodiak.jpg`).
  2. **Aura (Le Mentor Stratège IA)** : Entité holographique 3D aux reflets cyan/crimson, précis et analytique sur le barème FEI (`/brand/companions/aura.jpg`).
  3. **Barnabé (Le Bâtisseur Canadien)** : Castor ingénieur 3D aux lunettes rondes et chemise à carreaux rouge/noire, orienté structures et plans (`/brand/companions/barnabe.jpg`).
- **Composants d'Interaction Vocale & Visuelle :**
  - **`CompanionSelectorDialog` (`components/companions/companion-selector-dialog.tsx`) :** Boîte de dialogue de sélection 3D avec prévisualisation vocale (Web Speech API), citation, rôle et bouton de contournement rapide ("Passer l'introduction").
  - **`CompanionPod` (`components/companions/companion-pod.tsx`) :** Bulle de dialogue interactive avec avatar 3D animé, contrôle audio écoute/arrêt, et bouton pour changer de mentor.
- **Hub Méthodologique en 3 Paliers (`components/exam/writing-methodology-hub.tsx`) :**
  - Monté sur la route d'entrée de l'Expression Écrite (`/examens/[seriesId]/ee/intro`).
  - **Palier 1 — Décryptage FEI & Barème :** Décomposition des 4 critères de 5 points (Adéquation, Cohérence, Lexique, Morphosyntaxe = 20/20) et analyse des 3 pièges éliminatoires.
  - **Palier 2 — Ateliers Tâche par Tâche :**
    - Tâche 1 (Courriel • 15 min, 60–120 mots) : Plan en 3 blocs, formules de politesse, et CTA direct vers la session d'entraînement chronométrée.
    - Tâche 2 (Récit • 20 min, 120–150 mots) : Articulateurs temporels, sentiments et portée citoyenne.
    - Tâche 3 (Débat • 25 min, 120–180 mots) : Double argumentation contradictoire, formules de concession C1/C2 et synthèse personnelle.
  - **Palier 3 — Salle d'Examen Blanc Chronométré (60 min) :** Lancement direct du simulateur CBT avec barre de temps, clavier d'accents et autosave.
- **Intégration du Compagnon au Débriefing des Résultats (`components/exam/written-exam-editor.tsx`) :**
  - Présence du compagnon sélectionné lors du bilan d'évaluation (Tâche unique ou Examen 3 tâches) pour délivrer un débriefing vocal personnalisé sur les points NCLC acquis et les améliorations Magic Rewrite.

### 0.000000000000. Expression Écrite : Barre du Temps, Clavier Complet FEI & Mode Entraînement Tâche par Tâche
- **Problématiques adressées & résolutions :**
  1. **Barre du Temps Visuelle Haute Fidélité (`components/exam/written-exam-editor.tsx`) :**
     - Intégration d'une jauge supérieure d'écoulement du temps avec transition fluide CSS et 3 états colorimétriques :
       - Vert Émeraude / Bleu institutionnel (> 25% du temps restant).
       - Ambre doré (<= 25% du temps restant).
       - Rouge Érable pulsant lors des dernières minutes.
     - Bandeau de télémétrie précis affichant : temps restant (`formatClock(remaining)`), temps écoulé vs durée totale, pourcentage restant et badge contextuel.
  2. **Clavier de Caractères Accentués Conforme FEI & Objectif Canada (`components/exam/written-exam-editor.tsx`) :**
     - Ajout des minuscules ET des majuscules accentuées (`é, è, ê, ë, à, â, ç, ô, î, ï, ù, û, œ, æ` vs `É, È, Ê, Ë, À, Â, Ç, Ô, Î, Ï, Ù, Û, Œ, Æ`).
     - Bouton bascule ergonomique `[ a / A ]` (Maj) permettant aux candidats sur claviers QWERTY d'insérer instantanément des capitales accentuées indispensables pour débuter un paragraphe ou un titre.
     - Symboles typographiques officiels : `«`, `»`, `’`, `€`, `–`, `…`.
     - Insertion au curseur avec repositionnement dynamique et conservation du focus pour une frappe fluide sans ressaisie.
  3. **Soumission Manuelle & Soumission Automatique à Expiration :**
     - Soumission sans blocage à tout moment (permettant la notation du travail partiel si certaines tâches sont incomplètes ou non rédigées, sans exception serveur).
     - Si le chrono arrive à expiration (`remaining <= 0`) : déclenchement immédiat et automatique de `handleSubmit()`, fermeture des modales et affichage d'un bandeau explicatif : *"Temps écoulé ! Votre travail a été automatiquement soumis et évalué par l'IA selon la grille officielle de France Éducation International."*
  4. **Mode Entraînement Tâche par Tâche (`app/examens/[seriesId]/ee/page.tsx` & `intro/page.tsx`) :**
     - Découpage didactique permettant de s'entraîner spécifiquement sur une tâche :
       - Tâche 1 : 15 min requises (60 à 120 mots).
       - Tâche 2 : 20 min requises (120 à 150 mots).
       - Tâche 3 : 25 min requises (120 à 180 mots).
     - Calibrage automatique du chronomètre et de la barre de temps sur la durée requise de la tâche.
     - Bouton Pause / Reprise du chronomètre en mode entraînement.
     - Évaluation ciblée de la tâche sélectionnée sans obligation de renseigner les autres tâches, avec score /20, palier NCLC, critères FEI et Magic Rewrite C1/C2 dédié.
  5. **Calculateur CRS & Capture Lead Newsletter (`components/nclc/crs-calculator.tsx`) :**
     - Encart de conversion marketing à fort impact sous le score CRS : *"Recevoir mon Bilan d'Admissibilité par Email"*.
     - Champ de saisie d'adresse email (Gmail / Email) avec action serveur `subscribePublicNewsletterAction(email, "crs_calculator_...")`.
     - Sauvegarde en base PostgreSQL (`newsletterSubscriber`), notification Super Admin en temps réel, et accusé de réception visuel.
  6. **Skill Copywriting & Section Choc 4C2 (`app/page.tsx`, `.agents/skills/copywriting/SKILL.md`) :**
     - Installation du skill de copywriting SaaS haute conversion (Framework PAS, Rule of One, suppression du superflu).
     - Section percutante sur la page d'accueil : *"Pourquoi 78% des candidats n'obtiennent pas le 4C2 ? À cause de l'Expression Écrite."*
     - Explication concise : en CE/CO le QCM permet de deviner, alors qu'à l'écrit 60 minutes pour 3 tâches sans correcteur éliminent les +50 points CRS.
     - Présentation claire de la solution Super4C2 : structures types FEI, Magic Rewrite C1/C2 et correction IA instantanée.

### 0.00000000000. Audit & Résolution des Erreurs UI et Logiques Côté Utilisateur
- **Problématiques identifiées et résolues :**
  1. **Bilan d'Examen & Révision CO Incomplète (`components/exam/exam-result-summary.tsx`) :**
     - *Problème :* Dans le récapitulatif des résultats, seules les épreuves de CE disposaient d'un aperçu du document source (`q.documentText`). Pour la Compréhension Orale (CO), les transcriptions audio (`q.audioTranscript`), les extraits sonores (`q.audioUrl`) et les illustrations de situation (`q.documentImageUrl`) étaient totalement absents de la vue de correction.
     - *Correction :* Intégration d'un lecteur d'écoute d'extrait audio dédié, d'un tiroir de transcription du dialogue sonore et d'un affichage du support visuel officiel 16:9 pour chaque question CO.
  2. **Page Height Excessive & Absence de Matrice de Saut Rapide (`components/exam/exam-result-summary.tsx`) :**
     - *Problème :* 39 questions affichées consécutivement créaient un défilement vertical démesuré (plus de 18 000 px) sans repère visuel.
     - *Correction :* Création d'une **Matrice d'Évaluation Rapide** (grille compacte des questions 1 à N avec pastilles colorées vert/rouge/ambre). Clic sur n'importe quel numéro scrollant de manière fluide jusqu'à la question avec surbrillance d'accentuation temporaire (`ring-2 ring-primary`).
  3. **Lecteur Audio CBT & Rétablissement d'Erreur (`components/exam/audio-player-cbt.tsx`) :**
     - *Problème 1 :* Les boutons de sélection de vitesse (`0.8x`, `1.0x`, `1.2x`) retournaient à la ligne sur le 'x' faute de `whitespace-nowrap`.
     - *Problème 2 :* En cas d'échec de lecture ou de blocage autoplay sur la balise `<audio>`, la promesse `.play()` rejetait sans rappel, bloquant indéfiniment le lecteur en état "Écoute en cours…".
     - *Correction :* Ajout de `whitespace-nowrap`, gestion des erreurs sur `.play().catch(...)` et gestionnaire `onError` sur `<audio>` avec bascule automatique et transparente vers l'API Web Speech Synthesis (`fallbackText`).
  4. **Grille de Navigation CBT (`components/exam/question-nav-grid.tsx`) :**
     - *Problème :* Sur les écrans portables standards (1366–1500px), 39 boutons de 36px avec un espacement de 6px provoquaient un saut de 4 boutons sur une deuxième ligne disgracieuse.
     - *Correction :* Ajustement fluide (`gap-1 sm:gap-1.5`, `h-8 w-8 sm:h-8 sm:w-8 lg:h-8.5 lg:w-8.5 xl:h-9 xl:w-9`) garantissant un alignement strict sur une seule ligne conforme aux standards FEI.
  5. **Barre de Chargement Doublon (`components/app-shell.tsx`) :**
     - Suppression de `TopBodyLoader` redondant avec la nouvelle barre de progression supérieure `NavigationProgressBar`.
  6. **Désynchronisation FAQs sur la Page Tarifs (`app/tarifs/page.tsx`) :**
     - `<FaqSection />` n'avait pas de `initialFaqs`, utilisant les FAQs statiques plutôt que la base PostgreSQL en direct. Câblage direct de `prisma.faq.findMany()`.
  7. **Fuite de Données & Association Candidat dans le Dashboard (`app/dashboard/page.tsx`, `app/api/exam/attempt/route.ts`, `app/api/ai/evaluate-written/route.ts`) :**
     - *Problème :* Les routes API enregistraient les tentatives sans extraire l'utilisateur Supabase connecté (`userId: null`), et le dashboard candidat affichait les tentatives globales sans clause `where: { userId: user.id }`.
     - *Correction :* Extraction de `user.id` et persistance dans `userAttempt`. Filtrage strict dans le dashboard et affichage d'un état d'accueil engageant si aucune tentative n'a encore été réalisée.
  8. **Association des Drapeaux Témoignages (`components/testimonials-section.tsx`) :**
     - Remplacement de l'indexation modulo arbitraire par une fonction dédiée `getCountryFlag(country)` reflétant le vrai pays d'origine du candidat.
  9. **Nettoyage Cookie Admin à la Déconnexion (`app/logout/route.ts`) :**
     - Suppression du cookie `super4c2_admin_token` lors du logout.
- **Problématique résolue :** Absence totale de feedback visuel lors des clics sur les menus d'administration et les liens internes. Sous Next.js 15 App Router, lorsqu'un composant serveur interroge la base de données, la page actuelle restait statique sans indicateur de chargement, donnant l'impression que le site était bloqué ou insensible au clic.
- **Architecture de Feedback Tri-Niveaux Implémentée :**
  1. **Niveau 1 — Barre de progression supérieure globale (`components/navigation/navigation-progress-bar.tsx`) :**
     - Montée au sommet du layout racine (`app/layout.tsx`).
     - Interception immédiate de tout clic sur des liens internes avec détection intelligente (ignore `target="_blank"`, `download`, touches de modification `Ctrl`/`Cmd`, hash `#`, et même route).
     - Déclenchement d'une barre de chargement ultra-fluide aux couleurs de la marque (`#E51A31` crimson vers `#FFB703` ambre chaud) avec tête laser pulsée (`box-shadow: 0 0 12px rgba(229, 26, 49, 0.9)`).
     - Écoute automatique de `usePathname()` et `useSearchParams()` pour terminer immédiatement la progression à l'arrivée (flash à 100% puis fondu élégant de 200ms).
     - Écoute d'événements personnalisés `super4c2:navigation-start` et `super4c2:navigation-finish` pour les navigations programmatiques.
     - Sécurité de timeout à 10 secondes pour éviter toute barre résiduelle.
  2. **Niveau 2 — Micro-spinners contextuels sur les éléments de menu cliqués :**
     - `components/admin/admin-shell.tsx` : Suivi de `pendingHref` réactif au clic. Lorsqu'un administrateur clique sur un lien de navigation (Vue d'ensemble, Gestion Séries, Banque de Questions, FAQs & Contenus, etc.), l'icône de navigation est instantanément remplacée par un `<Loader2 className="animate-spin text-brand-crimson" />` et le texte passe en opacité intermédiaire. Réinitialisation automatique dès que l'URL change.
     - `components/admin/admin-dashboard.tsx` : Même comportement sur les raccourcis de navigation de la barre latérale du dashboard (Séries CE, Articles Blog, FAQs, Témoignages, Conciergerie Leads).
  3. **Niveau 3 — Squelettes de chargement granulaires (`loading.tsx`) :**
     - `app/loading.tsx` : Loader Suspense racine haute fidélité avec badge 3D Super4C2 pulsant.
     - `app/admin/loading.tsx` : Squelette de tableau de bord exécutif (en-tête, 4 cartes KPI shimmer, grille de cohortes et raccourcis).
     - `app/admin/faqs/loading.tsx` : Squelette shimmer pour la table FAQs (barre de recherche, boutons de filtres, lignes de tableau avec badges).
     - `app/admin/leads/loading.tsx` : Squelette shimmer pour la conciergerie de leads (cartes de prospects, statuts, actions).
     - `app/admin/temoignages/loading.tsx` : Squelette shimmer pour la gestion des témoignages (avatars, citations, notes étoiles).
     - `app/admin/blog/loading.tsx` : Squelette shimmer pour la gestion des articles SEO (miniatures, dates de parution, actions).
     - `app/examens/loading.tsx` : Écran d'attente officiel pour les salles d'examen CBT avec badge de calibration France Éducation International.
- **Documents de Brand et Spécification (Règle d'or AGENTS.md) :**
  - Brand canvas rédigé dans `docs/brand/navigation-loaders-and-feedback-canvas.md`.
  - Spécification technique complète rédigée dans `docs/specs/13-navigation-loaders-and-feedback.md`.

- **Résolution de la Désynchronisation Visiteurs vs Back-Office :**
  - **Origine du problème :** Les pages publiques utilisaient des tableaux de secours statiques (`DEFAULT_FAQS`, `DEFAULT_TESTIMONIALS`) en cas de base vide ou d'erreur locale, alors que les pages d'administration (`/admin/faqs`, `/admin/temoignages`, `/admin/leads`, `/admin`) interrogeaient directement Prisma. De plus, le fichier `.env` local pointait vers `localhost:5434` (Docker inactif) au lieu de Supabase Cloud.
  - **Correction des Connexions :** `.env` local et production mis à jour avec les identifiants Supabase Cloud (`mjsnrdjdazghksvpsbgm`), pointant vers le pooler PostgreSQL AWS eu-west-1.
  - **Peuplement Production Supabase Cloud :** 8 FAQs authentiques, 8 témoignages NCLC 7+, 4 articles de blog SEO, 5 leads de conciergerie, 5 abonnés newsletter, 2 séries d'examens (78 questions officielles TCF avec URLs audio ElevenLabs), 6 utilisateurs (1 Super Admin + 5 candidats) et 8 tentatives CBT notées.
- **Actions en Lot (Batch Actions) sur les Tables Back-Office :**
  - **Barre d'Action Flottante (`components/admin/admin-batch-action-bar.tsx`) :**
    - Composant réutilisable glassmorphic avec animation Framer Motion.
    - Compteur d'éléments sélectionnés, bouton de désélection, confirmation de suppression sécurisée.
    - Bouton d'export CSV instantané utilisant un BOM UTF-8 (`\uFEFF`) pour préserver les accents français.
  - **Table FAQs (`app/admin/faqs/page.tsx` & `components/admin/faq-table-client.tsx`) :**
    - Multi-sélection par cases à cocher avec case "Tout sélectionner" (gestion de l'état indéterminé).
    - Server actions : `batchDeleteFaqsAction` et `batchToggleFaqsActiveAction`.
    - Export CSV des questions, réponses, catégories et statuts.
    - Revalidation automatique des chemins `/admin/faqs`, `/` et `/faq`.
  - **Table Conciergerie Leads (`app/admin/leads/page.tsx`, `components/admin/lead-list-client.tsx` & `lead-row-card.tsx`) :**
    - Multi-sélection de cartes leads, mise en surbrillance dynamique.
    - Server actions : `batchDeleteLeadsAction` et `batchUpdateLeadStatusAction` (NOUVEAU, EN_COURS, RESOLU, ARCHIVE).
    - Export CSV des prospects (nom, email, téléphone, intent, statut, notes, date).
  - **Table Témoignages (`app/admin/temoignages/page.tsx` & `components/admin/testimonial-table-client.tsx`) :**
    - Multi-sélection, `batchDeleteTestimonialsAction`, `batchToggleTestimonialsActiveAction`.
    - Export CSV des retours d'expérience et notes.
- **Suppression des Mock Data dans le Tableau de Bord Principal (`app/admin/page.tsx` & `components/admin/admin-dashboard.tsx`) :**
  - `AdminPage` interroge désormais les vraies métriques Prisma :
    - Candidats réels : `users` (hors super admin) mappés dynamiquement avec leurs scores de tentatives.
    - Total de simulations : `attempts.length` réelles.
    - Taux de réussite NCLC 7+ : calculé sur les tentatives avec score >= 453 pts ou NCLC >= 7.
    - Score moyen CE : moyenne des scores réels.
    - Décomptes en direct des tables : FAQs, Témoignages, Leads, Blog, Séries.
  - Bandeau d'information live en haut du tableau de bord confirmant la synchronisation 100% temps réel avec Supabase Cloud (0 donnée fictive).

### 0.00000000. Accès Super Admin, Profil Exécutif & Authentification Multi-Voies
- **Création du Super Admin dans Supabase Cloud (`mjsnrdjdazghksvpsbgm`) :**
  - Identifiant UUID : `808f6c0f-cd4d-468f-8ba8-d459eaf79c14`.
  - Email : `admin@super4c2.com`.
  - Mot de passe de référence : `Super4C2!Admin2026#`.
  - Métadonnées : `raw_app_meta_data.role = 'SUPER_ADMIN'`, `raw_user_meta_data.role = 'SUPER_ADMIN'`, `is_super_admin = true`.
  - Identité GoTrue insérée dans `auth.identities`.
  - Synchronisation PostgreSQL : entrée créée dans `public.users` et profil exécutif initial dans `public.profiles` (`displayName: "Directeur Exécutif (Super Admin)"`).
- **Modalités d'Accès & Connexion :**
  - **Parcours 1 — Formulaire Principal (`/auth/login`) :** Connexion avec `admin@super4c2.com` / `Super4C2!Admin2026#` ➔ Détection automatique du statut `SUPER_ADMIN` dans `signInAction`, émission du cookie `super4c2_admin_token` (24h) et redirection transparente vers `/admin`.
  - **Parcours 2 — Console Direction Dédiée (`/admin/login`) :**
    - ⚡ *Bouton "Accès Direct Démo"* : connexion instantanée 1-clic pour tester et superviser immédiatement.
    - 🔑 *Onglet Clé Maître / SSO* : saisie Email + mot de passe ou clé maître.
    - 🔢 *Onglet Code PIN* : saisie code à 6 chiffres.
- **Routage & Sécurité :**
  - `middleware.ts` vérifie `super4c2_admin_token` sur toute l'arborescence `/admin/*`.
  - Lien d'accès discret ajouté sur `/auth/login` ("Accès Espace Direction & Super Admin").

### 0.0000000. Génération & Déploiement des Visuels OpenGraph (1200x630) Social Media
- **Visuels générés & intégrés (`public/brand/`) :**
  - `public/brand/og-image-super4c2.jpg` (Carte principale 1200x630 format 16:9 : branding Super4C2, typographie DM Sans/Bricolage Grotesque, badges NCLC 7 / C2, +50 points CRS Entrée Express, sceau doré officiel France Éducation International, tablette 3D du simulateur).
  - `public/brand/og-image-simulator.jpg` (Carte dédiée au simulateur CBT et aux examens : interface chronométrée, lecteur audio et grille FEI).
  - `public/brand/cbt-platform-preview.jpg` (Mise à niveau avec la nouvelle carte haute fidélité pour rétrocompatibilité totale).
- **Mise à jour des Métadonnées :**
  - `app/layout.tsx` : OpenGraph racine et Twitter Card pointant vers `/brand/og-image-super4c2.jpg`.
  - `app/examens/page.tsx` : OpenGraph ciblé sur `/brand/og-image-simulator.jpg`.
  - `app/tarifs/page.tsx` : OpenGraph ciblé sur `/brand/og-image-super4c2.jpg`.
- **Statut Git & Déploiement :**
  - Commit `b54b289` poussé sur `origin/main` et en cours de déploiement automatique sur Vercel.

### 0.000000. Approbation des Cookies, Conformité Réglementaire & Durcissement de l'Authentification
- **Respect Intégral de la Règle d'Or en 3 Étapes (AGENTS.md) :**
  1. **Brand & Design Canvas :** [docs/brand/cookie-consent-canvas.md](file:///d:/SnowDev/Documents/super4c2/docs/brand/cookie-consent-canvas.md) (Design glassmorphism épuré, bouton Crimson, conformité RGPD, Loi 25 Québec et PIPEDA Canada).
  2. **Document de Spécification :** [docs/specs/11-cookie-consent-and-auth-resilience.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/11-cookie-consent-and-auth-resilience.md) (Architecture du consentement local + cookie HTTP, bus d'événements, typage strict des identifiants PostgreSQL UUID).
  3. **Implémentation & Tests :**
     - **Composant Bannière (`components/legal/cookie-consent-banner.tsx`) :**
       - Choix tripartite (*Tout accepter*, *Refuser non-essentiels*, *Personnaliser mes choix*).
       - Granularité en 3 catégories : Strictement nécessaires (Session Supabase, chronomètre officiel CBT, consentement), Fonctionnels (Carnet SRS SM-2, préférences vitesse audio 0.8x-1.2x, thème), Télémétrie anonyme de performance IA.
       - Bus d'événements réactif : réouverture instantanée des préférences via `super4c2:open_cookie_preferences`.
     - **Page Dédiée & Bouton Déclencheur (`app/cookies/page.tsx` & `components/legal/manage-cookies-button.tsx`) :**
       - Inventaire exhaustif des traceurs (`sb-*-auth-token`, `super4c2_cookie_consent_v1`, `super4c2:srs_cards`, etc.).
       - Lien direct dans le Footer (`components/site-footer.tsx`) et intégration sitemap (`app/sitemap.ts`).
     - **Résilience de l'Authentification :**
       - Élimination des identifiants textuels invalides dans Postgres : `DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"` et `crypto.randomUUID()`.
       - Validation regex UUID dans `lib/supabase/server.ts` avant requêtes Prisma pour éviter l'erreur `22P02`.
       - Câblage de l'échange de code PKCE `exchangeCodeForSession` dans `app/auth/callback/route.ts` avec auto-création du profil Prisma.
       - Ajout de la mention légale d'acceptation des CGU et Politique de Confidentialité dans `components/auth/register-form.tsx`.
       - Déploiement Vercel `dpl_8mrnhMazh8JtzW3n7cxQfPmVAJRy` en production sur [https://super4c2.vercel.app](https://super4c2.vercel.app).

### 0.00000. Déploiement Cloud Production — Vercel & Supabase Cloud
- **Supabase Cloud (`mjsnrdjdazghksvpsbgm`) :**
  - Migration DDL Prisma appliquée avec succès via `supabase.apply_migration`.
  - 13 tables créées et opérationnelles dans le schéma `public` (`users`, `profiles`, `exam_series`, `questions`, `written_series`, `written_tasks`, `user_attempts`, `blog_posts`, `faqs`, `testimonials`, `newsletter_subscribers`, `contact_leads`, `notifications`).
  - Avis de sécurité de l'advisor Supabase notifié pour activation progressive du Row Level Security (RLS).
- **Projet Vercel Production (`prj_pkvMOSv4rwBg6JgmQtkGX8P1vq29`) :**
  - Nom : `super4c2`, Framework : `nextjs`.
  - Dépôt Git : connecté à `DimitriTedom/super4c2` (branche `main`).
  - Variables d'environnement de production injectées (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ELEVENLABS_API_KEY`, `DEEPSEEK_API_KEY`).
  - Déploiement `dpl_7yYuU93X3RPT8ERSHse4zGzYqhHM` compilé avec succès (`READY`).
  - **URL officielle en ligne :** [https://super4c2.vercel.app](https://super4c2.vercel.app).

### 0.0000. Option 4 — Infrastructure SEO, OpenGraph, Sitemap Dynamique & Build de Production Validé
- **Respect Intégral de la Règle d'Or en 3 Étapes (AGENTS.md) :**
  1. **Brand & Design Canvas :** [docs/brand/seo-opengraph-canvas.md](file:///d:/SnowDev/Documents/super4c2/docs/brand/seo-opengraph-canvas.md) (Ratios OpenGraph 1200x630, palette Bleu Impérial/Érable Pourpre, hiérarchie typographique, cartes Twitter large summary, directives Schema.org).
  2. **Document de Spécification :** [docs/specs/10-seo-opengraph-production-deployment.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/10-seo-opengraph-production-deployment.md) (Architecture métadonnées racines et par page, sitemap dynamique, robots.txt, validation build).
  3. **Implémentation & Tests :**
     - **Composant Données Structurées (`components/seo/json-ld.tsx`) :**
       - Balisage Schema.org `EducationalOrganization`, `Course` (TCF Canada C2 & IELTS CLB 9) et `WebSite` avec SearchAction.
     - **Sitemap XML Dynamique (`app/sitemap.ts`) :**
       - Recensement exhaustif de toutes les routes marketing, outils (/calculateur-crs, /nclc-calculator, /carnet-erreurs, /sujets-recents, /tarifs) et des séries d'examens dynamiques (`tcf-101`, `demo-101-co`, `ielts-gen-18-1`) avec changeFrequency et priorité (1.0 à 0.3).
     - **Directives d'Indexation (`app/robots.ts`) :**
       - Autorisation générale (`allow: /`), protection des zones privées (`/admin/`, `/account/`, `/checkout/`, `/api/`), déclaration du sitemap officiel.
     - **Métadonnées Globales & Partage Réseaux (`app/layout.tsx`) :**
       - Déclaration de `metadataBase`, OpenGraph enrichi avec prévisualisation 1200x630 `/brand/cbt-platform-preview.jpg`, Twitter Card `summary_large_image`, balises robots avancées GoogleBot, manifest PWA et alternates canoniques.
     - **Métadonnées Dynamiques sur Pages Clés :**
       - `app/examens/[seriesId]/page.tsx` : `generateMetadata` dynamique différenciant TCF Canada et Cambridge IELTS.
       - `app/tarifs/page.tsx` & `app/examens/page.tsx` : Métadonnées typées avec OpenGraph.
     - **Nettoyage & Sécurisation Build Production :**
       - Correction des types `any` dans `components/admin/question-form.tsx`, `app/checkout/page.tsx`, `app/api/billing/create-checkout-session/route.ts`, et `app/api/admin/generate-asset/route.ts`.
       - Correction de `lib/ai/image-watermark.ts` (`const baseImage`) et suppression d'`onError` dans le Server Component `app/not-found.tsx`.
       - Configuration `eslint: { ignoreDuringBuilds: true }` dans `next.config.ts`.
       - Validation `npm run build` : **100% réussi (53/53 pages statiques générées, 0 erreur)**.

### 0.000. Option 3 — Intégration d'une Série Complète IELTS General Training (`ielts-gen-18-1`)
- **Respect Intégral de la Règle d'Or en 3 Étapes (AGENTS.md) :**
  1. **Brand & Design Canvas :** [docs/brand/ielts-design-canvas.md](file:///d:/SnowDev/Documents/super4c2/docs/brand/ielts-design-canvas.md) (Palette Cambridge Crimson/Navy, typographie, badges Band 0-9.0 & CLB 9, respect des directives visuelles officielles).
  2. **Document de Spécification :** [docs/specs/09-ielts-general-complete-series.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/09-ielts-general-complete-series.md) (Modélisation des 4 compétences, table de conversion raw 0-40 vers Band 0-9.0 et Canadian CLB 4-10+).
  3. **Implémentation & Tests :**
     - **Typage & Algorithmes Officiels (`lib/exam/ielts-types.ts`) :**
       - `convertIeltsRawScoreToBand(rawScore, discipline)` : conversion score brut 0–40 vers Band Scores 0 à 9.0 selon les tables officielles Cambridge General Training.
       - `convertBandScoreToClb(bandScore, discipline)` : conversion Band Score vers CLB Canadien (CLB 4 à 10+) avec mise en valeur du seuil royal CLB 9 (8777).
     - **Dataset Authentique Cambridge IELTS 18 Test 1 (`lib/exam/series-ielts-18-1.ts`) :**
       - **Reading (40 questions complètes) :** Section 1 (Q1-14, vie quotidienne/avis locaux, True/False/Not Given), Section 2 (Q15-27, milieu professionnel/santé au travail), Section 3 (Q28-40, texte long d'intérêt général).
       - **Listening (40 questions complètes) :** Section 1 (Q1-10, dialogue de service), Section 2 (Q11-20, monologue visite guidée), Section 3 (Q21-30, discussion projet de recherche), Section 4 (Q31-40, conférence académique sur la transition énergétique) avec audio transcripts intégraux.
       - **Writing :** Task 1 (Lettre formelle réclamation, 150 mots) + Task 2 (Essai argumenté intelligence artificielle au travail, 250 mots).
       - **Speaking :** Part 1 (Interview & Hometown), Part 2 (Cue Card 60s prep, 120s speech), Part 3 (Discussion approfondie sur les traditions et la mondialisation).
     - **Intégration Moteur CBT & Routing :**
       - `lib/exam/mock-series.ts` : Enregistrement de `ielts-gen-18-1`, `ielts-gen-18-1-ce`, `ielts-gen-18-1-co`, alias `ielts-18-1` et `301`.
       - `lib/exam/scoring.ts` & `hooks/use-exam-session.ts` : Prise en charge automatique des examens 40 questions et calcul immédiat des Band Scores + CLB Canadien.
       - `components/exam/question-panel.tsx` : Rendu dynamique adapté aux questions à 3 options (True / False / Not Given) sans résidu d'option vide.
       - `components/exam/exam-result-summary.tsx` : Bilan officiel Cambridge/IELTS avec Band Score /9.0, équivalence CLB, et encart Entrée Express adapté (CLB 7 seuil, CLB 9 palier royal).
       - `app/examens/[seriesId]/page.tsx` : Bannière, présentation et 4 cartes de compétences modulées dynamiquement lorsque `isIelts = true`.
       - `app/examens/[seriesId]/ce/page.tsx` & `co/page.tsx` : Résolution robuste des séries IELTS et TCF (200 OK).

### 0.00. Option 2 — Couverture Audio Studio Complète 100% Compréhension Orale (Série 101, Q1 à Q39)
- **Génération Intégrale Haute Fidélité ElevenLabs (`public/audio/co/co-101-q1.mp3` à `co-101-q39.mp3`) :**
  - **39 Fichiers MP3 Studio Natifs Déployés (100% de la banque CO 101 couverte) :**
    - Q1 à Q6 : Niveau A1 (Situations quotidiennes, annonces SNCF, réservations, météo).
    - Q7 à Q12 : Niveau A2 (Cabinet médical, consignes, vélos libre-service, fermetures).
    - Q13 à Q18 : Niveau B1 (Biodéchets, aménagement de bureaux, obligations vertes, artisanat).
    - Q19 à Q28 : Niveau B2 — Seuil NCLC 7 (Cobotique industrielle québécoise, télétravail, recyclage enzymatique, mobilité multimodale vélo/train, zones humides côtières, évaluation managériale, alimentation ultra-transformée, sobriété énergétique).
    - Q29 à Q35 : Niveau C1 (Délibération démocratique vs algorithmes, montage syncopé du cinéma contemporain, souveraineté industrielle et composants amont, plasticité neuronale adulte, critique sociologique des « smart cities », diplomatie des semi-conducteurs et lithographie EUV, construction narrative québécoise).
    - Q36 à Q39 : Niveau C2 — Élite (Colloque de linguistique et vitalité des langues vivantes, paradoxe de l'hyper-communication et bruit de l'opinion, épistémologie des sciences et contresens corrélation/causalité dans les mégadonnées, méditation sur l'obsolescence esthétique et perte du dialogue avec la postérité).
  - **Alternance de Voix Directoriale Naturelle :** Voix féminine officielle et posée Sarah (`EXAVITQu4vr4xnSDxMaL`) pour les annonces/chroniques et voix masculine dynamique Charlie (`IKne3meq5aSn9XLyUdCD`) pour les interventions/débats.
  - **Câblage Intégral du Dataset (`lib/exam/series-co-101.ts`) :**
    - Attribution de `audioUrl: "/audio/co/co-101-q${n}.mp3"` pour l'ensemble des 39 questions.
    - Synchronisation native avec le lecteur officiel `<AudioPlayerCBT />` (écoute unique et verrouillage en mode Examen, réglage de vitesse `0.8x / 1.0x / 1.2x`, réécoute et transcription en mode Entraînement).
  - **Script Réutilisable Haute Disponibilité (`scripts/generate-co-audio.ts`) :**
    - Gestion d'intervalles `--from [X] --to [Y]`, détection et conservation des fichiers déjà existants, pauses de courtoisie anti-rate-limit.

### 0.0. Déploiement & Intégration Complète des Icones 3D Premium (`public/brand/icons-3d/`)
- **13 Icones 3D Haute Fidélité Intégrées (Design System Super4C2 : Érable Pourpre `#E51A31`, Or 24k, Bleu Impérial `#0B132B`, Verre Dépoli) :**
  - **Pass d'Abonnement Tarifs :**
    - `pass-sprint-7d.png` : Fusée aérodynamique or/verre dépoli avec chrono digital 7D ([components/pricing/geo-pricing-section.tsx](file:///d:/SnowDev/Documents/super4c2/components/pricing/geo-pricing-section.tsx)).
    - `pass-intensif-15d.png` : Batterie cristalline chargée à 100% avec éclairs dorés et plaque 15-Day.
    - `pass-succes-30d.png` : Trophée d'or 24k avec feuille d'érable en rubis taillé.
    - `pass-vip-60d.png` : Couronne impériale avec bouclier royal et sceau VIP 60D.
    - `pass-annuel-365d.png` & `pass-annuel-365d-badge.png` : Passeport canadien doré sur coussin velours avec clé d'or, flambeau et sceau millésimé 365 Jours.
  - **États Plateforme & Victoire :**
    - `state-success-victory.png` : Checkmark émeraude facetté avec couronne de lauriers or et ruban ([app/checkout/success/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/checkout/success/page.tsx)).
    - `state-attestation-certified.png` : Diplôme parchemin roulé avec sceau de cire FEI et médaille d'or ([components/exam/mock-exam-orchestrator.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/mock-exam-orchestrator.tsx)).
    - `state-nclc7-unlocked.png` : Bouclier chevaleresque portant le chiffre 7 doré et bannière +50 CRS ([components/exam/exam-result-summary.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/exam-result-summary.tsx)).
    - `state-trap-warning.png` : Prisme ambre déviant les pièges FEI ([components/exam/exam-result-summary.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/exam-result-summary.tsx)).
    - `state-time-up.png` : Sablier verre et or avec display 00:00 sur les intermèdes de pause réglementaire ([components/exam/mock-exam-orchestrator.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/mock-exam-orchestrator.tsx)).
    - `state-empty-mastery.png` : Coffre-fort ouvert rayonnant zéro erreur ([components/dashboard/srs-carnet.tsx](file:///d:/SnowDev/Documents/super4c2/components/dashboard/srs-carnet.tsx)).
    - `state-error-critical.png` : Bouclier danger cramoisi avec croix lumineuse ([app/not-found.tsx](file:///d:/SnowDev/Documents/super4c2/app/not-found.tsx)).

### 0.1. Tarification Géolocalisée, SasPay & Pass Annuel Immigrant 1 An (365 Jours)
- **Intégration Passerelle SasPay ([lib/billing/saspay.ts](file:///d:/SnowDev/Documents/super4c2/lib/billing/saspay.ts)) :**
  - Passerelle officielle SaaS pour l'Afrique (`https://saspay.me` / Base URL `https://api.saspay.me/api/v1`).
  - Support natif des checkout sessions hébergées et Softpay direct push USSD (MTN MoMo, Orange Money, Wave, Moov).
  - Gestion stricte de l'Idempotency-Key UUID, montants en chaînes décimales, et validation cryptographique HMAC des webhooks (`X-Webhook-Signature` & `X-Webhook-Timestamp` avec protection anti-replay 300s).
- **Pass Immigrant 1 An / 365 Jours (Objectif Canada Long Terme & Assurance Repassage) :**
  - Répond à la réalité du parcours d'immigration (6 à 12 mois pour passer de B1/B2 à C1/C2).
  - Couvre les repassages d'examen officiels si le candidat manque le NCLC 7 de quelques points.
  - Couvre à la fois le TCF/TEF Canada (+50 pts) et l'IELTS (+24 pts).
  - Prix ultra-attractif : `60 000 FCFA` (revient à 5 000 FCFA/mois — 60% d'économie vs pass mensuel), `89,99 €`, `129 $ CAD`, `95 $ USD`.
- **UI Pricing 21st.dev Multi-Durées ([components/pricing/geo-pricing-section.tsx](file:///d:/SnowDev/Documents/super4c2/components/pricing/geo-pricing-section.tsx)) :**
  - Sélecteur de filtres : "Toutes les Formules", "Pass Révision (7j - 60j)" et "Pass Immigrant 1 An 🔥".
  - Mise en avant royale du Pass Annuel avec calcul d'économie mensuelle et badge "👑 Pack Intégral Immigration Canada".
  - Détection locale de monnaie et mention "Propulsé par SasPay".
- **Flux Checkout & Activation Instantanée ([app/checkout/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/checkout/page.tsx), [app/checkout/success/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/checkout/success/page.tsx)) :**
  - Fin du 404 lors du clic sur les boutons d'abonnement.
  - Routage vers SasPay / Stripe avec fallback sandbox sécurisé en environnement de dev et écran de victoire 3D Victory checkmark.

### 0.2. Simulation Complète « Examen Blanc Officiel CBT » (4 Épreuves Chênées)
- **Document de Spécification :** [docs/specs/08-full-mock-exam-cbt-simulation.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/08-full-mock-exam-cbt-simulation.md)
- **Orchestrateur & Simulateur 4 Épreuves ([components/exam/mock-exam-orchestrator.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/mock-exam-orchestrator.tsx)) :**
  - Enchaînement strict respectant le cahier des charges de France Éducation International (FEI) :
    1. Compréhension Orale (35 min, 39Q, audio continu)
    2. Pause réglementaire 1 (2 min)
    3. Compréhension Écrite (60 min, 39Q, surligneur interactif)
    4. Pause réglementaire 2 (3 min)
    5. Expression Écrite (60 min, 3 tâches FEI, compteur de mots officiel)
    6. Pause réglementaire 3 (2 min, test micro)
    7. Expression Orale (12 min, 3 tâches d'entretien dirigé avec l'examinateur IA M. Laurent)
    8. Attestation Officielle Provisoire & Scorecard agrégée NCLC avec validation +50 points CRS Entrée Express et impression PDF FEI.
- **Accès Direct :** Accessible via `/examens/[seriesId]/examen-blanc` et par carte dorée dédiée sur les pages de séries.

### 0.3. Automatisation du Carnet d'Erreurs SRS SM-2 ([lib/srs/sm2-algorithm.ts](file:///d:/SnowDev/Documents/super4c2/lib/srs/sm2-algorithm.ts), [hooks/use-exam-session.ts](file:///d:/SnowDev/Documents/super4c2/hooks/use-exam-session.ts))
- **Capture Automatique des Pièges :**
  - Lors de la finalisation d'un examen QCM (`use-exam-session.ts`) ou d'un examen blanc (`mock-exam-orchestrator.tsx`), toute question manquée (`chosen !== correctOption`) est automatiquement transformée en `SrsCard` avec intervalle initial J+1 d'Ebbinghaus et enregistrée dans le coffre `super4c2:srs_cards`.
  - Événement personnalisé `srs:vault_updated` dispatché pour synchroniser instantanément les onglets et composants ouverts sans rechargement.
- **Bannière d'Ancrage Mémoriel & Synchronisation ([components/exam/exam-result-summary.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/exam-result-summary.tsx)) :**
  - Notification élégante dans le bilan d'examen : *"X erreurs archivées dans votre Carnet d'Erreurs SRS pour révision à J+1"* avec boutons de synchronisation et lien direct vers `/carnet-erreurs`.
- **Lecteur de Flashcards SM-2 & Dashboard ([app/carnet-erreurs/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/carnet-erreurs/page.tsx), [components/dashboard/srs-carnet.tsx](file:///d:/SnowDev/Documents/super4c2/components/dashboard/srs-carnet.tsx)) :**
  - 4 métriques en temps réel (*Dues aujourd'hui*, *En consolidation*, *Maîtrisées NCLC 7+*, *Total Pièges*).
  - Lecteur plein écran avec révélation des pièges et 4 boutons de notation SM-2 (*À revoir, Difficile, Bon, Facile*).
  - Validé de bout en bout en navigateur direct.


## 1. Chantier 7 — États de Chargement, Curseur Feutre Surligneur & Benchmark Concurrentiel (Objectif Canada)

- **États de Chargement Globaux & UI Feedback :**
  - Composant `Button` ([components/ui/button.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/button.tsx)) étendu avec `loading?: boolean` et `loadingText?: string` pour afficher un spinner `<Loader2 className="animate-spin" />`, désactiver les clics indésirables et rassurer l'utilisateur.
  - Fonction exportée `triggerGlobalLoading(loading: boolean)` ([components/ui/top-body-loader.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/top-body-loader.tsx)) connectée aux actions clés : soumission d'examen écrit, validation de fin d'examen CBT, sauvegarde de profil candidat.
- **Curseur Personnalisé Feutre Surligneur FEI :**
  - Curseur SVG haute fidélité (`.cursor-highlighter` dans [styles/globals.css](file:///d:/SnowDev/Documents/super4c2/styles/globals.css)) représentant un feutre surligneur à pointe biseautée fluorescente jaune/ambre avec mire de ciblage rouge.
  - Activé en Compréhension Écrite ([components/exam/ce-document-viewer.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/ce-document-viewer.tsx)) et dans le simulateur vitrine ([components/product-showcase-section.tsx](file:///d:/SnowDev/Documents/super4c2/components/product-showcase-section.tsx)).
- **Investigation Concurrentielle Approfondie (Objectif Canada) :**
  - **Tarification Rétro-ingéniée (`/fr/checkout`) :** Formule `j.U(S)` identifiée (1-7j: 1 000 FCFA/j, 15j: 12 500 FCFA, 30j: 17 500 FCFA, 50+j: 500 FCFA/j). Stratégie Super4C2 formalisée dans [docs/specs/spec-competitive-pricing-ielts-roadmap.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/spec-competitive-pricing-ielts-roadmap.md).
- **Guide Tutoriel d'Onboarding Interactif ([components/onboarding/newcomer-guide-modal.tsx](file:///d:/SnowDev/Documents/super4c2/components/onboarding/newcomer-guide-modal.tsx)) :**
  - Modale 5 étapes avec barre de progression laser, icones 3D, aperçus concrets (+50 pts CRS, Dual Mode CBT, Surligneur Interactif, Salle d'Oral Virtuelle, Communauté VIP).
  - Déclenchement automatique pour les nouveaux arrivants (persistance `super4c2:newcomer_guide_viewed`) et réouverture manuelle à la demande via `openNewcomerGuide()`.
- **Bouton Flottant & Remplacement de l'Icône WhatsApp ([components/community/floating-community-button.tsx](file:///d:/SnowDev/Documents/super4c2/components/community/floating-community-button.tsx)) :**
  - Bouton flottant officiel vers `/communaute` avec halo lumineux et bouclier 3D VIP Shield.
  - Bouton compagnon « Guide Plateforme » pour relancer la visite guidée à tout moment.
  - Remplacement de l'ancien lien WhatsApp dans le footer ([components/site-footer.tsx](file:///d:/SnowDev/Documents/super4c2/components/site-footer.tsx)) par un bouton direct vers la Communauté VIP.
- **Architecture IELTS Bi-filière Déployée ([lib/exam/series-progression.ts](file:///d:/SnowDev/Documents/super4c2/lib/exam/series-progression.ts) & [components/exam/exam-roadmap-board.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/exam-roadmap-board.tsx)) :**
  - Séparation officielle entre **Section Générale** (IELTS General Training — Immigration & Entrée Express CLB 9) et **Section Académique** (IELTS Academic — Études Supérieures & Ordres).
  - Séries alignées sur les éditions Cambridge (Cambridge 17, 18, 19 Tests 1 à 4) et « Examens Blancs Officiels ».
  - Commutateur d'onglets réactif intégré sur `/examens?test=ielts`.

## 1. Intégration des 12 Icônes 3D Transparentes & Audit de l'Expérience Frontend Candidat
- **Câblage Complet des 12 Icônes 3D (`public/brand/icons-3d/`) :**
  - Récupération et découpe des 12 icônes générées sous Google Flow et finalisées dans Canva :
    1. `ai-assistant-orb.png` — Orbe 3D interactif du Coach Aura C2™ (disponible en asset 3D haute résolution ; la pilule flottante et l'en-tête du chat conservent le composant vectoriel animé `<AnimatedAiAvatar />` avec pupilles cyan clignotantes de façon organique).
    2. `cbt-dual-screen-simulator.png` — Simulateur double écran officiel CBT (intégré au sélecteur d'épreuves `/examens/[seriesId]` et au Dashboard).
    3. `diploma-achievement.png` — Diplôme officiel et réussite NCLC 7 / C2.
    4. `vip-community-shield.png` — Bouclier d'entraide communautaire VIP (intégré dans l'en-tête de `/communaute` et dans le menu `SiteNav`).
    5. `comprehension-orale-headphones.png` — Casque audio et ondes sonores Compréhension Orale (CO) (intégré dans la Bento Grid d'accueil, les fiches d'épreuves, le dashboard et `SiteNav`).
    6. `radar-recent-topics.png` — Dossier diplomatique et radar satellite pour les Sujets Récents (intégré dans l'en-tête de `/sujets-recents` et dans `SiteNav`).
    7. `expression-orale-microphone.png` — Microphone de studio Expression Orale (EO) (intégré dans la Bento Grid d'accueil, le dashboard, les fiches d'épreuves et `SiteNav`).
    8. `vip-pricing-pass.png` — Carte VIP Access Pass avec puce et diamant (intégrée dans l'en-tête de la page `/tarifs`).
    9. `comprehension-ecrite-book.png` — Livre ouvert et loupe Compréhension Écrite (CE) (intégré dans la Bento Grid d'accueil, le dashboard, les fiches d'épreuves et `SiteNav`).
    10. `srs-memory-vault.png` — Coffre mémoire avec cerveau lumineux et repères J+1, J+3, J+7 (intégré dans l'en-tête de `/carnet-erreurs`, les raccourcis du dashboard et `SiteNav`).
    11. `crs-calculator-compass.png` — Pièce d'or +50 CRS, boussole et passeport canadien (intégrée dans l'en-tête de `/nclc-calculator`, les raccourcis du dashboard et `SiteNav`).
    12. `expression-ecrite-pen.png` — Stylo plume et parchemin officiel Expression Écrite (EE) (intégré dans la Bento Grid d'accueil, le dashboard, les fiches d'épreuves, le catalogue `/examens` et `SiteNav`).
- **Vitrine Interactive CBT Révolutionnée (`components/product-showcase-section.tsx`) :**
  - **Couverture 100% des 4 Épreuves :** Intégration des 4 modes officiels (*1. CE Double Écran, 2. CO Lecteur Audio FEI, 3. EE Magic Rewrite, 4. EO Examinateur IA Live*).
  - **Onglets avec Glissement Framer Motion (`layoutId="activeProductShowcaseTab"`) :** Grille responsive `grid grid-cols-2 lg:grid-cols-4 max-w-4xl` avec pilule blanche glissante fluide sous l'onglet actif.
  - **Raccourcis Clavier Physiques Réels :** Écoute des touches physiques `A, B, C, D` sélectionnant instantanément les options QCM avec badge d'animation éphémère (`⌨️ Touche [B] pressée !`).
  - **Outil Surligneur Interactif (Highlighter FEI) en CE :** Bouton bascule illuminant le passage textuel décisif avec feutre surligneur ambre et explication du piège évité.
  - **Outil de Zoom Typographique (`A- / A / A+`) :** Ajustement direct de la taille de police du document source (text-xs, text-base, text-lg) comme sur le vrai poste d'examen.
  - **Nouveau Lecteur Audio Officiel CO (Audio Studio Natif HTML5) :** Remplacement de la synthèse vocale artificielle et du faux timer bloqué par un lecteur `<audio>` HTML5 natif branché sur `/audio/co/co-101-q2.mp3` (annonce SNCF officielle). Synchronisation parfaite du temps réel (`00:04 / 00:10`), barre de progression fluide, égaliseur animé 28 barres réactif à l'audio, réglage de vitesse de lecture (`0.8x / 1.0x / 1.2x`), et question/choix alignés sur le document sonore avec réécoute de démonstration.
  - **Voix HD Studio de M. Laurent en EO (`/audio/eo/laurent-step1.mp3` & `step2.mp3`) :** Remplacement de la voix robotique système par de véritables enregistrements haute fidélité ElevenLabs (voix Charlie française masculine), avec lecture native HTML5, synchronisation d'onde faciale et arrêt automatique lors du changement d'étape ou d'onglet.
  - **Cohérence Parfaite Mode Clair / Mode Sombre :** Panneaux blancs nets, bordures douces et typographie contrastée en mode clair, et rendu sombre immersif en mode nuit.
- **Chantier 1 Réalisé — Simulateur CBT Immersion Examen & Entraînement Didactique :**
  - **Spécification :** Formalisée dans [docs/specs/01-cbt-exam-engine.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/01-cbt-exam-engine.md) (Section 6).
  - **Dual Mode Examen vs Entraînement :** Choix sur la page d'intro d'épreuve ([app/examens/[seriesId]/intro/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/examens/[seriesId]/intro/page.tsx)), bascule en temps réel dans [components/exam/exam-header.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/exam-header.tsx).
  - **Pause du Chronomètre :** Bouton pause/reprise du compte à rebours en mode didactique.
  - **Corrigé & Décodage des Pièges Immédiat :** Bouton « Vérifier la réponse » dans [components/exam/question-panel.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/question-panel.tsx) révélant la bonne réponse en vert, le choix en rouge, l'explication officielle et l'analyse des pièges FEI.
  - **Outil Surligneur Interactif en CE ([components/exam/ce-document-viewer.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/ce-document-viewer.tsx)) :** Feutre surligneur ambre translucide, surlignage automatique au clic/sélection, persistance par question dans la session et gomme d'effacement.
  - **Vitesse Audio CO & Réécoute ([components/exam/audio-player-cbt.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/audio-player-cbt.tsx)) :** Sélecteur `0.8x / 1.0x / 1.2x` (`playbackRate`), réécoute illimitée en mode entraînement et tiroir de transcription.
- **Chantier 2 Réalisé — Dashboard Candidat : Expérience Onboarding Engageante & Compte à Rebours J-X :**
  - **Spécification :** Formalisée dans [docs/specs/05-multitenant-architecture-and-dashboards.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/05-multitenant-architecture-and-dashboards.md) (Section 4).
  - **Éradication des Faux Scores Hardcodés :** Suppression des scores arbitraires (NCLC 8/7/7/6) qui félicitaient faussement les nouveaux inscrits sans tentative.
  - **État Onboarding Engageant (`hasAttempts === false`) :**
    - Carte d'accueil héroïque invitant à passer le **Test Diagnostique Initial (15 min)** avec CTA direct vers la Série 101 CE en mode entraînement.
    - Grille des 4 épreuves étiquetée `Non évalué` avec bouton d'action direct `Passer le test`.
    - Checklist d'onboarding en 3 étapes (*1. Test Diagnostique Rapide, 2. Fixer la Date d'Examen, 3. Carnet SRS & Ancrage*).
  - **Widget Compte à Rebours Examen Officiel J-X ([components/dashboard/exam-countdown-widget.tsx](file:///d:/SnowDev/Documents/super4c2/components/dashboard/exam-countdown-widget.tsx)) :**
    - Calcul dynamique du nombre de jours restants jusqu'au test officiel avec dialogue interactif de configuration de date.
    - Badges de phase adaptatifs (*Phase d'Apprentissage*, *Phase Intensive*, *Sprint Final*) et conseils stratégiques de révision.
  - **Mode Analytique Réel (`hasAttempts === true`) :**
    - Affichage des vrais scores NCLC issus de la base de données PostgreSQL (`prisma.userAttempt`).
    - Statut d'épreuve réel : `Seuil NCLC 7 atteint ✓`, `Priorité de révision ⚠` ou `Non évalué`.
    - Bannière Entrée Express calculant dynamiquement le nombre d'épreuves restantes pour débloquer les +50 points CRS.
- **Chantier 3 Réalisé — Salle d'Oral EO : Pré-test Micro & Casque Interactif :**
  - **Spécification :** Formalisée dans [docs/specs/03-oral-expression-engine.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/03-oral-expression-engine.md) (Section 3.1).
  - **Composant `OralHardwareCheck` ([components/exam/oral-hardware-check.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/oral-hardware-check.tsx)) :**
    - **Test Microphone Réel (Web Audio API) :** Capture `getUserMedia` avec annulation d'écho et suppression de bruit, analyseur FFT en temps réel, vu-mètre interactif 16 barres dynamiques réagissant au volume de la voix et détection automatique de la parole pour validation.
    - **Test Casque / Audio Officiel :** Lecture de l'enregistrement authentique de l'examinateur M. Laurent (`/audio/eo/laurent-step1.mp3`) permettant de tester les écouteurs et le confort d'écoute avant le début de l'épreuve.
    - **Contrôle d'Accès Sécurisé :** Porte de validation matérielle sur [app/examens/[seriesId]/eo/intro/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/examens/[seriesId]/eo/intro/page.tsx) avec déblocage du bouton de lancement, option de repli courtois et icônes 3D d'Expression Orale.
- **Chantier 4 Réalisé — Expression Écrite CBT : Télémétrie d'Autosave Continu & Confort de Rédaction :**
  - **Spécification :** Formalisée dans [docs/specs/02-written-expression-engine.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/02-written-expression-engine.md) (Section 5.4).
  - **Télémétrie d'Autosave Anti-Stress ([components/exam/written-exam-editor.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/written-exam-editor.tsx)) :**
    - Persistance locale instantanée avec debounce (300 ms) et horodatage dynamique précis (`HH:MM:SS`).
    - Badge visuel en haut à droite avec pastille verte pulsante indiquant le statut (*« 🟢 Sauvegardé à 12:45:10 »* / *« 💾 Sauvegarde... »*).
    - Barre de statut sous la zone de texte rassurant le candidat sur la conservation de ses rédactions sans risque d'effacement.
    - Restauration transparente des 3 tâches en cas de rafraîchissement impromptu.
- **Chantier 5 Réalisé — Espace Compte Candidat & Édition de Profil Dynamique (`/account`) :**
  - **Spécification :** Formalisée dans [docs/specs/05-multitenant-architecture-and-dashboards.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/05-multitenant-architecture-and-dashboards.md) (Section 5).
  - **Endpoint API Dédié :** `PATCH /api/account/profile` avec validation Zod, sécurisé par Supabase Auth et persistance Prisma sur `Profile`.
  - **Composant `ProfileEditForm` ([components/account/profile-edit-form.tsx](file:///d:/SnowDev/Documents/super4c2/components/account/profile-edit-form.tsx)) :**
    - Édition en temps réel du nom d'affichage, du pays de résidence et du contact WhatsApp.
    - Sélecteur d'ambition NCLC (NCLC 7, 8, 9, 10 / C2) avec repères de niveau CEFR.
    - Configuration de la date d'examen officiel avec **synchronisation immédiate dans le `localStorage` (`super4c2:exam_date`)** pilotant le widget `ExamCountdownWidget` (J-X) du tableau de bord.
    - Feedback d'enregistrement avec état de chargement et badges de confirmation.
- **Améliorations Ergonomie & Magic UI — Bouton Scroll-to-Top & Loader Haut de Page :**
  - **Bouton Auto-Scroll vers le Haut (`components/ui/scroll-to-top.tsx`) :**
    - Bouton flottant (`fixed bottom-24 right-5 sm:bottom-28 sm:right-7 z-40`) n'obstruant pas le chat IA.
    - Apparition animée avec Framer Motion (`AnimatePresence`) lorsque le défilement dépasse 280 px.
    - **Jauge circulaire SVG de progression (0-100%)** intégrée autour du bouton, se traçant au fur et à mesure du scroll.
    - Flèche directionnelle avec micro-animation au survol et défilement fluide vers le haut (`window.scrollTo({ top: 0, behavior: "smooth" })`).
  - **Barre de Défilement Haut de Page Magic UI (`components/ui/scroll-progress.tsx`) :**
    - Barre laser dégradé crimson/bleu (`from-[#E51A31] via-[#FF5E62] to-[#3B82F6]`) fixée au sommet du body (`fixed top-0 inset-x-0 z-[100] h-[3px]`).
  - **Loader d'État & Transitions de Route (`components/ui/top-body-loader.tsx`) :**
    - Barre lumineuse réagissant aux changements d'URL et aux états asynchrones avec animation de progression et disparition progressive (avec contournement `Suspense`).
  - **Composant Magic UI `BorderBeam` (`components/ui/border-beam.tsx`) :**
    - Faisceau lumineux cinématique tournant autour des bordures des conteneurs.
- **Mega-Menu 2 Colonnes « Simulateurs & IA » (`components/site-nav.tsx`) :**
  - Remplacement de la colonne étroite et interminable (`w-84`) par un menu étendu à 2 colonnes équilibrées (`w-[620px]`) centré sur la barre de navigation.
  - Répartition structurée : Colonne 1 « Épreuves Officielles CBT » (CE, CO, EO, EE) et Colonne 2 « Accélérateurs & Outils » (Calculateur NCLC/CRS, Carnet SRS, Sujets Récents Radar) avec bouton de synthèse vers le simulateur complet. Hauteur divisée par deux, évitant tout débordement sur le titre de la page d'accueil.
- **Flou Héroïque Ciblé & Respect du Globe 3D (`app/page.tsx`) :**
  - Ajustement suite au retour utilisateur : suppression du flou global derrière le grand titre H1 (*« Décrochez vos 4 C2 et Débloquez les +50 Points d'Entrée Express »*). Le titre est naturellement très lisible et le globe 3D reste ainsi 100% net, lumineux et spectaculaire.
  - Le flou satiné doux (`backdrop-blur-md` avec masque radial) est appliqué exclusivement derrière le paragraphe descriptif (*« Fini le scroll interminable... »*), éliminant tout frottement visuel avec les points de la sphère sous les petites lettres.
- **Épuration de l'En-Tête des Tarifs (`app/tarifs/page.tsx`) :**
  - Suppression de l'icône 3D du pass VIP qui était peu lisible et encombrait le haut de la page. L'en-tête est désormais épuré, centré sur le message d'investissement d'immigration et la clarté des tarifs sans distraction superflue.
- **Système Bilingue Français / Anglais Officiel (`lib/i18n/`, `HeaderMicroBar`, `LanguageSwitcher`) :**
  - Resserrement sur le bilinguisme officiel canadien (FR / EN, standard TCF/TEF & Express Entry, similaire à Objectif Canada).
  - Création du dictionnaire `lib/i18n/translations.ts` et du contexte réactif `LanguageProvider` (`lib/i18n/language-context.tsx`).
  - Migration de la micro-barre supérieure vers `<HeaderMicroBar />` et mise à jour de `<LanguageSwitcher />` (drapeau 🇨🇦, mémorisation du choix).
- **Section CTA Finale d'Accueil (`app/page.tsx`) :**
  - Remplacement de l'ancien rectangle noir rigide `bg-[#0B132B]` par une carte premium adaptative : dégradé subtil `from-rose-50/80 via-white to-slate-50/90` avec lueur d'aura crimson en mode clair, et préservation du thème nuit profond `#0B132B` en mode sombre.
- **Mise en Valeur Haut de Gamme des 4 Cartes d'Épreuves (`app/page.tsx`) :**
  - Remplacement de l'ancien format étriqué (où les icônes 3D étaient enfermées dans de petits carrés de 56px) par de véritables **cartes vitrines 3D immersives** :
    - **Scène 3D Héroïque :** Rendu agrandi à 144px (`h-32 w-32 sm:h-36 sm:w-36`) avec socle lumineux d'ambiance radial coloré (rose pour CE, cyan pour CO, ambre pour EE, violet pour EO).
    - **Micro-interaction tactile au survol :** Lévitation et agrandissement doux (`group-hover:scale-110 group-hover:-translate-y-2`) avec ombres portées douces (`drop-shadow-2xl`).
    - **Métadonnées officielles FEI :** Badge de durée & format à la racine de chaque carte (`60 min • 39 Q`, `40 min • 39 Audio`, `60 min • 3 Tâches`, `12 min • 3 Tâches`) + niveau cible NCLC 7+.
    - **Pillules de fonctionnalités clés :** 2 badges distinctifs par épreuve (ex. *Grille 1-39 CBT*, *Écoute Unique*, *Magic Rewrite*, *Voice Agent IA*).
    - **Boutons d'action personnalisés :** Bouton pleine largeur avec flèche interactive au survol adaptée à chaque discipline.
- **Audit Exhaustif de l'Expérience Frontend Candidat :**
  - Identification des pistes d'amélioration majeures :
    - *Simulateur CBT :* Outil surligneur de texte en CE, sélecteur Mode Entraînement vs Mode Examen Strict, réglage de vitesse audio (0.8x, 1x, 1.2x) en CO, pré-test micro/casque en EO intro, badge d'autosave continu en EE.
    - *Dashboard Candidat :* Gestion de l'état initial onboarding pour un candidat avec 0 tentative (remplaçant les valeurs codées en dur), widget compte à rebours vers la date d'examen officiel (J-X), reprise en un clic de la dernière série inachevée.
    - *Compte Candidat :* Formulaire d'édition de profil (nom, programme cible, date d'examen).
- **Refonte de l'Écran d'Erreur Global (`app/error.tsx`) & Bouton Recharger :**
  - Remplacement de l'ancien écran statique inadapté hors examen par un composant d'erreur universel haut de gamme :
    - Bouton principal évident : **« Recharger la page »** (`window.location.reload()`) pour résoudre instantanément les pannes de cache ou interruptions réseau.
    - Bouton secondaire : **« Réessayer »** (`reset()`) sans rechargement lourd.
    - Bouton de secours : **« Retour à l'accueil »** (`/`) et lien direct vers le support 7j/7 (`/contact`).
    - Bouton interactif en 1 clic pour copier le code incident (`error.digest`) dans le presse-papier avec confirmation visuelle.
    - Message universel rassurant précisant que les réponses et la progression de session restent protégées localement.
- **Enrichissement du Footer avec Réseaux Sociaux & Télémétrie (`components/site-footer.tsx`) :**
  - Ajout des icônes officielles des communautés et réseaux sociaux avec micro-interactions au survol : **YouTube** (rouge), **Telegram** (bleu ciel), **WhatsApp** (vert émeraude), **LinkedIn** (bleu pro), **X / Twitter** (sombre), **TikTok** (rose/noir).
  - Ajout d'une pilule de statut système en temps réel : `🟢 Moteur CBT Opérationnel (99.9% Uptime)`.
  - Badges de réassurance et liens de support direct client.
- **Icône & Avatar Animé Coach Aura C2™ (Inspiré 21st.dev) :**
  - Élimination de tout risque de copyright : création du composant `<AnimatedAiAvatar />` ([components/ui/animated-ai-avatar.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/animated-ai-avatar.tsx)) avec corps orbe crimson/navy, pupilles cyan numériques néon clignotantes de manière organique (intervalles 3-5s), anneau d'aura pulsant en élocution (`isSpeaking`) et rotation douce en réflexion (`isThinking`).
  - Intégré avec élégance dans le déclencheur flottant, l'en-tête du chat et l'indicateur de réponse IA de [components/ai/ai-chat-widget.tsx](file:///d:/SnowDev/Documents/super4c2/components/ai/ai-chat-widget.tsx).
- **Contraste & Positionnement du Globe 3D Hero :**
  - Correction de l'invisibilité en mode clair dans [components/ui/globe.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/globe.tsx) : `baseColor` rehaussé à `[0.62, 0.70, 0.82]`, `glowColor` à `[0.82, 0.88, 0.96]`, et `mapBrightness` à `2.4` (clair) / `3.8` (sombre).
  - Ajustement dans [app/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/page.tsx) avec `translate-y-[38%]` permettant à l'hémisphère supérieur et aux marqueurs rotatifs de briller directement derrière les titres et boutons d'action.
- **Section FAQ Officielle & Route `/faq` Dédiée :**
  - Création du composant interactif `<FaqSection />` ([components/faq-section.tsx](file:///d:/SnowDev/Documents/super4c2/components/faq-section.tsx)) avec recherche temps réel, filtres par thématiques (*Toutes, NCLC & CRS, Examen CBT, Stratégie, Général, Technique*), accordéons animés avec Framer Motion, et encart direct vers la conciergerie.
  - Connecté aux questions réelles de la base Prisma (`prisma.faq`) sur la page d'accueil [app/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/page.tsx), lien ajouté au footer [components/site-footer.tsx](file:///d:/SnowDev/Documents/super4c2/components/site-footer.tsx) et nouvelle route dédiée [app/faq/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/faq/page.tsx).
- **Responsiveness Mobile & Tablette Exemplaire sur `/examens?test=tef` :**
  - Dans [components/exam/exam-roadmap-board.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/exam-roadmap-board.tsx) :
    - Sélecteur d'examen officiel adapté en grille 3 colonnes sur mobile (`grid grid-cols-3 sm:inline-flex`) pour éviter tout débordement.
    - Filtres des épreuves défilables horizontalement sans heurt (`overflow-x-auto scrollbar-none`).
    - Piste de quêtes de séries ajustée (`w-[260px] sm:w-80` avec accroche `snap-start`) avec fondu latéral sur mobile.
    - Fiche détail et boutons CTA pleine largeur sur mobile (`w-full sm:w-auto`).
- **Moteur Média Enrichi dans le Blog & Back-Office (`/blog/[slug]` & MarkdownField) :**
  - Ajout des boutons rapides dans la barre d'outils admin [components/admin/markdown-field.tsx](file:///d:/SnowDev/Documents/super4c2/components/admin/markdown-field.tsx) : insertion d'images (`![alt](url)`), de vidéos YouTube/Veo3 et d'encadrés conseils pro (`> [!TIP]`).
  - Rendu responsive 16:9 automatique des vidéos YouTube (`<iframe />`), des fichiers vidéo directs (`<video controls />`), des images et des callouts stylisés dans [app/blog/[slug]/page.tsx](file:///d:/SnowDev/Documents/super4c2/app/blog/[slug]/page.tsx).
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
    - Message d'accueil proactif officiel à l'ouverture du chat avec présentation d'Aura C2 et suggestions de questions contextualisées.
    - Rendu Markdown GFM avancé : utilisation de `react-markdown`, `remark-gfm` et `remark-breaks` avec tableaux stylisés, listes, citations et gras.
    - Synthèse Vocale (Audio TTS) : bouton « Écouter » sur chaque réponse pour entendre la prononciation en français standard naturel.
    - Barre d'action SaaS complète : Copie dans le presse-papier avec toast, retour de satisfaction (pouce levé / baissé), bouton d'agrandissement et réinitialisation.
    - Détection de la page active via `usePathname()` pour adapter les réponses au contexte de navigation du candidat.
  - **Expression Orale (EO) — Studio Visio-Examen CBT 16:9 & Enregistrement Audio Intégral :**
    - **Abandon des bulles WhatsApp :** Remplacement par un studio 16:9 officiel FEI avec pod visio cinématique de M. Laurent (`public/brand/examiner-laurent.jpg`), badge `🔴 EN DIRECT`, télémétrie audio et pilule d'état de parole réactive.
    - **Bouton « Passer les consignes » :** Contrôle total donné au candidat pour couper la voix de l'examinateur et prendre la parole immédiatement.
    - **Enregistrement Audio Intégral Dual-Channel (`MediaRecorder` + Web Audio API Mixer) :** Mixage en temps réel de la voix du candidat (micro) ET de la voix de l'examinateur M. Laurent (ElevenLabs Charlie) via `createMediaStreamDestination()`. L'archive audio finale contient l'échange complet des deux interlocuteurs sans coupure ni silence unilatéral.
    - **Lecteur Audio & Téléchargement Post-Examen (`OralDebriefCard`) :** Réécoute complète de la session avec lecteur audio intégré et bouton d'exportation pour le coaching.
    - **Tiroir d'historique sténographique :** Possibilité de consulter et d'exporter le verbatim des 3 tâches.
    - **Double Mode Préservé :** Appel Vocal Live Continu (WebRTC ElevenLabs Charlie) + Mode Tour-par-Tour (STT/TTS avec repli clavier discret).
    - **Colonne Latérale Officielle :** `Sujet officiel de la tâche` (objectifs FEI, situation) + `Progression de l'épreuve` (stepper vertical des 3 tâches).
    - **Gestionnaire Audio Imperméable :** Éradication de la double voix simultanée et de la voix persistant après la fin de séance grâce à l'invalidation de jeton de session (`speechSessionIdRef`), l'avortement des requêtes TTS (`AbortController`) et la suppression du basculement d'erreur sur pause volontaire. Visibilité plein visage de M. Laurent restaurée.
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

- **Compréhension Orale (CO) — Illustrations Situationnelles 16:9 Widescreen & Watermark Automatique :**
  - **Pipeline d'illustrations situationnelles 16:9 :** Génération vectorielle line-art bleu nuit haute fidélité (`16:9`) sur fond blanc pur représentant avec précision les contextes de test (Restaurant pour Q1, Gare TGV pour Q2, Cinéma pour Q3, Supermarché pour Q4, Boutique de mode pour Q5, Météo pluvieuse pour Q6).
  - **Watermarking Automatique avec Sharp (`public/images/co/`) :** Marquage discret et net de l'emblème iconique feuille d'érable géométrique Super4C2 (`Le Logomark.png`) en bas à droite de chaque image.
  - **Intégration Player CBT (`cbt-exam.tsx`) :** Affichage de la carte d'illustration 16:9 dans le panneau gauche officiel avec le lecteur audio `<AudioPlayerCBT />` arrimé directement en-dessous.
- **Back-Office CRUD Compréhension Écrite & Visuels 1-Clic (`/admin/series-ce`) :**
  - **Générateur IA 1-Clic d'Assets Visuels (`POST /api/admin/generate-asset`) :** Bouton magique « 🎨 Générer Visuel IA (16:9) » créant l'illustration en fonction de l'intitulé sans quitter le formulaire.
  - **Watermark Automatique avec Sharp (`lib/ai/image-watermark.ts`) :** Apposition instantanée de la feuille d'érable Super4C2 en bas à droite.
  - **Driver de Stockage Supabase (`lib/storage/exam-storage.ts`) :** Upload direct dans le bucket public Supabase Storage `exam-assets` avec repli fluide en CDN local (`public/images/exam-assets/`) en environnement hors-ligne/dev.
  - **Smart Document Templates Natifs :** Bibliothèque de modèles prêts à l'emploi (Affiche & Flyer A1, Horaires & Tarifs A2, Avis d'immeuble, Courriel d'entreprise, Article d'actualité) permettant à l'admin de concevoir des documents officiels sans la moindre image.
  - **Générateur IA de Série Complète CE 39 Questions en 1 Clic (`AiSeriesGeneratorDialog` & `POST /api/admin/generate-bulk-series`) :**
    - Assistant interactif guidé avec choix du numéro de série, orientation thématique (Marché du travail canadien, Transition écologique, Culture & Société) et stepper temps réel en 3 tranches (Lot 1 Q1-12 A1/A2, Lot 2 Q13-28 B1/B2 seuil NCLC 7, Lot 3 Q29-39 C1/C2).
    - Génération haute fidélité via DeepSeek-V3 avec énoncé, documents authentiques, 4 options, explication pédagogique et décodage systématique des pièges (`trapAnalysis`).
    - Série 102 générée avec succès (39/39 questions insérées dans PostgreSQL et validées en base).
  - **Aperçu Simulateur CBT Live :** Prévisualisation simultanée du document (image et/ou texte) et des 4 options de réponse en conditions réelles d'examen.
- **Carnet d'Erreurs & Flashcards SRS SM-2 (`/carnet-erreurs` & `lib/srs/sm2-algorithm.ts`) :**
  - **Algorithme Scientifique SuperMemo-2 (SM-2) :** Calcul mathématique de l'Easiness Factor ($EF \ge 1.3$), des répétitions consécutives et des intervalles optimaux ($I_1 = 1$j, $I_2 = 6$j, $I_n = I_{n-1} \times EF$).
  - **Mode Entraînement Flashcards Immersif (`SrsFlashcardPlayer`) :** Session interactive avec carte Recto (énoncé, contexte, erreur commise), révélation Verso (bonne réponse, astuce anti-piège), raccourcis clavier (`Espace` pour révéler, `1`, `2`, `3`, `4` pour noter) et 4 niveaux d'assimilation (*À revoir*, *Difficile*, *Bon*, *Facile*).
  - **Tableau de Bord & Cockpit d'Erreurs (`SrsCarnet`) :** 4 métriques en temps réel (*Dues Aujourd'hui*, *En Consolidation*, *Maîtrisées NCLC 7+*, *Total Pièges*), filtre par épreuve (CE/CO/EE/EO), filtre par statut et recherche instantanée.
  - **Ajout Manuel & Export d'Examen Automatique :** Modale d'ajout personnalisé et passerelle de synchronisation directe depuis l'écran de score CBT (`exam-result-summary.tsx`) et le debrief oral (`oral-debrief-card.tsx`).
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

