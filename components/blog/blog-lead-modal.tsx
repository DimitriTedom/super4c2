"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Sparkles, CheckCircle2, ShieldCheck, Loader2, Download, MessageSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { captureLeadAction } from "@/app/admin/newsletter/actions";
import { SUJET_DIAL_CODES } from "@/components/sujets/sujet-lead-dialog";

interface BlogLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleTitle?: string;
  onSuccess?: () => void;
}

export function BlogLeadModal({
  open,
  onOpenChange,
  articleTitle,
  onSuccess,
}: BlogLeadModalProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>("+237");
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Veuillez renseigner une adresse e-mail valide.");
      return;
    }

    if (!phone || phone.trim().length < 6) {
      toast.error("Veuillez renseigner votre numéro WhatsApp pour recevoir les alertes d'examen.");
      return;
    }

    startTransition(async () => {
      const fullPhone = `${dialCode} ${phone.trim()}`;
      const res = await captureLeadAction({
        email,
        name: name.trim() || undefined,
        phone: fullPhone,
        source: "blog_free_pack_whatsapp",
      });

      if (res.ok) {
        setIsSuccess(true);
        try {
          localStorage.setItem("super4c2:blog_lead_captured", "true");
        } catch {}
        toast.success("Pack débloqué ! Bienvenue dans la communauté Super4C2.");
        onSuccess?.();
      } else {
        toast.error(res.error || "Une erreur est survenue.");
      }
    });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 300);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-2xl">
        {/* Banner header gradient */}
        <div className="relative bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 sm:p-7 border-b border-border/70">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              100% Gratuit — Sans Carte Bancaire
            </span>
          </div>

          <DialogHeader className="text-left space-y-1.5">
            <DialogTitle className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {isSuccess
                ? "Félicitations ! Votre Pack est Débloqué"
                : "Recevez les 10 Modèles C1/C2 & les Sujets Réels sur WhatsApp"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isSuccess
                ? "Vous avez désormais accès à notre communauté VIP et à l'ensemble des modèles didactiques officiels."
                : articleTitle
                ? `Pour compléter votre lecture de « ${articleTitle} », recevez notre kit de préparation complet directement sur WhatsApp.`
                : "Téléchargez immédiatement le guide PDF des 10 modèles d'Expression Écrite C1/C2 et rejoignez notre veille hebdomadaire des sujets réels."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-7 space-y-5">
          {isSuccess ? (
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display text-lg font-bold text-foreground">
                  Dernière Étape : Rejoindre le Groupe WhatsApp VIP
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Rejoignez plus de 1 400 candidats actifs pour recevoir chaque vendredi les sujets officiels tombés en centre d&apos;examen.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button
                  asChild
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold h-11 text-sm shadow-md gap-2"
                >
                  <a
                    href="https://chat.whatsapp.com/super4c2_nclc7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Rejoindre le Groupe WhatsApp Officiel →
                  </a>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleClose(false)}
                  className="w-full text-xs h-9"
                >
                  Continuer la lecture
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Feature checkmarks */}
              <div className="rounded-2xl bg-muted/40 p-3.5 border border-border/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-foreground/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>10 Modèles rédigés de Tâche 1, 2 et 3 niveau C1/C2 (PDF)</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Veille hebdomadaire gratuite des sujets tombés en session 2026</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Accès libre au simulateur CBT sans abonnement ni carte</span>
                </div>
              </div>

              {/* Name field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Votre Prénom
                </label>
                <input
                  type="text"
                  placeholder="ex : Marie, Ibrahim, David..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Votre Adresse E-mail <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* WhatsApp phone field with dial code */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Votre Numéro WhatsApp <span className="text-primary">*</span>
                </label>
                <div className="flex gap-2">
                  <Select value={dialCode} onValueChange={setDialCode}>
                    <SelectTrigger className="w-[110px] shrink-0 h-10 text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUJET_DIAL_CODES.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <input
                    type="tel"
                    required
                    placeholder="6XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Utilisé uniquement pour vous envoyer les alertes de nouveaux sujets d&apos;examen.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Validation en cours...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Débloquer mon Pack Gratuit &amp; WhatsApp →</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% Gratuit • Zéro spam • Désinscription en 1 clic</span>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
