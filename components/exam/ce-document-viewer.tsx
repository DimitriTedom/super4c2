"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, Highlighter, Eraser, ZoomIn, ZoomOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FontSizeLevel = "sm" | "base" | "lg" | "xl";

const FONT_SIZE_CLASSES: Record<FontSizeLevel, string> = {
  sm: "text-sm leading-relaxed",
  base: "text-base leading-relaxed sm:text-lg sm:leading-loose",
  lg: "text-lg leading-relaxed sm:text-xl sm:leading-loose",
  xl: "text-xl leading-loose sm:text-2xl sm:leading-loose",
};

interface CeDocumentViewerProps {
  questionNumber: number;
  documentNature: string;
  documentText?: string;
  highlights: string[];
  onAddHighlight: (text: string) => void;
  onClearHighlights: () => void;
}

export function CeDocumentViewer({
  questionNumber,
  documentNature,
  documentText = "",
  highlights,
  onAddHighlight,
  onClearHighlights,
}: CeDocumentViewerProps) {
  const [fontSize, setFontSize] = useState<FontSizeLevel>("base");
  const [isHighlighterActive, setIsHighlighterActive] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const increaseFontSize = () => {
    if (fontSize === "sm") setFontSize("base");
    else if (fontSize === "base") setFontSize("lg");
    else if (fontSize === "lg") setFontSize("xl");
  };

  const decreaseFontSize = () => {
    if (fontSize === "xl") setFontSize("lg");
    else if (fontSize === "lg") setFontSize("base");
    else if (fontSize === "base") setFontSize("sm");
  };

  // Handle text selection when highlighter is active
  useEffect(() => {
    if (!isHighlighterActive) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim();
      if (selectedText.length >= 2 && selectedText.length <= 300) {
        onAddHighlight(selectedText);
        selection.removeAllRanges();
      }
    };

    const node = articleRef.current;
    if (node) {
      node.addEventListener("mouseup", handleMouseUp);
      node.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      if (node) {
        node.removeEventListener("mouseup", handleMouseUp);
        node.removeEventListener("touchend", handleMouseUp);
      }
    };
  }, [isHighlighterActive, onAddHighlight]);

  // Helper to render text with highlighted segments
  const renderHighlightedContent = () => {
    if (!documentText) return null;
    if (highlights.length === 0) {
      return documentText;
    }

    // Sort highlights by length descending to match longest phrases first
    const sortedHighlights = [...highlights].filter(Boolean).sort((a, b) => b.length - a.length);

    try {
      // Escape regex special chars
      const pattern = sortedHighlights
        .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
      const regex = new RegExp(`(${pattern})`, "gi");
      const parts = documentText.split(regex);

      return parts.map((part, index) => {
        const isMatch = sortedHighlights.some(
          (h) => h.toLowerCase() === part.toLowerCase()
        );
        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-amber-300/50 dark:bg-amber-400/35 text-foreground rounded-sm px-1 py-0.5 border-b-2 border-amber-500/80 font-semibold shadow-2xs transition-colors"
            >
              {part}
            </mark>
          );
        }
        return part;
      });
    } catch {
      return documentText;
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col space-y-4">
      {/* Document Top Bar with Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <FileText className="h-4 w-4 text-primary" />
          <span className="truncate max-w-[220px] sm:max-w-none">{documentNature}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Highlighter Toggle Button */}
          <div className="flex items-center gap-1 border-r pr-2 border-border/60">
            <Button
              type="button"
              variant={isHighlighterActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsHighlighterActive(!isHighlighterActive)}
              className={cn(
                "h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all shadow-2xs",
                isHighlighterActive
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500/30"
                  : "hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400"
              )}
              title="Activer le feutre surligneur interactif"
            >
              <Highlighter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isHighlighterActive ? "Surligneur actif" : "Surligneur"}
              </span>
            </Button>

            {highlights.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClearHighlights}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                title="Effacer tous les surlignages de ce document"
              >
                <Eraser className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Text Zoom Controls */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground mr-1 hidden md:inline">Police :</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={decreaseFontSize}
              disabled={fontSize === "sm"}
              title="Diminuer la police"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <button
              type="button"
              onClick={() => setFontSize("base")}
              className="px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground hover:text-foreground"
              title="Taille standard (100%)"
            >
              {fontSize === "sm" ? "85%" : fontSize === "base" ? "100%" : fontSize === "lg" ? "115%" : "130%"}
            </button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={increaseFontSize}
              disabled={fontSize === "xl"}
              title="Agrandir la police"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Highlighter Status Hint */}
      {isHighlighterActive && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-medium animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Sélectionnez du texte avec votre souris ou doigt pour surligner les indices clés.</span>
          </div>
          {highlights.length > 0 && (
            <span className="font-mono text-[11px] font-bold">
              {highlights.length} {highlights.length > 1 ? "passages" : "passage"}
            </span>
          )}
        </div>
      )}

      {/* Authentic High-Contrast Document Card */}
      <div
        className={cn(
          "flex-1 rounded-3xl border-2 border-slate-200/90 dark:border-border bg-white dark:bg-card p-6 sm:p-8 shadow-md flex flex-col transition-all",
          isHighlighterActive && "ring-2 ring-amber-400/40 border-amber-400/60 dark:border-amber-500/50 cursor-highlighter"
        )}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50">
            Document Support Officiel · Question {questionNumber}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground font-semibold">
            Standard FEI Écran Scindé
          </span>
        </div>

        <article
          ref={articleRef}
          className={cn(
            "whitespace-pre-line font-sans text-slate-900 dark:text-foreground font-medium transition-all tracking-normal flex-1",
            isHighlighterActive ? "cursor-highlighter select-text" : "select-text",
            FONT_SIZE_CLASSES[fontSize],
          )}
        >
          {renderHighlightedContent()}
        </article>
      </div>
    </div>
  );
}
