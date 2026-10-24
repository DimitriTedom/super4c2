"use client";

import React, { useState } from "react";
import { Share2, Link2, Check, Linkedin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BlogSocialShareProps {
  title: string;
  slug: string;
}

export function BlogSocialShare({ title, slug }: BlogSocialShareProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://super4c2.com/blog/${slug}`;
  };

  const handleCopyLink = () => {
    const url = getUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Lien copié dans le presse-papier !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = getUrl();
    const text = `Découvre ce guide officiel Super4C2 pour réussir le TCF Canada : "${title}"\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = getUrl();
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(liUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const url = getUrl();
    const text = `${title} — Guide de préparation TCF Canada & NCLC 7 :`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
        <Share2 className="h-3.5 w-3.5" />
        <span>Partager ce guide :</span>
      </span>

      {/* WhatsApp */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShareWhatsApp}
        className="h-8 text-xs gap-1.5 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
        title="Partager sur WhatsApp"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        <span>WhatsApp</span>
      </Button>

      {/* LinkedIn */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShareLinkedIn}
        className="h-8 text-xs gap-1.5 rounded-xl border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10"
        title="Partager sur LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" />
        <span>LinkedIn</span>
      </Button>

      {/* Copy Link */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="h-8 text-xs gap-1.5 rounded-xl"
        title="Copier le lien"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>Lien copié</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span>Copier le lien</span>
          </>
        )}
      </Button>
    </div>
  );
}
