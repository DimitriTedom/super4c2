"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  Save,
  Eye,
  Clock,
  Star,
  Image as ImageIcon,
  Video,
  Sparkles,
  Check,
  Copy,
  LayoutTemplate,
  MonitorPlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownField } from "@/components/admin/markdown-field";
import { slugify } from "@/lib/admin-crud-utils";

export const COVER_PRESETS = [
  {
    name: "🇨🇦 Canada & Entrée Express",
    url: "https://images.unsplash.com/photo-1517935703635-27c94660ab4f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "💻 Simulateur CBT & Réussite",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "🎙️ Studio Oral & Écouteurs",
    url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "✍️ Expression Écrite & Méthode",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  },
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const BLOG_CATEGORIES = [
  "Stratégie TCF",
  "Entrée Express & CRS",
  "Expression Écrite",
  "Compréhension Écrite",
  "Méthodologie NCLC 7",
  "Actualités Immigration",
] as const;

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  authorName: string;
  authorRole: string;
  readingMinutes: number;
  category: string;
  tags: string[];
  featured: boolean;
  isPublished: boolean;
}

interface BlogFormProps {
  action: (formData: FormData) => Promise<void>;
  post?: BlogPostData;
  submitLabel?: string;
}

export function BlogForm({
  action,
  post,
  submitLabel = "Enregistrer l'article",
}: BlogFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [isSlugCustom, setIsSlugCustom] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "Stratégie TCF");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [authorName, setAuthorName] = useState(
    post?.authorName || "Équipe Pédagogique Super4C2"
  );
  const [authorRole, setAuthorRole] = useState(
    post?.authorRole || "Expert NCLC & Ancien Correcteur FEI"
  );
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? true);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [previewMode, setPreviewMode] = useState<"card" | "article">("card");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom && !post) {
      setSlug(slugify(val));
    }
  };

  const blogTemplates = [
    {
      label: "Guide Stratégique NCLC",
      snippet:
        "## Pourquoi cette épreuve est déterminante pour votre dossier\n\nDans le système de sélection de l'immigration canadienne (Entrée Express), chaque point compte. Valider le palier **NCLC 7** équivaut à un saut quantique pour votre note globale CRS.\n\n### 1. La règle d'or du temps imparti\n- Ne restez jamais bloqué plus de **90 secondes** sur une question.\n- Marquez immédiatement les questions ambiguës avec la touche `[F]` pour y revenir.\n\n### 2. Le piège des synonymes approximatifs\nLes concepteurs de France Éducation International construisent leurs distracteurs sur des faux-amis et des généralisations hâtives. Vérifiez toujours la présence explicite de l'indice dans le document source.",
    },
    {
      label: "Plan d'Action Rédaction 16/20",
      snippet:
        "## La méthodologie infaillible pour l'Expression Écrite\n\nL'épreuve d'expression écrite ne sanctionne pas votre créativité littéraire, mais votre capacité à respecter rigoureusement la consigne et le registre sociolinguistique.\n\n### Structure type recommandée pour la Tâche 3 :\n1. **Introduction (25 mots) :** Présentation du débat et des deux visions.\n2. **Comparaison synthétique (50 mots) :** Confrontation des arguments avec connecteurs logiques (*Certes*, *Néanmoins*).\n3. **Prise de position personnelle argumentée (60 mots) :** Avis clair illustré par un exemple concret du monde professionnel.\n4. **Conclusion (20 mots) :** Recommandation finale nuancée.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Back Link */}
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux Articles de Blog</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="border-b pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
          <FolderKanban className="h-3 w-3" />
          Rédaction &amp; Acquisition SEO
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {post ? "Modifier l'Article de Blog" : "Rédiger un Article de Blog"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Rédigez un guide de référence en Markdown optimisé pour le référencement et la conversion des candidats.
        </p>
      </div>

      {/* Form and Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* Left Form */}
        <form action={action} className="rounded-2xl border bg-card p-6 shadow-xs space-y-5">
          {post?.id && <input type="hidden" name="id" value={post.id} />}
          <input type="hidden" name="category" value={category} />

          {/* Title & Slug */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Titre de l&apos;Article <span className="text-primary">*</span>
              </label>
              <Input
                type="text"
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Comment Valider le Palier NCLC 7 en 30 Jours"
                required
                className="h-10 text-xs rounded-xl bg-muted/20 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Slug URL <span className="text-primary">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugCustom(!isSlugCustom)}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  {isSlugCustom ? "Générer automatiquement" : "Modifier manuellement"}
                </button>
              </div>
              <Input
                type="text"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setIsSlugCustom(true);
                  setSlug(slugify(e.target.value));
                }}
                required
                className="h-9 text-xs rounded-xl bg-muted/20 font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                URL finale : <span className="font-mono text-foreground">/blog/{slug || "mon-slug"}</span>
              </p>
            </div>
          </div>

          {/* Category, Cover Image & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Catégorie <span className="text-primary">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {BLOG_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Image de Couverture (URL)
                </label>
                <span className="text-[10px] text-muted-foreground">Format 16:9 recommandé</span>
              </div>
              <Input
                type="url"
                name="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>
          </div>

          {/* 🎨 Presets d'images officielles & Studio YouTube */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
                <span>Médiathèque Rapide & Intégrations</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Prêt à l&apos;emploi</span>
            </div>

            {/* Presets Unsplash */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground font-medium">
                Photos de couverture certifiées :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className="text-left p-1.5 rounded-lg border border-border/60 bg-background/80 hover:bg-primary/5 hover:border-primary/40 transition-colors text-[11px] font-medium text-foreground truncate"
                    title={preset.name}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* YouTube Embed Helper */}
            <div className="pt-2 border-t border-border/50 space-y-2">
              <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Video className="h-3.5 w-3.5 text-rose-500" />
                <span>Intégrer une vidéo YouTube (cours / débrief) :</span>
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Coller l'URL YouTube (ex: https://youtu.be/...)"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="h-8 text-xs rounded-lg bg-background"
                />
                {extractYouTubeId(youtubeUrl) && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs gap-1 shrink-0 px-2.5"
                    onClick={() => {
                      const ytId = extractYouTubeId(youtubeUrl);
                      if (ytId) {
                        setCoverImage(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
                      }
                    }}
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-brand-crimson" />
                    <span>Miniature</span>
                  </Button>
                )}
              </div>
              {extractYouTubeId(youtubeUrl) && (
                <div className="flex items-center justify-between text-[11px] bg-rose-500/10 text-rose-700 dark:text-rose-300 p-2 rounded-lg border border-rose-500/20">
                  <span>ID détecté : <strong className="font-mono">{extractYouTubeId(youtubeUrl)}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      const ytId = extractYouTubeId(youtubeUrl);
                      if (ytId) {
                        navigator.clipboard.writeText(`\nhttps://www.youtube.com/watch?v=${ytId}\n`);
                        setCopiedSnippet(true);
                        setTimeout(() => setCopiedSnippet(false), 2000);
                      }
                    }}
                    className="flex items-center gap-1 font-semibold hover:underline"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copié dans le presse-papier !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copier pour le Markdown</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Auteur
              </label>
              <Input
                type="text"
                name="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Rôle ou Titre de l&apos;Auteur
              </label>
              <Input
                type="text"
                name="authorRole"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Tags Clés (séparés par des virgules)
            </label>
            <Input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: TCF Canada, NCLC 7, Entrée Express, CRS, Stratégie"
              className="h-10 text-xs rounded-xl bg-muted/20"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Extrait / Chapeau SEO <span className="text-primary">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {excerpt.length} caractères
              </span>
            </div>
            <Textarea
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé accrocheur qui sera affiché dans les cartes d'articles et les métadonnées Google..."
              required
              rows={3}
              className="text-xs rounded-xl bg-muted/20 resize-y"
            />
          </div>

          {/* Markdown Content Field */}
          <div className="pt-2 border-t">
            <MarkdownField
              id="content"
              name="content"
              label="Contenu Intégral de l'Article"
              description="Rédigez en Markdown enrichi avec titres, listes, citations et modèles SEO."
              defaultValue={post?.content || ""}
              placeholder="Rédigez l'article complet ici..."
              rows={12}
              required
              templates={blogTemplates}
            />
          </div>

          {/* Switches: Published and Featured */}
          <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">Article publié</p>
                <p className="text-[11px] text-muted-foreground">
                  Visible par les visiteurs sur le catalogue du blog.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                value="true"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">Mettre à la une</p>
                <p className="text-[11px] text-muted-foreground">
                  Affiché en bannière vedette principale sur /blog.
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/blog">Annuler</Link>
            </Button>

            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>{submitLabel}</span>
            </Button>
          </div>
        </form>

        {/* Right Preview Card (Model Pratik-IT / Public Blog Card & Article Layout) */}
        <aside className="rounded-2xl border bg-card/60 p-5 shadow-xs space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center justify-between border-b pb-3">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
              <button
                type="button"
                onClick={() => setPreviewMode("card")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  previewMode === "card"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutTemplate className="h-3 w-3" />
                <span>Carte</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("article")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  previewMode === "article"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MonitorPlay className="h-3 w-3" />
                <span>Article &amp; Médias</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {featured && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  À la une
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isPublished
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {isPublished ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>

          {previewMode === "card" ? (
            /* Card Mockup */
            <div className="rounded-xl border bg-card overflow-hidden shadow-xs space-y-3">
              {coverImage ? (
                <div className="aspect-video w-full bg-muted overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted/40 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                  <ImageIcon className="h-6 w-6 opacity-30" />
                  <span>Aucune image de couverture</span>
                </div>
              )}

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-primary uppercase tracking-wide">
                    {category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    ~5 min
                  </span>
                </div>

                <h4 className="font-bold text-foreground text-sm line-clamp-2">
                  {title || "Titre de l'article de blog..."}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-3">
                  {excerpt || "L'extrait accrocheur apparaîtra ici..."}
                </p>

                <div className="pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">{authorName}</span>
                  <span>{new Date().toLocaleDateString("fr-CA")}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Full Article Media Preview Mockup */
            <div className="rounded-xl border bg-card p-4 shadow-xs space-y-4">
              {/* Media Display */}
              {coverImage ? (
                <div className="aspect-video w-full rounded-lg bg-black overflow-hidden relative border border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-xs text-[10px] font-bold">
                    16:9 Responsive Media
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-muted/30 border border-dashed border-border/80 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                  <Video className="h-6 w-6 opacity-40 text-brand-crimson" />
                  <span>Ajoutez une image ou vidéo YouTube</span>
                </div>
              )}

              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {category}
                </span>
                <h4 className="font-display font-black text-foreground text-base leading-snug">
                  {title || "Titre intégral de votre publication..."}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground border-b pb-2">
                  <span className="font-semibold text-foreground">{authorName}</span>
                  <span>•</span>
                  <span>{authorRole}</span>
                </div>
              </div>

              {excerpt && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground/90 italic">
                  &ldquo;{excerpt}&rdquo;
                </div>
              )}

              {tags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
