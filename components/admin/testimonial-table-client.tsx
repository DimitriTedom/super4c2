"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Globe, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { AdminBatchActionBar } from "@/components/admin/admin-batch-action-bar";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";
import {
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
  toggleTestimonialFeaturedAction,
  batchDeleteTestimonialsAction,
  batchToggleTestimonialsActiveAction,
} from "@/app/admin/temoignages/actions";

export interface TestimonialRecord {
  id: string;
  order: number;
  candidateName: string;
  country: string;
  targetScore: string;
  achievedNclc: string;
  crsPointsGained: number;
  quote: string;
  avatar: string | null;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface TestimonialTableClientProps {
  testimonials: TestimonialRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
  };
  searchQuery?: string;
  countryFilter?: string;
  statusFilter?: string;
}

export function TestimonialTableClient({
  testimonials,
  pagination,
  searchQuery,
}: TestimonialTableClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAllSelected =
    testimonials.length > 0 && selectedIds.length === testimonials.length;
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < testimonials.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testimonials.map((t) => t.id));
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
      const res = await batchDeleteTestimonialsAction(selectedIds);
      toast.success(`${res.count} témoignage(s) supprimé(s).`);
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la suppression en lot.");
    }
  };

  const handleBatchToggleActive = async (active: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchToggleTestimonialsActiveAction(selectedIds, active);
      toast.success(
        `${res.count} témoignage(s) ${active ? "mis en ligne" : "masqué(s)"}.`
      );
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la mise à jour en lot.");
    }
  };

  const handleExportCsv = () => {
    const itemsToExport =
      selectedIds.length > 0
        ? testimonials.filter((t) => selectedIds.includes(t.id))
        : testimonials;

    downloadCsv(
      `temoignages-super4c2-${new Date().toISOString().slice(0, 10)}`,
      itemsToExport.map((t) => ({
        id: t.id,
        ordre: t.order,
        candidat: t.candidateName,
        pays: t.country,
        cible: t.targetScore,
        obtenu: t.achievedNclc,
        pointsCRS: t.crsPointsGained,
        noteEtoiles: `${t.rating}/5`,
        citation: t.quote,
        enVedette: t.isFeatured ? "Oui" : "Non",
        statut: t.isActive ? "En ligne" : "Masque",
      })),
      [
        { key: "ordre", label: "Ordre" },
        { key: "candidat", label: "Candidat" },
        { key: "pays", label: "Pays" },
        { key: "cible", label: "Score visé" },
        { key: "obtenu", label: "NCLC obtenu" },
        { key: "pointsCRS", label: "Points CRS débloqués" },
        { key: "noteEtoiles", label: "Étoiles" },
        { key: "citation", label: "Témoignage" },
        { key: "enVedette", label: "En vedette" },
        { key: "statut", label: "Statut" },
      ]
    );
    toast.info(`${itemsToExport.length} témoignage(s) exporté(s) en CSV.`);
  };

  if (testimonials.length === 0) {
    return (
      <AdminListEmptyState
        kind="testimonials"
        title="Aucun témoignage trouvé"
        description="Ajoutez les retours d'expérience et réussites NCLC 7 de vos premiers candidats."
        actionLabel="Ajouter un témoignage"
        actionHref="/admin/temoignages/nouveau"
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
                    aria-label="Sélectionner tous les témoignages"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-14 text-center">Ordre</th>
                <th className="py-3 px-4">Candidat</th>
                <th className="py-3 px-4">Pays &amp; Résultat</th>
                <th className="py-3 px-4 max-w-xs md:max-w-md">Citation</th>
                <th className="py-3 px-4 text-center w-24">Étoiles</th>
                <th className="py-3 px-4 text-center w-24">Statut</th>
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {testimonials.map((t) => {
                const isSelected = selectedIds.includes(t.id);
                return (
                  <tr
                    key={t.id}
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
                        onChange={() => toggleSelectOne(t.id)}
                        aria-label={`Sélectionner le témoignage de ${t.candidateName}`}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-bold text-muted-foreground">
                      <span className="inline-flex items-center justify-center h-6 w-8 rounded-md bg-muted text-[11px]">
                        #{t.order}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {t.avatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={t.avatar}
                            alt={t.candidateName}
                            className="h-9 w-9 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                            {t.candidateName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            {t.candidateName}
                            {t.isFeatured && (
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Cible : {t.targetScore}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {t.country}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {t.achievedNclc}
                          </span>
                          {t.crsPointsGained > 0 && (
                            <span className="text-[11px] text-muted-foreground font-mono">
                              +{t.crsPointsGained} CRS
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <p className="text-xs text-muted-foreground line-clamp-2 italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500" />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <form
                        action={toggleTestimonialActiveAction}
                        className="inline-block"
                      >
                        <input type="hidden" name="id" value={t.id} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                            t.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          }`}
                          title="Cliquer pour basculer la visibilité"
                        >
                          {t.isActive ? (
                            <>
                              <Eye className="h-3 w-3" />
                              <span>En ligne</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              <span>Masqué</span>
                            </>
                          )}
                        </button>
                      </form>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Featured */}
                        <form
                          action={toggleTestimonialFeaturedAction}
                          className="inline-block"
                        >
                          <input type="hidden" name="id" value={t.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              t.isFeatured
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            title={
                              t.isFeatured
                                ? "Retirer de la une"
                                : "Mettre en avant"
                            }
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                t.isFeatured ? "fill-amber-500" : ""
                              }`}
                            />
                          </Button>
                        </form>

                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Modifier le témoignage"
                        >
                          <Link href={`/admin/temoignages/${t.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        <form
                          id={`del-t-${t.id}`}
                          action={deleteTestimonialAction}
                        >
                          <input type="hidden" name="id" value={t.id} />
                        </form>

                        <ConfirmActionDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              title="Supprimer le témoignage"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                          title="Supprimer ce témoignage ?"
                          description={`Êtes-vous sûr de vouloir supprimer définitivement le témoignage de ${t.candidateName} ?`}
                          confirmLabel="Supprimer"
                          formId={`del-t-${t.id}`}
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
          basePath="/admin/temoignages"
          search={searchQuery ?? undefined}
        />
      </div>

      {/* Floating Batch Actions Bar */}
      <AdminBatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        itemName="témoignage(s)"
        onDeleteSelected={handleBatchDelete}
        onToggleActiveSelected={handleBatchToggleActive}
        onExportCsv={handleExportCsv}
      />
    </>
  );
}
