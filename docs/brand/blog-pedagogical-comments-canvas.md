# Brand & Design Canvas : Espace d'Échange Pédagogique & Questions Candidats du Blog

## 1. Vision & Tonalité
- **Rôle Produit :** Transformer les articles en salons de mentorat interactifs où chaque candidat peut poser ses questions spécifiques d'examen et obtenir des réponses certifiantes de correcteurs officiels FEI.
- **Tonalité de Marque :**
  - **Mentor & Académique Bienveillant :** Des réponses précises, rassurantes, basées strictement sur les textes officiels de France Éducation International et d'IRCC.
  - **Preuve Sociale Inattaquable :** Présenter des échanges réalistes qui dissipent l'angoisse des candidats (décompte de mots, formules autorisées, gestion du temps, accent à l'oral).
  - **Engagement Communautaire :** Valoriser les réponses de l'équipe avec un badge exclusif *« Réponse Certifiée FEI »* ou *« Expert Super4C2 »*.

---

## 2. Codes Visuels & Architecture UI

### 2.1. Structure du Bloc (`BlogCommentsSection`)
- **Emplacement :** En bas d'article, après la bio de l'auteur et les boutons d'évaluation, avant les articles recommandés.
- **En-tête de Section :**
  - Titre : *« Questions & Réponses Pédagogiques »*.
  - Badge dynamique : *« X échanges de candidats vérifiés »*.
  - Sous-titre : *« Une incertitude sur cette tâche ou sur le barème FEI ? Posez votre question à nos experts du TCF Canada. »*.

### 2.2. Cartes de Commentaires & Fils de Discussion
- **Question du Candidat :**
  - Avatar rond avec initiale colorée, prénom, date relative (ex. *« Il y a 2 jours »*), badge candidat.
  - Corps de la question typographié avec soin.
  - Bouton discret d'upvote : *« Utile (X) »* avec icône `ThumbsUp`.
- **Réponse Pédagogique Officielle (Filet Indenté) :**
  - Encart légèrement teinté avec bordure gauche rouge carmin (`border-l-2 border-primary bg-primary/[0.03] p-4 rounded-xl`).
  - Badge d'autorité vert/carmin : *« Réponse Officielle • Équipe Pédagogique Super4C2 »*.
  - Avatar officiel du mentor (ex. Dimitri Tedom ou M. Laurent Mercier).
  - Explications structurées avec citations des critères FEI.

### 2.3. Formulaire de Soumission (`CommentForm`)
- **Champs Épurés :**
  - Textarea réactif : *« Posez votre question sur cette tâche ou ce barème... »* (hauteur auto, compteur de caractères).
  - Si non connecté : prénom + email (avec mention : *« 100% Gratuit — Utilisé uniquement pour vous notifier de la réponse du mentor »*).
  - Si connecté : détection automatique du compte candidat avec badge *« Connecté en tant que [Prénom] »*.
  - Bouton d'action : `Envoyer ma question au mentor →` avec spinner de validation et toast Sonner de succès.

---

## 3. Micro-Interactions & Persistance
- **Ajout Instantané Réactif :** Lorsque le candidat soumet une question, elle s'affiche immédiatement en tête de liste avec le badge ambré doux *« En attente de validation pédagogique »*.
- **Persistance Locale (`localStorage`) :** Mémorise les questions de l'utilisateur sur son appareil et les upvotes pour éviter les doublons.
