# Spécification Technique — Expression Écrite : Barre du Temps, Clavier FEI, Mode Entraînement Tâche par Tâche & Lead Gen CRS

## 1. Objectifs & Exigences Métier
- Fournir un simulateur d'Expression Écrite rigoureusement conforme aux normes de France Éducation International (FEI) et aligné avec l'expérience utilisateur d'Objectif Canada.
- Répondre aux 5 points opérationnels demandés :
  1. **Barre de progression du temps :** Écoulement visuel dynamique avec changement d'état colorimétrique.
  2. **Clavier virtuel de caractères accentués complet :** Minuscules et majuscules (`É`, `À`, `Ç`, etc.) avec bascule ergonomique.
  3. **Soumission manuelle & automatique à expiration :** Soumission sans blocage du travail effectué et passage immédiat en correction lorsque le chrono expire.
  4. **Mode Entraînement Tâche par Tâche :** Possibilité de s'entraîner sur une tâche isolée (T1: 15 min, T2: 20 min, T3: 25 min) avec chronomètre dédié et évaluation IA immédiate de cette tâche.
  5. **Capture Lead sur le Calculateur CRS :** Conversion des visiteurs en leads qualifiés par capture d'adresse email pour l'envoi du rapport d'admissibilité Entrée Express.
  6. **Copywriting percutant & concis :** Mise en avant du problème central du TCF Canada (l'Expression Écrite comme cause n°1 d'échec du 4C2).

## 2. Architecture Technique & Schéma de Données

### 2.1. États du Composant `WrittenExamEditor`
- `mode`: `"exam" | "practice"`
- `selectedPracticeTask`: `0 | 1 | 2` (lorsque `mode === "practice"`)
- `totalDurationSeconds`: calculé dynamiquement :
  - En mode examen : `series.durationSeconds` (3600 secondes / 60 minutes)
  - En mode entraînement tâche par tâche :
    - Tâche 1 : 15 min (900 s)
    - Tâche 2 : 20 min (1200 s)
    - Tâche 3 : 25 min (1500 s)
- `remaining`: secondes restantes
- `isTimerPaused`: boolean (actif en mode entraînement)
- `isCapsActive`: boolean (bascule minuscules / majuscules du clavier virtuel)
- `autoSubmitted`: boolean (indique si la soumission a été déclenchée par la fin du temps)

### 2.2. Clavier Virtuel Conforme FEI & Objectif Canada
```typescript
const LOWERCASE_CHARS = [
  "é", "è", "ê", "ë", "à", "â", "ç", "ô", "î", "ï", "ù", "û", "œ", "æ"
] as const;

const UPPERCASE_CHARS = [
  "É", "È", "Ê", "Ë", "À", "Â", "Ç", "Ô", "Î", "Ï", "Ù", "Û", "Œ", "Æ"
] as const;

const PUNCTUATION_CHARS = ["«", "»", "’", "€", "–", "…"] as const;
```

### 2.3. Soumission Partielle & Automatique
- En mode Examen ou Tâche par Tâche, l'API `/api/ai/evaluate-written` et la fonction `evaluateWrittenExam` acceptent les textes partiels :
  - Si une tâche est vide ou inférieure au seuil minimal, elle est évaluée avec 0 point sur ses critères, sans provoquer d'exception serveur.
  - L'évaluation des tâches rédigées retourne la grille FEI complète et le Magic Rewrite C1/C2.
- À expiration (`remaining <= 0`) :
  - `handleSubmit()` est invoqué immédiatement avec fermeture de toute boîte de dialogue ouverte.
  - L'état `autoSubmitted` est mis à `true` et un bandeau d'information informe le candidat.

### 2.4. Capture Lead Calculateur CRS (`CrsCalculator`)
- Nouveau composant / section intégrée dans `CrsCalculator` :
  - Collecte de l'adresse email.
  - Action serveur : `subscribePublicNewsletterAction(email, "crs_calculator_report")`.
  - Affichage instantané d'un accusé de réception stylisé avec récapitulatif des points CRS générés (+totalCrsPoints).
