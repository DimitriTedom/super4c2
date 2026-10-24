# Spécification Technique #24 : Espace d'Échange Pédagogique & Q&A Candidats sous les Articles de Blog

## 1. Contexte & Objectifs Produit
Les articles de méthodologie TCF Canada génèrent chez les candidats des interrogations précises sur les subtilités du barème officiel de France Éducation International (FEI) et les critères d'admissibilité IRCC :
- Décompte exact des mots et tolérances de pénalités (Tâche 1, 2 et 3 de l'Expression Écrite).
- Usage des registres de langue et formules d'appel/de politesse.
- Prise de parole en interaction (Tâche 2 de l'Expression Orale) et monologue argumenté (Tâche 3).
- Seuils NCLC 7 et points bonus Entrée Express (+50 points pour profil bilingue).

L'objectif de cette spécification est d'intégrer sous chaque article (`/blog/[slug]`) un **Espace d'Échange Pédagogique certifié** permettant :
1. De consulter des questions d'autres candidats accompagnées des réponses officielles de l'équipe pédagogique Super4C2 (avec citation des critères FEI).
2. De poser une question directement via un formulaire élégant et réactif.
3. De sauvegarder localement les questions soumises (`localStorage`) avec affichage optimiste et badge *"En attente de validation pédagogique"*.
4. De capturer des leads qualifiés (prénom, email) avec consentement bienveillant ("100% Gratuit — Utilisé uniquement pour vous notifier de la réponse du mentor"), renforçant la conversion vers la création de compte.

---

## 2. User Stories
- **US1 — Lecture des Réponses Pédagogiques :** En tant que candidat lisant un article, je veux consulter des questions réalistes et les réponses détaillées d'un examinateur officiel afin de lever mes doutes d'examen.
- **US2 — Poser une Question sans Friction :** En tant que visiteur ou candidat connecté, je veux pouvoir formuler ma question en 2 clics avec mon prénom et mon email optionnel pour recevoir la notification.
- **US3 — Feedback Réactif & Sauvegarde :** Dès que je soumets ma question, je veux la voir apparaître immédiatement en tête de liste avec un statut transparent *"En attente de validation pédagogique"*.
- **US4 — Utilité Communautaire (Upvotes) :** En tant que lecteur, je veux pouvoir voter *"Utile"* sur les questions ou réponses pour indiquer qu'elles m'ont aidé, avec mémorisation de mon vote.

---

## 3. Schéma de Données & Types TypeScript

```typescript
export interface PedagogicalAnswer {
  id: string;
  authorName: string;
  authorRole: string; // ex: "Formateur Agréé FEI • Équipe Super4C2"
  authorAvatar?: string;
  isVerifiedMentor: boolean;
  publishedAt: string;
  content: string;
  feiReference?: string; // ex: "Grille d'évaluation FEI 2024 — Critère Cohérence & Cohésion"
}

export interface PedagogicalComment {
  id: string;
  slug: string; // Slug de l'article ou "*" si global à la catégorie
  category?: string; // "Expression Écrite", "Expression Orale", "Compréhension", "Immigration & CRS"
  authorName: string;
  authorEmail?: string;
  authorBadge?: string; // "Candidat TCF Canada", "Candidat Bilingue NCLC 9"
  publishedAt: string;
  question: string;
  upvotes: number;
  status: "verified" | "pending"; // Les questions créées localement démarrent en pending
  officialAnswer?: PedagogicalAnswer;
}
```

---

## 4. Architecture des Composants

### 4.1 `lib/blog/comments-data.ts`
- Fournit un jeu riche et réaliste de questions/réponses pédagogiques par catégorie (`Expression Écrite`, `Expression Orale`, `Compréhension Écrite`, `Compréhension Orale`, `Immigration & CRS`).
- Chaque réponse officielle cite explicitement les règlements de France Éducation International ou d'IRCC pour asseoir une autorité incontestable.

### 4.2 `components/blog/blog-comments-section.tsx`
- **Composant Client (`"use client"`)**
- Intègre :
  - **En-tête :** Titre, compteur dynamique de questions résolues, badge d'autorité.
  - **Formulaire de question (`BlogQuestionForm`) :**
    - Zone de saisie avec limite souple (400 caractères), nom, email pour notification.
    - Message rassurant sur la gratuité.
    - Détection de la session utilisateur si connecté (Supabase Auth).
  - **Liste des Fils de Discussion :**
    - Questions soumises par l'utilisateur (issues du `localStorage`, affichées avec badge d'attente).
    - Questions certifiées de la base mock pour cet article ou cette catégorie.
    - Bouton d'upvote avec compteur et anti-double vote local.
    - Bloc réponse de l'équipe pédagogique avec style visuel carmin distinctif, badge FEI et citation de référence.

### 4.3 Intégration dans `app/blog/[slug]/page.tsx`
- Inséré entre la section de feedback/réactions de l'article et la section des articles recommandés.
- Reçoit en props : `slug`, `category`, `articleTitle`.

---

## 5. Critères d'Acceptation & Validation
- [x] Rendu immédiat et sans erreur SSR/hydration.
- [x] Filtrage contextuel : les questions affichées correspondent au sujet de l'article (ex. Expression Écrite pour les articles EE).
- [x] Soumission instantanée avec mise à jour optimiste du state et persistance `localStorage`.
- [x] Validation TypeScript stricte (`0 errors`).
- [x] Build Next.js clean (41/41 pages statiques/dynamiques générées).
