"use client";

import React, { useState } from "react";
import { LeadRowCard } from "@/components/admin/lead-row-card";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { AdminBatchActionBar } from "@/components/admin/admin-batch-action-bar";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";
import { LeadStatus } from "@prisma/client";
import {
  batchDeleteLeadsAction,
  batchUpdateLeadStatusAction,
} from "@/app/admin/leads/actions";

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  intent: string;
  message: string;
  status: LeadStatus;
  adminNotes: string | null;
  createdAt: Date;
}

interface LeadListClientProps {
  leads: LeadData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
  };
  searchQuery?: string;
  intentFilter?: string;
  statusFilter?: string;
}

export function LeadListClient({
  leads,
  pagination,
  searchQuery,
  intentFilter,
  statusFilter,
}: LeadListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
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
      const res = await batchDeleteLeadsAction(selectedIds);
      toast.success(`${res.count} demande(s) supprimée(s).`);
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la suppression en lot.");
    }
  };

  const handleBatchStatusChange = async (status: string) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchUpdateLeadStatusAction(
        selectedIds,
        status as LeadStatus
      );
      toast.success(`${res.count} demande(s) passée(s) à "${status}".`);
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut en lot.");
    }
  };

  const handleExportCsv = () => {
    const itemsToExport =
      selectedIds.length > 0
        ? leads.filter((l) => selectedIds.includes(l.id))
        : leads;

    downloadCsv(
      `demandes-contact-${new Date().toISOString().slice(0, 10)}`,
      itemsToExport.map((l) => ({
        id: l.id,
        nom: l.name,
        email: l.email,
        telephone: l.phone || "",
        type: l.intent,
        statut: l.status,
        message: l.message,
        notesAdmin: l.adminNotes || "",
        date: new Date(l.createdAt).toLocaleDateString("fr-FR"),
      })),
      [
        { key: "nom", label: "Nom" },
        { key: "email", label: "Email" },
        { key: "telephone", label: "Téléphone" },
        { key: "type", label: "Type de demande" },
        { key: "statut", label: "Statut" },
        { key: "message", label: "Message candidat" },
        { key: "notesAdmin", label: "Notes internes" },
        { key: "date", label: "Date de réception" },
      ]
    );
    toast.info(`${itemsToExport.length} demande(s) exportée(s) en CSV.`);
  };

  if (leads.length === 0) {
    return (
      <AdminListEmptyState
        kind="leads"
        title="Aucune demande de contact"
        description={
          searchQuery || intentFilter || statusFilter
            ? "Aucune demande ne correspond à vos filtres actuels."
            : "La boîte de réception des messages est vide. Les messages envoyés depuis le formulaire de contact apparaîtront ici."
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Selection Bar Helper */}
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
            />
            <span className="font-semibold text-foreground">
              {isAllSelected
                ? "Désélectionner tout"
                : "Tout sélectionner sur cette page"}
            </span>
          </label>
          {selectedIds.length > 0 && (
            <span className="font-medium text-primary">
              {selectedIds.length} sur {leads.length} sélectionnée(s)
            </span>
          )}
        </div>

        {/* Lead cards */}
        {leads.map((lead) => (
          <LeadRowCard
            key={lead.id}
            lead={lead}
            isSelected={selectedIds.includes(lead.id)}
            onToggleSelect={() => toggleSelectOne(lead.id)}
          />
        ))}

        {/* Pagination */}
        <AdminTablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          basePath="/admin/leads"
          search={searchQuery ?? undefined}
        />
      </div>

      {/* Floating Batch Actions Bar */}
      <AdminBatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        itemName="demande(s)"
        statusOptions={[
          { label: "Passer à Résolu", value: "RESOLU" },
          { label: "Passer à En cours", value: "EN_COURS" },
          { label: "Archiver", value: "ARCHIVE" },
          { label: "Marquer Nouveau", value: "NOUVEAU" },
        ]}
        onStatusChangeSelected={handleBatchStatusChange}
        onDeleteSelected={handleBatchDelete}
        onExportCsv={handleExportCsv}
      />
    </>
  );
}
