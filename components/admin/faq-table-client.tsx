"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { AdminBatchActionBar } from "@/components/admin/admin-batch-action-bar";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";
import {
  toggleFaqActiveAction,
  deleteFaqAction,
  batchDeleteFaqsAction,
  batchToggleFaqsActiveAction,
} from "@/app/admin/faqs/actions";

export interface FaqItemRecord {
  id: string;
  order: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface FaqTableClientProps {
  faqs: FaqItemRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
  };
  searchQuery?: string;
  statusFilter?: string;
  categoryFilter?: string;
}

export function FaqTableClient({
  faqs,
  pagination,
  searchQuery,
}: FaqTableClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const isAllSelected = faqs.length > 0 && selectedIds.length === faqs.length;
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < faqs.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(faqs.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchDeleteFaqsAction(selectedIds);
      toast.success(`${res.count} FAQ(s) supprimée(s) avec succès.`);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Erreur lors de la suppression en lot.");
    }
  };

  const handleBatchToggleActive = async (active: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchToggleFaqsActiveAction(selectedIds, active);
      toast.success(
        `${res.count} FAQ(s) ${active ? "activée(s)" : "masquée(s)"}.`
      );
      setSelectedIds([]);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour en lot.");
    }
  };

  const handleExportCsv = () => {
    const itemsToExport =
      selectedIds.length > 0
        ? faqs.filter((f) => selectedIds.includes(f.id))
        : faqs;

    downloadCsv(
      `faqs-super4c2-${new Date().toISOString().slice(0, 10)}`,
      itemsToExport.map((f) => ({
        id: f.id,
        ordre: f.order,
        question: f.question,
        reponse: f.answer,
        categorie: f.category,
        statut: f.isActive ? "Active" : "Masquee",
      })),
      [
        { key: "ordre", label: "Ordre" },
        { key: "question", label: "Question" },
        { key: "reponse", label: "Réponse" },
        { key: "categorie", label: "Catégorie" },
        { key: "statut", label: "Statut" },
      ]
    );
    toast.info(`${itemsToExport.length} FAQ(s) exportée(s) en CSV.`);
  };

  if (faqs.length === 0) {
    return (
      <AdminListEmptyState
        kind="faqs"
        title="Aucune question fréquente trouvée"
        description="Créez votre première FAQ pour enrichir la section d'aide aux candidats."
        actionLabel="Créer une FAQ"
        actionHref="/admin/faqs/ajouter"
      />
    );
  }

  return (
    <>
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isPartiallySelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Sélectionner toutes les FAQs"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-14 text-center">Ordre</th>
                <th className="py-3 px-4">Question &amp; Réponse</th>
                <th className="py-3 px-4 w-32">Catégorie</th>
                <th className="py-3 px-4 text-center w-24">Statut</th>
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {faqs.map((faq) => {
                const isSelected = selectedIds.includes(faq.id);
                return (
                  <tr
                    key={faq.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(faq.id)}
                        aria-label={`Sélectionner ${faq.question}`}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-bold text-muted-foreground">
                      <span className="inline-flex items-center justify-center h-6 w-8 rounded-md bg-muted text-[11px]">
                        #{faq.order}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <div className="space-y-1">
                        <p className="font-bold text-foreground text-xs sm:text-sm">
                          {faq.question}
                        </p>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {faq.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <form action={toggleFaqActiveAction} className="inline-block">
                        <input type="hidden" name="id" value={faq.id} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                            faq.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          }`}
                          title="Cliquer pour basculer la visibilité"
                        >
                          {faq.isActive ? (
                            <>
                              <Eye className="h-3 w-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              <span>Masquée</span>
                            </>
                          )}
                        </button>
                      </form>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Modifier la FAQ"
                        >
                          <Link href={`/admin/faqs/${faq.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        <form id={`del-faq-${faq.id}`} action={deleteFaqAction}>
                          <input type="hidden" name="id" value={faq.id} />
                        </form>

                        <ConfirmActionDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              title="Supprimer la FAQ"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                          title="Supprimer cette FAQ ?"
                          description={`Êtes-vous sûr de vouloir supprimer définitivement la question : "${faq.question}" ?`}
                          confirmLabel="Supprimer"
                          formId={`del-faq-${faq.id}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <AdminTablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          basePath="/admin/faqs"
          search={searchQuery ?? undefined}
        />
      </div>

      {/* Floating Batch Actions Bar */}
      <AdminBatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        itemName="FAQ(s)"
        onDeleteSelected={handleBatchDelete}
        onToggleActiveSelected={handleBatchToggleActive}
        onExportCsv={handleExportCsv}
      />
    </>
  );
}
