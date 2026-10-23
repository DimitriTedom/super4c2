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
import { Sparkles, CheckCircle2, ShieldCheck, Loader2, Download, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { captureLeadAction } from "@/app/admin/newsletter/actions";

export const SUJET_DIAL_CODES = [
  { code: "+237", label: "🇨🇲 +237" },
  { code: "+221", label: "🇸🇳 +221" },
  { code: "+225", label: "🇨🇮 +225" },
  { code: "+212", label: "🇲🇦 +212" },
  { code: "+213", label: "🇩🇿 +213" },
  { code: "+216", label: "🇹🇳 +216" },
  { code: "+243", label: "🇨🇩 +243" },
  { code: "+241", label: "🇬🇦 +241" },
  { code: "+224", label: "🇬🇳 +224" },
  { code: "+229", label: "🇧🇯 +229" },
  { code: "+228", label: "🇹🇬 +228" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+1", label: "🇨🇦 +1" },
];

interface SujetLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicTitle?: string;
  isPdfPack?: boolean;
  onSuccess?: () => void;
}

export function SujetLeadDialog({
  open,
  onOpenChange,
  topicTitle,
  isPdfPack = false,
  onSuccess,
}: SujetLeadDialogProps) {
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
      toast.error("Veuillez renseigner un numéro WhatsApp valide.");
      return;
    }

    startTransition(async () => {
      const cleanDigits = phone.replace(/\D/g, "").replace(/^0+/, "");
      const fullPhone = `${dialCode}${cleanDigits}`;

      const res = await captureLeadAction({
        name: name.trim() || undefined,
        email: email.trim().toLowerCase(),
        phone: fullPhone,
        source: isPdfPack ? "sujets_recents_pack_pdf" : "sujets_recents_vip",
      });

      if (!res.ok) {
        toast.error(res.error || "Une erreur est survenue.");
        return;
      }

      try {
        localStorage.setItem("super4c2:vip_topics_unlocked", "true");
        localStorage.setItem("super4c2:lead_phone", fullPhone);
        localStorage.setItem("super4c2:lead_email", email.trim().toLowerCase());
      } catch {}

      setIsSuccess(true);
      toast.success("✓ Accès VIP Débloqué avec succès !");
      onSuccess?.();
    });
  };

  const handleClose = () => {
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 sm:p-8">
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 mb-1">
            {isPdfPack ? (
              <Download className="h-7 w-7 text-emerald-600" />
            ) : (
              <Sparkles className="h-7 w-7 text-emerald-600" />
            )}
          </div>
          <DialogTitle className="font-display text-xl sm:text-2xl font-black text-foreground">
            {isPdfPack
              ? "Télécharger le Pack 50 Sujets Réels 2026"
              : "Débloquer le Corrigé C1/C2 & la Fiche PDF"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {topicTitle
              ? `Accédez au modèle de rédaction C1/C2 pour « ${topicTitle} » et recevez chaque semaine les nouveaux sujets sur WhatsApp.`
              : "Recevez immédiatement l'accès aux corrigés types de niveau C1/C2 rédigés par nos mentors FEI."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4 py-4 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2 text-xs">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-foreground">
                Félicitations ! Vos accès VIP sont débloqués
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Tous les corrigés types C1/C2 et fiches de révision de la page sont désormais accessibles en lecture libre.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://chat.whatsapp.com/super4c2_nclc7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 rounded-xl shadow-md transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Rejoindre le Groupe WhatsApp Officiel
              </a>

              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full text-xs h-10 rounded-xl border-border/80 font-medium"
              >
                Continuer la lecture sur cette page
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Votre Prénom
              </label>
              <input
                type="text"
                autoComplete="name"
                required
                placeholder="Ex : Sarah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border bg-background px-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Numéro WhatsApp (Pour recevoir les corrigés)
              </label>
              <div className="flex gap-2">
                <Select value={dialCode} onValueChange={setDialCode}>
                  <SelectTrigger className="h-11 w-[115px] shrink-0 rounded-xl text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {SUJET_DIAL_CODES.map((d) => (
                      <SelectItem key={d.code} value={d.code} className="text-xs">
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  required
                  placeholder="6XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border bg-background px-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Adresse E-mail
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="sarah.candidat@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border bg-background px-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>
                100% Gratuit &amp; Sans engagement. Vos données restent strictement confidentielles.
              </span>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm h-12 rounded-xl shadow-lg shadow-emerald-500/20 gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Déblocage en cours...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {isPdfPack
                      ? "Télécharger le Pack Gratuit"
                      : "Débloquer le Corrigé sur WhatsApp"}
                  </span>
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
