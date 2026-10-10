# Spécification Fonctionnelle & Technique : Série Complète IELTS General Training 18 (Test 1)

**Version :** 1.0  
**Date :** Octobre 2026  
**Auteur :** Antigravity Agent  
**Statut :** Approuvé pour Implémentation  

---

## 1. Vue d'Ensemble & Objectifs

L'épreuve **IELTS General Training** est le deuxième levier stratégique majeur pour les candidats à l'immigration canadienne (Entrée Express).
Obtenir le niveau **CLB 9 (Band Scores 8.0 en Listening, 7.0 en Reading, 7.0 en Writing, 7.0 en Speaking — le fameux palier 8777)** débloque jusqu'à **+24 à +50 points de transférabilité de compétences** dans le système de classement global (CRS).

Cette spécification définit l'implémentation de la première **Série Complète IELTS General Training (Série 301 / `ielts-gen-18-1`)**, conçue selon les standards rigoureux de Cambridge English et du British Council :
1. **Reading (General Training) :** 3 sections complètes (Section 1: Social Survival, Section 2: Workplace Context, Section 3: Extended Article) avec documents d'époque, formats QCM, True/False/Not Given et complétion.
2. **Listening :** 4 sections scénarisées (Social conversation, Local facility monologue, Study group dialogue, Academic talk) avec audio transcripts intégraux.
3. **Writing :** Task 1 (Formal Letter - 150 mots) et Task 2 (Discursive Essay - 250 mots) avec barème officiel en 4 critères IDP/Cambridge (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).
4. **Speaking :** 3 parties (Part 1 Interview, Part 2 Cue Card de 2 min avec préparation, Part 3 Deep Discussion).
5. **Scorecard & Conversion CLB/NCLC :** Tableau officiel de conversion Band Score (0 à 9.0) vers CLB canadien (CLB 4 à CLB 10+) et calcul des points CRS gagnés.

---

## 2. Architecture des Données

### 2.1 Types TypeScript Dédiés (`lib/exam/ielts-types.ts`)
```typescript
export type IeltsQuestionType =
  | "multiple_choice"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_headings"
  | "sentence_completion";

export interface IeltsQuestion {
  id: string;
  questionNumber: number;
  section: 1 | 2 | 3 | 4;
  type: IeltsQuestionType;
  prompt: string;
  passageSnippet?: string;
  documentTitle?: string;
  documentText?: string;
  options?: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  trapAnalysis: string;
  targetBand: number; // e.g. 7.0, 8.0, 9.0
}

export interface IeltsSeriesData {
  id: string;
  seriesNumber: number;
  testType: "ielts";
  track: "general" | "academic";
  title: string;
  edition: string; // e.g. "Cambridge IELTS 18"
  testNumber: number; // e.g. 1
  readingQuestions: IeltsQuestion[];
  listeningQuestions: IeltsQuestion[];
  writingTasks: {
    task1: { prompt: string; minWords: number; situation: string; bulletPoints: string[] };
    task2: { prompt: string; minWords: number; topic: string };
  };
  speakingTasks: {
    part1: { topic: string; questions: string[] };
    part2: { cueCardTopic: string; bulletPoints: string[] };
    part3: { theme: string; questions: string[] };
  };
}
```

---

## 3. Matrice de Conversion Officielle Band Score ➔ CLB (IRCC)

| Compétence | CLB 7 (Seuil Express) | CLB 8 | CLB 9 (Palier Royal 8777) | CLB 10 (C2 Élite) |
| :--- | :--- | :--- | :--- | :--- |
| **Reading (General)** | Band 6.0 (30-31 / 40) | Band 6.5 (32-33 / 40) | **Band 7.0 (34-35 / 40)** | Band 8.0+ (37+ / 40) |
| **Listening** | Band 6.0 (23-25 / 40) | Band 7.5 (32-34 / 40) | **Band 8.0 (35-36 / 40)** | Band 8.5+ (37+ / 40) |
| **Writing** | Band 6.0 | Band 6.5 | **Band 7.0** | Band 7.5+ |
| **Speaking** | Band 6.0 | Band 6.5 | **Band 7.0** | Band 7.5+ |

---

## 4. Expérience Utilisateur (UI/UX)

- **Sélecteur d'Épreuves IELTS :** Accessible directement depuis `/examens?test=ielts` avec onglets *IELTS General Training* vs *IELTS Academic*.
- **CBT Runner Dédié :** Interface scindée Cambridge CBT :
  - Panneau gauche : Document de lecture ou Lecteur Audio.
  - Panneau droit : Questions IELTS avec sélecteurs A/B/C/D ou boutons True / False / Not Given.
  - Surligneur interactif ambre et raccourcis clavier.
  - Bilan de fin d'examen avec calcul automatique du Band Score global et équivalence CLB 7 à 9.
