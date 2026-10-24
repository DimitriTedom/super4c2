# Brand & Design Canvas : Favoris Candidat & Réactions d'Utilité du Blog

## 1. Vision & Objectif Émotionnel
- **Rôle Produit :** Transformer la lecture passive d'un article de blog en un engagement actif et personnel, tout en créant le déclencheur n°1 d'inscription gratuite : la mise en favoris d'un guide stratégique pour ses révisions.
- **Tonalité de Marque :**
  - **Bienveillante & Certifiante :** L'accent est mis sur l'aide à la réussite du candidat (déblocage des 50 points CRS, palier NCLC 7).
  - **Prestigieuse (EdTech / Fintech moderne) :** Micro-animations délicates, retour haptique visuel, tokens sémantiques HSL soignés, absence totale de friction agressive.
  - **100% Gratuite & Désintéressée :** Aucun blocage payant. La création de compte est offerte comme un service de sauvegarde et d'entraînement pour le candidat.

---

## 2. Système Visuel & Tokens Graphiques

### 2.1. Bouton de Favoris (`BlogBookmarkButton`)
- **État Inactif (Non sauvegardé) :**
  - Contour doux `border border-border/70 bg-card hover:bg-muted text-muted-foreground hover:text-foreground`.
  - Icône `Bookmark` en trait fin (1.5px).
- **État Actif (Sauvegardé) :**
  - Remplissage rouge carmin marque : `bg-primary/10 border-primary/30 text-primary`.
  - Icône `Bookmark` pleine (`fill-primary text-primary`).
  - Animation `scale(1.15)` puis retour doux à `scale(1)` pour célébrer l'action.
- **Étiquette :**
  - En mode compact (carte catalogue) : icône seule avec infobulle accessible.
  - En mode complet (en-tête d'article) : icône + texte dynamique *« Sauvegarder »* / *« Sauvegardé »*.

### 2.2. Modale de Conversion Contextuelle (`BlogBookmarkAuthDialog`)
- **Déclenchement :** Au clic sur le bouton Favoris par un utilisateur non authentifié.
- **En-tête Visuel :**
  - Orbe rouge carmin avec icône `BookmarkCheck` illuminée.
  - Titre percutant : *« Sauvegardez ce guide dans vos favoris »*.
  - Sous-titre rassurant : *« Retrouvez toutes vos fiches méthodes et formules C1/C2 au même endroit la veille de votre épreuve. »*.
- **3 Avantages Clés (Puces Émeraude) :**
  1. *Accès permanent et synchronisé sur mobile et ordinateur.*
  2. *Sauvegarde automatique de vos scores et chronos d'entraînement.*
  3. *100% Gratuit — Sans carte bancaire requise.*
- **Appel à l'Action Principal :**
  - `ShimmerButton` rouge carmin : *« Créer mon compte gratuit en 30s »* pointant vers `/auth/register?source=blog_bookmark`.
  - Lien secondaire discret : *« Déjà inscrit ? Se connecter »* vers `/auth/login`.

### 2.3. Widget d'Évaluation & Claps Pédagogiques (`BlogArticleFeedback`)
- **Emplacement :** Fin du corps de l'article, juste avant l'encart WhatsApp et la bio de l'auteur.
- **Architecture du Bloc :**
  - Fond dégradé subtil `bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border border-border/80 p-6`.
  - Titre : *« Ce guide vous a-t-il aidé dans votre préparation ? »*.
  - Sous-titre de réassurance : *« Votre avis aide l'équipe pédagogique Super4C2 à perfectionner nos corrigés. »*.
- **3 Boutons d'Action Réactifs :**
  - 👍 **Utile** (`ThumbsUp`) : Bouton vert menthe doux au survol, incrément dynamique du compteur.
  - ❤️ **Inspirant / Bravo** (`Heart`) : Bouton carmin doux au survol avec pulsation délicate.
  - 🔖 **Sauvegarder** (`Bookmark`) : Synchronisé avec l'état global du favori.
- **Indicateur de Satisfaction Communautaire :**
  - Pastille d'autorité : *« 98% des candidats ont trouvé ce guide utile pour l'examen officiel TCF »*.
- **État Post-Vote :**
  - Toast Sonner de gratitude et message de remerciement doux : *« Merci pour votre retour ! »*.

---

## 3. Ergonomie & Micro-Interactions
- **Persistance Zéro-Latency :** Utilisation conjointe de `localStorage` (`super4c2:saved_articles` et `super4c2:article_reactions`) et des sessions candidates pour garantir que l'interface réagit instantanément sans rechargement.
- **Filtre Dédié sur `/blog` :** Ajout d'une pastille *« 🔖 Mes Favoris (N) »* dans la barre des filtres du catalogue pour afficher d'un clic ses fiches de révision enregistrées.
