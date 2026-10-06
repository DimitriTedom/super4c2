# 🗺️ Master Product Roadmap & Arborescence des Fonctionnalités : Super4C2

Ce document est la **feuille de route fonctionnelle exhaustive** de Super4C2. Il recense toutes les pages, routes, user flows et fonctionnalités à implémenter, phase par phase.

---

## 1. Arborescence Complète des Routes de l'Application

```
/ (Landing Page Haute Conversion)
├── /tarifs (Offres claires Sprint 15j / Pass 30j / VIP)
├── /nclc-calculator (Simulateur Viral de Points CRS Entrée Express)
├── /test-gratuit (Mini-test diagnostic 15 min - Aimant à prospects)
│
├── /auth/
│   ├── /login (Connexion sécurisée)
│   ├── /register (Création de compte)
│   └── /callback (OAuth Supabase)
│
├── /onboarding (Diagnostic d'objectif, date d'examen & roadmap personnalisée)
│
├── /dashboard (Hub central de l'étudiant : radar NCLC, jauge CRS, plan du jour)
├── /carnet-erreurs (Répétition espacée SRS des questions et pièges ratés)
│
├── /examens/ (Catalogue des séries TCF Canada)
│   └── /[seriesId]/
│       ├── /intro (Consignes officielles & vérification matériel/audio)
│       ├── /ce (Simulateur CBT Compréhension Écrite : 60 min / 39 QCM)
│       ├── /co (Simulateur CBT Compréhension Orale : 40 min / 39 QCM audio)
│       ├── /ee (Atelier Expression Écrite : 60 min / 3 tâches FEI)
│       └── /eo (Salle d'Expression Orale IA : 12 min / Voice Agent WebRTC)
│
├── /resultats/[attemptId]/
│   ├── /synthese (Score global, échelon NCLC 1-10, gain CRS)
│   ├── /correction-qcm (Explications détaillées question par question)
│   ├── /correction-ee (Rapport critères FEI + Magic Rewrite C1/C2)
│   └── /debrief-eo (Analyse audio, fluidité, prononciation & transcription)
│
└── /compte/
    ├── /profil (Informations personnelles & date de passage)
    └── /facturation (Gestion du Pass, crédits IA & factures)
```

---

## 2. Découpage Fonctionnel Écran par Écran

### 🌟 BLOC 1 : Vitrine & Entonnoir d'Acquisition

