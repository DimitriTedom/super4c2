# Spécification Technique & Benchmark Concurrentiel : Tarification, IELTS & Guide Interactif Super4C2

**Version :** 1.0  
**Auteur :** Antigravity Agent  
**Date :** Octobre 2026  
**Statut :** Validé / En cours de déploiement  

---

## 1. Contexte & Objectifs

Suite à l'analyse en environnement isolé et rétro-ingénierie du concurrent direct **Objectif Canada** (`https://objectifcanada-tcf.com/fr/checkout` et `https://objectifcanada-tcf.com/fr/examen/ielts`), cette spécification vise à :
1. **Établir une stratégie tarifaire compétitive et accessible** pour Super4C2, adaptée aux candidats d'Afrique francophone (Cameroun, Côte d'Ivoire, Sénégal, RDC) et de la diaspora internationale.
2. **Aligner et surpasser l'expérience d'examen IELTS**, en comprenant précisément pourquoi l'offre actuelle différait de celle du concurrent et comment la hisser au standard officiel Cambridge/IDP.
3. **Formaliser le guide d'onboarding interactif (Walkthrough)** pour les nouveaux arrivants et la redirection vers la **Communauté VIP Super4C2** (en lieu et place d'un simple widget WhatsApp).
4. **Valider les états de chargement (Loaders) et le curseur feutre surligneur interactif** déjà déployés.

---

## 2. Analyse Approfondie de la Tarification Concurrentielle (Objectif Canada)

### 2.1 Formule Mathématique Rétro-ingéniée (`j.U(S)`)
L'inspection du code JavaScript client de la page de commande d'Objectif Canada a révélé leur algorithme de tarification exact :

```typescript
// Extrait décompilé du module tarifaire d'Objectif Canada
const MAX_DAYS = 365;

function computePrice(days: number): { nbJours: number; prixFCFA: number; prixUSD: number } | null {
  const s = Number(days);
  if (!Number.isInteger(s) || s < 1 || s > MAX_DAYS) return null;

  let prixFCFA: number;
  let prixUSD: number;

  if (s <= 7) {
    prixFCFA = 1000 * s; // 1 000 FCFA / jour (~1.52 €)
    prixUSD = 2 * s;     // 2 USD / jour
  } else if (s <= 15) {
    prixFCFA = 12500;    // Forfait 15 jours : 12 500 FCFA (~19.05 € / 25 USD)
    prixUSD = 25;
  } else if (s <= 30) {
    prixFCFA = 17500;    // Forfait 1 mois : 17 500 FCFA (~26.68 € / 35 USD)
    prixUSD = 35;
  } else if (s <= 49) {
    prixFCFA = 25000;    // Forfait intermédiaire : 25 000 FCFA (~38.11 € / 50 USD)
    prixUSD = 50;
  } else {
    prixFCFA = 500 * s;  // Tarif longue durée : 500 FCFA / jour (~0.76 €)
    prixUSD = 1 * s;     // 1 USD / jour
  }

  return { nbJours: s, prixFCFA, prixUSD };
}
```

### 2.2 Enseignements Clés du Modèle Concurrent
1. **Le prix psychologique d'entrée :** Leur forfait 30 jours est positionné à **17 500 FCFA (~26.70 € / 35 USD)**. C'est le palier qui déclenche la majorité des achats via Mobile Money (Orange Money / MTN / Wave via NotchPay).
2. **Le curseur dynamique :** Au lieu de proposer uniquement des packs figés, ils permettent au candidat de saisir le nombre de jours exacts jusqu'à sa date d'examen officiel.
3. **Le verrouillage "Abonnement Requis" :** Dans leur roadmap, la majorité des séries et les "Examens Blancs" complets sont cadenassés avec une redirection systématique vers `/checkout?examen=TCF`.

### 2.3 Grille Tarifaire Recommandée pour Super4C2
Pour s'imposer face à la concurrence tout en couvrant largement les coûts d'infrastructure (Vercel, Supabase, LLM OpenAI/DeepSeek, ElevenLabs TTS) :

| Formule | Durée | Prix Super4C2 (FCFA) | Prix Super4C2 (EUR / CAD) | Avantage Concurrentiel vs Objectif Canada |
|---|---|---|---|---|
| **Pass Sprint Découverte** | 7 jours | **5 000 FCFA** | **7,99 € / 12 CAD** | Moins cher (5 000 vs 7 000 FCFA), accès à 1 simulation complète |
| **Pass 15 Jours Intensif** | 15 jours | **10 000 FCFA** | **15,99 € / 23 CAD** | Plus avantageux qu'Objectif Canada (10k vs 12,5k FCFA) |
| **Pass 30 Jours Objectif C2 (Best-seller)** | 30 jours | **15 000 FCFA** | **22,99 € / 34 CAD** | Moins cher (15k vs 17,5k FCFA) + IA Dialogue Oral Vocal + Carnet SRS |
| **Pass VIP 60 Jours + Garantie Réussite** | 60 jours | **25 000 FCFA** | **38,99 € / 58 CAD** | Moins cher (25k vs 30k FCFA) + Accès à vie au Carnet SRS |

