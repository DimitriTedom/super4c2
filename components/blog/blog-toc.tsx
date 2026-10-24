"use client";

import React, { useEffect, useState } from "react";
import { List, ChevronDown, ChevronUp, Bookmark, Clock } from "lucide-react";
import { slugify } from "@/lib/admin-crud-utils";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractTocFromMarkdown(content: string): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace("## ", "").trim();
      items.push({
        id: slugify(text),
        text,
        level: 2,
      });
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.replace("### ", "").trim();
      items.push({
        id: slugify(text),
        text,
        level: 3,
      });
    }
  }

  return items;
}

interface BlogTocProps {
  items: TocItem[];
  readTimeMinutes?: number;
}

export function BlogTableOfContents({ items, readTimeMinutes }: BlogTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setIsMobileOpen(false);

      // Trigger high-visibility pulse animation on target
      el.classList.remove("heading-pulse-target");
      void el.offsetWidth;
      el.classList.add("heading-pulse-target");
      setTimeout(() => el.classList.remove("heading-pulse-target"), 1900);
    }
  };

  if (items.length === 0) return null;

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const currentStep = activeIndex >= 0 ? activeIndex + 1 : 1;
  const progressPercent = items.length > 0 ? Math.round((currentStep / items.length) * 100) : 0;

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden rounded-2xl border border-border bg-card p-4 my-6 shadow-xs">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center justify-between w-full text-left font-display font-bold text-sm text-foreground"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-brand-crimson" />
            <span>Sommaire de l&apos;Article ({items.length} sections)</span>
          </span>
          {isMobileOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {isMobileOpen && (
          <nav className="mt-3 pt-3 border-t border-border/60 space-y-2 text-xs">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left transition-colors py-1 ${
                  item.level === 3 ? "pl-4 text-muted-foreground" : "font-semibold"
                } ${
                  activeId === item.id
                    ? "text-brand-crimson font-bold"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.text}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-border bg-card/90 backdrop-blur-md p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-3">
            <span className="flex items-center gap-2">
              <Bookmark className="h-3.5 w-3.5 text-brand-crimson" />
              <span>Dans ce Guide</span>
            </span>
            {readTimeMinutes && (
              <span className="flex items-center gap-1 font-mono text-[11px] font-normal text-muted-foreground/80 lowercase">
                <Clock className="h-3 w-3 text-brand-crimson" />
                {readTimeMinutes} min
              </span>
            )}
          </div>

          {/* Reading Progress Indicator */}
          <div className="space-y-1.5 pb-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Section {currentStep} sur {items.length}</span>
              <span className="font-bold text-foreground">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-brand-crimson transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 text-xs">
            {items.map((item, idx) => {
              const isActive = activeId === item.id;
              const isPast = activeIndex > idx;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  className={`group flex items-start gap-2 w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${
                    item.level === 3 ? "ml-3 text-[11px]" : "font-semibold"
                  } ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                      isActive
                        ? "bg-brand-crimson scale-125 ring-2 ring-brand-crimson/20"
                        : isPast
                        ? "bg-emerald-500/70"
                        : "bg-muted-foreground/30 group-hover:bg-muted-foreground"
                    }`}
                  />
                  <span className="line-clamp-2 leading-snug">{item.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
