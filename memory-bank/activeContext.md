# Active Context: Super4C2

## 0. Chantier 7 — États de Chargement, Curseur Feutre Surligneur & Benchmark Concurrentiel (Objectif Canada)
- **États de Chargement Globaux & UI Feedback :**
  - Composant `Button` ([components/ui/button.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/button.tsx)) étendu avec `loading?: boolean` et `loadingText?: string` pour afficher un spinner `<Loader2 className="animate-spin" />`, désactiver les clics indésirables et rassurer l'utilisateur.
  - Fonction exportée `triggerGlobalLoading(loading: boolean)` ([components/ui/top-body-loader.tsx](file:///d:/SnowDev/Documents/super4c2/components/ui/top-body-loader.tsx)) connectée aux actions clés : soumission d'examen écrit, validation de fin d'examen CBT, sauvegarde de profil candidat.
- **Curseur Personnalisé Feutre Surligneur FEI :**
  - Curseur SVG haute fidélité (`.cursor-highlighter` dans [styles/globals.css](file:///d:/SnowDev/Documents/super4c2/styles/globals.css)) représentant un feutre surligneur à pointe biseautée fluorescente jaune/ambre avec mire de ciblage rouge.
  - Activé en Compréhension Écrite ([components/exam/ce-document-viewer.tsx](file:///d:/SnowDev/Documents/super4c2/components/exam/ce-document-viewer.tsx)) et dans le simulateur vitrine ([components/product-showcase-section.tsx](file:///d:/SnowDev/Documents/super4c2/components/product-showcase-section.tsx)).
- **Investigation Concurrentielle Approfondie (Objectif Canada) :**
  - **Tarification Rétro-ingéniée (`/fr/checkout`) :** Formule `j.U(S)` identifiée (1-7j: 1 000 FCFA/j, 15j: 12 500 FCFA, 30j: 17 500 FCFA, 50+j: 500 FCFA/j). Stratégie Super4C2 formalisée dans [docs/specs/spec-competitive-pricing-ielts-roadmap.md](file:///d:/SnowDev/Documents/super4c2/docs/specs/spec-competitive-pricing-ielts-roadmap.md).
  - **Offre IELTS Rétro-ingéniée (`/fr/examen/ielts`) :** Découpage Cambridge (General 11-17 vs Academic 11-19, Tests 1-4) et plan de mise à niveau bi-filière pour Super4C2.
  - **Guide Tutoriel Newcomers :** Spécification de la modale en 5 étapes et redirection vers la Communauté VIP (`/communaute`).

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

