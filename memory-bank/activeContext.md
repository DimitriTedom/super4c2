# Active Context: Super4C2

## 1. Focus Actuel
- **Résolution complète de l'erreur de rendu dev & build :**
  - Conflit d'importation `next/headers` résolu (découplage Server/Client via slot prop dans `AppShell`).
  - Cache corrompu purgé et processus orphelins sur le port 3000 nettoyés.
  - Le serveur Next.js tourne proprement sur `http://localhost:3000` et toutes les routes principales (`/`, `/examens`, `/nclc-calculator`, `/carnet-erreurs`, `/tarifs`, `/examens/demo-101/ce`, `/examens/demo-101-ee/ee`, `/examens/demo-101-eo/eo`) renvoient **HTTP 200**.
  - Liens du catalogue d'examen corrigés vers les écrans d'instructions dédiés (`/ee/intro` et `/eo/intro`).
  - Autorisation micro `microphone=(self)` activée dans `next.config.ts` pour l'enregistrement oral.

## 2. Décisions Récentes
- **Architecture SSR / Client :** Aucun composant client n'importe directement `site-header` ou `lib/supabase/server.ts`. Le header est passé comme ReactNode serveur injecté depuis `app/layout.tsx`.
- **Permissions-Policy :** Activation du microphone pour permettre au Voice Agent d'enregistrer la voix du candidat en Expression Orale.
- **Git Commit :** `947aaaa` sur `main`.

## 3. Prochaines Étapes Immédiates
1. Vérification interactive dans le navigateur par l'utilisateur.
2. Connexion de la base de données PostgreSQL / Supabase dès que le service Docker local est redémarré.
3. Finalisation des webhooks Stripe pour le checkout sur `/tarifs`.
