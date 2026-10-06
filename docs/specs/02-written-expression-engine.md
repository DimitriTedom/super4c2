# 📋 Spécification Technique : 02 - Atelier d'Expression Écrite (EE) & Correcteur IA FEI

## 1. Contexte & Objectif
L'Expression Écrite (EE) du TCF Canada est une épreuve éliminatoire pour l'obtention des points bonus CRS Entrée Express (palier NCLC 7).
Les candidats souffrent de deux problèmes majeurs avec les plateformes actuelles :
1. **L'absence de simulateur temps réel :** Les candidats tapent dans un Word ou un formulaire basique avec correcteur orthographique automatique, ce qui fausse totalement leur préparation aux conditions d'examen FEI.
2. **Le délai de correction prohibitif :** Les solutions humaines prennent entre 24h et 72h pour rendre une note, souvent sommaire et sans explication pédagogique.

Super4C2 apporte :
* Un éditeur d'examen immersif respectant les 3 tâches officielles FEI avec décompte de temps (60 minutes au total).
* Un **compteur de mots en temps réel** avec repères visuels d'intervalles stricts.
* Désactivation native du correcteur orthographique du navigateur (`spellcheck="false"`, `autocorrect="off"`).
* Une évaluation IA instantanée selon les **4 critères officiels de France Éducation International (FEI)** :
  1. *Adéquation à la situation / Respect de la consigne & du volume de mots*
  2. *Cohérence & Cohésion textuelle (connecteurs logiques, structure en paragraphes)*
  3. *Compétence lexicale (richesse du vocabulaire, précision, registre de langue)*
  4. *Compétence morphosyntaxique (grammaire, accords, structures de phrases complexes)*
* Le **Magic Rewrite C1/C2** : Une version réécrite par l'IA sublimant le texte original de l'étudiant tout en conservant ses idées clés, pour un apprentissage par l'exemple immédiat.

---

## 2. Structure Réglementaire de l'Épreuve d'Expression Écrite (TCF Canada)

* **Durée totale :** 60 minutes pour les 3 tâches.
* **Tâche 1 (Message descriptif / informatif) :**
  * Objectif : Rédiger un message pour décrire, raconter ou expliquer.
  * Volume imposé : **60 à 120 mots**.
  * Échelle de niveau ciblée : A1 à A2/B1.
* **Tâche 2 (Article / Courrier / Récit d'expérience avec avis personnel) :**
  * Objectif : Raconter une expérience personnelle et donner son opinion.
  * Volume imposé : **120 à 150 mots**.
  * Échelle de niveau ciblée : B1 à B2.
* **Tâche 3 (Texte argumentatif comparatif) :**
  * Objectif : Analyser deux opinions opposées sur un sujet de société et prendre position en argumentant.
  * Volume imposé : **120 à 180 mots**.
  * Échelle de niveau ciblée : B2 à C1/C2.

---

## 3. Parcours Utilisateur & Écrans

1. **Écran de Préparation & Consignes (`/examens/[seriesId]/ee/intro`) :**
   * Présentation des 3 tâches, règles de comptage de mots officielles (un mot = tout signe typographique séparé par un espace ou une apostrophe).
   * Bouton de lancement de l'épreuve avec enclenchement du compte à rebours de 60:00.

2. **Éditeur d'Épreuve CBT (`/examens/[seriesId]/ee`) :**
   * En-tête : Minuteur persistant (60:00), sélecteur d'onglets des 3 tâches avec statut (ex: `Tâche 1 [84/120 mots ✓]`, `Tâche 2 [135/150 mots ✓]`, `Tâche 3 [Non commencée]`), bouton "Soumettre pour correction IA".
   * Écran scindé :
     * **Volet gauche :** Sujet officiel avec consignes et documents de référence éventuels.
     * **Volet droit :** Zone de rédaction sécurisée (`textarea` optimisé avec ligne de statut de comptage dynamique).
   * Jauge de comptage de mots interactive :
     * Rouge : En dessous du minimum requis (- de 60 mots).
     * Vert : Dans la fourchette idéale (ex: 80-110 mots).
     * Orange : Au-dessus de la limite supérieure (risque de pénalité de temps).

3. **Rapport d'Évaluation Instantané (`/examens/[seriesId]/ee/resultat/[submissionId]`) :**
   * Score global estimé sur 20 / Échelon NCLC (NCLC 4 à 10).
   * Radar des 4 critères FEI avec sous-notes sur 5.
   * Feedback détaillé critère par critère avec relevé des erreurs annotées.
   * **Magic Rewrite C1/C2 :** Texte révisé en miroir avec mise en valeur des tournures enrichies et du vocabulaire avancé.

---

## 4. Modélisation de Données & Schéma d'API

### A. Modèle Prisma (complément)
```prisma
model WrittenSubmission {
  id          String   @id @default(cuid())
  userId      String   @db.Uuid
  seriesId    String
  startedAt   DateTime @default(now())
  submittedAt DateTime @default(now())
  
  task1Text   String   @db.Text
  task1Words  Int
  task2Text   String   @db.Text
  task2Words  Int
  task3Text   String   @db.Text
  task3Words  Int

  totalScore     Float   // Note sur 20
  tcfScaledScore Int     // Équivalent sur 699
  nclcLevel      Int     // 4 à 10
  
  evaluations Json    // Rapport détaillé par tâche et par critère FEI
  magicRewrites Json  // { task1: string, task2: string, task3: string }
}
```

### B. Algorithme de Comptage de Mots Officiel FEI
Un mot est défini selon la règle standard FEI :
`mots = texte.trim().split(/[\s'’]+/).filter(Boolean).length`
Exemple : *"L'arbre"* = 2 mots (*L'* + *arbre*). *"C'est-à-dire"* = 1 ou 4 mots selon tolérance (standard TCF : trait d'union compte pour 1 bloc composé).

---

## 5. Composants UI à Réaliser

1. `<WordCountBadge current={n} min={min} max={max} />` : Pastille visuelle interactive.
2. `<WrittenTaskEditor task={task} value={text} onChange={setText} />` : Zone d'écriture avec raccourcis et sans autocorrecteur.
3. `<WrittenExamSplitLayout />` : Présentation du sujet officiel à gauche, éditeur à droite.
4. `<FeiEvaluationCard result={evalResult} />` : Restitution de la grille de correction FEI avec accordéon interactif.
5. `<MagicRewriteViewer original={text} rewritten={c2Text} />` : Comparateur côte à côte avec surlignage des améliorations.
