# Spec — Historique & Corrections « Studio »

## Objectif
Permettre au candidat de retrouver, filtrer, trier et ré-étudier chaque épreuve passée,
avec un tableau scalable (centaines de lignes) et une page de détail par tentative.
Référence UX : tableau de contenus YouTube Studio. Benchmark : Objectif Canada
(`/dashboard/tcfhistory` → modale « Choisissez une épreuve » → `/detail/TCF/CO/:id`, défilement
infini de 39 blocs, aucun filtre ni pagination).

## User stories
1. Je vois toutes mes tentatives dans un tableau trié par date décroissante.
2. Je recherche (texte), filtre par épreuve et par statut (NCLC 7+ / à consolider), et trie par date, note, NCLC.
3. Je choisis 5 / 10 / 25 / 50 lignes par page ; le pied de tableau affiche « 1–10 sur N » + pagination.
4. Un clic sur une ligne ouvre `/dashboard/historique/[attemptId]` (détail complet).
5. Depuis une ligne : « Voir » (détail), « PDF » (export direct), « Refaire » (relance l'épreuve).
6. Sans tentative : état vide + lien vers un exemple (`/dashboard/historique/demo`).

## Données (existant, Prisma `UserAttempt`)
`id, discipline, rawScore, tcfScaledScore, nclcLevel, crsPointsUnlocked, answers (Json: string[3] pour EE), feedback (Json: WrittenExamResult), createdAt, completedAt`.
Aucun changement de schéma. Les helpers `lib/dashboard/attempt-utils.ts` normalisent `answers`/`feedback`.

## Routes
- `GET /dashboard/historique/[attemptId]` — server component, `findFirst({ id, userId })`, 404 si inconnu, `demo` = tentative d'exemple sans DB.

## États UI
- Table : chargement n/a (SSR), vide, aucun résultat de filtre (bouton « Réinitialiser »), pagination bornée.
- Détail : onglets Tâche 1/2/3, rédaction soumise, décompte de mots, grille FEI /5 ×4, Magic Rewrite C2, export PDF, retour historique.

## Cas limites
- `feedback`/`answers` stockés en string JSON ou null → fallback à 0 sans exception.
- Changement de filtre/taille de page → retour page 1.
- Tentatives futures CE/CO (QCM) : le détail utilisera une grille 1–39 (vert/rouge) + filtre « mes erreurs » + explication/piège par question (hors périmètre tant que les réponses QCM ne sont pas persistées).
