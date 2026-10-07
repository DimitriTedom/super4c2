"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  FileEdit,
  Save,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import {
  updateLeadStatusAction,
  updateLeadNotesAction,
  deleteLeadAction,
} from "@/app/admin/leads/actions";
import { LeadStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

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

interface LeadRowCardProps {
  lead: LeadData;
}

const INTENT_LABELS: Record<string, { label: string; color: string }> = {
  CANDIDATE: {
    label: "Candidat TCF",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  URGENT: {
    label: "Urgence Examen",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  B2B: {
    label: "Partenariat / B2B",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  TECH: {
    label: "Support Technique",
    color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  NOUVEAU: {
    label: "Nouveau",
    color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    icon: AlertCircle,
  },
  EN_COURS: {
    label: "En cours",
    color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    icon: Clock,
  },
  RESOLU: {
    label: "Résolu",
    color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  ARCHIVE: {
    label: "Archivé",
    color: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
    icon: Archive,
  },
};

export function LeadRowCard({ lead }: LeadRowCardProps) {
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [notes, setNotes] = useState(lead.adminNotes || "");

  const intentMeta = INTENT_LABELS[lead.intent] || {
    label: lead.intent,
    color: "bg-muted text-muted-foreground",
  };

  const statusMeta = STATUS_CONFIG[lead.status];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/30 transition-all space-y-4">
      {/* Top Header: Identity + Intent + Status Select */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shrink-0">
            {lead.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-base">
                {lead.name}
              </h3>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${intentMeta.color}`}
              >
                {intentMeta.label}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1 hover:text-primary transition-colors font-mono"
              >
                <Mail className="h-3 w-3" />
                {lead.email}
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors font-mono"
                >
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(lead.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Change Status with Server Action */}
        <div className="flex items-center gap-2">
          <form action={updateLeadStatusAction} className="flex items-center">
            <input type="hidden" name="id" value={lead.id} />
            <Select
              name="status"
              defaultValue={lead.status}
              onValueChange={() => {
                const form = document.getElementById(
                  `status-form-${lead.id}`
                ) as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
            >
              <form id={`status-form-${lead.id}`} action={updateLeadStatusAction}>
                <input type="hidden" name="id" value={lead.id} />
                <SelectTrigger className={cn("w-[140px] h-8 text-xs font-semibold border", statusMeta.color)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOUVEAU">Nouveau</SelectItem>
                  <SelectItem value="EN_COURS">En cours</SelectItem>
                  <SelectItem value="RESOLU">Résolu</SelectItem>
                  <SelectItem value="ARCHIVE">Archivé</SelectItem>
                </SelectContent>
              </form>
            </Select>
          </form>

          {/* Delete Dialog */}
          <form id={`del-lead-${lead.id}`} action={deleteLeadAction}>
            <input type="hidden" name="id" value={lead.id} />
          </form>
          <ConfirmActionDialog
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                title="Supprimer la demande"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
            title="Supprimer cette demande ?"
            description={`Êtes-vous sûr de vouloir supprimer définitivement la demande de contact de ${lead.name} ?`}
            confirmLabel="Supprimer"
            formId={`del-lead-${lead.id}`}
          />
        </div>
      </div>

      {/* Message Content */}
      <div className="rounded-lg bg-muted/30 p-3.5 text-xs text-foreground/90 leading-relaxed border space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
          <MessageSquare className="h-3 w-3 text-primary" />
          Message du Candidat :
        </div>
        <p className="whitespace-pre-wrap">{lead.message}</p>
      </div>

      {/* Admin Notes Section */}
      <div className="space-y-2 pt-1">
        {lead.adminNotes && !showNotesForm && (
          <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-primary font-semibold text-[11px]">
              <span className="flex items-center gap-1">
                <FileEdit className="h-3 w-3" />
                Notes Internes de Suivi :
              </span>
              <button
                type="button"
                onClick={() => setShowNotesForm(true)}
                className="underline hover:text-primary/80"
              >
                Modifier
              </button>
            </div>
            <p className="text-muted-foreground">{lead.adminNotes}</p>
          </div>
        )}

        {(!lead.adminNotes || showNotesForm) && (
          <div>
            {!showNotesForm ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotesForm(true)}
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
              >
                <FileEdit className="h-3 w-3" />
                Ajouter une note de suivi interne
              </Button>
            ) : (
              <form action={updateLeadNotesAction} className="space-y-2 mt-2">
                <input type="hidden" name="id" value={lead.id} />
                <Textarea
                  name="adminNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes internes (ex: Contacté par WhatsApp le 07/10, intéressé par la formule Premium EE)..."
                  rows={2}
                  className="text-xs rounded-lg"
                />
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" className="h-7 text-xs gap-1">
                    <Save className="h-3 w-3" />
                    Enregistrer la note
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotesForm(false)}
                    className="h-7 text-xs"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
