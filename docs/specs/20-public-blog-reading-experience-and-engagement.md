# 20. Spécification Technique & Fonctionnelle : Expérience de Lecture Publique & Rétention Candidat (`/blog/[slug]`)

**Version :** 1.0 — Octobre 2026  
**Module :** Expérience de Lecture Publique & Acquisition Organique (`/blog/[slug]`)  
**Statut :** Spécifié & En cours d'implémentation (Jalon 2)

---

## 1. Objectifs & Métriques de Rétention
1. **Dwell Time $\ge$ 4 minutes :** Allonger le temps moyen de consultation sur la page grâce à la vidéo YouTube, au confort typographique et au sommaire interactif.
2. **Sitelinks Google :** Structurer les titres H2 et H3 avec des identifiants d'ancrage uniques pour permettre à Google d'indexer les sous-parties directement dans la SERP.
3. **Conversion Directe :** Transformer le lecteur anonyme en candidat actif par le biais de Call-To-Action (CTA) ciblés et de boutons de partage viral sur WhatsApp.

---

## 2. Architecture des Composants Publics

```mermaid
flowchart TD
    A[Page Article /blog/slug] --> B[ReadingProgressBar (Top 0px)]
    A --> C[Header Article: Titre H1, Date, Auteur, Tags]
    A --> D[Media Block: Player YouTube 16:9 ou Image HD]
    A --> E[Contenu Scindé Desktop]
    E --> F[Sommaire Interactif TOC (Sticky Sidebar)]
    E --> G[Flux de Lecture Markdown Enrichi]
    G --> H[Callouts FEI, Tableaux, Listes]
    A --> I[Encart de Conversion CTA Contextuel]
    A --> J[Bloc Auteur E-E-A-T & Boutons Partage Social]
    A --> K[Données Structurées JSON-LD (Article + Video)]
```

---

## 3. Spécification des Composants UI

### 3.1. `ReadingProgressBar` (`components/blog/reading-progress-bar.tsx`)
- Écoute l'événement `scroll` de la fenêtre avec `requestAnimationFrame`.
- Calcule le ratio : $\text{progress} = \frac{\text{window.scrollY}}{\text{document.body.scrollHeight} - \text{window.innerHeight}}$.
- Rendu : barre d'épaisseur 2.5px en position `fixed top-0 left-0 right-0 z-50` avec transition douce.

### 3.2. `BlogTableOfContents` (`components/blog/blog-toc.tsx`)
- Extraction des titres depuis le contenu markdown :
  - Expression régulière : `/^(#{2,3})\s+(.+)$/gm`.
  - Format d'élément : `{ id: string, text: string, level: 2 | 3 }`.
- Défilement fluide vers `#id` avec compensation du header sticky (décalage de 80px).
- `IntersectionObserver` sur tous les titres `h2[id], h3[id]` pour marquer le titre courant en surbrillance.
- Version mobile : bloc accordéon déployable en début d'article.

### 3.3. `BlogVideoEmbed` (`components/blog/blog-video-embed.tsx`)
- Détecte l'URL YouTube ou l'ID vidéo.
- Restitution dans un wrapper responsive `aspect-video w-full rounded-2xl overflow-hidden`.
- Chargement optimisé avec `loading="lazy"` et `allowFullScreen`.

### 3.4. `BlogSocialShare` (`components/blog/blog-social-share.tsx`)
- **Partage WhatsApp :** `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`.
- **Partage LinkedIn :** `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`.
- **Partage Twitter / X :** `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`.
- **Copier le lien :** Copie dans le presse-papier avec notification Sonner `toast.success("Lien copié dans le presse-papier !")`.

### 3.5. `BlogAuthorBio` (`components/blog/blog-author-bio.tsx`)
- Présentation d'autorité selon les directives Google Search Quality Evaluator Guidelines (E-E-A-T : Experience, Expertise, Authoritativeness, Trustworthiness).
- Nom, rôle d'expert, affiliation TCF Canada FEI, et mention de vérification pédagogique.

---

## 4. Données Structurées JSON-LD (Schema.org)
- Balise `@type: "Article"` ou `"BlogPosting"`.
  - `headline`: titre de l'article.
  - `description`: extrait SEO.
  - `image`: URL de l'image de couverture ou miniature YouTube.
  - `datePublished`: date de publication ISO.
  - `author`: `{ "@type": "Person", "name": post.author.name, "jobTitle": post.author.role }`.
  - `publisher`: `{ "@type": "Organization", "name": "Super4C2", "url": "https://super4c2.com" }`.
- Si `youtubeUrl` est présent : balise additionnelle `@type: "VideoObject"` avec `name`, `thumbnailUrl`, `embedUrl` et `uploadDate`.
