"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Filter,
  Flame,
  Search,
  Plus,
  BookOpen,
  RotateCcw,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SrsCard,
  INITIAL_SRS_CARDS,
  isCardDueToday,
  calculateDeckStats,
  getCardMasteryStatus,
} from "@/lib/srs/sm2-algorithm";
import { SrsFlashcardPlayer } from "./srs-flashcard-player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

export function SrsCarnet() {
  const [cards, setCards] = useState<SrsCard[]>(INITIAL_SRS_CARDS);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerDeck, setPlayerDeck] = useState<SrsCard[]>([]);

  // Dialog pour ajout manuel d'un piège
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState<"CE" | "CO" | "EE" | "EO">("CE");
  const [newPrompt, setNewPrompt] = useState("");
  const [newMistake, setNewMistake] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const [newTrapType, setNewTrapType] = useState("");

  // Synchronisation avec localStorage & événement personnalisé srs:vault_updated
  useEffect(() => {
    const loadCards = () => {
      try {
        const stored = localStorage.getItem("super4c2:srs_cards");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Fusionner avec les cartes initiales pour toujours avoir un deck riche
            const merged: SrsCard[] = [...parsed];
            INITIAL_SRS_CARDS.forEach((init) => {
              if (!merged.some((m) => m.id === init.id)) {
                merged.push(init);
              }
            });
            setCards(merged);
            return;
          }
        }
        localStorage.setItem("super4c2:srs_cards", JSON.stringify(INITIAL_SRS_CARDS));
        setCards(INITIAL_SRS_CARDS);
      } catch {
        // ignore storage error
      }
    };

    loadCards();

    const handleVaultUpdated = () => {
      loadCards();
    };

    window.addEventListener("srs:vault_updated", handleVaultUpdated);
    window.addEventListener("storage", handleVaultUpdated);
    return () => {
      window.removeEventListener("srs:vault_updated", handleVaultUpdated);
      window.removeEventListener("storage", handleVaultUpdated);
    };
  }, []);

  const saveCards = (updated: SrsCard[]) => {
    setCards(updated);
    try {
      localStorage.setItem("super4c2:srs_cards", JSON.stringify(updated));
    } catch {
      // quota
    }
  };

  const stats = calculateDeckStats(cards);
  const dueCards = cards.filter(isCardDueToday);

  // Filtrage des cartes
  const filteredCards = cards.filter((card) => {
    if (selectedDiscipline !== "ALL" && card.discipline !== selectedDiscipline) {
      return false;
    }

    const status = getCardMasteryStatus(card);
    if (selectedStatus === "DUE" && status !== "DUE") return false;
    if (selectedStatus === "LEARNING" && status !== "LEARNING") return false;
    if (selectedStatus === "MASTERED" && status !== "MASTERED") return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const match =
        card.questionPrompt.toLowerCase().includes(query) ||
        card.ruleExplanation.toLowerCase().includes(query) ||
        card.trapType.toLowerCase().includes(query) ||
        card.candidateMistake.toLowerCase().includes(query);
      if (!match) return false;
    }

    return true;
  });

  const startSession = (onlyDue: boolean = true) => {
    const sessionCards = onlyDue ? dueCards : cards;
    console.log("[SRS] startSession called. onlyDue:", onlyDue, "count:", sessionCards.length);
    if (sessionCards.length === 0) {
      toast.info("Aucune carte dans cette sélection.");
      return;
    }
    setPlayerDeck(sessionCards);
    setIsPlayerOpen(true);
  };

  const handlePlayerComplete = (reviewedDeck: SrsCard[]) => {
    const updated = cards.map((c) => {
      const found = reviewedDeck.find((r) => r.id === c.id);
      return found || c;
    });
    saveCards(updated);
    toast.success("Deck SRS synchronisé avec succès !");
  };

  const handleResetCard = (id: string) => {
    const updated = cards.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          repetitions: 0,
          intervalDays: 1,
          easinessFactor: 2.5,
          nextReviewDate: new Date().toISOString(),
        };
      }
      return c;
    });
    saveCards(updated);
    toast.info("Carte réinitialisée : programmée pour révision immédiate.");
  };

  const handleDeleteCard = (id: string) => {
    const updated = cards.filter((c) => c.id !== id);
    saveCards(updated);
    toast.success("Carte supprimée du carnet.");
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt || !newAnswer || !newExplanation) {
      toast.error("Veuillez renseigner les champs obligatoires.");
      return;
    }

    const newCard: SrsCard = {
      id: `custom-${Date.now()}`,
      discipline: newDiscipline,
      questionNumber: 1,
      questionPrompt: newPrompt,
      candidateMistake: newMistake || "Non renseigné",
      correctAnswer: newAnswer,
      ruleExplanation: newExplanation,
      trapType: newTrapType || "Piège personnalisé",
      repetitions: 0,
      intervalDays: 1,
      easinessFactor: 2.5,
      nextReviewDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    saveCards([newCard, ...cards]);
    setIsAddOpen(false);
    setNewPrompt("");
    setNewMistake("");
    setNewAnswer("");
    setNewExplanation("");
    setNewTrapType("");
    toast.success("Piège ajouté avec succès au Carnet SRS !");
  };

  return (
    <div className="space-y-8">
      {/* Lecteur de Flashcards en surimpression */}
      {isPlayerOpen && (
        <SrsFlashcardPlayer
          cards={playerDeck}
          onComplete={handlePlayerComplete}
          onClose={() => setIsPlayerOpen(false)}
        />
      )}

      {/* Statistiques Scientifiques SM-2 */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Dues Aujourd&apos;hui
            </span>
            {stats.due > 0 && (
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            )}
          </div>
          <p className="font-display text-3xl font-black text-primary mt-2">
            {stats.due}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            À réviser pour ancrage immédiat
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            En Consolidation
          </span>
          <p className="font-display text-3xl font-black text-amber-500 mt-2">
            {stats.learning}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Intervalles de 3 à 6 jours
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Maîtrisées (NCLC 7+)
          </span>
          <p className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.mastered}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Ancrage mémoriel définitif (14j+)
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            Total Pièges Enregistrés
          </span>
          <p className="font-display text-3xl font-black text-foreground mt-2">
            {stats.total}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Banque globale du candidat
          </p>
        </div>
      </div>

      {/* Hero Action CTA Banner */}
      <div className="rounded-3xl border bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
            <Flame className="h-3 w-3 text-primary" />
            Entraînement Actif par Répétition Espacée
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
            {stats.due > 0
              ? `Vous avez ${stats.due} carte(s) à réviser aujourd'hui !`
              : "Toutes vos cartes sont à jour pour aujourd'hui !"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {stats.due > 0
              ? "Passez votre session de 3 minutes pour consolider les pièges avant qu'ils ne s'effacent de votre mémoire de travail."
              : "Votre mémoire est parfaitement consolidée selon l'algorithme SuperMemo-2. Vous pouvez réviser l'ensemble du deck ou lancer un examen CBT."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {stats.due > 0 ? (
            <Button
              size="lg"
              onClick={() => startSession(true)}
              className="w-full sm:w-auto gap-2 font-bold bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-500 text-white shadow-md text-xs sm:text-sm"
            >
              <Flame className="h-4 w-4" />
              <span>Lancer la Session du Jour ({stats.due} Q)</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={() => startSession(false)}
              className="w-full sm:w-auto gap-2 font-bold text-xs sm:text-sm"
            >
              <RotateCcw className="h-4 w-4 text-primary" />
              <span>Réviser le Deck Complet ({stats.total} cartes)</span>
            </Button>
          )}

          {/* Modal d'ajout personnalisé */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold text-xs sm:text-sm">
                <Plus className="h-4 w-4" />
                <span>Ajouter un Piège</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-lg font-black">
                  Ajouter un Piège / Règle au Carnet SRS
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Créez une flashcard personnalisée pour ancrer une tournure C1/C2 ou une règle de grammaire.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateCard} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Épreuve</label>
                    <select
                      value={newDiscipline}
                      onChange={(e) =>
                        setNewDiscipline(e.target.value as "CE" | "CO" | "EE" | "EO")
                      }
                      className="w-full px-3 py-2 rounded-xl border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                    >
                      <option value="CE">Compréhension Écrite (CE)</option>
                      <option value="CO">Compréhension Orale (CO)</option>
                      <option value="EE">Expression Écrite (EE)</option>
                      <option value="EO">Expression Orale (EO)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Type de piège</label>
                    <input
                      type="text"
                      placeholder="ex: Faux ami, Registre de langue"
                      value={newTrapType}
                      onChange={(e) => setNewTrapType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Question / Énoncé / Situation *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Quelle est la nuance ou la consigne précise ?"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-600 dark:text-red-400">
                      Erreur commise (ou piège classique)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ce qu'il ne faut pas dire/cocher"
                      value={newMistake}
                      onChange={(e) => setNewMistake(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Bonne réponse & Formulation C1/C2 *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="La réponse ou tournure exacte"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Règle & Astuce Anti-Piège *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Pourquoi cette réponse est correcte et comment déjouer le distracteur ?"
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="font-bold bg-primary hover:bg-primary/90 text-white"
                  >
                    Enregistrer la carte
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border shadow-xs">
          {/* Recherche */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un piège, un mot-clé ou une règle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filtres Disciplines */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
            {[
              { key: "ALL", label: "Toutes" },
              { key: "CE", label: "CE" },
              { key: "CO", label: "CO" },
              { key: "EE", label: "EE" },
              { key: "EO", label: "EO" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setSelectedDiscipline(f.key)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition-all border",
                  selectedDiscipline === f.key
                    ? "bg-primary text-white border-primary"
                    : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}

            <div className="h-4 w-px bg-border mx-1" />

            {/* Filtre Statut */}
            {[
              { key: "ALL", label: "Tous statuts" },
              { key: "DUE", label: "Dues" },
              { key: "LEARNING", label: "En cours" },
              { key: "MASTERED", label: "Maîtrisées" },
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelectedStatus(s.key)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all border",
                  selectedStatus === s.key
                    ? "bg-foreground text-background border-foreground font-bold"
                    : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Affichage de <span className="font-bold text-foreground">{filteredCards.length}</span> carte(s) sur {cards.length} au total
        </div>
      </div>

      {/* Grille des Flashcards SRS */}
      {filteredCards.length === 0 ? (
        <div className="rounded-3xl border bg-card p-12 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-display text-base font-bold text-foreground">
            Aucun piège ne correspond à vos filtres
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Modifiez vos critères de recherche ou ajoutez un nouveau piège pour démarrer votre entraînement.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredCards.map((card) => {
            const status = getCardMasteryStatus(card);
            const isDue = isCardDueToday(card);

            return (
              <div
                key={card.id}
                className={cn(
                  "rounded-2xl border bg-card p-5 shadow-xs space-y-4 transition-all hover:border-primary/40 flex flex-col justify-between",
                  isDue && "border-primary/30 ring-1 ring-primary/20"
                )}
              >
                {/* Header card */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                        {card.discipline} · Q{card.questionNumber}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[150px]">
                        {card.trapType}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                        status === "DUE"
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : status === "LEARNING"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      )}
                    >
                      {status === "DUE"
                        ? "Due aujourd'hui"
                        : status === "LEARNING"
                        ? `Dans ${card.intervalDays} jour(s)`
                        : `Maîtrisée (${card.intervalDays}j)`}
                    </span>
                  </div>

                  {/* Prompt */}
                  <h3 className="font-display text-sm font-bold text-foreground leading-snug">
                    {card.questionPrompt}
                  </h3>

                  {card.documentSnippet && (
                    <p className="text-[11px] text-muted-foreground italic line-clamp-2 bg-muted/20 p-2 rounded-lg border">
                      « {card.documentSnippet} »
                    </p>
                  )}

                  {/* Comparatif Erreur vs Attendu */}
                  <div className="grid gap-2 text-xs">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-2.5">
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block">
                        Votre erreur commise :
                      </span>
                      <span className="text-foreground/90 text-xs">
                        {card.candidateMistake}
                      </span>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                        Formulation exacte attendue :
                      </span>
                      <span className="text-foreground text-xs font-semibold">
                        {card.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Règle anti-piège */}
                  <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1">
                    <span className="font-bold text-foreground text-[11px] block">
                      Règle & Astuce Anti-Piège :
                    </span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-3">
                      {card.ruleExplanation}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="flex items-center justify-between border-t pt-3 text-[11px]">
                  <span className="text-muted-foreground font-mono">
                    Répétitions : {card.repetitions} · EF : {card.easinessFactor}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetCard(card.id)}
                      className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                      title="Reprogrammer à zéro pour révision immédiate"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Réinitialiser
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                      title="Supprimer la carte"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
