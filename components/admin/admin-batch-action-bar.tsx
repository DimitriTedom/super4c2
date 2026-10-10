"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  X,
  AlertTriangle,
  Loader2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface BatchActionOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

interface AdminBatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  itemName?: string; // ex: "FAQs", "leads", "articles", "candidats"
  onDeleteSelected?: () => Promise<void> | void;
  onToggleActiveSelected?: (active: boolean) => Promise<void> | void;
  onStatusChangeSelected?: (status: string) => Promise<void> | void;
  statusOptions?: BatchActionOption[];
  onExportCsv?: () => void;
  customActions?: React.ReactNode;
}

export function AdminBatchActionBar({
  selectedCount,
  onClearSelection,
  itemName = "éléments",
  onDeleteSelected,
  onToggleActiveSelected,
  onStatusChangeSelected,
  statusOptions,
  onExportCsv,
  customActions,
}: AdminBatchActionBarProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (selectedCount === 0) return null;

  const handleDelete = () => {
    if (!onDeleteSelected) return;
    startTransition(async () => {
      await onDeleteSelected();
      setShowDeleteConfirm(false);
      onClearSelection();
    });
  };

  const handleToggleActive = (active: boolean) => {
    if (!onToggleActiveSelected) return;
    startTransition(async () => {
      await onToggleActiveSelected(active);
      onClearSelection();
    });
  };

  const handleStatusChange = (status: string) => {
    if (!onStatusChangeSelected) return;
    startTransition(async () => {
      await onStatusChangeSelected(status);
      onClearSelection();
    });
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 p-3 sm:p-4 shadow-2xl shadow-black/60 backdrop-blur-xl text-slate-100 flex flex-wrap items-center justify-between gap-3">
            {/* Ambient edge highlight */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-80 rounded-full bg-gradient-to-r from-red-500/20 via-primary/30 to-blue-500/20 blur-xl" />

            {/* Left: Count & Clear */}
            <div className="flex items-center gap-2.5 z-10">
              <span className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-primary text-white font-mono font-black text-xs shadow-md">
                {selectedCount}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {itemName} sélectionné{selectedCount > 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={onClearSelection}
                className="ml-1 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                title="Désélectionner tout"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Batch Actions */}
            <div className="flex items-center flex-wrap gap-2 z-10 ml-auto">
              {/* Status toggles if available */}
              {onToggleActiveSelected && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleToggleActive(true)}
                    className="h-8 text-xs font-semibold bg-white/5 border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Activer</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleToggleActive(false)}
                    className="h-8 text-xs font-semibold bg-white/5 border-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>Masquer</span>
                  </Button>
                </>
              )}

              {/* Status Options for Leads or Workflow */}
              {statusOptions && onStatusChangeSelected && (
                <div className="flex items-center gap-1">
                  {statusOptions.map((opt) => {
                    const Icon = opt.icon || Layers;
                    return (
                      <Button
                        key={opt.value}
                        type="button"
                        size="sm"
                        variant={opt.variant || "outline"}
                        disabled={isPending}
                        onClick={() => handleStatusChange(opt.value)}
                        className="h-8 text-xs font-semibold bg-white/5 border-white/10 hover:bg-white/15 gap-1.5"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{opt.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Custom Action slot */}
              {customActions}

              {/* Export to CSV */}
              {onExportCsv && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={onExportCsv}
                  className="h-8 text-xs font-semibold bg-white/5 border-white/10 hover:bg-white/15 gap-1.5"
                  title="Exporter la sélection en CSV"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </Button>
              )}

              {/* Delete with confirmation dialog */}
              {onDeleteSelected && (
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-8 text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white shadow-md shadow-red-950/50 gap-1.5"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  <span>Supprimer</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md bg-slate-900 border-white/10 text-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-white">
                Supprimer {selectedCount} {itemName} ?
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs sm:text-sm pt-2 leading-relaxed">
              Cette action est <span className="text-red-400 font-semibold">irréversible</span>. Les {selectedCount} {itemName} sélectionnés seront définitivement supprimés de la base de données.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setShowDeleteConfirm(false)}
              className="border-white/10 text-slate-300 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmer la suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
