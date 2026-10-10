# Document de Spécification Technique — Examen Blanc Complet CBT (Simulation Intégrale 4 Épreuves)

**Version :** 1.0  
**Statut :** En cours d'implémentation  
**Auteur :** Antigravity AI & Dimitri (@dimitri-snowdev)  
**Date :** Octobre 2026  
**Fichiers Liés :**  
- Orchestrateur Examen Blanc : [`components/exam/mock-exam-orchestrator.tsx`](file:///d:/SnowDev/Documents/super4c2/components/exam/mock-exam-orchestrator.tsx)
- Page Route : [`app/examens/[seriesId]/examen-blanc/page.tsx`](file:///d:/SnowDev/Documents/super4c2/app/examens/[seriesId]/examen-blanc/page.tsx)
- Progression & Séries : [`lib/exam/series-progression.ts`](file:///d:/SnowDev/Documents/super4c2/lib/exam/series-progression.ts)
- Relevé & Scoring : [`lib/exam/scoring.ts`](file:///d:/SnowDev/Documents/super4c2/lib/exam/scoring.ts)

---

## 1. Contexte & Valeur Stratégique pour les Candidats

L'un des plus grands facteurs d'échec des candidats au TCF Canada dans les centres agréés (France Éducation International / CCI Paris) est l'**endurance cognitive** :
- Le jour J, les candidats ne passent pas une épreuve isolée de 20 minutes ; ils subissent une session d'examen ininterrompue de **près de 3 heures** (CO + CE + EE + EO).
- La fatigue accumulée en Compréhension Écrite impacte directement la clarté rédactionnelle en Expression Écrite et la vivacité en Expression Orale.
- **L'Examen Blanc Complet Super4C2** est la simulation d'examen CBT la plus fidèle du marché, reproduisant les 4 épreuves chronométrées à la suite avec transitions réglementaires et délivrance d'un **Relevé Officiel d'Attestation Agrégé**.

---

## 2. Déroulement Chronologique Officiel (Standards FEI)

```mermaid
flowchart LR
    A[1. Accueil & Consignes] --> B[2. Compréhension Orale CO (35 min)]
    B --> C[Pause Réglementaire (2 min)]
    C --> D[3. Compréhension Écrite CE (60 min)]
    D --> E[Pause Réglementaire (3 min)]
    E --> F[4. Expression Écrite EE (60 min)]
    F --> G[Pause & Test Micro (2 min)]
    G --> H[5. Expression Orale EO (12 min)]
    H --> I[6. Relevé Global Officiel FEI (+50 pts CRS)]
```

### 2.1 Détail des 4 Épreuves :
1. **Compréhension Orale (CO) — 35 minutes** :
   - 39 questions QCM à écoute continue avec lecteur audio officiel HTML5 synchronisé.
   - Notation sur 699 points (Seuil NCLC 7 : **458 points**).
2. **Compréhension Écrite (CE) — 60 minutes** :
   - 39 questions QCM avec visualiseur double écran de documents authentiques et outil surligneur interactif à pointe biseautée (`.cursor-highlighter`).
   - Notation sur 699 points (Seuil NCLC 7 : **453 points**).
3. **Expression Écrite (EE) — 60 minutes** :
   - 3 tâches officielles :
     - *Tâche 1 (60-120 mots)* : Message court / invitation / description factuelle.
     - *Tâche 2 (120-150 mots)* : Article de presse / récit d'expérience.
     - *Tâche 3 (120-180 mots)* : Confrontation de deux opinions divergentes et prise de position argumentée.
   - Barre de caractères accentués officielle FEI (`é`, `è`, `ê`, `à`, `ç`, `ô`, `î`, `ù`, `œ`, `«`, `»`).
   - Notation sur 20 points (Seuil NCLC 7 : **12 à 13 / 20**).
4. **Expression Orale (EO) — 12 minutes** :
   - 3 tâches avec examinateur IA interactif (voix de M. Laurent) :
     - *Tâche 1 (2 min)* : Entretien dirigé sans préparation (présentation personnelle).
     - *Tâche 2 (3 min 30)* : Exercice en interaction (jeu de rôle où le candidat pose des questions).
     - *Tâche 3 (4 min 30)* : Expression d'un point de vue argumenté sur un sujet de société.
   - Notation sur 20 points (Seuil NCLC 7 : **12 à 13 / 20**).

---

## 3. Grille de Notation & Relevé Officiel Agrégé

### 3.1 Règles d'Admissibilité NCLC 7 Fédérale (IRCC) :
Pour décrocher le bonus massif de **+50 points CRS** dans le bassin Entrée Express Canada, le candidat doit impérativement obtenir **NCLC 7 au minimum dans TOUTES les 4 épreuves** :
- `CO >= 458`
- `CE >= 453`
- `EE >= 12/20`
- `EO >= 12/20`

Si ne serait-ce qu'une seule compétence est à NCLC 6 (ex : CE à 445 points), le bonus +50 points est suspendu et le relevé Super4C2 indique précisément la compétence goulot d'étranglement avec un plan d'entraînement d'urgence ciblé.

---

## 4. Architecture Technique du Mock Exam Runner

- **State Machine React (`components/exam/mock-exam-orchestrator.tsx`) :**
  - Gère l'état global de l'examen avec persistance dans le `localStorage` (`super4c2:mock_exam_session_progress`) pour survivre à un rechargement accidentel de page sans perte de progression.
  - Horloge globale d'examen & horloges individuelles d'épreuves.
  - Calcul déterministe immédiat des scores CO/CE et évaluation par critères FEI pour EE/EO.
- **Écran de Débriefing & Attestation Téléchargeable :**
  - Génération d'une attestation au look officiel France Éducation International avec logo, date, numéro d'attestation unique et récapitulatif par compétence.
  - Calculateur d'impact CRS réactif simulant l'ajout des +50 points sur le profil du candidat.
