"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  AlertTriangle,
  X,
  Square,
  CheckSquare,
  MinusSquare,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAttemptDate,
  getDisciplineMeta,
  getTasksWritten,
  getTotalWords,
  type UserAttemptFull,
} from "@/lib/dashboard/attempt-utils";
import { exportAttemptPdf } from "@/lib/dashboard/attempt-export";
import {
  deleteUserAttemptAction,
  batchDeleteEmptyAttemptsAction,
  batchDeleteUserAttemptsAction,
} from "@/app/dashboard/historique/actions";
import { toast } from "sonner";

type SortKey = "date" | "score" | "nclc";
type SortDir = "asc" | "desc";
type StatusFilter = "ALL" | "VALIDATED" | "TO_IMPROVE";

const PAGE_SIZES = [5, 10, 25, 50] as const;

const DISCIPLINE_FILTERS = [
  { value: "ALL", label: "Toutes" },
  { value: "EXPRESSION_ECRITE", label: "✍️ Écrit" },
  { value: "EXPRESSION_ORALE", label: "🎙️ Oral" },
  { value: "COMPREHENSION_ECRITE", label: "📖 CE" },
  { value: "COMPREHENSION_ORALE", label: "🎧 CO" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Tous les paliers" },
  { value: "VALIDATED", label: "NCLC 7+ validé" },
  { value: "TO_IMPROVE", label: "À consolider" },
];

interface AttemptHistoryTableProps {
  attempts: UserAttemptFull[];
}

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = active === sortKey;
  const Icon = !isActive ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider hover:text-foreground transition-colors ${
        isActive ? "text-foreground" : ""
      } ${className}`}
    >
      {label}
      <Icon className="h-3 w-3" />
    </button>
  );
}

export function AttemptHistoryTable({ attempts }: AttemptHistoryTableProps) {
  const router = useRouter();
  const [localAttempts, setLocalAttempts] = useState<UserAttemptFull[]>(attempts);

  useEffect(() => {
    setLocalAttempts(attempts);
  }, [attempts]);

  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [exportingId, setExportingId] = useState<string | null>(null);

  // États de suppression
  const [confirmDeleteAttempt, setConfirmDeleteAttempt] = useState<UserAttemptFull | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCleanEmptyDialog, setShowCleanEmptyDialog] = useState(false);
  const [isCleaningEmpty, setIsCleaningEmpty] = useState(false);

  // Détection des copies vides (0 mot ou note 0)
  const emptyAttemptsCount = useMemo(() => {
    return localAttempts.filter((a) => a.rawScore === 0 || getTotalWords(a) === 0).length;
  }, [localAttempts]);

  const hasActiveFilters = query.trim() !== "" || discipline !== "ALL" || status !== "ALL";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = localAttempts.filter((a) => {
      if (discipline !== "ALL" && a.discipline !== discipline) return false;
      if (status === "VALIDATED" && a.nclcLevel < 7) return false;
      if (status === "TO_IMPROVE" && a.nclcLevel >= 7) return false;
      if (q) {
        const meta = getDisciplineMeta(a.discipline);
        const haystack = [
          meta.label,
          meta.short,
          `nclc ${a.nclcLevel}`,
          getAttemptDate(a).toLocaleDateString("fr-FR"),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortKey === "score") return (a.rawScore - b.rawScore) * dir;
      if (sortKey === "nclc") return (a.nclcLevel - b.nclcLevel) * dir;
      return (getAttemptDate(a).getTime() - getAttemptDate(b).getTime()) * dir;
    });
  }, [localAttempts, query, discipline, status, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const resetFilters = () => {
    setQuery("");
    setDiscipline("ALL");
    setStatus("ALL");
    setPage(1);
  };

  const handleExport = async (attempt: UserAttemptFull) => {
    try {
      setExportingId(attempt.id);
      await exportAttemptPdf(attempt);
    } catch (err) {
      console.error("Échec de l'export PDF :", err);
    } finally {
      setExportingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteAttempt) return;
    try {
      setIsDeleting(true);
      const res = await deleteUserAttemptAction(confirmDeleteAttempt.id);
      if (res.ok) {
        setLocalAttempts((prev) => prev.filter((a) => a.id !== confirmDeleteAttempt.id));
        toast.success("Correction supprimée de votre historique.");
        setConfirmDeleteAttempt(null);
        router.refresh();
      } else {
        toast.error(res.error || "Impossible de supprimer cette correction.");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCleanEmptyAttempts = async () => {
    try {
      setIsCleaningEmpty(true);
      const res = await batchDeleteEmptyAttemptsAction();
      if (res.ok) {
        setLocalAttempts((prev) => prev.filter((a) => a.rawScore > 0 && getTotalWords(a) > 0));
        toast.success(
          `${res.count || emptyAttemptsCount} copie(s) non rédigée(s) supprimée(s) de votre espace.`
        );
        setShowCleanEmptyDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || "Impossible de nettoyer les copies.");
      }
    } catch {
      toast.error("Erreur réseau lors du nettoyage.");
    } finally {
      setIsCleaningEmpty(false);
    }
  };

  // Sélection & Actions par lot (Batch)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const allPageIds = useMemo(() => pageItems.map((a) => a.id), [pageItems]);
  const isAllPageSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id));
  const isSomePageSelected = allPageIds.some((id) => selectedIds.has(id)) && !isAllPageSelected;

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllPageSelected) {
        allPageIds.forEach((id) => next.delete(id));
      } else {
        allPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleSelectAllFiltered = () => {
    setSelectedIds(new Set(filtered.map((a) => a.id)));
    toast.info(`${filtered.length} correction(s) sélectionnée(s).`);
  };

  const handleSelectEmptyAttempts = () => {
    const emptyIds = localAttempts
      .filter((a) => a.rawScore === 0 || getTotalWords(a) === 0)
      .map((a) => a.id);
    setSelectedIds(new Set(emptyIds));
    toast.info(`${emptyIds.length} copie(s) vide(s) cochée(s).`);
  };

  const handleBatchExportCsv = () => {
    const selectedAttempts = localAttempts.filter((a) => selectedIds.has(a.id));
    if (selectedAttempts.length === 0) return;

    const headers = [
      "ID Copie",
      "Date",
      "Heure",
      "Discipline",
      "Note / 20",
      "Score TCF / 699",
      "Palier NCLC",
      "Statut NCLC 7+",
      "Nombre de mots",
      "Points CRS",
    ];

    const rows = selectedAttempts.map((a) => {
      const meta = getDisciplineMeta(a.discipline);
      const date = getAttemptDate(a);
      const dateStr = date.toLocaleDateString("fr-FR");
      const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      const words = getTotalWords(a);
      const validated = a.nclcLevel >= 7 ? "Validé (NCLC 7+)" : "À consolider";
      const crsStr = a.crsPointsUnlocked ? "+50 CRS" : "0 CRS";

      return [
        `"${a.id}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${meta.label}"`,
        `"${a.rawScore}"`,
        `"${a.tcfScaledScore}"`,
        `"NCLC ${a.nclcLevel}"`,
        `"${validated}"`,
        `"${words}"`,
        `"${crsStr}"`,
      ].join(";");
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `super4c2-corrections-selection-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Export CSV de ${selectedAttempts.length} correction(s) téléchargé.`);
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      setIsBatchDeleting(true);
      const idsArray = Array.from(selectedIds);
      const res = await batchDeleteUserAttemptsAction(idsArray);
      if (res.ok) {
        setLocalAttempts((prev) => prev.filter((a) => !selectedIds.has(a.id)));
        toast.success(`${res.count || idsArray.length} correction(s) supprimée(s) avec succès.`);
        setSelectedIds(new Set());
        setShowBatchDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || "Impossible de supprimer les corrections sélectionnées.");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression groupée.");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  if (localAttempts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed bg-card/60 p-10 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
          <FileText className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Aucune session enregistrée</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Chaque épreuve soumise sera archivée ici avec sa note, sa copie et sa correction détaillée.
          </p>
        </div>
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-2 text-xs font-bold">
            <Link href="/dashboard/historique/demo">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Voir un exemple de correction</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold text-xs">
            <Link href="/examens?discipline=ee">Lancer ma première épreuve</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
      {/* Barre d'outils */}
      <div className="p-4 border-b space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher (épreuve, date, NCLC…)"
              aria-label="Rechercher dans l'historique"
              className="h-9 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-hidden focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-full sm:w-[180px]">
              <Select
                value={status}
                onValueChange={(val) => {
                  setStatus(val as StatusFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 rounded-xl border bg-background text-xs font-semibold focus:ring-2 focus:ring-primary/30">
                  <SelectValue placeholder="Filtrer par palier" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="text-xs">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Boutons d'Action & Sélection Rapide */}
            <div className="flex items-center gap-2 shrink-0">
              {emptyAttemptsCount > 0 && selectedIds.size === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectEmptyAttempts}
                  className="h-9 rounded-xl border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold gap-1.5"
                  title="Cocher automatiquement toutes les simulations à 0 mot pour les exporter ou les supprimer"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-amber-600" />
                  <span>Cocher {emptyAttemptsCount} copie{emptyAttemptsCount > 1 ? "s" : ""} vide{emptyAttemptsCount > 1 ? "s" : ""}</span>
                </Button>
              )}

              {selectedIds.size > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-9 rounded-xl border-border text-muted-foreground hover:text-foreground text-xs font-bold gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Désélectionner ({selectedIds.size})</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-xl border p-1 bg-muted/40">
            {DISCIPLINE_FILTERS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => {
                  setDiscipline(d.value);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  discipline === d.value
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-[11px] text-muted-foreground">
              <th className="w-10 px-3 py-3 text-center">
                <button
                  type="button"
                  onClick={handleSelectAllPage}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title={
                    isAllPageSelected
                      ? "Tout désélectionner sur cette page"
                      : "Tout sélectionner sur cette page"
                  }
                >
                  {isAllPageSelected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : isSomePageSelected ? (
                    <MinusSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Épreuve</th>
              <th className="px-4 py-3 text-left">
                <SortHeader label="Date" sortKey="date" active={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader label="Note FEI" sortKey="score" active={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader label="Palier" sortKey="nclc" active={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left font-bold uppercase tracking-wider">
                Production
              </th>
              <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm font-semibold text-foreground">Aucun résultat pour ces filtres</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-2 text-xs font-bold text-primary hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </td>
              </tr>
            ) : (
              pageItems.map((attempt) => {
                const meta = getDisciplineMeta(attempt.discipline);
                const date = getAttemptDate(attempt);
                const validated = attempt.nclcLevel >= 7;
                const href = `/dashboard/historique/${attempt.id}`;
                const isWritten = attempt.discipline === "EXPRESSION_ECRITE";
                const isSelected = selectedIds.has(attempt.id);

                return (
                  <tr
                    key={attempt.id}
                    onClick={() => router.push(href)}
                    className={`group border-b last:border-b-0 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/[0.05] hover:bg-primary/[0.08]"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="w-10 px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(attempt.id)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={isSelected ? "Désélectionner" : "Sélectionner cette copie"}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
                          {meta.emoji}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={href}
                            onClick={(e) => e.stopPropagation()}
                            className="block truncate font-bold text-foreground group-hover:text-primary"
                          >
                            {meta.label}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">Simulation FEI</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="block text-xs font-semibold text-foreground">
                        {date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-sm font-extrabold text-foreground">{attempt.rawScore}</span>
                      <span className="text-xs text-muted-foreground"> / 20</span>
                      <span className="block text-[11px] text-muted-foreground">{attempt.tcfScaledScore} / 699</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          validated
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        }`}
                      >
                        NCLC {attempt.nclcLevel}
                      </span>
                      <span className="block text-[11px] text-muted-foreground mt-0.5">
                        {validated ? "+50 pts CRS" : "À consolider"}
                      </span>
                    </td>

                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {isWritten ? (
                        <>
                          <strong className="text-foreground">{getTasksWritten(attempt)} / 3</strong> tâches ·{" "}
                          {getTotalWords(attempt)} mots
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8" title="Voir la correction">
                          <Link href={href} onClick={(e) => e.stopPropagation()} aria-label="Voir la correction">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title="Télécharger le PDF"
                          aria-label="Télécharger le PDF"
                          disabled={exportingId === attempt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(attempt);
                          }}
                        >
                          {exportingId === attempt.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8" title="Refaire l'épreuve">
                          <Link
                            href={`/examens?discipline=${isWritten ? "ee" : "eo"}`}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Refaire l'épreuve"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Supprimer cette correction"
                          aria-label="Supprimer cette correction"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteAttempt(attempt);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Lignes par page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[72px] rounded-lg text-xs font-semibold text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono">
            {filtered.length === 0 ? "0" : `${start + 1}–${Math.min(start + pageSize, filtered.length)}`} sur{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-mono font-bold text-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 🗑️ Modale de Confirmation de Suppression Individuelle */}
      <Dialog
        open={!!confirmDeleteAttempt}
        onOpenChange={(open) => !open && setConfirmDeleteAttempt(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-lg font-black">
              Supprimer cette correction ?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground pt-1">
              Cette action est irréversible. La tentative ({confirmDeleteAttempt?.discipline ? getDisciplineMeta(confirmDeleteAttempt.discipline).label : ""} · Note {confirmDeleteAttempt?.rawScore}/20 · NCLC {confirmDeleteAttempt?.nclcLevel}) sera définitivement effacée et vos statistiques seront recalculées.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteAttempt(null)}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs font-bold gap-1.5"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>{isDeleting ? "Suppression…" : "Supprimer définitivement"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🧹 Modale de Nettoyage des Copies Vides */}
      <Dialog open={showCleanEmptyDialog} onOpenChange={setShowCleanEmptyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-2">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-lg font-black">
              Nettoyer les copies non rédigées ?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground pt-1">
              Vous avez <strong>{emptyAttemptsCount} simulation(s)</strong> à 0 mot ou non rédigées. Cette action les retirera de votre historique pour assainir votre moyenne et vos statistiques NCLC.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowCleanEmptyDialog(false)}
              disabled={isCleaningEmpty}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              Annuler
            </Button>
            <Button
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1.5"
              onClick={handleCleanEmptyAttempts}
              disabled={isCleaningEmpty}
            >
              {isCleaningEmpty ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>{isCleaningEmpty ? "Nettoyage en cours…" : "Nettoyer maintenant"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🚀 BARRE D'ACTIONS EN LOT FLOTTANTE (BATCH ACTION BAR) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 p-3 sm:p-4 shadow-2xl shadow-black/60 backdrop-blur-xl text-slate-100 flex flex-wrap items-center justify-between gap-3">
              {/* Halos lumineux d'ambiance */}
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-80 rounded-full bg-gradient-to-r from-red-500/20 via-primary/30 to-emerald-500/20 blur-xl" />

              {/* Gauche : Compteur & portée */}
              <div className="flex items-center gap-2.5 z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-black text-xs shadow-md">
                  {selectedIds.size}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {selectedIds.size} correction{selectedIds.size > 1 ? "s" : ""} sélectionnée{selectedIds.size > 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    {selectedIds.size < filtered.length ? (
                      <button
                        type="button"
                        onClick={handleSelectAllFiltered}
                        className="hover:text-primary transition-colors underline"
                      >
                        Sélectionner tous les {filtered.length} résultats
                      </button>
                    ) : (
                      <span>Toutes les corrections filtrées sont cochées</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Droite : Actions en lot */}
              <div className="flex items-center gap-2 z-10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBatchExportCsv}
                  className="h-8 gap-1.5 text-xs font-semibold bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
                  title="Exporter les corrections sélectionnées au format CSV (Excel)"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Exporter</span> CSV
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBatchDeleteDialog(true)}
                  className="h-8 gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm"
                  title="Supprimer les corrections sélectionnées"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Supprimer</span>
                </Button>

                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Annuler la sélection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛑 Modale de Confirmation de Suppression Groupée */}
      <Dialog open={showBatchDeleteDialog} onOpenChange={setShowBatchDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-lg font-black">
              Supprimer {selectedIds.size} correction{selectedIds.size > 1 ? "s" : ""} ?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground pt-1 leading-relaxed">
              Cette action est irréversible. Les <strong>{selectedIds.size} tentative(s) sélectionnée(s)</strong> seront définitivement supprimées de votre historique et votre moyenne sera immédiatement recalculée.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              disabled={isBatchDeleting}
              onClick={() => setShowBatchDeleteDialog(false)}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={isBatchDeleting}
              onClick={handleConfirmBatchDelete}
              className="w-full sm:w-auto text-xs font-bold gap-1.5"
            >
              {isBatchDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Suppression en cours…</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Supprimer définitivement ({selectedIds.size})</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
