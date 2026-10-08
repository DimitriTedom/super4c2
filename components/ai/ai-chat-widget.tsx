"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  Check,
  Copy,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  liked?: boolean | null;
}

const DEFAULT_SUGGESTIONS = [
  "Comment décrocher le NCLC 7 en Expression Écrite ?",
  "Donne-moi 5 connecteurs logiques formels de niveau C1/C2.",
  "Quels sont les pièges classiques en Compréhension Orale ?",
  "Aide-moi à concevoir un sujet d'examen pour la Tâche 2 (Admin).",
];

export function AiChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Stop speech when closing or unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          currentPath: pathname,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de réponse du serveur.");
      }

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "Désolé, je n'ai pas pu formuler de réponse pour le moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            "Une perturbation temporaire empêche Aura C2™ de formuler une réponse. Veuillez réessayer dans quelques instants.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Réponse copiée dans le presse-papier", { autoClose: 1800 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.warning("La synthèse vocale n'est pas disponible sur ce navigateur.");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Nettoyer les caractères Markdown bruts pour la lecture vocale
    const cleanText = text
      .replace(/[#*`_~[\]|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleFeedback = (id: string, liked: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked } : m))
    );
    toast.success(
      liked
        ? "Merci pour votre retour positif !"
        : "Merci, nous améliorons continuellement les explications d'Aura C2.",
      { autoClose: 2000 }
    );
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages([]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-slate-900 px-4 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95"
          aria-label="Ouvrir le Coach Aura C2™"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-3.5 w-3.5 text-amber-200" />
          </div>
          <span className="text-sm font-bold tracking-wide">Coach Aura C2™</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            En ligne
          </span>
        </button>
      )}

      {/* Slide-in Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-300",
            isExpanded
              ? "fixed inset-4 sm:inset-10 z-50"
              : "w-[92vw] sm:w-[450px] h-[620px] max-h-[85vh]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-card/70 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold leading-none text-foreground">
                    Aura C2™
                  </h3>
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    Officiel Super4C2
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Tuteur Pédagogique Certifié FEI & IRCC • 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleReset}
                  title="Nouvelle conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Réduire" : "Agrandir"}
              >
                {isExpanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Viewport */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 text-sm"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col justify-center space-y-4 py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 via-rose-500/10 to-amber-500/10 text-primary">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-foreground">
                    Bienvenue sur Aura C2™
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Votre intelligence pédagogique dédiée au TCF & TEF Canada. Posez vos questions méthodologiques, demandez des explications de pièges ou des reformulations C1/C2.
                  </p>
                </div>

                {/* Suggestions Chips */}
                <div className="space-y-2 pt-2 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                    Suggestions rapides :
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => void handleSend(sug)}
                        className="rounded-xl border border-border/80 bg-card/60 p-2.5 text-xs text-foreground/90 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.99] text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m) => {
                const isUser = m.role === "user";
                const isSpeaking = speakingId === m.id;

                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col space-y-1.5",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "group relative max-w-[90%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-2xs break-words",
                        isUser
                          ? "bg-primary text-primary-foreground rounded-br-xs font-medium"
                          : "bg-card text-foreground border border-border/70 rounded-bl-xs"
                      )}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground text-[13.5px] leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              table: ({ ...props }) => (
                                <div className="my-3 overflow-x-auto rounded-xl border border-border/80 shadow-2xs">
                                  <table className="w-full text-left text-xs border-collapse" {...props} />
                                </div>
                              ),
                              thead: ({ ...props }) => (
                                <thead className="bg-muted/80 text-foreground font-semibold border-b border-border/80" {...props} />
                              ),
                              th: ({ ...props }) => (
                                <th className="p-2.5 font-bold text-foreground border-r last:border-r-0 border-border/60" {...props} />
                              ),
                              td: ({ ...props }) => (
                                <td className="p-2.5 text-muted-foreground border-b border-border/50 border-r last:border-r-0" {...props} />
                              ),
                              h2: ({ ...props }) => (
                                <h2 className="text-base font-bold font-display text-foreground mt-3 mb-1.5" {...props} />
                              ),
                              h3: ({ ...props }) => (
                                <h3 className="text-sm font-bold font-display text-foreground mt-2.5 mb-1 text-primary" {...props} />
                              ),
                              h4: ({ ...props }) => (
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2 mb-1" {...props} />
                              ),
                              ul: ({ ...props }) => (
                                <ul className="my-2 space-y-1 list-disc pl-4 text-foreground/90" {...props} />
                              ),
                              ol: ({ ...props }) => (
                                <ol className="my-2 space-y-1 list-decimal pl-4 text-foreground/90" {...props} />
                              ),
                              li: ({ ...props }) => (
                                <li className="text-[13px] text-foreground/90" {...props} />
                              ),
                              strong: ({ ...props }) => (
                                <strong className="font-bold text-foreground" {...props} />
                              ),
                              blockquote: ({ ...props }) => (
                                <blockquote className="border-l-2 border-primary pl-3 my-2 text-muted-foreground italic text-xs" {...props} />
                              ),
                              code: ({ ...props }) => (
                                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-primary font-semibold" {...props} />
                              ),
                              p: ({ ...props }) => (
                                <p className="mb-2 last:mb-0" {...props} />
                              ),
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {/* Action Bar for Assistant Message */}
                      {!isUser && (
                        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-muted-foreground text-xs">
                          <div className="flex items-center gap-1">
                            {/* Voice Speak Button */}
                            <button
                              onClick={() => handleSpeak(m.id, m.content)}
                              className={cn(
                                "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:bg-muted hover:text-foreground",
                                isSpeaking && "bg-primary/10 text-primary font-semibold animate-pulse"
                              )}
                              title={isSpeaking ? "Arrêter la lecture" : "Écouter l'explication (Voix FR)"}
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX className="h-3.5 w-3.5 text-primary" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3.5 w-3.5" />
                                  <span>Écouter</span>
                                </>
                              )}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(m.id, m.content)}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:bg-muted hover:text-foreground"
                              title="Copier la réponse"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  <span className="text-emerald-500">Copié</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Feedback Thumbs */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFeedback(m.id, true)}
                              className={cn(
                                "rounded-lg p-1 transition-colors hover:bg-muted",
                                m.liked === true ? "text-emerald-500 font-bold" : "hover:text-foreground"
                              )}
                              title="Cette réponse est utile"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(m.id, false)}
                              className={cn(
                                "rounded-lg p-1 transition-colors hover:bg-muted",
                                m.liked === false ? "text-red-500 font-bold" : "hover:text-foreground"
                              )}
                              title="Cette réponse n'est pas utile"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <span className="flex items-center gap-1.5 font-medium">
                  Aura C2™ formule votre réponse pédagogique
                  <span className="flex gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Composer Input */}
          <div className="border-t bg-card/70 p-3">
            <div className="relative flex items-end gap-2 rounded-2xl border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Posez votre question à Aura C2™ (ex: grammaire, NCLC 7...)"
                disabled={loading}
                className="max-h-28 min-h-[38px] w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden disabled:opacity-50"
              />
              <Button
                onClick={() => void handleSend()}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-8 w-8 shrink-0 rounded-xl"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between px-1 pt-2 text-[10px] text-muted-foreground">
              <span>Appuyez sur Entrée pour envoyer • Maj+Entrée pour saut de ligne</span>
              <span className="font-mono text-primary/80 font-semibold">Aura C2™ Engine</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
