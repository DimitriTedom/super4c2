"use client";

import React from "react";
import { CheckCircle2, Video, Lightbulb, AlertTriangle, Info, Sparkles } from "lucide-react";
import { slugify } from "@/lib/admin-crud-utils";
import { BlogVideoPlayer, extractYouTubeId } from "./blog-video-player";
import { cn } from "@/lib/utils";

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  // Split into markdown blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 space-y-6 text-sm sm:text-base leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 2
        if (trimmed.startsWith("## ")) {
          const text = trimmed.replace("## ", "").trim();
          const id = slugify(text);
          return (
            <h2
              key={idx}
              id={id}
              className="scroll-mt-24 font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground pt-6 border-b border-border/60 pb-2.5 flex items-center justify-between group"
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

        // Heading 3
        if (trimmed.startsWith("### ")) {
          const text = trimmed.replace("### ", "").trim();
          const id = slugify(text);
          return (
            <h3
              key={idx}
              id={id}
              className="scroll-mt-24 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground pt-4 text-primary flex items-center justify-between group"
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

        // Heading 4
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

        // Blockquotes and Callouts
        if (trimmed.startsWith("> ")) {
          const isTip = trimmed.includes("[!TIP]") || trimmed.includes("Conseil") || trimmed.includes("Recommandation");
          const isWarning = trimmed.includes("[!WARNING]") || trimmed.includes("Piège") || trimmed.includes("Attention");
          const isFormula = trimmed.includes("Formule") || trimmed.includes("C1/C2");
          const cleanText = trimmed
            .replace(/>\s*\[!(TIP|WARNING|NOTE)\]\s*/g, "")
            .replace(/^>\s*/gm, "");

          return (
            <blockquote
              key={idx}
              className={cn(
                "rounded-2xl border-l-4 p-5 italic text-sm my-6 shadow-2xs space-y-1.5",
                isTip
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                  : isWarning
                  ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                  : isFormula
                  ? "border-sky-500 bg-sky-500/10 text-sky-950 dark:text-sky-100"
                  : "border-primary bg-primary/5 text-foreground/90"
              )}
            >
              <div className="font-sans not-italic font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
                {isTip ? (
                  <>
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-700 dark:text-emerald-300">Conseil Pédagogique FEI</span>
                  </>
                ) : isWarning ? (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-300">Piège Classique à Éviter</span>
                  </>
                ) : isFormula ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                    <span className="text-sky-700 dark:text-sky-300">Formule C1/C2 Recommandée</span>
                  </>
                ) : (
                  <>
                    <Info className="h-3.5 w-3.5 text-primary" />
                    <span>Note Méthodologique</span>
                  </>
                )}
              </div>
              <p className="whitespace-pre-line leading-relaxed font-normal not-italic">{cleanText}</p>
            </blockquote>
          );
        }

        // Bullet Lists
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n- ").map((item) => item.replace("- ", ""));
          return (
            <ul key={idx} className="space-y-2.5 list-none pl-0 my-4">
              {items.map((it, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Numbered Lists
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n\d+\.\s/).filter(Boolean);
          return (
            <ol key={idx} className="space-y-2 list-decimal pl-5 my-4 text-sm marker:text-primary marker:font-bold">
              {items.map((it, i) => (
                <li key={i} className="leading-relaxed pl-1">
                  {it}
                </li>
              ))}
            </ol>
          );
        }

        // Markdown Tables
        if (trimmed.startsWith("| ")) {
          const lines = trimmed.split("\n").filter((l) => !l.includes(":---") && !l.includes("---:"));
          const headers = lines[0]?.split("|").filter(Boolean).map((h) => h.trim());
          const rows = lines.slice(1).map((l) => l.split("|").filter(Boolean).map((c) => c.trim()));

          return (
            <div key={idx} className="overflow-x-auto my-6 rounded-2xl border border-border shadow-xs">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-muted text-foreground font-bold">
                  <tr>
                    {headers?.map((h, i) => (
                      <th key={i} className="p-3.5 border-b border-border/80">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className="p-3.5">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Code Blocks
        if (trimmed.startsWith("```")) {
          const codeContent = trimmed.replace(/^```[a-z]*\n/, "").replace(/```$/, "");
          return (
            <pre
              key={idx}
              className="rounded-2xl border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto my-4 text-foreground/90 leading-relaxed"
            >
              <code>{codeContent}</code>
            </pre>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed text-foreground/90">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
