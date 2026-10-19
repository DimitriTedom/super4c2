"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, LogOut, Mail, Trash2, TriangleAlert } from "lucide-react";

import { changeEmailAction, deleteAccountAction, signOutEverywhereAction } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function AccountLifecycle({ userId, currentEmail }: { userId: string; currentEmail: string }) {
  const [newEmail, setNewEmail] = React.useState("");
  const [emailPending, setEmailPending] = React.useState(false);
  const [sessionsPending, setSessionsPending] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [deletePending, setDeletePending] = React.useState(false);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes("@") || newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      toast.error("Saisissez une nouvelle adresse e-mail valide.");
      return;
    }
    setEmailPending(true);
    try {
      const res = await changeEmailAction(newEmail);
      if (res.ok) {
        toast.success(res.message);
        setNewEmail("");
      } else {
        toast.error(res.error);
      }
    } finally {
      setEmailPending(false);
    }
  };

  const handleSignOutEverywhere = async () => {
    setSessionsPending(true);
    try {
      const res = await signOutEverywhereAction();
      if (res.ok) {
        toast.success("Toutes les sessions ont été fermées.");
        window.location.href = "/auth/login";
      } else {
        toast.error(res.error);
        setSessionsPending(false);
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.");
      setSessionsPending(false);
    }
  };

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      const res = await deleteAccountAction(confirmText);
      if (res.ok) {
        try {
          window.localStorage.removeItem(`super4c2:srs_cards:${userId}`);
          window.localStorage.removeItem(`super4c2:onboarding_dismissed:${userId}`);
        } catch {
          // stockage indisponible
        }
        toast.success("Votre compte et vos données ont été supprimés.");
        window.location.href = "/";
      } else {
        toast.error(res.error);
        setDeletePending(false);
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.");
      setDeletePending(false);
    }
  };

  return (
    <>
      <section className="rounded-3xl border bg-card p-6 shadow-xs space-y-6" aria-labelledby="lifecycle-title">
        <div className="flex items-center gap-2 border-b pb-3">
          <Mail className="h-5 w-5 text-primary" />
          <h2 id="lifecycle-title" className="font-display text-lg font-bold">
            Compte &amp; sessions
          </h2>
        </div>

        <form onSubmit={handleChangeEmail} className="space-y-2">
          <label htmlFor="new-email" className="text-xs font-semibold">
            Changer d&apos;adresse e-mail
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="new-email"
              type="email"
              autoComplete="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nouvelle.adresse@exemple.com"
              className="h-10 rounded-xl"
            />
            <Button type="submit" disabled={emailPending} variant="secondary" className="h-10 rounded-xl">
              {emailPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Adresse actuelle : {currentEmail}. Un lien de confirmation vous sera envoyé.
          </p>
        </form>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Se déconnecter de tous les appareils</p>
            <p className="text-xs text-muted-foreground">
              Ferme toutes vos sessions actives, y compris sur cet appareil.
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOutEverywhere} disabled={sessionsPending} className="gap-2">
            {sessionsPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Déconnecter partout
          </Button>
        </div>
      </section>

      <section
        className="rounded-3xl border border-destructive/40 bg-destructive/5 p-6 space-y-3"
        aria-labelledby="danger-title"
      >
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-5 w-5 text-destructive" />
          <h2 id="danger-title" className="font-display text-lg font-bold text-destructive">
            Zone dangereuse
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          La suppression de votre compte efface définitivement votre profil, votre historique d&apos;épreuves et vos
          notifications. Cette action est irréversible.
        </p>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </Button>
      </section>

      <Dialog open={deleteOpen} onOpenChange={(o) => !deletePending && setDeleteOpen(o)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-display text-xl font-bold text-destructive">
              Supprimer définitivement mon compte ?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Toutes vos données seront effacées sans possibilité de récupération. Tapez{" "}
              <strong>SUPPRIMER</strong> pour confirmer.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="SUPPRIMER"
            aria-label="Confirmation de suppression"
            className="h-10 rounded-xl"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deletePending}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePending || confirmText.trim().toUpperCase() !== "SUPPRIMER"}
              className="gap-2"
            >
              {deletePending && <Loader2 className="h-4 w-4 animate-spin" />}
              Supprimer définitivement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
