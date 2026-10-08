# 🎨 Brand & Design Canvas : Générateur IA de Séries CE 39 Questions (Super4C2)

## 1. Intention & Expérience Administrateur
Le Générateur IA de Série CE est l'outil d'accélération suprême pour le Back-Office Super4C2.
Il permet à l'administrateur de générer une série d'examen complète de **39 questions authentiques** (ou de compléter une série existante) en une seule action guidée, tout en garantissant :
- Le respect absolu de la matrice des 6 paliers CECRL / NCLC officiels de France Éducation International (FEI).
- La variété des types de supports (flyers, horaires, avis, courriels d'entreprise, articles de presse, essais philosophiques).
- Des distracteurs réalistes avec analyse chirurgicale des pièges (`trapAnalysis`).
- Une esthétique visuelle haut de gamme inspirée de la Fintech / EdTech moderne (Glassmorphism, Dark Mode Imperial Navy, accents Maple Crimson et Electric Cyan pour l'IA).

---

## 2. Composants & Hiérarchie UI

### A. Bouton Déclencheur Principal (`BulkGenerateButton`)
- **Emplacement :** 
  - En-tête de la liste des séries (`/admin/series-ce`) à côté de *"Nouvelle Série CE"*.
  - En-tête de la gestion des questions d'une série (`/admin/series-ce/[id]/questions`) sous la forme *"✨ Générer / Compléter avec IA"*.
- **Style Visuel :**
  - Bouton avec fond dégradé subtil `bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white`.
  - Icône animée `Sparkles` ou `Wand2` avec lueur pulsée.

### B. Modal / Drawer Interactif (`AiSeriesGeneratorDialog`)
- **En-tête de l'assistant :**
  - Titre : `Générateur IA de Série Complète CE (39 Questions)`.
  - Badge technologique : `Moteur Aura C2™ · Calibration Officielle FEI`.
- **Formulaire de Configuration :**
  1. **Cible de la génération :**
     - Option A : *Créer une nouvelle série complète* (titre et numéro automatique, ex: Série 102).
     - Option B : *Injecter dans la série actuelle* (compléter les questions manquantes jusqu'à 39).
  2. **Thématique directrice :**
     - Sélecteur de dominante éditoriale :
       - `Standard Officiel Équilibré` (Vie quotidienne, travail, écologie, société canadienne).
       - `Focus Société & Travail Canadien` (Immigration, marché de l'emploi au Québec et provinces, télétravail).
       - `Focus Environnement & Transition` (Climat, biodiversité, énergies renouvelables).
       - `Focus Culture & Société Contemporaine` (Arts, médias numériques, éducation, débats éthiques).
  3. **Mode de génération (Sécurisé par Paliers) :**
     - Génération séquentielle par lots de paliers (A1-A2, B1-B2, C1-C2) ou complète en arrière-plan avec barre de progression temps réel.
- **Visualisation de la Progression (Live Stepper) :**
  - Jauge circulaire ou barre de progression découpée en 6 paliers.
  - État dynamique de chaque palier : *En attente*, *En cours d'écriture*, *Validé ✓*.
  - Log des questions créées en temps réel (`[Q01] Affiche promo restaurant · A1 validée`, `[Q19] Transition écologique B2 validée...`).
- **Footer & Actions :**
  - Bouton d'annulation sécurisé.
  - Bouton d'action directe : `Accéder à la série générée` avec lien vers la prévisualisation CBT.

---

## 3. Tokens & Couleurs
- Fond du dialogue : `bg-card border-border` avec ombre profonde `shadow-2xl`.
- Barres de paliers :
  - A1 / A2 : `emerald-500` / `teal-500`
  - B1 / B2 : `blue-500` / `primary (Maple Crimson)` (Seuil NCLC 7)
  - C1 / C2 : `purple-500` / `rose-500`
- Statuts de chargement : Spinner et skeleton avec effet de shimmer aux tons `slate-800` et `indigo-500/20`.
