# Spécification Technique 16 : Lancement 100% Gratuit, Verrouillage Auth & UX Dashboard Candidat

**Date :** 12 Octobre 2026  
**Auteur :** Antigravity Agent & Dimitri (@dimitri-snowdev)  
**Projet :** Super4C2  
**Statut :** Approuvé & En cours d'implémentation

---

## 1. Objectifs & Périmètre

1. **Masquage / Retrait Intégral du Système Tarifaire** :
   - L'application est gratuite pour tous les candidats pendant la période de lancement.
   - Suppression du lien "Tarifs" dans la barre de navigation et dans le pied de page.
   - Redirection de `/tarifs` et `/checkout` vers `/dashboard` (ou `/auth/register` si non connecté).
   - Remplacement de tout bouton payant par *"Commencer gratuitement"* ou *"Accès Lancement 100% Gratuit"*.

2. **Disponibilité des Disciplines TCF Canada** :
   - **Actives & Disponibles immédiatement** :
     - **Expression Écrite (EE)** : Hub en 3 paliers, entraînement tâche par tâche (T1 15m, T2 20m, T3 25m), simulation CBT 60m, correction IA FEI, Magic Rewrite C1/C2.
     - **Expression Orale (EO)** : Pré-test matériel, studio 16:9, entretien dirigé IA avec M. Laurent, transcription et débriefing.
   - **En statut "Bientôt disponible"** :
     - **Compréhension Écrite (CE)** : Badge *"🔒 Bientôt disponible — Calibrage FEI en cours"*, bouton inerte avec dialogue informatif expliquant l'arrivée imminente des 39 questions officielles.
     - **Compréhension Orale (CO)** : Même badge et dialogue informatif.
     - Redirection automatique si tentative d'accès par URL directe (`/examens/[seriesId]/ce` ou `co`) vers `/examens/[seriesId]`.

3. **Verrouillage du Système (Auth Gating)** :
   - Mise à niveau de `middleware.ts` pour protéger l'ensemble des simulateurs et outils :
     - Routes protégées : `/dashboard`, `/account`, `/examens`, `/examens/*`, `/carnet-erreurs`, `/sujets-recents`, `/communaute`.
     - Routes publiques autorisées : `/`, `/blog*`, `/faq`, `/contact`, `/mentions-legales`, `/confidentialite`, `/cookies`, `/calculateur-crs`, `/nclc-calculator`, `/auth/*`.
   - Si un utilisateur non authentifié tente d'accéder à une route protégée : redirection automatique vers `/auth/login?next=[encoded_path]`.

4. **Flux UX Candidat à la Connexion & Dashboard Repensé (`/dashboard`)** :
   - Après connexion (ou inscription), si `next` est présent, redirection vers la ressource demandée.
   - Si aucun paramètre `next` : redirection vers le **Tableau de Bord Candidat (`/dashboard`)**.
   - Le dashboard candidat affiche :
     - Bandeau festif de gratuité lancement.
     - Widget d'accueil du Compagnon 3D (Kodiak, Aura ou Barnabé) avec message oral et écrit.
     - 2 grandes cartes d'action rapide pour les compétences phares (EE et EO).
     - Cartes informatives pour CE et CO.
     - Compte à rebours vers la date d'examen officiel.
     - Historique des évaluations et carnet d'erreurs SRS.

---

## 2. Matrice des Routes & Permissions

| Route | Statut d'Accès | Comportement si non connecté | Comportement si connecté |
|---|---|---|---|
| `/` | Public | Accès normal | Accès normal (CTA menant au Dashboard) |
| `/auth/login` | Public | Formulaire de connexion | Redirection vers `/dashboard` |
| `/auth/register` | Public | Formulaire d'inscription gratuite | Redirection vers `/dashboard` |
| `/tarifs` | Masqué | Redirection vers `/auth/register` | Redirection vers `/dashboard` |
| `/checkout` | Masqué | Redirection vers `/auth/register` | Redirection vers `/dashboard` |
| `/dashboard` | Protégé | Redirection vers `/auth/login?next=/dashboard` | Tour de contrôle candidat |
| `/account` | Protégé | Redirection vers `/auth/login?next=/account` | Gestion du profil & date d'examen |
| `/examens` | Protégé | Redirection vers `/auth/login?next=/examens` | Hub des examens TCF / IELTS |
| `/examens/[seriesId]/ee/*` | Protégé | Redirection vers `/auth/login?next=...` | Hub & simulateur d'Expression Écrite |
| `/examens/[seriesId]/eo/*` | Protégé | Redirection vers `/auth/login?next=...` | Salle d'Expression Orale IA |
| `/examens/[seriesId]/ce` | Protégé | Redirection vers `/auth/login?next=...` | Redirection vers `/examens/[seriesId]` + Toast d'information |
| `/examens/[seriesId]/co` | Protégé | Redirection vers `/auth/login?next=...` | Redirection vers `/examens/[seriesId]` + Toast d'information |
| `/carnet-erreurs` | Protégé | Redirection vers `/auth/login?next=/carnet-erreurs` | Réviseur SM-2 des pièges |
| `/calculateur-crs` | Public | Outil libre avec capture lead | Outil libre |

---

## 3. Plan d'Implémentation & Fichiers Cibles

1. `middleware.ts` : Extension du filtre `isProtected` pour inclure `/examens`, `/carnet-erreurs`, `/sujets-recents`, `/communaute`.
2. `components/site-nav.tsx` & `components/site-footer.tsx` : Retrait de "Tarifs", ajout de l'accès gratuit.
3. `app/tarifs/page.tsx` & `app/checkout/page.tsx` : Redirections directes avec notification de gratuité.
4. `app/examens/page.tsx`, `app/examens/[seriesId]/page.tsx`, `components/exam/exam-roadmap-board.tsx` : Marquage de CE et CO en "Bientôt disponible" avec dialogue explicatif et focus sur EE et EO.
5. `app/examens/[seriesId]/ce/page.tsx` & `co/page.tsx` : Interception pour rediriger vers la page parente avec information claire.
6. `app/dashboard/page.tsx` : Nouveau tableau de bord premium avec compagnon 3D, accès direct EE/EO, bandeau 100% gratuit et suivi.
