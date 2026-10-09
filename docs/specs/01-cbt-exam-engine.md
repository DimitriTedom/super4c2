# 📋 Spécification Technique : 01 - Moteur d'Examen CBT (CE & CO)

## 1. Contexte & Objectif
L'objectif de cette fonctionnalité est de fournir le premier simulateur d'examen au format **CBT (Computer-Based Test)** pour le TCF Canada, éliminant totalement l'expérience médiocre du concurrent (scroll de 18 000 px).

## 2. Structure Réglementaire des Épreuves (TCF Canada Nouveau Format)

### A. Compréhension Écrite (CE)
* **Durée :** 60 minutes (chronomètre non arrêtable en conditions réelles).
* **Nombre de questions :** 39 questions à choix multiple (4 propositions : A, B, C, D — une seule bonne réponse).
* **Format visuel :** Écran scindé (Texte / Document source à gauche, Question et options à droite).
* **Notation :** Score brut sur 39 converti sur l'échelle officielle TCF (100 à 699 points) et en niveau NCLC (1 à 10+).

### B. Compréhension Orale (CO)
* **Durée :** 40 minutes.
* **Nombre de questions :** 39 questions à choix multiple (4 propositions : A, B, C, D).
* **Format visuel :** Lecteur audio officiel avec barre de progression de lecture unique (pas de pause ni de retour en arrière possible en mode officiel).
* **Notation :** Score brut sur 39 converti sur l'échelle officielle TCF et en niveau NCLC (1 à 10+).

---

## 3. User Stories & Parcours Candidat

1. **Démarrage de l'épreuve :**
   * L'utilisateur choisit une série (ex: Série 101).
   * Un écran de consignes officielles apparaît avec test de son obligatoire pour la CO.
   * L'utilisateur clique sur "Démarrer l'épreuve" : le compte à rebours s'enclenche.

2. **Passation de l'épreuve :**
   * Interface plein écran sans distraction.
   * Grille de navigation en bas ou sur le volet droit (39 pastilles numérotées).
   * Pastilles avec états : *Non répondue* (neutre), *Répondue* (bleue/remplie), *Marquée pour révision* (drapeau jaune).
   * L'utilisateur peut marquer une question (`Flag / Réviser plus tard`) et y revenir à tout moment avant la fin du temps imparti.
   * Sauvegarde continue en local (`localStorage` + synchronisation en arrière-plan).

3. **Soumission & Clôture :**
   * Deux déclencheurs : clic sur "Terminer l'examen" (avec dialogue de confirmation alertant sur les questions non répondues) OU expiration automatique du chronomètre (00:00).
   * Calcul immédiat des résultats.

4. **Écran de Débriefing & Explications Pédagogiques :**
   * Score global, score TCF (sur 699) et niveau NCLC obtenu (ex. NCLC 7).
   * Impact sur le score CRS Entrée Express (ex. "+50 points débloqués !").
   * Liste détaillée de chaque question :
     * Texte/audio avec transcription synchronisée.
     * Option choisie par le candidat vs bonne réponse.
     * **Explication pédagogique rédigée :** Pourquoi la bonne réponse est exacte et pourquoi chaque distracteur était un piège.
     * Bouton "Ajouter au Carnet d'Erreurs" (ou ajout automatique).

---

## 4. Modèle de Données (Schéma Prisma Conceptuel)

