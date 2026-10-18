import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  CheckCircle2,
  Sparkles,
  User,
} from "lucide-react";
import { getSingleBlogPost, listAllBlogPosts } from "@/lib/blog/blog-service";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getSingleBlogPost(slug);
  if (!post) return { title: "Article non trouvé — Super4C2" };

  return {
    title: `${post.title} — Blog Super4C2`,
    description: post.excerpt,
    keywords: post.tags,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getSingleBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Articles recommandés
  const allPosts = await listAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-4xl space-y-10 py-6">
      {/* 🧭 Fil d'Ariane & Bouton Retour */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Retour à tous les articles
          </Link>
        </Button>

        <span className="rounded-full border bg-muted/50 px-3 py-1 font-mono text-[11px] text-muted-foreground">
          {post.categoryLabel}
        </span>
      </div>

      {/* 📰 En-tête de l'Article */}
      <header className="space-y-4 border-b pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {post.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readTimeMinutes} minutes de lecture
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <User className="h-3.5 w-3.5 text-primary" /> {post.author.name} ({post.author.role})
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              <Tag className="h-3 w-3 text-primary" /> {tag}
            </span>
          ))}
        </div>
      </header>

      {/* 📖 Corps de l'Article */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 space-y-6 text-sm sm:text-base leading-relaxed">
        {/* On découpe le contenu Markdown basique en blocs lisibles */}
        {post.content.split("\n\n").map((block, idx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={idx}
                className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground pt-6 border-b pb-2"
              >
                {trimmed.replace("## ", "")}
              </h2>
            );
          }

          if (trimmed.startsWith("### ")) {
            return (
              <h3
                key={idx}
                className="font-display text-xl font-bold tracking-tight text-foreground pt-4 text-primary"
              >
                {trimmed.replace("### ", "")}
              </h3>
            );
          }

          if (trimmed.startsWith("#### ")) {
            return (
              <h4
                key={idx}
                className="font-display text-base font-bold text-foreground pt-2 italic"
              >
                {trimmed.replace("#### ", "")}
              </h4>
            );
          }

          // 🎥 Support Vidéo YouTube (URL directe ou embed)
          const ytMatch = trimmed.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
          if (ytMatch && ytMatch[1]) {
            return (
              <div key={idx} className="my-8 overflow-hidden rounded-2xl border border-border/80 bg-black/90 shadow-2xl">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                    title="Vidéo explicative officielle"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            );
          }

          // 🎬 Support Vidéo MP4 / Veo3 directe
          if (trimmed.match(/^https?:\/\/.*\.(mp4|webm)(\?.*)?$/i) || trimmed.startsWith("<video")) {
            const videoUrl = trimmed.replace(/<video[^>]*src="([^"]+)"[^>]*>/, "$1");
            return (
              <div key={idx} className="my-8 overflow-hidden rounded-2xl border border-border/80 bg-black/90 shadow-2xl">
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="aspect-video w-full rounded-2xl"
                />
              </div>
            );
          }

          // 🖼️ Support Image Markdown ![Alt](URL)
          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const alt = imgMatch[1];
            const src = imgMatch[2];
            return (
              <figure key={idx} className="my-8 space-y-2 text-center">
                <div className="overflow-hidden rounded-2xl border border-border/80 shadow-lg">
                  <img src={src} alt={alt} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
                {alt && (
                  <figcaption className="text-xs text-muted-foreground italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (trimmed.startsWith("> ")) {
            const isTip = trimmed.includes("[!TIP]") || trimmed.includes("Conseil");
            const isWarning = trimmed.includes("[!WARNING]") || trimmed.includes("Piège");
            const cleanText = trimmed
              .replace(/>\s*\[!(TIP|WARNING|NOTE)\]\s*/g, "")
              .replace(/^>\s*/gm, "");

            return (
              <blockquote
                key={idx}
                className={cn(
                  "rounded-2xl border-l-4 p-5 italic text-sm text-foreground/90 my-6 shadow-xs",
                  isTip
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                    : isWarning
                    ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                    : "border-primary bg-primary/5"
                )}
              >
                <div className="font-sans not-italic font-semibold text-xs uppercase tracking-wider mb-1 text-primary">
                  {isTip ? "💡 Conseil Pédagogique FEI" : isWarning ? "⚠️ Piège Classique à Éviter" : "Note Importante"}
                </div>
                <p className="whitespace-pre-line leading-relaxed">{cleanText}</p>
              </blockquote>
            );
          }

          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n- ").map((item) => item.replace("- ", ""));
            return (
              <ul key={idx} className="space-y-2 list-none pl-0 my-3">
                {items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          }

          if (trimmed.startsWith("| ")) {
            // Tableau simple
            const lines = trimmed.split("\n").filter((l) => !l.includes(":---"));
            const headers = lines[0]?.split("|").filter(Boolean).map((h) => h.trim());
            const rows = lines.slice(1).map((l) => l.split("|").filter(Boolean).map((c) => c.trim()));

            return (
              <div key={idx} className="overflow-x-auto my-6 rounded-2xl border">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-muted text-foreground font-bold">
                    <tr>
                      {headers?.map((h, i) => (
                        <th key={i} className="p-3 border-b">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                        {row.map((cell, j) => (
                          <td key={j} className="p-3">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return (
            <p key={idx} className="leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* 🎯 Encadré d'Action Contextuel Haute Conversion */}
      <div className="rounded-3xl border bg-gradient-to-r from-card to-primary/10 p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Passer à la pratique immédiate
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight">
          Prêt à Valider votre Palier NCLC 7 et Gagner vos 50 Points CRS ?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Entraînez-vous dans le simulateur CBT de Super4C2 avec le chronomètre conforme de 60 minutes et le décodage des pièges de France Éducation International.
        </p>
        <div className="pt-2">
          <ShimmerButton
            href={post.targetCta.href}
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-7"
          >
            {post.targetCta.label}
          </ShimmerButton>
        </div>
      </div>

      {/* ✍️ Signature Auteur */}
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-display text-base font-bold text-primary">
          DT
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-foreground">{post.author.name}</h4>
          <p className="text-xs text-muted-foreground">{post.author.role}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Passionné par la pédagogie linguistique et la simplification des démarches d&apos;immigration canadienne.
          </p>
        </div>
      </div>

      {/* 🔗 Articles Recommandés */}
      <div className="space-y-4 border-t pt-8">
        <h3 className="font-display text-xl font-bold">Poursuivre votre Lecture</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {relatedPosts.map((related) => (
            <div
              key={related.slug}
              className="group rounded-2xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <span className="text-[11px] font-semibold text-primary">{related.categoryLabel}</span>
              <h4 className="font-display text-base font-bold mt-1 text-foreground group-hover:text-primary transition-colors">
                <Link href={`/blog/${related.slug}`}>{related.title}</Link>
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                {related.excerpt}
              </p>
              <Link
                href={`/blog/${related.slug}`}
                className="mt-3 inline-flex items-center text-xs font-bold text-primary"
              >
                Lire l&apos;article →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
