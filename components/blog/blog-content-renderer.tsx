"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Info,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Quote,
} from "lucide-react";
import { slugify } from "@/lib/admin-crud-utils";
import { BlogVideoPlayer, extractYouTubeId } from "./blog-video-player";
import { BlogInArticleCta } from "./blog-in-article-cta";
import { cn } from "@/lib/utils";

interface BlogContentRendererProps {
  content: string;
  categoryLabel?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  showMidArticleCta?: boolean;
}

// Inline Markdown parser for text: handles **bold**, *italic*, `code`, and [links](url)
export function renderInlineMarkdown(text: string): React.ReactNode {
  // Regex splitting on markdown inline tokens
  // Matches: **bold**, *italic*, `code`, [link text](url)
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic *text*
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-foreground/90">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline code `text`
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[12px] font-semibold text-primary border border-border/80"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown link [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = linkMatch[2];
      const isInternal = href.startsWith("/") || href.includes("super4c2.com");

      if (isInternal) {
        return (
          <Link
            key={i}
            href={href}
            className="font-semibold text-brand-crimson underline decoration-brand-crimson/40 underline-offset-4 hover:decoration-brand-crimson transition-colors"
          >
            {label}
          </Link>
        );
      }

      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold text-brand-crimson underline decoration-brand-crimson/40 underline-offset-4 hover:decoration-brand-crimson transition-colors"
        >
          <span>{label}</span>
          <ExternalLink className="h-3 w-3 inline-block shrink-0" />
        </a>
      );
    }

    return part;
  });
}

