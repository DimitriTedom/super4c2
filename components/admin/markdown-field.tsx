"use client";

import React, { useRef, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { markdownRemarkPlugins, markdownRehypePlugins } from "@/lib/markdown";
import { cn } from "@/lib/utils";

interface MarkdownFieldProps {
  id?: string;
  name: string;
  label?: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  templates?: { label: string; snippet: string }[];
}

export function MarkdownField({
  id,
  name,
  label,
  description,
  defaultValue = "",
  placeholder,
  rows = 6,
  required = false,
  templates = [],
}: MarkdownFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const words = useMemo(() => {
    return value.trim() ? value.trim().split(/\s+/).length : 0;
  }, [value]);

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setValue((curr) => curr + snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
    setValue(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + snippet.length;
      textarea.selectionStart = pos;
      textarea.selectionEnd = pos;
    });
  };

  const wrapSelection = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const wrapped = `${prefix}${selected || "texte"}${suffix}`;
    const next = `${value.slice(0, start)}${wrapped}${value.slice(end)}`;
    setValue(next);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + (selected.length || 5);
    });
  };

  return (
    <div className="space-y-2 rounded-2xl border bg-card/60 p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div>
          {label && (
            <label htmlFor={id || name} className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>{label}</span>
              {required && <span className="text-primary">*</span>}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1",
              viewMode === "edit"
                ? "bg-card text-foreground shadow-xs border"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Mode Édition Seule"
          >
            <Edit3 className="h-3 w-3" />
            <span>Édition</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 hidden sm:flex",
              viewMode === "split"
                ? "bg-card text-foreground shadow-xs border"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Mode Côte à Côte"
          >
            <Columns className="h-3 w-3" />
            <span>Côte à côte</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1",
              viewMode === "preview"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Aperçu Rendu Markdown"
          >
            <Eye className="h-3 w-3" />
            <span>Aperçu</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {viewMode !== "preview" && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1">
          <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-lg border border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => wrapSelection("**", "**")}
              className="h-7 px-2 text-xs font-bold"
              title="Gras (**texte**)"
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => wrapSelection("*", "*")}
              className="h-7 px-2 text-xs italic font-serif"
              title="Italique (*texte*)"
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertSnippet("\n## ")}
              className="h-7 px-2 text-xs font-bold"
              title="Titre H2"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertSnippet("\n### ")}
              className="h-7 px-2 text-xs font-bold"
              title="Titre H3"
            >
              <Heading3 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-lg border border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertSnippet("\n- ")}
              className="h-7 px-2 text-xs"
              title="Liste à puces"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertSnippet("\n1. ")}
              className="h-7 px-2 text-xs"
              title="Liste numérotée"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertSnippet("\n> ")}
              className="h-7 px-2 text-xs"
              title="Citation / Encadré"
            >
              <Quote className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => wrapSelection("`", "`")}
              className="h-7 px-2 text-xs font-mono"
              title="Code / Référence"
            >
              <Code className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertSnippet("[texte du lien](https://)")}
              className="h-7 px-2 text-xs"
              title="Lien hypertexte"
            >
              <Link2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Quick Templates */}
          {templates.length > 0 && (
            <div className="flex items-center gap-1">
              {templates.map((tpl, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertSnippet(tpl.snippet)}
                  className="h-7 px-2 text-[11px] font-semibold gap-1 text-primary hover:text-primary"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{tpl.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor & Preview Area */}
      <div
        className={cn(
          "grid gap-4",
          viewMode === "split" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* Editor Box */}
        {viewMode !== "preview" && (
          <div className="relative">
            <Textarea
              ref={textareaRef}
              id={id || name}
              name={name}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              required={required}
              className="text-xs font-mono rounded-xl bg-muted/20 border-border focus:ring-primary min-h-[140px] resize-y"
            />
          </div>
        )}

        {/* Live Preview Box */}
        {viewMode !== "edit" && (
          <div className="rounded-xl border bg-muted/10 p-4 overflow-y-auto max-h-[350px] min-h-[140px]">
            {value.trim() ? (
              <div className="markdown-content text-xs">
                <ReactMarkdown
                  remarkPlugins={markdownRemarkPlugins}
                  rehypePlugins={markdownRehypePlugins}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-6 text-xs italic gap-1">
                <FileText className="h-6 w-6 opacity-40" />
                <span>L&apos;aperçu s&apos;affichera en temps réel dès que vous tapez du markdown...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Word and Character Count Status */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 px-1">
        <span>{words} mots · {value.length} caractères</span>
        <span className="text-[10px] text-muted-foreground/80 font-mono">
          Markdown / HTML géré
        </span>
      </div>
    </div>
  );
}
