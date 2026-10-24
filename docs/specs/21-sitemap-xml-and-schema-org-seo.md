# 21. Spécification Technique & Fonctionnelle : Sitemap XML Dynamique & Indexation Google (`app/sitemap.ts`)

**Version :** 1.0 — Octobre 2026  
**Module :** SEO Technique & Indexation Organique (`app/sitemap.ts`, `app/robots.ts`)  
**Statut :** Spécifié & En cours d'implémentation (Jalon 3)

---

## 1. Objectifs & Enjeux SEO
1. **Indexation Instantanée :** Permettre aux robots de Google (Googlebot, Bingbot) de découvrir et d'indexer tout nouvel article publié sur Super4C2 dès sa mise en ligne, sans attendre des semaines de crawl aléatoire.
2. **Priorisation Algorithmique :** Attribuer une priorité haute (`0.85` à `0.90`) aux articles de blog longue traîne et guides méthodologiques, avec un `changeFrequency: "weekly"`.
3. **Fraîcheur des Contenus (`<lastmod>`) :** Transmettre la date exacte de mise à jour (`updatedAt`) pour signaler aux moteurs de recherche les révisions régulières des barèmes et des sujets récents.

---

## 2. Architecture Technique (`app/sitemap.ts`)

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Routes Statiques & Outils (Accueil, /examens, /calculateur-crs, /blog, etc.)
  // 2. Séries d'Examen Officielles (/examens/[id], /ee, /eo, etc.)
  // 3. Articles de Blog Dynamiques (interrogation de prisma.blogPost avec repli mock-posts)
}
```

### Schéma de l'Entrée d'Article de Blog
- `url`: `https://super4c2.com/blog/${slug}`
- `lastModified`: `post.updatedAt || post.publishedAt || now`
- `changeFrequency`: `"weekly"`
- `priority`: `0.85`

---

## 3. Données Structurées & Balisage Sémantique (Jalon 2 + Jalon 3)
- **JSON-LD `BlogPosting` :** Injecté dans chaque page `/blog/[slug]`.
- **JSON-LD `VideoObject` :** Injecté automatiquement si une vidéo YouTube est associée à l'article pour se positionner dans le carrousel « Vidéos » de Google.
- **OpenGraph & Twitter Cards :** Balises générées dynamiquement dans `generateMetadata` avec `og:image` en 1200x630 px.
