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
              <label className="text-xs font-bold text-foreground">
                Image de Couverture (URL)
              </label>
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

        {/* Right Preview Card (Model Pratik-IT / Public Blog Card) */}
        <aside className="rounded-2xl border bg-card/60 p-5 shadow-xs space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Eye className="h-3.5 w-3.5" />
              <span>Aperçu Carte Publique</span>
            </h3>
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

          {/* Card Mockup */}
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
        </aside>
      </div>
    </div>
  );
}
