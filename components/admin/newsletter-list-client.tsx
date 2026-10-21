"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
  MessageCircle,
  Copy,
  Mail,
  Square,
  CheckSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { AdminBatchActionBar } from "@/components/admin/admin-batch-action-bar";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";
import {
  deleteSubscriberAction,
  toggleSubscriberStatusAction,
  batchDeleteSubscribersAction,
  batchUpdateSubscribersStatusAction,
} from "@/app/admin/newsletter/actions";

export interface SubscriberRowData {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  isActive: boolean;
  subscribedAt: Date;
  crsScore: number | null;
  nclcProfile: string | null;
}

interface NewsletterListClientProps {
  subscribers: SubscriberRowData[];
  searchQuery?: string;
  sourceFilter?: string;
  statusFilter?: string;
}

export function NewsletterListClient({
  subscribers,
  searchQuery,
  sourceFilter,
  statusFilter,
}: NewsletterListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAllSelected =
    subscribers.length > 0 && selectedIds.length === subscribers.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscribers.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedSubscribers = subscribers.filter((s) =>
    selectedIds.includes(s.id)
  );

  // 1. Export CSV en lot
  const handleExportCsv = () => {
    const itemsToExport =
      selectedSubscribers.length > 0 ? selectedSubscribers : subscribers;

    downloadCsv(
      `abonnes-newsletter-${new Date().toISOString().slice(0, 10)}`,
      itemsToExport.map((s) => ({
        id: s.id,
        nom: s.name || "Non renseigné",
        email: s.email,
        whatsapp_telephone: s.phone || "Non renseigné",
        score_crs: s.crsScore != null ? `+${s.crsScore} pts` : "—",
        profil_nclc: s.nclcProfile || "—",
        source: s.source,
        statut: s.isActive ? "Actif" : "Désinscrit",
        date_inscription: new Date(s.subscribedAt).toLocaleDateString("fr-FR"),
      })),
      [
        { key: "nom", label: "Nom" },
        { key: "email", label: "Email" },
        { key: "whatsapp_telephone", label: "WhatsApp / Téléphone" },
        { key: "score_crs", label: "Diagnostic CRS" },
        { key: "profil_nclc", label: "Profil NCLC visé" },
        { key: "source", label: "Source" },
        { key: "statut", label: "Statut" },
        { key: "date_inscription", label: "Date d'inscription" },
      ]
    );
    toast.success(`${itemsToExport.length} abonné(s) exporté(s) en CSV.`);
  };

  // 2. Copie groupée des numéros WhatsApp
  const handleCopyWhatsAppNumbers = async () => {
    const phones = selectedSubscribers
      .map((s) => (s.phone ? s.phone.replace(/[^\d+]/g, "") : null))
      .filter((p): p is string => Boolean(p && p.length >= 8));

    if (phones.length === 0) {
      toast.warning("Aucun numéro WhatsApp valide dans la sélection.");
      return;
    }

    try {
      await navigator.clipboard.writeText(phones.join(", "));
      toast.success(
        `${phones.length} numéro(s) WhatsApp copié(s) dans le presse-papier.`
      );
    } catch {
      toast.error("Impossible de copier les numéros WhatsApp.");
    }
  };

  // 3. Copie groupée des e-mails
  const handleCopyEmails = async () => {
    const emails = selectedSubscribers.map((s) => s.email).filter(Boolean);
    if (emails.length === 0) return;

    try {
      await navigator.clipboard.writeText(emails.join(", "));
      toast.success(
        `${emails.length} adresse(s) e-mail copiée(s) dans le presse-papier.`
      );
    } catch {
      toast.error("Impossible de copier les adresses e-mail.");
    }
  };

  // 4. Suppression en lot
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchDeleteSubscribersAction(selectedIds);
      toast.success(`${res.count} abonné(s) supprimé(s) de la base.`);
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la suppression en lot.");
    }
  };

  // 5. Bascule de statut en lot
  const handleBatchToggleActive = async (active: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchUpdateSubscribersStatusAction(selectedIds, active);
      toast.success(
        `${res.count} abonné(s) marqué(s) comme ${active ? "Actif(s)" : "Désinscrit(s)"}.`
      );
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  if (subscribers.length === 0) {
    return (
      <AdminListEmptyState
        kind="newsletter"
        title="Aucun abonné trouvé"
        description={
          searchQuery || sourceFilter || statusFilter
            ? "Aucun e-mail ne correspond à votre filtre de recherche actuel."
            : "La base d'abonnés est actuellement vide. Les inscriptions s'ajouteront automatiquement via le footer et le simulateur NCLC."
        }
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-semibold border-b">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title={isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Candidat</th>
                <th className="px-4 py-3">WhatsApp / Téléphone</th>
                <th className="px-4 py-3">Diagnostic CRS</th>
                <th className="px-4 py-3">Origine / Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map((s) => {
                const isSelected = selectedIds.includes(s.id);
                const cleanDigits = (s.phone || "").replace(/\D/g, "");
                const waLink = cleanDigits ? `https://wa.me/${cleanDigits}` : null;

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(s.id)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={isSelected ? "Désélectionner" : "Sélectionner"}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {s.name && (
                          <p className="font-semibold text-foreground text-xs">
                            {s.name}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground font-mono block">
                          {s.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {s.phone ? (
                        waLink ? (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                            title="Ouvrir la conversation WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5 fill-current" />
                            <span>{s.phone}</span>
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-muted-foreground">
                            {s.phone}
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">
                          Non renseigné
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {s.crsScore != null ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary">
                            +{s.crsScore} pts CRS
                          </span>
                          {s.nclcProfile && (
                            <span className="text-[10px] text-muted-foreground block font-mono">
                              {s.nclcProfile}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        {s.source}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(s.subscribedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {s.isActive ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Actif
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Désinscrit
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Active / Unsubscribe */}
                        <form action={toggleSubscriberStatusAction}>
                          <input type="hidden" name="id" value={s.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title={
                              s.isActive
                                ? "Marquer comme désinscrit"
                                : "Réactiver l'abonnement"
                            }
                          >
                            {s.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </form>

                        <form id={`del-sub-${s.id}`} action={deleteSubscriberAction}>
                          <input type="hidden" name="id" value={s.id} />
                        </form>

                        <ConfirmActionDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              title="Supprimer cet abonné"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Supprimer définitivement cet abonné ?"
                          description={`Êtes-vous certain de vouloir supprimer ${s.email} de la base d'abonnés ? Cette action est irréversible.`}
                          confirmLabel="Supprimer définitivement"
                          formId={`del-sub-${s.id}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barre d'Actions en Lot Flottante */}
      <AdminBatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        itemName="abonnés"
        onExportCsv={handleExportCsv}
        onDeleteSelected={handleBatchDelete}
        onToggleActiveSelected={handleBatchToggleActive}
        customActions={
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyWhatsAppNumbers}
              className="h-8 gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-300"
              title="Copier tous les numéros WhatsApp sélectionnés"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>Copier WhatsApp</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEmails}
              className="h-8 gap-1.5 text-xs font-semibold bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
              title="Copier toutes les adresses e-mail sélectionnées"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copier Emails</span>
            </Button>
          </div>
        }
      />
    </>
  );
}