#### 1. Page d'Accueil (`/`)
* **Composants Magic UI / React Bits :** `InteractiveGridPattern` ou `AnimatedGradientText`, `BentoGrid` des 4 épreuves, `NumberTicker` pour les statistiques de réussite, `Marquee` des témoignages candidats.
* **Fonctionnalités :**
  * Hero impactant avec typographie **Bricolage Grotesque** et CTA clair *"Faire le diagnostic gratuit (15 min)"*.
  * Tableau comparatif interactif : *Super4C2 vs Méthodes Traditionnelles / Objectif Canada* (Instant vs 24h, Vrai CBT vs Scroll 18 000 px, Oral interactif vs Monologue).
  * Démonstrateur en direct du correcteur IA (test d'un paragraphe avec score FEI instantané).

#### 2. Simulateur Viral de Points CRS (`/nclc-calculator`)
* **Fonctionnalités :**
  * Sliders interactifs par épreuve (CE, CO, EE, EO) de NCLC 4 à 10.
  * Calcul en temps réel des points bonus d'Entrée Express (+50 points au palier NCLC 7).
  * Bouton de conversion : *"Garantir mes +50 points avec le programme Super4C2"*.

---

### 🖥️ BLOC 2 : Le Moteur d'Examen CBT Officiel (`/examens/[id]/...`)

#### 3. Compréhension Écrite (`/ce`) & Orale (`/co`)
* **Spécification :** Conforme à `docs/specs/01-cbt-exam-engine.md`.
* **Fonctionnalités :**
  * Écran scindé officiel : Texte/Document à gauche (avec zoom), Question & 4 options A/B/C/D à droite.
  * Lecteur audio CO sans rembobinage avec indicateur visuel de lecture unique.
  * Compte à rebours officiel strict (60 min CE / 40 min CO) non pausable en mode réel.
  * Grille de navigation de 39 pastilles interactives avec état de réponse et drapeau de révision (`Flag for review`).
  * Sauvegarde automatique locale (résistance aux coupures de connexion).

#### 4. Atelier d'Expression Écrite (`/ee`)
* **Fonctionnalités :**
  * Écran scindé avec sujet officiel pour les 3 tâches (Tâche 1 : 60-120 mots, Tâche 2 : 120-150 mots, Tâche 3 : 120-180 mots).
  * Éditeur de texte sans correcteur orthographique intégré (conditions réelles).
  * Compteur de mots en temps réel avec jauge dynamique (Vert dans la fourchette, Orange/Rouge si hors consigne).
  * Soumission en un clic vers le moteur d'évaluation IA FEI.

#### 5. Salle d'Expression Orale IA (`/eo`)
* **Fonctionnalités :**
  * **Tâche 1 (2 min) :** Présentation sans préparation (l'IA pose 2 questions d'amorce).
  * **Tâche 2 (3 min 30 s) :** **Vrai Jeu de Rôle Interactif** (L'agent vocal IA joue le rôle de l'interlocuteur et répond vocalement en direct aux questions du candidat !).
  * **Tâche 3 (4 min 30 s) :** Monologue argumenté suivi d'une contradiction posée par l'IA.
  * Visualisation de la voix (Waveform interactive WaveSurfer / React Bits).

---

### 📊 BLOC 3 : Résultats, Débriefing Pédagogique & Rétention

#### 6. Synthèse d'Examen (`/resultats/[attemptId]`)
* Carte de score TCF (sur 699) + Niveau NCLC officiel (NCLC 4 à 10).
* Calculateur d'impact CRS Canada.
* Badge de réussite exportable ou partageable.

#### 7. Correction Pédagogique Détaillée
* **Pour la Compréhension :** Justification textuelle pour chaque question (*Pourquoi B est vrai, pourquoi A, C et D sont des pièges*) + Transcription synchronisée des audios.
* **Pour l'Écrit (Magic Rewrite) :**
  * Découpe des notes selon les 4 critères officiels FEI.
  * Surlignage couleur des erreurs (grammaire, accords, faux amis).
  * **Version Modèle C1/C2 :** Réécriture complète du texte de l'étudiant avec tournures de haut niveau.
* **Pour l'Oral :**
  * Transcription intégrale du dialogue.
  * Débit de parole (mots/minute) et pauses hésitantes.
  * Grille d'évaluation lexicale et syntaxique.

#### 8. Carnet d'Erreurs Intelligent (`/carnet-erreurs`)
* Algorithme de répétition espacée (SRS) : chaque question ou mot raté réapparaît à intervalles réguliers (J+1, J+3, J+7) jusqu'à maîtrise totale.

---

## 3. Feuille de Route d'Exécution (Phasage Fonctionnel)

| Phase | Intitulé | Livrables Principaux |
| :--- | :--- | :--- |
| **Phase 1** | **Moteur CBT & QCM (CE & CO)** | Modèles Prisma, Simulateur officiel écran scindé, lecteur audio, grille 1-39, calcul NCLC. |
| **Phase 2** | **Atelier Écrit & Correction IA** | Éditeur avec compteur de mots, API de notation selon grille FEI, Magic Rewrite C1/C2. |
| **Phase 3** | **Simulateur Oral Vocal IA** | Pipeline audio WebRTC / Groq Whisper + Cartesia/ElevenLabs, jeu de rôle interactif Tâche 2. |
| **Phase 4** | **Dashboard, Carnet d'Erreurs & CRS** | Radar de progression, algorithme SRS, simulateur Entrée Express. |
| **Phase 5** | **Landing Page & Monétisation** | Vitrine Magic UI / React Bits, checkout Stripe & Mobile Money. |
