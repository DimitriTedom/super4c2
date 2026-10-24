"use client";

import React from "react";
import {
  Search,
  Bookmark,
  PenTool,
  Mic,
  Compass,
  Headphones,
  Languages,
  Layers,
  Clock,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  X,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BlogFilterState {
  discipline: string;
  duration: "ALL" | "SHORT" | "MEDIUM" | "DEEP";
  sortBy: "NEWEST" | "FEATURED" | "READ_TIME_ASC" | "READ_TIME_DESC";
  query: string;
}

interface BlogFilterBarProps {
  filters: BlogFilterState;
  onChange: (updater: (prev: BlogFilterState) => BlogFilterState) => void;
  totalResults: number;
  bookmarkCount: number;
}

const DISCIPLINES: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "ALL", label: "Tous les Guides", icon: Layers },
  { key: "EE", label: "Expression Écrite", icon: PenTool },
  { key: "EO", label: "Expression Orale", icon: Mic },
  { key: "CRS", label: "Entrée Express & CRS", icon: Compass },
  { key: "COMPREHENSION", label: "Compréhension QCM", icon: Headphones },
  { key: "IELTS", label: "IELTS General", icon: Languages },
];

const DURATIONS: { key: BlogFilterState["duration"]; label: string; shortLabel: string }[] = [
  { key: "ALL", label: "Tous formats", shortLabel: "Tous" },
  { key: "SHORT", label: "⚡ Express (≤ 5 min)", shortLabel: "≤ 5 min" },
  { key: "MEDIUM", label: "📖 Stratégique (6–9 min)", shortLabel: "6–9 min" },
  { key: "DEEP", label: "🏛️ Dossier Pilier (10+ min)", shortLabel: "10+ min" },
];

export function BlogFilterBar({
  filters,
  onChange,
  totalResults,
  bookmarkCount,
}: BlogFilterBarProps) {
  const isFiltered =
    filters.discipline !== "ALL" ||
    filters.duration !== "ALL" ||
    filters.sortBy !== "NEWEST" ||
    filters.query.trim().length > 0;

  const handleReset = () => {
    onChange(() => ({
      discipline: "ALL",
      duration: "ALL",
      sortBy: "NEWEST",
      query: "",
    }));
  };

  return (
    <div className="space-y-4">
      {/* 🧭 Niveau 1 : Onglets par Discipline / Compétence & Favoris */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {DISCIPLINES.map((d) => {
          const Icon = d.icon;
          const isActive = filters.discipline === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  discipline: d.key,
                }))
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 border shadow-2xs",
                isActive
                  ? "bg-primary text-white border-primary shadow-xs scale-[1.02]"
                  : "border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-muted-foreground")} />
              <span>{d.label}</span>
            </button>
          );
        })}

        {/* Onglet Mes Favoris */}
        <button
          type="button"
          onClick={() =>
            onChange((prev) => ({
              ...prev,
              discipline: "FAVORITES",
            }))
          }
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 border shadow-2xs",
            filters.discipline === "FAVORITES"
              ? "bg-primary text-white border-primary shadow-xs scale-[1.02]"
              : "border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Bookmark
            className={cn(
              "h-3.5 w-3.5",
              filters.discipline === "FAVORITES" || bookmarkCount > 0 ? "fill-current" : ""
            )}
          />
          <span>Mes Favoris</span>
          {bookmarkCount > 0 && (
            <span
              className={cn(
                "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                filters.discipline === "FAVORITES" ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              )}
            >
              {bookmarkCount}
            </span>
          )}
        </button>
      </div>

      {/* 🛠️ Niveau 2 : Barre de Recherche + Durée + Tri + Compteur */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-2xs">
        {/* Recherche Plein-Texte avec bouton de vidage */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher : Tâche 2, NCLC 7, barème, connecteurs..."
            value={filters.query}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                query: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, query: "" }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              title="Effacer la recherche"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filtres de Durée & Tri */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Durée de lecture */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/70">
            <Clock className="h-3 w-3 text-muted-foreground ml-1 hidden sm:inline" />
            {DURATIONS.map((dur) => (
              <button
                key={dur.key}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, duration: dur.key }))}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
                  filters.duration === dur.key
                    ? "bg-card text-foreground shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={dur.label}
              >
                <span className="hidden sm:inline">{dur.label}</span>
                <span className="sm:hidden">{dur.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Sélecteur de Tri */}
          <div className="w-44">
            <Select
              value={filters.sortBy}
              onValueChange={(val) =>
                onChange((prev) => ({
                  ...prev,
                  sortBy: val as BlogFilterState["sortBy"],
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs rounded-xl bg-card border-border/80">
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Trier par..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEWEST" className="text-xs">
                  Plus récents d&apos;abord
                </SelectItem>
                <SelectItem value="FEATURED" className="text-xs">
                  Recommandés / À la une
                </SelectItem>
                <SelectItem value="READ_TIME_ASC" className="text-xs">
                  Temps : plus court (≤ 5 min)
                </SelectItem>
                <SelectItem value="READ_TIME_DESC" className="text-xs">
                  Temps : plus complet (10+ min)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 📊 Compteur de Résultats & Bouton Réinitialiser Contextuel */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-2">
          <span>
            <strong className="text-foreground">{totalResults}</strong> guide{totalResults > 1 ? "s" : ""}{" "}
            méthodologique{totalResults > 1 ? "s" : ""}
          </span>
          {isFiltered && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <SlidersHorizontal className="h-2.5 w-2.5" />
              Filtres actifs
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}
