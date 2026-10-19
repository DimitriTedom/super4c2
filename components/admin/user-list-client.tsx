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
  Info,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

export function UserListClient({ users, query }: UserListClientProps) {
  const [selectedUser, setSelectedUser] = useState<UserRowData | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Adresse e-mail copiée dans le presse-papier !");
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
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b">
            <tr>
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
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {users.map((u) => {
              const displayName = u.displayName || u.email.split("@")[0];
              const initials = getInitials(u.displayName, u.email);

              return (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
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

                  {/* Copies & Simulations (Lien direct) */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.attemptsCount > 0 ? (
                      <Link
                        href={`/admin/tentatives?q=${encodeURIComponent(u.email)}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all group"
                        title={`Consulter les ${u.attemptsCount} copies d'examen de ce candidat`}
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
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Fiche</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Fiche Candidat */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        {selectedUser && (
          <DialogContent className="sm:max-w-md rounded-2xl p-6">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-extrabold text-primary border border-primary/20">
                  {getInitials(selectedUser.displayName, selectedUser.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg font-bold truncate">
                    {selectedUser.displayName || selectedUser.email.split("@")[0]}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground truncate">
                    {selectedUser.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              {/* Rôle & Statut */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
                <span className="text-xs font-medium text-muted-foreground">Rôle de l&apos;utilisateur</span>
                {selectedUser.isAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Super Administrateur
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Candidat Officiel TCF / TEF
                  </span>
                )}
              </div>

              {/* Grille d'informations */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border bg-card space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3 text-primary" /> Objectif Seuil
                  </span>
                  <p className="font-bold text-sm text-foreground">
                    NCLC {selectedUser.targetNclc}+ <span className="text-[10px] text-muted-foreground font-normal">(+50 pts CRS)</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl border bg-card space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CalendarClock className="h-3 w-3 text-primary" /> Date Examen
                  </span>
                  <p className="font-bold text-sm text-foreground">
                    {formatDate(selectedUser.examDate)}
                  </p>
                </div>

                <div className="p-3 rounded-xl border bg-card space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3 text-primary" /> Téléphone
                  </span>
                  <p className="font-bold text-xs text-foreground truncate">
                    {selectedUser.phone || "Non renseigné"}
                  </p>
                </div>

                <div className="p-3 rounded-xl border bg-card space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3 text-primary" /> Pays / Bassin
                  </span>
                  <p className="font-bold text-xs text-foreground truncate">
                    {selectedUser.country || "Non spécifié"}
                  </p>
                </div>
              </div>

              {/* Raccourcis d'actions */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedUser.attemptsCount > 0 ? (
                  <Link
                    href={`/admin/tentatives?q=${encodeURIComponent(selectedUser.email)}`}
                    onClick={() => setSelectedUser(null)}
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Consulter ses {selectedUser.attemptsCount} copie(s) d&apos;examen</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </Link>
                ) : (
                  <div className="p-2.5 rounded-xl bg-muted/30 border text-center text-xs text-muted-foreground">
                    Aucune copie d&apos;examen enregistrée pour le moment.
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyEmail(selectedUser.email)}
                    className="flex-1 gap-1.5 text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copier e-mail</span>
                  </Button>

                  <a
                    href={`mailto:${selectedUser.email}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Contacter</span>
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
