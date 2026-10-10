# Spécification Technique : Navigation Loaders & Feedback System

**Numéro de Spec :** 13  
**Statut :** Validé & En cours d'implémentation  
**Périmètre :** Rendu React 19 / Next.js 15 App Router, Navigation client/serveur, Suspense fallbacks.

---

## 1. Contexte & Problématique

Dans l'architecture Next.js 15 App Router :
1. Les Server Components (`app/admin/page.tsx`, `app/admin/faqs/page.tsx`, etc.) s'exécutent côté serveur et effectuent des requêtes asynchrones vers PostgreSQL (Supabase Cloud).
2. Lors d'un clic sur un `<Link href="...">`, Next.js déclenche une transition de route asynchrone. En l'absence de fichiers `loading.tsx` ou d'indicateur visuel au sommet de la page, l'écran reste statique sans aucune réaction visible jusqu'à l'arrivée de la réponse serveur, donnant une impression de lenteur ou de gel applicatif.
3. Cette spécification standardise :
   - Un **Top Navigation Progress Bar** global monté au niveau de `app/layout.tsx`.
   - Des fichiers `loading.tsx` stratégiques pour chaque route du back-office et de l'espace examen.
   - Un indicateur de transition local dans `AdminShell` informant l'administrateur de l'élément en cours de chargement.

---

## 2. Architecture Technique

### A. Composant `NavigationProgressBar` (`components/navigation/navigation-progress-bar.tsx`)
- Écoute les événements de clic sur les balises `<a>` internes (sans `target="_blank"`, sans touche modificateur `Ctrl`/`Cmd`, sans ancre `#`).
- Initialise un timer de progression non bloquant :
  - Étape 1 : 0% ➔ 30% instantanément.
  - Étape 2 : Ralentissement logarithmique jusqu'à 85%.
  - Fin : Détection du changement de `pathname` / `searchParams` ➔ Saut à 100% et fondu de sortie.
- Utilise `usePathname()` et `useSearchParams()` enveloppés dans un boundary de sécurité.
- Timeout de sécurité automatique à 8000ms pour réinitialiser la barre en cas d'annulation ou d'erreur réseau.

### B. Suspense Fallbacks Route par Route (`loading.tsx`)
- `app/loading.tsx` : Squelette global pour les pages publiques.
- `app/admin/loading.tsx` : Squelette exécutif (Header + 4 KPIs + Cartes cohortes).
- `app/admin/faqs/loading.tsx` : Squelette de tableau FAQs (Filtres + Lignes).
- `app/admin/leads/loading.tsx` : Squelette des cartes de leads conciergerie.
- `app/admin/temoignages/loading.tsx` : Squelette de tableau témoignages.
- `app/admin/blog/loading.tsx` : Squelette de tableau d'articles.
- `app/examens/loading.tsx` : Squelette de salle d'examen CBT.

### C. State de Navigation dans `AdminShell`
- `pendingHref: string | null`
- Lors du clic sur un lien de menu différent de la page actuelle :
  - `setPendingHref(targetHref)`
  - Affichage d'un micro-spinner Loader2 ou pulse sur l'icône du lien.
  - Dès que `pathname === targetHref`, `pendingHref` est réinitialisé à `null`.
