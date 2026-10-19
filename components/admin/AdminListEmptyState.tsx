"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  FolderKanban,
  Mail,
  MessageSquareQuote,
  Plus,
  Settings2,
  PenTool,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyKind =
  | "series-ce"
  | "series-ee"
  | "series-eo"
  | "blog"
  | "faqs"
  | "testimonials"
  | "newsletter"
  | "leads"
  | "default";

interface AdminListEmptyStateProps {
  kind: EmptyKind;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AdminListEmptyState({
  kind,
  title,
  description,
  actionHref,
  actionLabel = "Ajouter",
}: AdminListEmptyStateProps) {
  const icon = useMemo(() => {
    switch (kind) {
      case "series-ce":
        return <BookOpen className="h-8 w-8 text-primary" />;
      case "series-ee":
        return <PenTool className="h-8 w-8 text-primary" />;
      case "series-eo":
        return <Mic className="h-8 w-8 text-primary" />;
      case "blog":
        return <FolderKanban className="h-8 w-8 text-primary" />;
      case "faqs":
        return <CircleHelp className="h-8 w-8 text-primary" />;
      case "testimonials":
        return <MessageSquareQuote className="h-8 w-8 text-primary" />;
      case "newsletter":
      case "leads":
        return <Mail className="h-8 w-8 text-primary" />;
      default:
        return <Settings2 className="h-8 w-8 text-primary" />;
    }
  }, [kind]);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionHref && (
        <div className="mt-6">
          <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
            <Link href={actionHref}>
              <Plus className="h-4 w-4" />
              <span>{actionLabel}</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