// Copyable Code or Formula Block
function CopyableBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-5 rounded-2xl border border-border bg-muted/40 overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border text-[11px] font-mono text-muted-foreground">
        <span>Extrait Didactique / Modèle FEI</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-foreground transition-colors font-semibold"
          title="Copier le texte"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">Copié</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 font-mono text-xs overflow-x-auto text-foreground/90 leading-relaxed whitespace-pre-wrap">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export function BlogContentRenderer({
  content,
  categoryLabel,
  ctaLabel,
  ctaUrl,
  showMidArticleCta = true,
}: BlogContentRendererProps) {
  // Split into markdown blocks
  const blocks = content.split(/\n\n+/);

  // Find optimal insertion index for the mid-article CTA (before the 3rd H2, or 3 blocks after 2nd H2)
  let h2Count = 0;
  let ctaInsertionIndex = -1;

  if (showMidArticleCta) {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].trim().startsWith("## ")) {
        h2Count++;
        if (h2Count === 3) {
          ctaInsertionIndex = i;
          break;
        }
      }
    }
    // If fewer than 3 H2, insert after 2nd H2
    if (ctaInsertionIndex === -1 && h2Count >= 2) {
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].trim().startsWith("## ")) {
          ctaInsertionIndex = i + 2;
          break;
        }
      }
    }
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 space-y-6 text-sm sm:text-base leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const isCtaSpot = idx === ctaInsertionIndex;
        const ctaElement = isCtaSpot ? (
          <BlogInArticleCta
            key="mid-article-cta"
            category={categoryLabel}
            customLabel={ctaLabel}
            customHref={ctaUrl}
          />
        ) : null;

        return (
          <React.Fragment key={idx}>
            {ctaElement}
            {renderSingleBlock(trimmed, idx)}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderSingleBlock(trimmed: string, idx: number): React.ReactNode {
  // Heading 2 (##)
  if (trimmed.startsWith("## ")) {
    const text = trimmed.replace("## ", "").trim();
    const id = slugify(text);
    return (
      <h2
        key={idx}
        id={id}
        className="scroll-mt-24 font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground pt-8 border-b border-border/70 pb-3 flex items-center justify-between group transition-colors"
      >
        <span>{text}</span>
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity text-sm ml-2"
          title="Lien permanent vers cette section"
          aria-label="Lien permanent"
        >
          #
        </a>
      </h2>
    );
  }

  // Heading 3 (###)
  if (trimmed.startsWith("### ")) {
    const text = trimmed.replace("### ", "").trim();
    const id = slugify(text);
    return (
      <h3
        key={idx}
        id={id}
        className="scroll-mt-24 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground pt-5 text-primary flex items-center justify-between group transition-colors"
      >
        <span>{text}</span>
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity text-xs ml-2"
          title="Lien permanent vers cette section"
          aria-label="Lien permanent"
        >
          #
        </a>
      </h3>
    );
  }

  // Heading 4 (####)
  if (trimmed.startsWith("#### ")) {
    const text = trimmed.replace("#### ", "").trim();
    return (
      <h4
        key={idx}
        className="font-display text-base font-bold text-foreground pt-2 italic"
      >
        {text}
      </h4>
    );
  }

  // YouTube Embed in Markdown
  const ytId = extractYouTubeId(trimmed);
  if (ytId && (trimmed.startsWith("http") || trimmed.includes("youtube") || trimmed.includes("youtu.be"))) {
    return <BlogVideoPlayer key={idx} urlOrId={ytId} />;
  }

  // Direct Video (mp4 / webm)
  if (trimmed.match(/^https?:\/\/.*\.(mp4|webm)(\?.*)?$/i)) {
    return (
      <div key={idx} className="my-6 overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <video src={trimmed} controls playsInline className="aspect-video w-full rounded-2xl" />
      </div>
    );
  }

  // Markdown Image ![Alt](URL)
  const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (imgMatch) {
    const alt = imgMatch[1];
    const src = imgMatch[2];
    return (
      <figure key={idx} className="my-8 space-y-2 text-center">
        <div className="overflow-hidden rounded-2xl border border-border shadow-md bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full h-auto object-cover max-h-[520px]" />
        </div>
        {alt && (
          <figcaption className="text-xs text-muted-foreground italic">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  }

  // Blockquotes, Callouts, and Pull Quotes
  if (trimmed.startsWith("> ")) {
    const isTip =
      trimmed.includes("[!TIP]") ||
      trimmed.includes("Conseil") ||
      trimmed.includes("Recommandation");
    const isWarning =
      trimmed.includes("[!WARNING]") ||
      trimmed.includes("Piège") ||
      trimmed.includes("Attention");
    const isFormula =
      trimmed.includes("Formule") ||
      trimmed.includes("C1/C2") ||
      trimmed.includes("Bilan");
    const cleanText = trimmed
      .replace(/>\s*\[!(TIP|WARNING|NOTE)\]\s*/g, "")
      .replace(/^>\s*/gm, "");

    return (
      <blockquote
        key={idx}
        className={cn(
          "relative rounded-2xl border-l-4 p-5 sm:p-6 my-6 shadow-2xs space-y-2",
          isTip
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
            : isWarning
            ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-100"
            : isFormula
            ? "border-sky-500 bg-sky-500/10 text-sky-950 dark:text-sky-100"
            : "border-primary bg-primary/5 text-foreground/90"
        )}
      >
        <div className="font-sans not-italic font-bold text-xs uppercase tracking-wider flex items-center gap-2">
          {isTip ? (
            <>
              <Lightbulb className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-300">Conseil Pédagogique FEI</span>
            </>
          ) : isWarning ? (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-amber-700 dark:text-amber-300">Piège Classique à Éviter</span>
            </>
          ) : isFormula ? (
            <>
              <Sparkles className="h-4 w-4 text-sky-500 shrink-0" />
              <span className="text-sky-700 dark:text-sky-300">Modèle C1/C2 &amp; Bilan</span>
            </>
          ) : (
            <>
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span className="text-primary">Note Méthodologique</span>
            </>
          )}
        </div>

        <div className="whitespace-pre-line leading-relaxed font-normal not-italic text-sm sm:text-base">
          {renderInlineMarkdown(cleanText)}
        </div>
      </blockquote>
    );
  }

  // Bullet Lists
  if (trimmed.startsWith("- ")) {
    const items = trimmed.split("\n- ").map((item) => item.replace("- ", ""));
    return (
      <ul key={idx} className="space-y-2.5 list-none pl-0 my-4">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <div>{renderInlineMarkdown(it)}</div>
          </li>
        ))}
      </ul>
    );
  }

  // Numbered Lists
  if (/^\d+\.\s/.test(trimmed)) {
    const lines = trimmed.split(/\n(?=\d+\.\s)/);
    return (
      <ol key={idx} className="space-y-2.5 list-none pl-0 my-4">
        {lines.map((line, i) => {
          const numMatch = line.match(/^(\d+)\.\s*([\s\S]*)/);
          const num = numMatch ? numMatch[1] : `${i + 1}`;
          const text = numMatch ? numMatch[2] : line;

          return (
            <li key={i} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold font-mono text-xs">
                {num}
              </span>
              <div>{renderInlineMarkdown(text)}</div>
            </li>
          );
        })}
      </ol>
    );
  }

  // Markdown Tables
  if (trimmed.startsWith("| ")) {
    const lines = trimmed.split("\n").filter((l) => !l.includes(":---") && !l.includes("---:"));
    const headers = lines[0]?.split("|").filter(Boolean).map((h) => h.trim());
    const rows = lines.slice(1).map((l) => l.split("|").filter(Boolean).map((c) => c.trim()));

    return (
      <div key={idx} className="overflow-x-auto my-6 rounded-2xl border border-border shadow-xs bg-card">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead className="bg-muted/70 text-foreground font-bold border-b border-border">
            <tr>
              {headers?.map((h, i) => (
                <th key={i} className="p-3.5 font-bold">{renderInlineMarkdown(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="p-3.5">{renderInlineMarkdown(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Code Blocks with Copy button
  if (trimmed.startsWith("```")) {
    const codeContent = trimmed.replace(/^```[a-z]*\n/, "").replace(/```$/, "");
    return <CopyableBlock key={idx} content={codeContent} />;
  }

  // Standard Paragraph with inline formatting
  return (
    <p key={idx} className="leading-relaxed text-foreground/90 text-sm sm:text-base">
      {renderInlineMarkdown(trimmed)}
    </p>
  );
}