*Options de paiement intégrées prévues :* Mobile Money (MTN, Orange, Wave via CinetPay/NotchPay) + Carte Bancaire Internationale via Stripe.

---

## 3. Analyse de l'Écart IELTS : Objectif Canada vs Super4C2

### 3.1 Pourquoi notre version actuelle semblait différente
1. **Séparation Officielle Manquante :** Objectif Canada segmente clairement deux univers étanches :
   - **Section Générale (IELTS General Training) :** Conçue pour l'immigration canadienne (Entrée Express, PNB). Textes orientés vie quotidienne, travail, notices.
   - **Section Académique (IELTS Academic) :** Conçue pour l'admission universitaire et les ordres professionnels. Textes longs, articles de recherche, graphiques analytiques (Writing Task 1).
2. **Nomenclature Cambridge :** Objectif Canada référence directement les séries officielles annuelles de Cambridge English :
   - `GENERAL 11` à `GENERAL 17` (Tests 1 à 4)
   - `ACADEMIC 11` à `ACADEMIC 19` (Tests 1 à 4)
3. **Types de Questions IELTS :** Alors que le TCF est un QCM à 4 choix stricts (A, B, C, D), l'IELTS comporte :
   - *Matching Headings / Information*
   - *Sentence Completion / Summary Completion* (saisie de mots)
   - *True / False / Not Given* ou *Yes / No / Not Given*
   - *Map / Diagram / Flowchart Labelling*
   - *Writing Task 1 :* Description de graphique (Academic) ou Lettre formelle (General)
   - *Speaking :* Épreuve en 3 parties (Interview, Cue Card de 2 min, Discussion abstraite)
4. **Système de Notation :** Barème officiel en **Band Scores 0 à 9.0** (par demi-points), avec cible **CLB 9 (Listening 8.0, Reading 7.0, Writing 7.0, Speaking 7.0)** pour maximiser le CRS Entrée Express.

### 3.2 Plan d'Action pour Super4C2 IELTS
- **Onglet Dédié "IELTS General" vs "IELTS Academic"** sur `/examens?test=ielts`.
- Intégration de séries numérotées inspirées des standards Cambridge (ex: `IELTS-GEN-18-1`, `IELTS-ACAD-19-1`).
- Simulateur adapté avec saisie textuelle pour le Reading/Listening et transcription audio spécifique.
- Évaluateur IA calqué sur la grille officielle IDP/British Council (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation).

---

## 4. Spécification du Guide Tutoriel d'Onboarding (Newcomers) & Communauté VIP

### 4.1 Parcours du Guide Interactif (5 Étapes)
Une modale d'accueil fluide (Framer Motion) s'affichant pour tout premier visiteur ou déclenchable via un bouton "Guide / Découverte" :

1. **Étape 1 — Bienvenue & Philosophie Super4C2 :**
   - Présentation de la promesse : "Décrochez vos 4 C2 et débloquez les +50 points CRS".
2. **Étape 2 — Double Mode Examen (Strict CBT vs Didactique) :**
   - Explication du mode officiel FEI (chronomètre strict non arrêtable) vs mode entraînement (pause chrono, explications immédiates).
3. **Étape 3 — Le Surligneur Interactif & Outils d'Examen :**
   - Démonstration du feutre surligneur avec curseur personnalisé et zoom de police.
4. **Étape 4 — La Salle d'Oral Virtuelle & Pré-test Matériel :**
   - Présentation du VU-mètre Web Audio API et de l'interlocuteur IA vocal en temps réel.
5. **Étape 5 — Rejoignez l'Élite Francophone :**
   - Redirection vers la **Communauté VIP Super4C2** (`/communaute`) avec accès aux salons d'entraide, partages de sujets récents et coaching de groupe.

### 4.2 Substitution du Widget WhatsApp
- Remplacement du bouton flottant tiers WhatsApp par un bouton de navigation intégré vers **`/communaute`** ("Rejoindre la Communauté des 4 C2").

---

## 5. Récapitulatif des Améliorations Déployées

1. **États de Chargement Globaux & Boutons :**
   - Composant `Button` étendu avec `loading?: boolean` et `loadingText?: string`, incluant le spinner `<Loader2 />` automatique et `disabled={loading}`.
   - Fonction exportée `triggerGlobalLoading(loading: boolean)` activant la barre laser supérieure `TopBodyLoader`.
   - Intégration sur la soumission d'examen écrit (`written-exam-editor.tsx`), la fin d'examen CBT (`use-exam-session.ts`), et l'enregistrement du profil candidat (`profile-edit-form.tsx`).
2. **Curseur Personnalisé Feutre Surligneur :**
   - Classe CSS `.cursor-highlighter` définie avec un curseur SVG haute résolution à pointe biseautée fluorescente jaune/ambre et mire de ciblage rouge.
   - Activé dynamiquement dans `ce-document-viewer.tsx` et `product-showcase-section.tsx`.
