"use client";

import React, { useState, useTransition } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { subscribePublicNewsletterAction } from "@/app/admin/newsletter/actions";
import { Button } from "@/components/ui/button";

export function NewsletterCard({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    startTransition(async () => {
      const res = await subscribePublicNewsletterAction(email, source, phone.trim() || undefined);
      if (res.ok) {
        setSubscribed(true);
        toast.success("Vous êtes inscrit à la lettre d'information Super4C2 !");
      } else {
        toast.error(res.error || "Une erreur est survenue.");
      }
    });
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Merci ! Vous recevrez nos nouveaux sujets et astuces NCLC 7.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="space-y-2">
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            required
            placeholder="votre-email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-xl border bg-background/80 pl-10 pr-3 text-xs shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
          />
        </div>

        <div className="relative flex items-center">
          <input
            type="tel"
            placeholder="Numéro WhatsApp (ex: +33... ou +237...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-10 w-full rounded-xl border bg-background/80 px-3.5 pr-24 text-xs shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
          />
          <Button
            type="submit"
            size="sm"
            disabled={pending}
            className="absolute right-1 h-8 rounded-lg bg-primary hover:bg-primary-dark font-semibold text-white px-3 text-xs"
          >
            {pending ? (
              <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
            ) : (
              <span className="flex items-center gap-1">
                Rejoindre <ArrowRight className="h-3 w-3" />
              </span>
            )}
          </Button>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Aucun spam. Recevez nos nouveaux sujets et alertes par e-mail et WhatsApp.
      </p>
    </form>
  );
}
