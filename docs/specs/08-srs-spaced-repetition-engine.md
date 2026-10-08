# 📋 Spécification Technique : 08 - Moteur de Répétition Espacée SRS (Algorithme SM-2)

## 1. Contexte & Objectif
Le système SRS (Spaced Repetition System) est le pilier d'entraînement continu de Super4C2.
Son objectif est d'éliminer la récurrence des erreurs commises par les candidats lors des examens blancs CBT en programmant des révisions à intervalles optimaux basés sur la courbe de l'oubli d'Ebbinghaus et l'algorithme **SuperMemo-2 (SM-2)**.

---

## 2. Modèle Mathématique de l'Algorithme SM-2

Chaque flashcard possède les propriétés d'état suivantes :
- `repetitions` : Nombre de révisions consécutives réussies ($n \in \mathbb{N}$).
- `interval` : Intervalle actuel en jours avant la prochaine révision ($I \ge 1$).
- `easinessFactor` : Facteur de facilité de la carte ($EF \ge 1.3$, valeur par défaut initiale = $2.5$).
- `nextReviewDate` : Date horodatée de la prochaine échéance.
- `lastReviewDate` : Date de la dernière évaluation.

### Matrice de Notation & Qualité ($q$)
Lors d'une révision, l'utilisateur évalue sa mémorisation selon 4 choix :
| Bouton | Label | Score $q$ | Signification |
| :--- | :--- | :--- | :--- |
| **Bouton 1** | **À revoir (Again)** | **1** | Échec complet, réponse non retrouvée ou piège récidivé. |
| **Bouton 2** | **Difficile (Hard)** | **3** | Réponse retrouvée avec hésitation ou effort important. |
| **Bouton 3** | **Bon (Good)** | **4** | Réponse correcte après un léger temps de réflexion (nominal). |
| **Bouton 4** | **Facile (Easy)** | **5** | Réponse immédiate, piège parfaitement assimilé. |

### Calculs de Mise à Jour :
1. **Mise à jour du facteur d'aisance ($EF$) :**
   $$EF' = EF + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))$$
   $$EF = \max(1.3, EF')$$

2. **Mise à jour des répétitions et de l'intervalle ($I$) :**
   - **Si $q < 3$ (Échec / À revoir) :**
     $$repetitions = 0$$
     $$interval = 1 \text{ jour}$$
   - **Si $q \ge 3$ (Succès) :**
     $$repetitions = repetitions + 1$$
     - Si $repetitions = 1$ : $$interval = 1 \text{ jour}$$
     - Si $repetitions = 2$ : $$interval = 6 \text{ jours}$$
     - Si $repetitions > 2$ :
       - Si $q = 3$ (Difficile) : $$interval = \max(interval + 1, \text{round}(interval \cdot 1.2))$$
       - Si $q = 4$ (Bon) : $$interval = \text{round}(interval \cdot EF)$$
       - Si $q = 5$ (Facile) : $$interval = \text{round}(interval \cdot EF \cdot 1.3)$$

3. **Date de prochaine révision :**
   $$nextReviewDate = \text{now}() + (interval \cdot 86400 \cdot 1000)$$

---

## 3. Schéma de Données TypeScript

```typescript
export interface SrsCard {
  id: string;
  discipline: "CE" | "CO" | "EE" | "EO";
  questionNumber: number;
  questionPrompt: string;
  documentSnippet?: string;
  candidateMistake: string;
  correctAnswer: string;
  ruleExplanation: string;
  trapType: string;
  
  // Paramètres algorithme SM-2
  repetitions: number;
  intervalDays: number;
  easinessFactor: number;
  nextReviewDate: string; // ISO string
  lastReviewDate?: string;
  
  // Métadonnées
  createdAt: string;
  sourceExamId?: string;
}
```

---

## 4. Parcours Candidat & User Stories

1. **Alimentation Automatique :**
   - À la fin d'un examen de Compréhension Écrite, Compréhension Orale ou Expression, l'écran de résultat propose un bouton d'export direct `[Ajouter toutes les erreurs au Carnet SRS]` ou l'ajoute automatiquement.
2. **Consultation du Deck :**
   - Sur `/carnet-erreurs`, le candidat voit le nombre de cartes **« Dues Aujourd'hui »**.
   - Clic sur `[⚡ Lancer la Session Flashcard du Jour]`.
3. **Session Flashcard Immersive :**
   - Mode plein écran sans distraction.
   - Recto : Énoncé du piège et de la faute commise.
   - Touche `Espace` ou clic pour dévoiler la bonne réponse et l'astuce anti-piège.
   - Touches `1`, `2`, `3`, `4` pour noter et passer à la carte suivante.
   - Écran de félicitations lorsque toutes les cartes du jour sont révisées.
