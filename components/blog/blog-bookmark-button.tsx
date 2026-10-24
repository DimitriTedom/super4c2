"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useBlogBookmarks } from "@/lib/blog/use-blog-bookmarks";
import { BlogBookmarkDialog } from "@/components/blog/blog-bookmark-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogBookmarkButtonProps {
  slug: string;
  articleTitle?: string;
  variant?: "icon" | "button";
  className?: string;
}

export function BlogBookmarkButton({
  slug,
  articleTitle,
  variant = "icon",
  className = "",
}: BlogBookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isAuthenticated, isLoaded } = useBlogBookmarks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const saved = isBookmarked(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si le statut est encore en chargement, attendre
    if (!isLoaded) return;

    // Si le visiteur n'est PAS connecté et n'a pas encore sauvegardé cet article,
    // on lui présente la modale valorisant la création de compte gratuit
    if (isAuthenticated === false && !saved) {
      setDialogOpen(true);
      return;
    }

    // Sinon (connecté ou déjà sauvegardé), on bascule directement
    performToggle();
  };

  const performToggle = () => {
    setIsAnimating(true);
    const nowSaved = toggleBookmark(slug);
    setTimeout(() => setIsAnimating(false), 300);

    if (nowSaved) {
      toast.success("✓ Guide ajouté à vos fiches de révision !", {
        description: articleTitle ? `« ${articleTitle} »` : undefined,
      });
    } else {
      toast.info("Guide retiré de vos favoris.");
    }
  };

  if (variant === "button") {
    return (
      <>
        <Button
          type="button"
          onClick={handleClick}
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 text-xs font-semibold rounded-full transition-all duration-200 border-border/80 shadow-2xs",
            saved
              ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/15 hover:text-primary"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            isAnimating && "scale-105",
            className
          )}
          aria-label={saved ? "Retirer des favoris" : "Sauvegarder dans mes favoris"}
          title={saved ? "Sauvegardé dans vos fiches" : "Sauvegarder ce guide"}
        >
          <Bookmark
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              saved ? "fill-primary text-primary" : "text-muted-foreground",
              isAnimating && "scale-125"
            )}
          />
          <span>{saved ? "Sauvegardé" : "Sauvegarder"}</span>
        </Button>

        <BlogBookmarkDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          articleTitle={articleTitle}
          articleSlug={slug}
          onContinueLocal={performToggle}
        />
      </>
    );
  }

  // Variant "icon" compact pour les cartes
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "p-1.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm",
          saved
            ? "bg-primary text-white ring-2 ring-primary/40 scale-105"
            : "bg-black/60 text-white/80 hover:bg-black/80 hover:text-white border border-white/20",
          isAnimating && "scale-125",
          className
        )}
        aria-label={saved ? "Retirer des favoris" : "Sauvegarder dans mes favoris"}
        title={saved ? "Sauvegardé dans vos fiches" : "Sauvegarder dans mes révisions"}
      >
        <Bookmark
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            saved ? "fill-white text-white" : "text-white/90"
          )}
        />
      </button>

      <BlogBookmarkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        articleTitle={articleTitle}
        articleSlug={slug}
        onContinueLocal={performToggle}
      />
    </>
  );
}
