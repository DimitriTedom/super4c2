"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  Save,
  Clock,
  Star,
  Image as ImageIcon,
  Video,
  Sparkles,
  Check,
  Copy,
  LayoutTemplate,
  MonitorPlay,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Target,
  Zap,
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
  {
    name: "🏛️ FEI & Normes Officielles",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "🥇 Attestation NCLC 7 & CRS",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  },
];

export const BLOG_CATEGORIES = [
  "Stratégie TCF",
  "Entrée Express & CRS",
  "Expression Écrite",
  "Expression Orale",
  "Compréhension Écrite",
  "Méthodologie NCLC 7",
  "Actualités Immigration",
] as const;

export const CTA_PRESETS = [
  {
    type: "CRS_CALCULATOR",
    label: "Simuler mes 50 points CRS avec le NCLC 7",
    url: "/nclc-calculator",
    description: "Calculateur de points Entrée Express",
  },
  {
    type: "CBT_EXAM",
    label: "S'entraîner sur le Simulateur CBT Officiel",
    url: "/examens",
    description: "Catalogue des séries complètes d'examen",
  },
  {
    type: "RECENT_TOPICS",
    label: "Consulter les Sujets Récents d'Examen 2026",
    url: "/sujets-recents",
    description: "Banque de sujets tombés en session FEI",
  },
  {
    type: "COMMUNITY",
    label: "Rejoindre le Groupe d'Entraide WhatsApp VIP",
    url: "/communaute",
    description: "Veille hebdomadaire et correction collégiale",
  },
  {
    type: "FREE_TEST",
    label: "Passer le Test Diagnostique Gratuit",
    url: "/test-gratuit",
    description: "Mini-test de 15 questions avec estimation NCLC",
  },
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  youtubeUrl?: string | null;
  targetKeyword?: string | null;
  authorName: string;
  authorRole: string;
  readingMinutes: number;
  category: string;
  tags: string[];
  featured: boolean;
  isPublished: boolean;
  ctaType?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
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
  const [targetKeyword, setTargetKeyword] = useState(post?.targetKeyword || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category || "Stratégie TCF");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [youtubeUrl, setYoutubeUrl] = useState(post?.youtubeUrl || "");
  const [authorName, setAuthorName] = useState(
    post?.authorName || "Dimitri • Équipe Pédagogique Super4C2"
  );
  const [authorRole, setAuthorRole] = useState(
    post?.authorRole || "Expert NCLC & Ancien Correcteur FEI"
  );
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? true);

  // Call to action
  const [ctaType, setCtaType] = useState(post?.ctaType || "CRS_CALCULATOR");
  const [ctaLabel, setCtaLabel] = useState(
    post?.ctaLabel || "Simuler mes 50 points CRS avec le NCLC 7"
  );
  const [ctaUrl, setCtaUrl] = useState(post?.ctaUrl || "/nclc-calculator");

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [previewMode, setPreviewMode] = useState<"card" | "serp" | "article">("card");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom && !post) {
      setSlug(slugify(val));
    }
  };

  const handleCtaTypeChange = (type: string) => {
    setCtaType(type);
    const preset = CTA_PRESETS.find((p) => p.type === type);
    if (preset) {
      setCtaLabel(preset.label);
      setCtaUrl(preset.url);
    }
  };

  // YouTube Helper
  const ytId = useMemo(() => extractYouTubeId(youtubeUrl), [youtubeUrl]);

  // Real-time SEO Analyzer
  const seoAudit = useMemo(() => {
    const kw = targetKeyword.trim().toLowerCase();
    if (!kw) {
      return {
        score: 0,
        hasKeyword: false,
        inTitle: false,
        inSlug: false,
        inExcerpt: false,
        inContent: false,
        densityPercent: 0,
        excerptLengthOk: excerpt.length >= 130 && excerpt.length <= 165,
        titleLengthOk: title.length >= 40 && title.length <= 70,
      };
    }

    const inTitle = title.toLowerCase().includes(kw);
    const inSlug = slug.toLowerCase().includes(slugify(kw));
    const inExcerpt = excerpt.toLowerCase().includes(kw);
    const inContent = content.toLowerCase().includes(kw);

    const words = content.trim().split(/\s+/).filter(Boolean);
    const kwMatches = (content.toLowerCase().match(new RegExp(kw, "g")) || []).length;
    const densityPercent = words.length > 0 ? (kwMatches / words.length) * 100 : 0;

    const excerptLengthOk = excerpt.length >= 130 && excerpt.length <= 165;
    const titleLengthOk = title.length >= 40 && title.length <= 70;

    let score = 0;
    if (inTitle) score += 25;
    if (inSlug) score += 20;
    if (inExcerpt) score += 20;
    if (inContent) score += 20;
    if (excerptLengthOk) score += 15;

    return {
      score,
      hasKeyword: true,
      inTitle,
      inSlug,
      inExcerpt,
      inContent,
      densityPercent: Number(densityPercent.toFixed(1)),
      excerptLengthOk,
      titleLengthOk,
    };
  }, [targetKeyword, title, slug, excerpt, content]);

  // Pedagogical Templates
  const blogTemplates = [
    {
      label: "Guide Méthodologique NCLC 7",
      snippet:
        "## Pourquoi cette épreuve est déterminante pour votre dossier Entrée Express\n\nDans le barème du système de classement global (CRS) d'Immigration, Réfugiés et Citoyenneté Canada (IRCC), le palier **NCLC 7** (niveau B2 avancé) agit comme un multiplicateur de points immédiat (+50 points bonus francophones).\n\n### 1. La règle d'or du temps imparti\n- Ne restez jamais bloqué plus de **90 secondes** sur une question ambiguë.\n- Éliminez d'abord les deux distracteurs évidents.\n\n### 2. Le décodage des pièges conçus par France Éducation International\nLes concepteurs de sujets FEI jouent sur des nuances de registre et des généralisations hâtives. Vérifiez toujours la présence textuelle explicite avant de valider votre réponse.\n\n> **Conseil de l'examinateur :** Une réponse plausible n'est pas forcément la bonne si elle extrapole au-delà du document source.",
    },
    {
      label: "Expression Écrite (Plan Décortiqué)",
      snippet:
        "## Comment structurer la Tâche 3 en 25 minutes chrono\n\nL'épreuve d'expression écrite ne sanctionne pas votre style littéraire, mais le respect strict de la consigne et la pertinence de votre argumentation contradictoire.\n\n### Structure type recommandée pour viser 16/20 (NCLC 7+) :\n1. **Introduction (25-30 mots) :** Amorce du sujet, reformulation des deux thèses en présence sans recopier le texte brut.\n2. **Synthèse des visions (50-60 mots) :** Comparaison des arguments avec connecteurs logiques (*D'un côté*, *En revanche*, *Certes*).\n3. **Point de vue personnel argumenté (60-70 mots) :** Prise de position claire et étayée par un exemple tiré de la vie professionnelle ou sociétale.\n4. **Conclusion nuancée (20 mots) :** Synthèse finale concise.\n\n```\nNombre de mots cible : 160 à 180 mots\nTemps conseillé : 25 minutes chrono\n```",
    },
    {
      label: "Expression Orale (Les 10 Questions Tâche 2)",
      snippet:
        "## Tâche 2 Expression Orale : Les questions clés pour faire parler l'examinateur\n\nEn Tâche 2 (jeu de rôle de 3 minutes 30), vous êtes l'enquêteur. C'est à vous de mener l'échange en posant des questions variées et polies.\n\n### La boîte à outils des structures interrogatives C1/C2 :\n- *« Pourriez-vous m'éclairer sur les conditions préalables d'inscription ? »*\n- *« Dans quelle mesure ce programme est-il modulable selon nos disponibilités ? »*\n- *« Auriez-vous l'amabilité de me préciser la politique de remboursement en cas d'imprévu ? »*\n- *« Qu'en est-il de la prise en charge des frais accessoires ? »*",
    },
    {
      label: "Entrée Express & Stratégie CRS",
      snippet:
        "## NCLC 7 vs NCLC 5 : Le calcul mathématique qui change tout\n\nBeaucoup de candidats pensent qu'un score intermédiaire (NCLC 5 ou 6) suffit. C'est une erreur stratégique majeure.\n\n| Niveau TCF | Score CRS estimé | Bonus Francophone | Éligibilité Tirages Ciblés |\n| :--- | :--- | :--- | :--- |\n| **NCLC 5** | 380 - 410 pts | 0 point | ❌ Non éligible |\n| **NCLC 7+** | 470 - 520 pts | **+50 points** | ✅ Sélection prioritaire immédiate |\n\nEn franchissant la barre du NCLC 7 dans les 4 compétences (EE, EO, CE, CO), vous intégrez la catégorie francophone prioritaire où les seuils d'extraction récents se situent entre **390 et 435 points**.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
      <div className="border-b border-border/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
          <FolderKanban className="h-3 w-3" />
          Studio Éditorial &amp; Acquisition SEO
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {post ? "Modifier l'Article de Blog" : "Rédiger un Article de Blog"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Rédigez un guide d&apos;autorité optimisé pour surclasser la concurrence sur Google et convertir les candidats en utilisateurs actifs.
        </p>
      </div>

      {/* Form and Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* Left Form */}
        <form action={action} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          {post?.id && <input type="hidden" name="id" value={post.id} />}
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="ctaType" value={ctaType} />

          {/* 1. Titre & Slug */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Titre de l&apos;Article (Balise H1) <span className="text-primary">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    seoAudit.titleLengthOk
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                >
                  {title.length} car. {seoAudit.titleLengthOk ? "✓ Optimal (40-70)" : "(Idéal : 40-70)"}
                </span>
              </div>
              <Input
                type="text"
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: TCF Canada Expression Écrite Tâche 1 : Formules et Modèles 60-120 Mots"
                required
                className="h-10 text-xs rounded-xl bg-background font-bold"
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
                className="h-9 text-xs rounded-xl bg-background font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                URL finale sur Google : <span className="font-mono text-foreground font-semibold">/blog/{slug || "mon-slug"}</span>
              </p>
            </div>
          </div>

          {/* 2. SEO Focus Keyword & Live Audit */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                <span>Optimisation Mots-Clés SEO (Audit en Temps Réel)</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  seoAudit.score >= 80
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : seoAudit.score >= 50
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                Score SEO : {seoAudit.score}/100
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                Mot-clé principal ciblé (Ex: &ldquo;expression écrite tcf canada&rdquo;, &ldquo;nclc 7 entrée express&rdquo;) :
              </label>
              <Input
                type="text"
                name="targetKeyword"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="Ex: TCF Canada Expression Écrite Tâche 1"
                className="h-8.5 text-xs rounded-lg bg-background"
              />
            </div>

            {targetKeyword.trim() && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {seoAudit.inTitle ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={seoAudit.inTitle ? "text-foreground font-medium" : "text-muted-foreground"}>
                    Dans le Titre H1
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {seoAudit.inSlug ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={seoAudit.inSlug ? "text-foreground font-medium" : "text-muted-foreground"}>
                    Dans l&apos;URL
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {seoAudit.inExcerpt ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={seoAudit.inExcerpt ? "text-foreground font-medium" : "text-muted-foreground"}>
                    Dans l&apos;Extrait
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {seoAudit.inContent ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={seoAudit.inContent ? "text-foreground font-medium" : "text-muted-foreground"}>
                    Dans le Contenu ({seoAudit.densityPercent}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Catégorie & Image de Couverture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Catégorie Thématique <span className="text-primary">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-background border-border">
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
                <span className="text-[10px] text-muted-foreground">Ratio 16:9 recommandé</span>
              </div>
              <Input
                type="url"
                name="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-10 text-xs rounded-xl bg-background"
              />
            </div>
          </div>

          {/* 🎨 Presets d'images certifiées & Studio YouTube */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
                <span>Médiathèque Rapide &amp; Intégration YouTube</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Boost Rétention Google</span>
            </div>

            {/* Presets Unsplash */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground font-medium">
                Photothèques haute résolution prêtes à l&apos;emploi :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
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
                <span>Intégrer une vidéo YouTube (Dwell Time $\ge$ 4 min sur Google) :</span>
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="youtubeUrl"
                  placeholder="Coller l'URL YouTube (ex: https://youtu.be/... ou https://youtube.com/watch?v=...)"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="h-8.5 text-xs rounded-lg bg-background"
                />
                {ytId && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8.5 text-xs gap-1 shrink-0 px-2.5"
                    onClick={() => {
                      if (ytId) {
                        setCoverImage(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
                      }
                    }}
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-brand-crimson" />
                    <span>Miniature HD</span>
                  </Button>
                )}
              </div>

              {ytId && (
                <div className="flex items-center justify-between text-[11px] bg-rose-500/10 text-rose-700 dark:text-rose-300 p-2 rounded-lg border border-rose-500/20">
                  <span>
                    ID YouTube détecté : <strong className="font-mono">{ytId}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`\nhttps://www.youtube.com/watch?v=${ytId}\n`);
                      setCopiedSnippet(true);
                      setTimeout(() => setCopiedSnippet(false), 2000);
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

          {/* 4. Extrait / Chapeau SEO & Meta Description */}
          <div className="space-y-1.5 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Extrait / Meta Description Google <span className="text-primary">*</span>
              </label>
              <span
                className={`text-[11px] font-mono font-medium ${
                  seoAudit.excerptLengthOk ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {excerpt.length} caractères {seoAudit.excerptLengthOk ? "✓ Idéal (130-165)" : "(Idéal : 130-165)"}
              </span>
            </div>
            <Textarea
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé percutant qui apparaîtra en noir sous le titre sur Google et dans les aperçus WhatsApp..."
              required
              rows={3}
              className="text-xs rounded-xl bg-background resize-y"
            />
          </div>

          {/* 5. Contenu Intégral Markdown */}
          <div className="pt-2 border-t border-border/60">
            <MarkdownField
              id="content"
              name="content"
              label="Contenu Intégral de l'Article"
              description="Rédigez en Markdown enrichi avec titres H2/H3, listes didactiques, citations d'examinateur et tableaux."
              defaultValue={content}
              placeholder="Rédigez l'article complet ici..."
              rows={14}
              required
              templates={blogTemplates}
            />
          </div>

          {/* 6. Call-To-Action (CTA) Contextuel */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Call-To-Action (Conversion Lecteur $\to$ Candidat Actif)</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Bas d&apos;article</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Type d&apos;objectif de conversion :
                </label>
                <Select value={ctaType} onValueChange={handleCtaTypeChange}>
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-background border-border">
                    <SelectValue placeholder="Choisir un CTA" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {CTA_PRESETS.map((preset) => (
                      <SelectItem key={preset.type} value={preset.type}>
                        {preset.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Libellé du Bouton :
                </label>
                <Input
                  type="text"
                  name="ctaLabel"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                Lien cible de redirection :
              </label>
              <Input
                type="text"
                name="ctaUrl"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="h-8.5 text-xs rounded-xl bg-background font-mono"
              />
            </div>
          </div>

          {/* 7. Détails Auteur, Tags & Publication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Auteur Référent
              </label>
              <Input
                type="text"
                name="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-9 text-xs rounded-xl bg-background font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Titre d&apos;Autorité Auteur (E-E-A-T Google)
              </label>
              <Input
                type="text"
                name="authorRole"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="h-9 text-xs rounded-xl bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Tags Clés Secondaires (séparés par des virgules)
            </label>
            <Input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: TCF Canada, NCLC 7, Entrée Express, Barème FEI, Conseils"
              className="h-9 text-xs rounded-xl bg-background"
            />
          </div>

          {/* Switches: Published and Featured */}
          <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <p className="text-xs font-bold text-foreground">Article en Ligne (Publié)</p>
                <p className="text-[11px] text-muted-foreground">
                  Accessible aux candidats et explorable par les robots Google.
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
                  Positionné en tête d&apos;affiche sur le catalogue /blog.
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/blog">Annuler</Link>
            </Button>

            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>{submitLabel}</span>
            </Button>
          </div>
        </form>

        {/* Right Preview Sidebar */}
        <aside className="rounded-2xl border border-border bg-card/60 p-5 shadow-xs space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
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
                onClick={() => setPreviewMode("serp")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  previewMode === "serp"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Search className="h-3 w-3" />
                <span>Google</span>
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
                <span>Article</span>
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

          {/* Mode 1 : Carte Catalogue */}
          {previewMode === "card" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs space-y-3">
              {coverImage ? (
                <div className="aspect-video w-full bg-muted overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  {ytId && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-rose-500 flex items-center gap-1 text-[10px] font-bold">
                      <Video className="h-3 w-3" />
                      Vidéo
                    </div>
                  )}
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

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">{authorName}</span>
                  <span>{new Date().toLocaleDateString("fr-CA")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2 : Simulateur SERP Google */}
          {previewMode === "serp" && (
            <div className="rounded-xl border border-border/80 bg-background p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/60 pb-2">
                <span className="font-semibold flex items-center gap-1 text-foreground">
                  <Search className="h-3.5 w-3.5 text-primary" />
                  <span>Résultat de Recherche Google</span>
                </span>
                <span className="font-mono text-[10px]">Google Search (FR/CA)</span>
              </div>

              {/* SERP Item */}
              <div className="space-y-1 font-sans">
                {/* Breadcrumb URL */}
                <div className="text-[12px] text-emerald-700 dark:text-emerald-400 font-mono truncate flex items-center gap-1">
                  <span>https://super4c2.com</span>
                  <span className="text-muted-foreground">›</span>
                  <span>blog</span>
                  <span className="text-muted-foreground">›</span>
                  <span className="font-semibold text-foreground/80">{slug || "mon-article"}</span>
                </div>

                {/* Clickable Title */}
                <h4 className="text-[15px] font-medium text-blue-600 dark:text-blue-400 hover:underline leading-snug line-clamp-2 cursor-pointer">
                  {title || "Titre de votre publication TCF Canada..."} | Super4C2
                </h4>

                {/* Description snippet */}
                <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 pt-0.5">
                  <span className="text-foreground/75 font-medium">
                    {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} —{" "}
                  </span>
                  {excerpt || "Votre extrait méta description complet apparaîtra sous le titre dans Google..."}
                </p>
              </div>

              {/* SERP advice */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>Conseil d&apos;optimisation Google :</span>
                </div>
                <p>
                  Assurez-vous que le mot-clé principal figure dans les premiers mots du titre et de la description pour maximiser le taux de clic (CTR).
                </p>
              </div>
            </div>
          )}

          {/* Mode 3 : Article Intégral & Médias */}
          {previewMode === "article" && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
              {/* Media Display */}
              {ytId ? (
                <div className="aspect-video w-full rounded-lg bg-black overflow-hidden relative border border-border/60">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="Lecteur YouTube"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : coverImage ? (
                <div className="aspect-video w-full rounded-lg bg-black overflow-hidden relative border border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-muted/30 border border-dashed border-border/80 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                  <Video className="h-6 w-6 opacity-40 text-brand-crimson" />
                  <span>Ajoutez une image ou vidéo YouTube</span>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {category}
                </span>
                <h4 className="font-display font-black text-foreground text-base leading-snug">
                  {title || "Titre intégral de votre publication..."}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground border-b border-border/60 pb-2">
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

              {/* Call to action mockup */}
              <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-1.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Module de Conversion Intégré
                </span>
                <p className="text-xs font-bold text-foreground">{ctaLabel}</p>
                <Button size="sm" className="h-7 text-xs font-bold w-full">
                  Tester maintenant →
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
