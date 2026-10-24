# Spécification Technique : Filtres Avancés & Tri Intelligent du Blog

## 1. Contexte & Objectifs
- **Problématique :** Avec la croissance du catalogue (12+ articles couvrant l'Expression Écrite, Orale, l'Entrée Express, la Compréhension et les Favoris), les simples onglets de catégories statiques deviennent insuffisants pour un ciblage rapide.
- **Solution (Option B) :**
  - Moteur de filtrage multi-critères combinant :
    1. **Discipline / Compétence** (Tous, Expression Écrite, Expression Orale, Entrée Express / CRS, Compréhension, IELTS, Favoris).
    2. **Temps de lecture** (Tous, < 5 min, 5–9 min, 10+ min).
    3. **Recherche plein-texte** (Titre, extrait, tags, mots-clés cibles).
    4. **Ordre de tri** (Récents, Recommandés, Lecture courte, Lecture approfondie).
  - Feedback immédiat sur le volume de résultats et bouton de réinitialisation contextuel.

---

## 2. Spécification des Types & Logique de Filtrage

### 2.1. Types de Filtrage
```typescript
export type DisciplineFilter =
  | "ALL"
  | "EE"           // Expression Écrite
  | "EO"           // Expression Orale
  | "CRS"          // Entrée Express & CRS
  | "COMPREHENSION"// Compréhension Écrite & Orale
  | "IELTS"        // IELTS General
  | "FAVORITES";   // Bookmarks du candidat

export type DurationFilter =
  | "ALL"
  | "SHORT"        // <= 5 min
  | "MEDIUM"       // 6 à 9 min
  | "DEEP";        // >= 10 min

export type SortOption =
  | "NEWEST"       // Plus récents
  | "FEATURED"     // À la une / Recommandés
  | "READ_TIME_ASC"// Plus rapide à lire
  | "READ_TIME_DESC";// Plus complet
```

### 2.2. Algorithme de Correspondance Multi-Critères
Un article $P$ est retenu si et seulement si :
1. **Recherche textuelle :** `query.length === 0` OU le titre, l'extrait, un tag ou le mot-clé contient la chaîne recherchée.
2. **Discipline :**
   - Si `ALL` : toujours vrai.
   - Si `FAVORITES` : `isBookmarked(P.slug)`.
   - Si `EE` : la catégorie ou le slug contient `ecrite`, `écrite`, `tache` ou `tâche`.
   - Si `EO` : la catégorie ou le slug contient `orale` ou `oral`.
   - Si `CRS` : la catégorie est `ENTREE_EXPRESS` ou mentionne `crs` ou `immigration`.
   - Si `COMPREHENSION` : le titre/slug mentionne `comprehension` ou `pièges`.
   - Si `IELTS` : la catégorie est `IELTS_CANADA`.
3. **Durée de lecture :**
   - Si `SHORT` : `P.readTimeMinutes <= 5`.
   - Si `MEDIUM` : `P.readTimeMinutes >= 6 && P.readTimeMinutes <= 9`.
   - Si `DEEP` : `P.readTimeMinutes >= 10`.
4. **Tri (Sorting) :**
   - `NEWEST` : ordre antichronologique.
   - `FEATURED` : articles mis à la une en premier (`featured === true`), puis date.
   - `READ_TIME_ASC` : `P1.readTimeMinutes - P2.readTimeMinutes`.
   - `READ_TIME_DESC` : `P2.readTimeMinutes - P1.readTimeMinutes`.

---

## 3. Composants à Déployer & Modifier
1. `components/blog/blog-filter-bar.tsx` : Composant dédié avec sélection visuelle des compétences, filtres de durée, menu de tri et compteur dynamique.
2. `components/blog/blog-index-client.tsx` : Orchestrateur intégrant la barre de filtres avancés et la grille réactive.
