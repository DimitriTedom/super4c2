"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  Copy,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  "Comment décrocher le NCLC 7 en Expression Écrite ?",
  "Donne-moi 5 connecteurs logiques formels de niveau C1/C2.",
  "Quels sont les pièges classiques en Compréhension Orale ?",
  "Aide-moi à concevoir un sujet d'examen pour la Tâche 2 (Admin).",
];

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
          "Désolé, je n'ai pas pu générer de réponse pour le moment.",
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
            "Une erreur de communication est survenue avec le service DeepSeek. Veuillez réessayer dans quelques instants.",
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
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-4 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95"
          aria-label="Ouvrir le Coach IA Super4C2"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-wide">Coach IA</span>
          <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
            DeepSeek
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
              : "w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-card/60 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold leading-none text-foreground">
                    Super4C2 Coach
                  </h3>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    DeepSeek-V3
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Expert TCF & TEF Canada • 24/7
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
                  title="Réinitialiser la conversation"
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-amber-500/10 text-primary">
                  <Bot className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    Comment puis-je vous aider aujourd&apos;hui ?
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Posez vos questions sur le TCF Canada, demandez des reformulations de niveau C1/C2 ou sollicitez des astuces d&apos;examen.
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
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col space-y-1",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-2xs break-words",
                        isUser
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-muted/80 text-foreground border border-border/60 rounded-bl-xs"
                      )}
                    >
                      {m.content}

                      {/* Copy action on assistant message */}
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="absolute -right-7 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
                          title="Copier la réponse"
                        >
                          {copiedId === m.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted text-primary">
                  <Bot className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <span className="flex items-center gap-1">
                  DeepSeek analyse et formule sa réponse
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
          <div className="border-t bg-card/60 p-3">
            <div className="relative flex items-end gap-2 rounded-2xl border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Posez votre question (ex: grammaire, NCLC 7...)"
                disabled={loading}
                className="max-h-28 min-h-[36px] w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden disabled:opacity-50"
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
              <span>Appuyez sur Entrée pour envoyer</span>
              <span className="font-mono">Super4C2 AI v1.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
