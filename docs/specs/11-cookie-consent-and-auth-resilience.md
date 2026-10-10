# Document de Spécification Technique — Consentement des Cookies & Résilience de l'Authentification Super4C2

## 1. Contexte & Objectifs
1. **Conformité Légale & Approbation des Cookies :**
   - Implémenter une bannière de consentement conforme RGPD, ePrivacy et Loi 25 (Québec / Canada).
   - Offrir une granularité claire entre traceurs essentiels, fonctionnels (SRS/audio) et analytiques/performance.
   - Permettre à l'utilisateur de modifier son choix à tout moment depuis le footer ou une page dédiée `/cookies`.
2. **Résilience de l'Authentification Supabase & Prisma :**
   - Garantir que tout identifiant utilisateur est un UUID standard RFC 4122 (`@db.Uuid` sous PostgreSQL), éliminant tout risque d'erreur `22P02 invalid input syntax for type uuid`.
   - Câbler la route `app/auth/callback/route.ts` avec échange de code PKCE pour supporter les emails de confirmation Supabase et connexions magiques.
   - Assurer la synchronisation automatique des profils Prisma lors du premier login d'un candidat.

## 2. Architecture du Consentement des Cookies
- **Clé de stockage LocalStorage :** `super4c2_cookie_consent_v1`
- **Structure JSON :**
  ```typescript
  interface CookiePreferences {
    essential: true;       // Toujours true
    functional: boolean;   // Préférences audio, carnet SRS, thème
    analytics: boolean;    // Métriques de performance IA
    timestamp: string;     // Date ISO du consentement
  }
  ```
- **Cookie HTTP miroité :** `super4c2-consent-state=accepted|custom|rejected` (durée 180 jours, path `/`, SameSite `Lax`).
- **Bus d'Événements Client :**
  - Écoute de `super4c2:open_cookie_preferences` sur `window` pour rouvrir instantanément le modal de réglage sans recharger la page.

## 3. Architecture de l'Authentification Renforcée
- **Identifiant Démo Standardisé :**
  ```typescript
  export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
  ```
- **Génération Sécurisée de Candidat :**
  ```typescript
  const candidateId = crypto.randomUUID();
  ```
- **Échange de Code Supabase :**
  ```typescript
  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }
  ```
