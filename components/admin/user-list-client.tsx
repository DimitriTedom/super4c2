"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  CalendarClock,
  Target,
  ExternalLink,
  Copy,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Eye,
  CheckSquare,
  Square,
  Download,
  MessageCircle,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";

export interface CandidateAttemptSummary {
  id: string;
  discipline: "COMPREHENSION_ECRITE" | "COMPREHENSION_ORALE" | "EXPRESSION_ECRITE" | "EXPRESSION_ORALE" | string;
  rawScore: number;
  tcfScaledScore: number;
  nclcLevel: number;
  crsPointsUnlocked: number;
  createdAt: Date;
}

export interface UserRowData {
  id: string;
  email: string;
  createdAt: Date;
  displayName: string | null;
  targetNclc: number;
  examDate: Date | null;
  phone: string | null;
  country: string | null;
  attemptsCount: number;
  attempts: CandidateAttemptSummary[];
  isAdmin: boolean;
}

interface UserListClientProps {
  users: UserRowData[];
  query?: string;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "Non fixée";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string | null, email: string) {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function getDisciplineMeta(discipline: string) {
  switch (discipline) {
    case "COMPREHENSION_ECRITE":
      return { label: "Lecture (CE)", icon: BookOpen, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    case "COMPREHENSION_ORALE":
      return { label: "Écoute (CO)", icon: Headphones, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    case "EXPRESSION_ECRITE":
      return { label: "Rédaction (EE)", icon: PenTool, color: "text-brand-crimson bg-brand-crimson/10 border-brand-crimson/20" };
    case "EXPRESSION_ORALE":
      return { label: "Oral (EO)", icon: Mic, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
    default:
      return { label: discipline, icon: BookOpen, color: "text-muted-foreground bg-muted border-border" };
  }
}

export function UserListClient({ users, query }: UserListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRowData | null>(null);

  const isAllSelected = users.length > 0 && selectedIds.length === users.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Adresse e-mail copiée !");
  };

  // Actions groupées (Batch Actions)
  const handleBatchExport = () => {
    const items = users.filter((u) => selectedIds.includes(u.id));
    if (items.length === 0) return;

    downloadCsv(
      `candidats-selection-${new Date().toISOString().slice(0, 10)}`,
      items.map((u) => ({
        role: u.isAdmin ? "Super Admin" : "Candidat",
        nom: u.displayName || "Candidat",
        email: u.email,
        telephone: u.phone || "Non renseigné",
        pays: u.country || "Non spécifié",
        nclc: `NCLC ${u.targetNclc}`,
        examen: u.examDate ? new Date(u.examDate).toLocaleDateString("fr-FR") : "Non fixée",
        tentatives: u.attemptsCount,
        inscription: new Date(u.createdAt).toLocaleDateString("fr-FR"),
      })),
      [
        { key: "role", label: "Rôle" },
        { key: "nom", label: "Nom" },
        { key: "email", label: "Email" },
        { key: "telephone", label: "Téléphone" },
        { key: "pays", label: "Pays" },
        { key: "nclc", label: "Niveau NCLC visé" },
        { key: "examen", label: "Date d'examen prévue" },
        { key: "tentatives", label: "Nombre de simulations" },
        { key: "inscription", label: "Date d'inscription" },
      ]
    );
    toast.success(`${items.length} candidat(s) exporté(s) en CSV.`);
  };

  const handleBatchCopyEmails = () => {
    const emails = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => u.email)
      .join(", ");
    navigator.clipboard.writeText(emails);
    toast.success(`${selectedIds.length} adresse(s) e-mail copiée(s) !`);
  };

  if (users.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        <Users className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
        <p>
          {query
            ? "Aucun candidat ne correspond à cette recherche."
            : "Aucun candidat inscrit pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b select-none">
            <tr>
              <th className="px-4 py-3 w-10">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title={isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Candidat & Rôle</th>
              <th className="px-4 py-3 font-semibold">Inscription</th>
              <th className="px-4 py-3 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Target className="h-3 w-3" /> NCLC visé
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" /> Examen
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">Copies & Simulations</th>
              <th className="px-4 py-3 text-right font-semibold">Fiche & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {users.map((u) => {
              const displayName = u.displayName || u.email.split("@")[0];
              const initials = getInitials(u.displayName, u.email);
              const isSelected = selectedIds.includes(u.id);

              return (
                <tr
                  key={u.id}
                  className={`transition-colors ${
                    isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                  }`}
                >
                  {/* Checkbox sélection */}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSelectOne(u.id)}
                      className="flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>

                  {/* Candidat & Rôle */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary border border-primary/20">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[240px]">
                            {displayName}
                          </span>
                          {u.isAdmin ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20 shrink-0">
                              <ShieldCheck className="h-3 w-3" /> Super Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0">
                              Candidat
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Inscription */}
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                    {formatDate(u.createdAt)}
                  </td>

                  {/* NCLC visé */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-primary/5 text-primary border border-primary/10">
                      NCLC {u.targetNclc}+
                    </span>
                  </td>

                  {/* Examen prévu */}
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(u.examDate)}
                  </td>

                  {/* Copies & Simulations (Lien direct vers les copies) */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.attemptsCount > 0 ? (
                      <Link
                        href={`/admin/tentatives?q=${encodeURIComponent(u.email)}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all group"
                        title={`Consulter les ${u.attemptsCount} copies d'examen de ${displayName}`}
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{u.attemptsCount} copie{u.attemptsCount > 1 ? "s" : ""}</span>
                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 opacity-70" />
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">
                        0 simulation
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                      className="gap-1.5 text-xs font-semibold shadow-2xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Fiche Candidat</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Barre d'Actions Groupées (Batch Actions) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-card/95 backdrop-blur-md border border-primary/30 px-4 py-2.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <span className="text-xs font-bold text-foreground">
            {selectedIds.length} sélectionné{selectedIds.length > 1 ? "s" : ""}
          </span>

          <div className="h-4 w-px bg-border" />

          <Button
            size="sm"
            variant="outline"
            onClick={handleBatchExport}
            className="gap-1.5 text-xs h-8"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>Exporter CSV</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleBatchCopyEmails}
            className="gap-1.5 text-xs h-8"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copier e-mails</span>
          </Button>

          <a
            href={`mailto:${users
              .filter((u) => selectedIds.includes(u.id))
              .map((u) => u.email)
              .join(",")}`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>Écrire à tous</span>
          </a>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds([])}
            className="h-8 px-2 text-muted-foreground hover:text-foreground text-xs"
            title="Désélectionner tout"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modal / Fiche Candidat Complète Enrichie au MAX */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        {selectedUser && (
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 scrollbar-thin">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary border border-primary/20 shadow-xs">
                  {getInitials(selectedUser.displayName, selectedUser.email)}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl font-bold truncate">
                      {selectedUser.displayName || selectedUser.email.split("@")[0]}
                    </DialogTitle>
                    {selectedUser.isAdmin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20 shrink-0">
                        <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
                      </span>
                    )}
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground truncate font-mono">
                    {selectedUser.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Statut de Performance & Diagnostic NCLC */}
              {(() => {
                const bestAttempt = [...selectedUser.attempts].sort((a, b) => b.nclcLevel - a.nclcLevel)[0];
                const hasNclc7 = selectedUser.attempts.some((a) => a.nclcLevel >= 7);

                return (
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      hasNclc7
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                        : "bg-primary/5 border-primary/20 text-foreground"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Award className="h-4 w-4 text-primary" />
                        <span>
                          {hasNclc7
                            ? "🏆 Objectif Canada Validé (NCLC 7+ Atteint)"
                            : "🎯 Entraînement en cours (Objectif Seuil NCLC 7)"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bestAttempt
                          ? `Meilleur palier atteint : NCLC ${bestAttempt.nclcLevel} (${bestAttempt.tcfScaledScore} pts)`
                          : "Aucune tentative notée à ce jour"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-base font-extrabold text-primary">
                        {hasNclc7 ? "+50 PTS CRS" : "0 / 50 PTS"}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Coordonnées & Profil Étendu */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  Coordonnées &amp; Informations d&apos;Immigration
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl border bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Target className="h-3 w-3 text-primary" /> Objectif Visé
                    </span>
                    <p className="font-bold text-sm text-foreground">
                      NCLC {selectedUser.targetNclc}+
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <CalendarClock className="h-3 w-3 text-primary" /> Examen Prévu
                    </span>
                    <p className="font-bold text-xs text-foreground">
                      {formatDate(selectedUser.examDate)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3 text-primary" /> Date d&apos;Inscription
                    </span>
                    <p className="font-bold text-xs text-foreground">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Phone className="h-3 w-3 text-primary" /> Téléphone
                    </span>
                    <p className="font-bold text-xs text-foreground truncate">
                      {selectedUser.phone || "Non renseigné"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Globe className="h-3 w-3 text-primary" /> Pays / Bassin
                    </span>
                    <p className="font-bold text-xs text-foreground truncate">
                      {selectedUser.country || "Non spécifié"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <GraduationCap className="h-3 w-3 text-primary" /> Total Simulations
                    </span>
                    <p className="font-bold text-xs text-foreground">
                      {selectedUser.attemptsCount} copie(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Répartition par Discipline */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Activité CBT par Épreuve
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { discipline: "COMPREHENSION_ECRITE", label: "Lecture (CE)", icon: BookOpen },
                    { discipline: "COMPREHENSION_ORALE", label: "Écoute (CO)", icon: Headphones },
                    { discipline: "EXPRESSION_ECRITE", label: "Rédaction (EE)", icon: PenTool },
                    { discipline: "EXPRESSION_ORALE", label: "Oral (EO)", icon: Mic },
                  ].map((d) => {
                    const count = selectedUser.attempts.filter((a) => a.discipline === d.discipline).length;
                    const Icon = d.icon;
                    return (
                      <div key={d.discipline} className="p-2.5 rounded-xl border bg-muted/20 text-center space-y-1">
                        <Icon className="h-4 w-4 mx-auto text-primary" />
                        <p className="text-[11px] font-medium text-muted-foreground">{d.label}</p>
                        <p className="font-bold text-sm text-foreground">{count}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Historique des Dernières Copies */}
              {selectedUser.attempts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Dernières simulations passées
                    </h4>
                    <Link
                      href={`/admin/tentatives?q=${encodeURIComponent(selectedUser.email)}`}
                      onClick={() => setSelectedUser(null)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Toutes les copies ({selectedUser.attempts.length})</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto rounded-xl border bg-card p-2 divide-y divide-border/40 text-xs">
                    {selectedUser.attempts.slice(0, 5).map((att) => {
                      const meta = getDisciplineMeta(att.discipline);
                      const Icon = meta.icon;

                      return (
                        <div key={att.id} className="flex items-center justify-between py-2 px-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`p-1 rounded-md border ${meta.color}`}>
                              <Icon className="h-3 w-3" />
                            </span>
                            <div className="truncate">
                              <p className="font-semibold text-foreground truncate">{meta.label}</p>
                              <p className="text-[10px] text-muted-foreground">{formatDate(att.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {att.rawScore} pts
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                              NCLC {att.nclcLevel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Directes */}
              <div className="flex flex-col gap-2.5 pt-2 border-t">
                {selectedUser.attemptsCount > 0 && (
                  <Link
                    href={`/admin/tentatives?q=${encodeURIComponent(selectedUser.email)}`}
                    onClick={() => setSelectedUser(null)}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Consulter ses {selectedUser.attemptsCount} copie(s) &amp; rapports PDF</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </Link>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyEmail(selectedUser.email)}
                    className="gap-1.5 text-xs h-9"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copier e-mail</span>
                  </Button>

                  <a
                    href={`mailto:${selectedUser.email}`}
                    className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>Envoyer email</span>
                  </a>

                  {(() => {
                    const cleanPhone = (selectedUser.phone || "").replace(/\D/g, "");
                    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                    if (waLink) {
                      return (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>
                      );
                    }

                    return (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="gap-1.5 text-xs h-9 text-muted-foreground/50"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Pas de WhatsApp</span>
                      </Button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