```prisma
enum ExamType {
  TCF_CANADA
  TEF_CANADA
}

enum Discipline {
  COMPREHENSION_ECRITE
  COMPREHENSION_ORALE
  EXPRESSION_ECRITE
  EXPRESSION_ORALE
}

model ExamSeries {
  id          String       @id @default(cuid())
  seriesNumber Int         // ex: 100, 101, 148
  title       String
  examType    ExamType     @default(TCF_CANADA)
  isFreeDemo  Boolean      @default(false)
  createdAt   DateTime     @default(now())
  questions   Question[]
  attempts    UserAttempt[]
}

model Question {
  id            String       @id @default(cuid())
  seriesId      String
  series        ExamSeries   @relation(fields: [seriesId], references: [id], onDelete: Cascade)
  discipline    Discipline
  questionNumber Int         // 1 à 39
  nclcTargetLevel Int?       // Niveau estimé (ex: 4 pour A2, 7 pour B2, 9 pour C1)
  
  // Contenu multimédia
  documentText  String?      @db.Text
  documentImageUrl String?
  audioUrl      String?
  audioTranscript String?    @db.Text
  
  // Question & Choix
  prompt        String       @db.Text
  optionA       String
  optionB       String
  optionC       String
  optionD       String
  correctOption String       // "A" | "B" | "C" | "D"
  
  // Pédagogie
  explanation   String       @db.Text // Justification détaillée
  trapAnalysis  String?      @db.Text // Analyse des pièges des mauvaises options
}

model UserAttempt {
  id          String       @id @default(cuid())
  userId      String
  seriesId    String
  series      ExamSeries   @relation(fields: [seriesId], references: [id])
  discipline  Discipline
  startedAt   DateTime     @default(now())
  completedAt DateTime?
  rawScore    Int          @default(0) // ex: 32 / 39
  tcfScaledScore Int       @default(0) // ex: 512 / 699
  nclcLevel   Int          @default(0) // ex: 8
  answers     Json         // Record<questionId, { selectedOption: string, isFlagged: boolean }>
}
```

---

## 5. Composants UI & UX à Développer

1. `<ExamHeader />` : Titre de l'épreuve, discipline, chronomètre officiel persistant, bouton Terminer.
2. `<ExamSplitLayout />` : Conteneur responsive (gauche : document/audio, droite : question/options).
3. `<AudioPlayerCBT />` : Lecteur audio sans retour en arrière avec barre de progression élégante.
4. `<QuestionNavGrid />` : Barre de 39 pastilles interactives avec filtres (Toutes, Répondues, Non répondues, Signalées).
5. `<ExamResultSummary />` : Carte de résultat avec badge NCLC, jauge CRS et breakdown pédagogique.

---

## 6. Extension UX Candidat Avancée : Dual Mode, Surligneur CE & Audio Flexible CO

### A. Dual Mode : Examen Strict vs Entraînement Didactique
* **Mode Examen Strict (Chrono FEI) :**
  - Chronomètre dégressif strict avec soumission automatique à 00:00.
  - Aucune réponse ni explication affichée pendant l'épreuve.
  - En CO : une seule écoute autorisée, sans pause ni réécoute.
  - Clôture avec calcul de score et débriefing final.
* **Mode Entraînement Didactique :**
  - Chronomètre avec bouton pause/reprise pour travailler sans stress.
  - Bouton interactif « Vérifier la réponse » disponible dès qu'une option est sélectionnée :
    - Révélation instantanée (vert si correct, rouge si faux).
    - Affichage de l'explication officielle et de l'analyse des pièges FEI.
  - En CO : bouton réécoute et accès facultatif à la transcription pour travailler la compréhension fine.

### B. Outil Surligneur Interactif (Highlighter) en Compréhension Écrite (CE)
* Bouton activable dans la barre d'outils du document support (`Highlighter`).
* Permet au candidat de surligner des segments textuels dans le document officiel à gauche.
* Couleur de surlignage feutre ambre/jaune fluo translucide (`bg-amber-300/40 dark:bg-amber-400/30 text-inherit`).
* Bouton « Effacer le surlignage » pour réinitialiser la vue du document.
* Persistance des surlignages par question pendant toute la durée de la session.

### C. Contrôle de Vitesse Audio & Flexibilité en Compréhension Orale (CO)
* Sélecteur de vitesse de lecture intégré au lecteur `<AudioPlayerCBT />` : `0.8x` (écoute analytique), `1.0x` (vitesse officielle FEI), `1.2x` (entraînement intensif à débit rapide).
* En mode entraînement : réécoute autorisée pour décortiquer les liaisons et accents francophones (québécois, parisien, africain, etc.).
