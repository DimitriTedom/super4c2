# Spécification Technique : Favoris Candidat & Réactions d'Utilité du Blog

## 1. Contexte & Objectifs Métier
- **Problématique :** Les visiteurs lisent les guides du blog de manière anonyme et éphémère. Sans mécanisme d'accroche immédiat, ils quittent le site après lecture sans créer de compte.
- **Solution (Option A) :**
  1. Donner au lecteur la possibilité de **mettre en favoris** n'importe quel guide d'un clic (sur `/blog` ou dans `/blog/[slug]`).
  2. S'il n'a pas encore de compte, le clic déclenche une boîte de dialogue contextuelle montrant la valeur ajoutée d'un compte gratuit (sauvegarde permanente des fiches et des scores).
  3. Fournir un widget de feedback immédiat en fin d'article pour évaluer l'utilité du guide, encourager les réactions (Utile, Inspirant) et afficher une preuve sociale d'excellence (98% de satisfaction).

---

## 2. User Stories
- **US-1 (Mise en Favoris Rapide) :** En tant que candidat, je peux cliquer sur l'icône marque-page d'une carte d'article ou de l'en-tête d'un guide pour l'enregistrer dans mes fiches de révision.
- **US-2 (Conversion Non-Authentifié) :** En tant que visiteur sans compte, lorsque je clique pour sauvegarder un guide, une modale engageante m'invite à créer mon compte gratuit en 30s sans carte bancaire, avec redirection pré-remplie.
- **US-3 (Filtre Mes Favoris) :** En tant que candidat ayant sauvegardé des articles, je peux cliquer sur le filtre *« Mes Favoris (N) »* sur `/blog` pour n'afficher que mes guides enregistrés.
- **US-4 (Évaluation d'Article) :** En tant que lecteur en fin d'article, je peux voter *« Utile »* ou *« Inspirant »* pour remercier l'équipe et exprimer mon appréciation en 1 clic.
- **US-5 (Mémorisation de Vote) :** Mon vote est mémorisé localement pour éviter les votes multiples accidentels tout en actualisant instantanément le compteur d'appréciation.

---

## 3. Architecture Technique des Composants

```
components/blog/
├── blog-bookmark-button.tsx       # Bouton réactif avec micro-animations
├── blog-bookmark-dialog.tsx       # Modale de conversion compte gratuit
├── blog-article-feedback.tsx      # Widget de réactions fin d'article
└── blog-index-client.tsx          # Intégration du filtre "Mes Favoris"
```

### 3.1. Hook de Gestion des Favoris (`useBlogBookmarks`)
- Fichier : `lib/blog/use-blog-bookmarks.ts`
- Clé de stockage : `super4c2:bookmarked_slugs` (tableau de slugs JSON dans `localStorage` + sync événement custom pour réactivité multi-composants sans rechargement).
- Méthodes exposées :
  - `isBookmarked(slug: string): boolean`
  - `toggleBookmark(slug: string): boolean` (renvoie le nouvel état)
  - `bookmarkedSlugs: string[]`
  - `count: number`

### 3.2. Hook de Gestion des Réactions (`useArticleReactions`)
- Fichier : `lib/blog/use-article-reactions.ts`
- Clé de stockage : `super4c2:article_reactions` (objet `{ [slug]: { utile: boolean, inspired: boolean } }`).
- Compteurs de base simulés avec incrément persistant local.

---

## 4. Cas Limites & Résilience
1. **SSR / Hydratation Client :** Les hooks doivent attendre le montage côté client (`useEffect`, `hasMounted: true`) pour éviter tout décalage d'hydratation entre le rendu serveur et l'état `localStorage`.
2. **Quota LocalStorage Dépassé :** Enveloppé systématiquement dans des blocs `try/catch` avec repli en mémoire vive.
3. **Multi-onglets :** Utilisation de l'événement standard `window.addEventListener("storage", ...)` pour synchroniser instantanément les favoris entre plusieurs onglets ouverts.
