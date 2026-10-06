# Super4C2 — Antigravity Agent Guidelines & Rules

## 1. Memory Bank Enforcement
- Le dossier `memory-bank/` à la racine est la **source de vérité pérenne** du projet.
- **Au début de chaque session ou tâche :** L'agent doit toujours vérifier `memory-bank/activeContext.md` et `memory-bank/progress.md` pour se synchroniser avec l'état d'avancement exact.
- **À la fin de chaque étape significative :** Mettre à jour `activeContext.md` et `progress.md` (ainsi que `systemPatterns.md` ou `techContext.md` si l'architecture ou les dépendances évoluent).

## 2. Règle d'Or du Développement : Best Practices & Spécifications Structurées
Pour chaque fonctionnalité majeure, l'agent doit impérativement suivre le flux en 3 étapes :
1. **Étape 1 — Brand & Design Canvas (`docs/brand/`) :** Définir la direction visuelle, les composants UI, la tonalité et l'identité de marque avant de coder l'interface.
2. **Étape 2 — Document de Spécification (`docs/specs/*.md`) :** Rédiger un document de spécification clair en Markdown décrivant les user stories, le schéma de données, les endpoints d'API, les états UI et les cas limites.
3. **Étape 3 — Implémentation & Tests :** Coder en respectant rigoureusement la spec, avec typage strict TypeScript, composants Shadcn UI réutilisables, validation Zod, et gestion gracieuse des erreurs.

## 3. Qualité Visuelle & UX
- L'interface doit être irréprochable et donner une impression haut de gamme (Fintech / EdTech moderne).
- Éviter les designs génériques ou simplistes. Utiliser une palette soignée (HSL / CSS variables), des micro-animations subtiles avec Framer Motion, et une ergonomie adaptée au stress des candidats d'examen.
- Mode Examen : reproduction exacte des standards officiels de France Éducation International (pas de scroll infini, navigation par grille de questions, compte à rebours précis).
