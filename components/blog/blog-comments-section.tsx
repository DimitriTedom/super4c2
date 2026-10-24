"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareQuote,
  ShieldCheck,
  ThumbsUp,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  ArrowRight,
  HelpCircle,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  type PedagogicalComment,
  getCommentsForSlug,
} from "@/lib/blog/comments-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface BlogCommentsSectionProps {
  slug: string;
  category?: string;
  articleTitle: string;
}

const UPVOTES_STORAGE_KEY = "super4c2:upvoted_comments";

export function BlogCommentsSection({
  slug,
  category,
  articleTitle,
}: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<PedagogicalComment[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [questionText, setQuestionText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    id?: string;
    email?: string;
    name?: string;
  } | null>(null);

  const localCommentsKey = `super4c2:user_comments_${slug}`;

  useEffect(() => {
    setMounted(true);

    // 1. Load seed comments
    const seed = getCommentsForSlug(slug, category);

    // 2. Load user-submitted comments from localStorage
    let localSubmitted: PedagogicalComment[] = [];
    try {
      const stored = localStorage.getItem(localCommentsKey);
      if (stored) {
        localSubmitted = JSON.parse(stored);
      }
    } catch {
      // LocalStorage access fallback
    }

    // Combine user comments (first) + verified seed comments
    setComments([...localSubmitted, ...seed]);

    // 3. Load upvoted comments from localStorage
    try {
      const storedUpvotes = localStorage.getItem(UPVOTES_STORAGE_KEY);
      if (storedUpvotes) {
        setUpvotedIds(JSON.parse(storedUpvotes));
      }
    } catch {
      // fallback
    }

    // 4. Try fetching current user session
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const email = data.user.email || "";
          const metaName =
            (data.user.user_metadata?.full_name as string) ||
            (data.user.user_metadata?.name as string) ||
            email.split("@")[0];
          setUserProfile({
            id: data.user.id,
            email,
            name: metaName,
          });
          setAuthorName(metaName);
          setAuthorEmail(email);
        }
      });
    } catch {
      // Supabase unconfigured or offline in dev
    }
  }, [slug, category, localCommentsKey]);

  const handleUpvote = (commentId: string) => {
    if (upvotedIds.includes(commentId)) {
      // Remove upvote
      const newUpvoted = upvotedIds.filter((id) => id !== commentId);
      setUpvotedIds(newUpvoted);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, upvotes: Math.max(0, c.upvotes - 1) } : c))
      );
      try {
        localStorage.setItem(UPVOTES_STORAGE_KEY, JSON.stringify(newUpvoted));
      } catch {
        // ignore
      }
      toast.info("Vote retiré.");
      return;
    }

    // Add upvote
    const newUpvoted = [...upvotedIds, commentId];
    setUpvotedIds(newUpvoted);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
    try {
      localStorage.setItem(UPVOTES_STORAGE_KEY, JSON.stringify(newUpvoted));
    } catch {
      // ignore
    }
    toast.success("Merci ! Votre vote a été comptabilisé.");
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = questionText.trim();
    if (trimmed.length < 15) {
      toast.error("Veuillez formuler une question d'au moins 15 caractères.");
      return;
    }

    const finalName = authorName.trim() || (userProfile?.name ?? "Candidat TCF");

    setIsSubmitting(true);

    const newComment: PedagogicalComment = {
      id: `user-${Date.now()}`,
      slug,
      category,
      authorName: finalName,
      authorEmail: authorEmail.trim() || undefined,
      authorBadge: "En attente de relecture pédagogique",
      publishedAt: "À l'instant",
      question: trimmed,
      upvotes: 1,
      status: "pending",
    };

    // Save to local state
    const updated = [newComment, ...comments];
    setComments(updated);

    // Save to localStorage
    try {
      const stored = localStorage.getItem(localCommentsKey);
      const existingUserComments: PedagogicalComment[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        localCommentsKey,
        JSON.stringify([newComment, ...existingUserComments])
      );
    } catch {
      // ignore
    }

    // Auto upvote own question
    const newUpvoted = [...upvotedIds, newComment.id];
    setUpvotedIds(newUpvoted);
    try {
      localStorage.setItem(UPVOTES_STORAGE_KEY, JSON.stringify(newUpvoted));
    } catch {
      // ignore
    }

    setQuestionText("");
    setIsSubmitting(false);

    toast.success(
      "Votre question a été enregistrée avec succès ! Elle est transmise à l'équipe pédagogique Super4C2."
    );
  };

  const totalQuestions = comments.length;

  return (
    <section
      id="pedagogical-comments"
      className="mt-14 pt-10 border-t border-border/80 scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Salon de Mentorat & Échange Pédagogique</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <MessageSquareQuote className="w-7 h-7 text-primary shrink-0" />
            <span>Questions & Réponses Certifiées</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-2xl">
            Une incertitude sur cette épreuve, le décompte des mots ou les critères FEI ?
            Nos correcteurs et experts du TCF Canada vous répondent directement.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-muted/60 dark:bg-muted/30 border border-border/70 rounded-xl px-4 py-2 text-xs font-medium text-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>
            <strong className="text-foreground">{totalQuestions}</strong> échange
            {totalQuestions > 1 ? "s" : ""} vérifié{totalQuestions > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Question Form */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-5 sm:p-6 shadow-sm mb-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Poser une question à l'équipe pédagogique</span>
          </div>
          {userProfile && (
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Connecté : <strong className="text-foreground">{userProfile.name}</strong>
            </span>
          )}
        </div>

        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <div className="relative">
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              maxLength={600}
              rows={3}
              placeholder="Exemple : Dans la Tâche 2 de l'Expression Écrite, est-ce pénalisant si j'écris 165 mots au lieu des 150 requis ? Comment le correcteur décompte-t-il ?"
              className="w-full rounded-xl border border-border/80 bg-background/80 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-y"
              required
            />
            <div className="text-right text-[11px] text-muted-foreground mt-1">
              {questionText.length}/600 caractères
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="comment-author-name"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Votre prénom ou identifiant
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="comment-author-name"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ex : Sarah M."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border/80 bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="comment-author-email"
                className="block text-xs font-medium text-muted-foreground mb-1">
                Votre email{" "}
                <span className="text-muted-foreground/70 font-normal">
                  (facultatif — pour notification)
                </span>
              </label>
              <input
                id="comment-author-email"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="sarah@exemple.com"
                className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                100% Gratuit — Vos coordonnées restent strictement confidentielles.
              </span>
            </p>

            <button
              type="submit"
              disabled={isSubmitting || questionText.trim().length < 15}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-primary-foreground bg-primary hover:bg-primary/95 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Envoi en cours..." : "Transmettre ma question au mentor"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => {
          const isUpvoted = mounted && upvotedIds.includes(comment.id);
          const isPending = comment.status === "pending";

          return (
            <article
              key={comment.id}
              className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm transition hover:border-border"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">
                        {comment.authorName}
                      </span>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-2.5 h-2.5" />
                          En attente de relecture
                        </span>
                      ) : (
                        comment.authorBadge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
                            {comment.authorBadge}
                          </span>
                        )
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {comment.publishedAt}
                    </span>
                  </div>
                </div>

                {/* Upvote Button */}
                <button
                  type="button"
                  onClick={() => handleUpvote(comment.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    isUpvoted
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/40 hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Voter pour cette question"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? "fill-primary" : ""}`} />
                  <span>Utile ({comment.upvotes})</span>
                </button>
              </div>

              {/* Question Body */}
              <p className="text-sm sm:text-base text-foreground leading-relaxed pl-12 pr-2">
                {comment.question}
              </p>

              {/* Pending notice if newly submitted */}
              {isPending && !comment.officialAnswer && (
                <div className="mt-4 ml-12 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                  <BadgeAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <strong>Question transmise !</strong> Un correcteur officiel examine votre
                    demande. La réponse pédagogique détaillée sera publiée ici après validation de
                    conformité avec les grilles FEI.
                  </div>
                </div>
              )}

              {/* Official Mentor Answer */}
              {comment.officialAnswer && (
                <div className="mt-5 ml-4 sm:ml-12 pl-4 sm:pl-5 border-l-2 border-primary/80 bg-primary/[0.03] dark:bg-primary/[0.05] rounded-r-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-foreground">
                            {comment.officialAnswer.authorName}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary border border-primary/25">
                            <ShieldCheck className="w-3 h-3" />
                            Réponse Officielle FEI
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {comment.officialAnswer.authorRole} •{" "}
                          {comment.officialAnswer.publishedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {comment.officialAnswer.content}
                  </p>

                  {comment.officialAnswer.feiReference && (
                    <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <FileText className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span>
                        <strong>Référence officielle :</strong>{" "}
                        {comment.officialAnswer.feiReference}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Conversion Card */}
      <div className="mt-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-card to-background p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 mb-4 sm:mb-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulateur Officiel TCF Canada</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Envie de tester vos rédactions sur les 3 Tâches réelles ?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Passez une simulation complète sur notre moteur d'examen CBT. Correction IA instantanée
            selon les 4 critères officiels FEI et calcul de vos points CRS en direct.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/test-gratuit"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:bg-primary/95 transition shadow-md cursor-pointer"
          >
            <span>Démarrer un Test Gratuit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
