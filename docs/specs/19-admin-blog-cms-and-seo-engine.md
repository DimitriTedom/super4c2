# 19. Spécification Technique & Fonctionnelle : CMS Blog & SEO Studio Back-Office (`/admin/blog`)

**Version :** 1.0 — Octobre 2026  
**Module :** Back-Office Administration & Moteur SEO Organique (`/admin/blog`)  
**Statut :** Spécifié & En cours d'implémentation (Jalon 1)

---

## 1. Objectifs & Bénéfices Métier
1. **Autonomie Éditoriale Totale :** Permettre à Dimitri et à l'équipe pédagogique de publier un article d'autorité SEO optimisé en moins de 5 minutes, sans recourir à un développeur ni modifier le code source.
2. **Supériorité Concurrentielle (vs Objectif Canada) :** Capter les requêtes de recherche stratégiques des candidats au TCF Canada et Entrée Express via un maillage interne millimétré, l'intégration vidéo YouTube pour maximiser le temps de rétention (*Dwell Time*), et des Call-To-Action dynamiques orientant vers les simulateurs de Super4C2.
3. **Productivité d'Administration :** Intégration des actions en lot (*Batch Actions*), export CSV compatible Excel (UTF-8 BOM), bascule rapide de statut de publication et mise à la une en 1 clic.

---

## 2. Architecture & Modèle de Données

### Schéma de Données (`BlogPost` dans `prisma/schema.prisma`)
```prisma
model BlogPost {
  id             String    @id @default(cuid())
  title          String
  slug           String    @unique
  excerpt        String    @db.Text
  content        String    @db.Text // Markdown enrichi
  coverImage     String?
  youtubeUrl     String?   // URL ou ID de vidéo YouTube
  targetKeyword  String?   // Mot-clé principal ciblé pour l'audit SEO
  authorName     String    @default("Équipe Pédagogique Super4C2")
  authorRole     String    @default("Expert NCLC & Ancien Correcteur FEI")
  readingMinutes Int       @default(5)
  category       String    // "Stratégie TCF", "Entrée Express & CRS", "Expression Écrite", etc.
  tags           String[]  @default([])
  featured       Boolean   @default(false)
  isPublished    Boolean   @default(true)
  viewCount      Int       @default(0)
  ctaType        String?   @default("CRS_CALCULATOR") // "CRS_CALCULATOR", "CBT_EXAM", "RECENT_TOPICS", "COMMUNITY", "FREE_TEST"
  ctaLabel       String?   // Libellé personnalisé du bouton d'action
  ctaUrl         String?   // URL cible de redirection
  publishedAt    DateTime  @default(now())
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@map("blog_posts")
  @@index([slug])
  @@index([category, isPublished])
}
```

---

## 3. Endpoints & Server Actions (`app/admin/blog/actions.ts`)

| Action | Signature | Rôle & Effets de Bord |
|---|---|---|
| `createBlogPostAction` | `(formData: FormData) => Promise<void>` | Valide les champs, calcule automatiquement le temps de lecture (~200 mots/min), résout les collisions de slug, insère en base et redirige avec toast. |
| `updateBlogPostAction` | `(formData: FormData) => Promise<void>` | Met à jour l'article existant, revalide le cache Next.js (`/admin/blog`, `/blog`, `/blog/[slug]`). |
| `deleteBlogPostAction` | `(formData: FormData) => Promise<void>` | Suppression unitaire avec dialogue de confirmation. |
| `toggleBlogPostPublishAction` | `(formData: FormData) => Promise<void>` | Bascule instantanée entre *Publié* et *Brouillon*. |
| `toggleBlogPostFeaturedAction` | `(formData: FormData) => Promise<void>` | Bascule instantanée du statut vedette *À la une*. |
| `batchDeleteBlogPostsAction` | `(ids: string[]) => Promise<{ count: number }>` | Suppression groupée atomique d'articles sélectionnés. |
| `batchUpdateBlogPostsPublishAction` | `(ids: string[], isPublished: boolean) => Promise<{ count: number }>` | Publication ou mise en brouillon en masse d'une sélection. |

---

## 4. Composants UI & Expérience Administrateur

### 4.1. Tableau de Bord `/admin/blog`
- **En-tête & KPIs :** 4 cartes métriques (Total, Publiés, Brouillons, Vues).
- **Barre d'Outils :** Recherche texte libre, filtres rapides par statut, filtre par catégorie thématique.
- **Tableau Client Interactif (`BlogListClient`) :**
  - Sélection unitaire et globale.
  - Barre flottante réactive `AdminBatchActionBar`.
  - Export CSV direct encodé UTF-8 BOM avec séparateurs point-virgule (compatible Excel/Sheets).
  - Lignes complètes avec miniature, mot-clé, date, vues, switch publication et menu d'actions.
- **Gestionnaire de Pagination :** Intégration de `AdminTablePagination`.

### 4.2. Formulaire Éditeur Haute Fidélité (`BlogForm`)
- **Onglet Métadonnées & Structure :**
  - Titre avec jauge de longueur Google SERP (50-60 car.).
  - Slug dynamique avec mode édition manuelle ou synchronisation automatique.
  - Mot-clé principal (*Focus Keyword*) avec audit SEO en temps réel (titre, slug, extrait, contenu, densité).
  - Catégorie & Tags.
- **Onglet Média & YouTube :**
  - Saisie URL YouTube avec lecteur responsive 16:9.
  - Bouton 1-clic pour définir la miniature de la vidéo comme image de couverture.
  - Bouton 1-clic pour copier le snippet d'intégration Markdown.
  - 6 Presets de photos de couverture professionnelles.
- **Onglet Rédaction Markdown :**
  - Composant `MarkdownField` enrichi avec raccourcis de mise en forme (H2, H3, Gras, Italique, Liste, Tableaux, Callouts).
  - 4 Modèles didactiques prêts à insérer.
- **Onglet Conversion (CTA) :**
  - Sélecteur de type de conversion (Calculateur CRS, Examen CBT, Sujets récents, WhatsApp VIP, Test gratuit).
- **Volet d'Aperçu Tri-Mode :**
  - Mode 1 : Carte de catalogue blog.
  - Mode 2 : Simulateur Google SERP (mobile et desktop).
  - Mode 3 : Article complet avec média et bloc d'autorité auteur.

---

## 5. Gestion des Erreurs & Cas Limites
- **Collisions de Slug :** Si le slug généré ou saisi existe déjà pour un autre article, suffixer automatiquement par un horodatage court `-XXXX` pour éviter tout échec d'insertion PostgreSQL.
- **Rupture de Connexion Base :** Encadrement des requêtes de listing par des blocs `try / catch` avec affichage d'un bandeau d'avertissement gracieux au lieu d'un crash `app/error.tsx`.
- **Compatibilité CSV :** Préfixe UTF-8 BOM (`\uFEFF`) et délimiteur `;` assurant la lisibilité parfaite des accents français dans Excel.
- **Sanitisation des Contenus :** Les caractères spéciaux et balises Markdown sont sécurisés pour la restitution publique.
