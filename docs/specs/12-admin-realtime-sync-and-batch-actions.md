# Document de Spécification Technique — Synchronisation Temps Réel Admin & Actions Groupées (Batch Actions)

**ID :** SPEC-12  
**Titre :** Synchronisation Intégrale des Données Publiques / Admin & Moteur d'Actions Groupées  
**Statut :** Validé pour Implémentation  
**Auteurs :** Antigravity Agent & Dimitri (@dimitri-snowdev)  

---

## 1. Contexte & Problématique
1. **Désynchronisation Visiteur / Admin :**
   - Sur le site public, les FAQs, témoignages et articles de blog étaient affichés via des tableaux en mémoire statiques (ex: `DEFAULT_FAQS`, `DEFAULT_TESTIMONIALS`), tandis que les pages d'administration (`/admin/faqs`, `/admin/temoignages`, `/admin/blog`) requêtaient la base PostgreSQL Supabase Cloud, qui était encore vierge (`count = 0`).
   - Résultat : l'administrateur voyait des tables vides dans le back-office, et toute création ou mise à jour ne prenait pas effet uniformément.
2. **Absence d'Actions Groupées (Batch Actions) :**
   - L'administration d'éléments multiples (suppression groupée de leads, publication/dépublication en lot de FAQs ou d'articles, export CSV) nécessitait des actions unitaires répétitives.
3. **Tableau de Bord Principal (`/admin`) en Données Fictives :**
   - Les cartes KPI affichaient des constantes statiques ("1 428 candidats", "94.2%"), déconnectées des données de l'application.

---

## 2. Objectifs Techniques & Fonctionnels
1. **Alimentation Exhaustive de Supabase Cloud :**
   - Insérer en base de données de production l'intégralité des FAQs officielles (6 FAQs par défaut + compléments), des témoignages certifiés (8 témoignages), des articles de blog SEO (4 articles complets), des séries et des questions d'examen.
2. **Synchronisation Hybride Résiliente :**
   - Les composants publics (`FaqSection`, `TestimonialsSection`, `BlogIndexPage`) lisent en priorité la base de données PostgreSQL de Supabase Cloud. Si la base est inaccessible, ils conservent un fallback gracieux transparent.
3. **Actions Groupées Réutilisables (`AdminBatchActionBar`) :**
   - Implémenter un composant universel d'actions en lot :
     - Sélection multiple par case à cocher.
     - Barre d'outils flottante animée (Framer Motion).
     - Server Actions pour suppression groupée (`batchDeleteFaqs`, `batchDeleteLeads`, etc.).
     - Server Actions pour modification de statut groupée (`batchToggleActive`, `batchUpdateStatus`).
     - Export CSV instantané encodé en UTF-8.
4. **Dashboard de Supervision Réel (`/admin`) :**
   - Raccorder les KPIs aux requêtes Prisma directes :
     - Nombre réel d'utilisateurs et de candidats (`prisma.user.count()`).
     - Nombre de séries officielles et de questions actives.
     - Nombre de demandes conciergerie / leads en attente.
     - Nombre d'inscrits à la newsletter.
     - Liste réelle des candidats avec leurs scores et statuts NCLC.

---

## 3. Schéma d'Endpoints & Server Actions

### 3.1 Actions Groupées FAQs (`app/admin/faqs/actions.ts`)
```typescript
export async function batchDeleteFaqsAction(ids: string[]): Promise<{ ok: boolean; count?: number; error?: string }>
export async function batchToggleFaqsActiveAction(ids: string[], isActive: boolean): Promise<{ ok: boolean; count?: number; error?: string }>
```

### 3.2 Actions Groupées Demandes / Leads (`app/admin/leads/actions.ts`)
```typescript
export async function batchDeleteLeadsAction(ids: string[]): Promise<{ ok: boolean; count?: number; error?: string }>
export async function batchUpdateLeadStatusAction(ids: string[], status: LeadStatus): Promise<{ ok: boolean; count?: number; error?: string }>
```

### 3.3 Actions Groupées Blog & Témoignages
```typescript
export async function batchDeleteBlogPostsAction(ids: string[]): Promise<{ ok: boolean; count?: number; error?: string }>
export async function batchToggleBlogPublishAction(ids: string[], isPublished: boolean): Promise<{ ok: boolean; count?: number; error?: string }>
export async function batchDeleteTestimonialsAction(ids: string[]): Promise<{ ok: boolean; count?: number; error?: string }>
```

---

## 4. Matrice de Validation & Tests
- [ ] Base de données Supabase Cloud peuplée avec >0 FAQs, >0 témoignages, >0 articles et >0 séries d'examen.
- [ ] Visite de `/admin/faqs` : affichage des FAQs réelles, test de suppression groupée et de changement de statut.
- [ ] Visite de `/faq` et de la page d'accueil : les FAQs proviennent de la base et reflètent les modifications administratives.
- [ ] Visite de `/admin` : les cartes de métriques KPI et la liste des candidats affichent les données réelles de la base.
- [ ] Export CSV fonctionnel sur les tables avec encodage des caractères accentués (BOM UTF-8).
