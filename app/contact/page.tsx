"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  ShieldCheck,
  Send,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { submitContactLeadAction } from "./actions";

export default function ContactPage() {
  const [intent, setIntent] = useState<"CANDIDATE" | "URGENT" | "B2B" | "TECH">("CANDIDATE");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    examDate: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez renseigner tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const res = await submitContactLeadAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        examDate: formData.examDate || null,
        message: formData.message,
        intent,
      });

      if (!res.ok) {
        toast.error(res.error || "Une erreur est survenue lors de l'envoi.");
        return;
      }

      setSubmitted(true);
      toast.success("Votre demande a été transmise à notre équipe pédagogique !");
    } catch {
      toast.error("Impossible de transmettre la demande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-4">
      {/* 🧭 Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Support &amp; Conciergerie Candidat
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Une Équipe d&apos;Experts à Vos Côtés
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Que vous prépariez votre examen dans 6 mois ou dans 48 heures, nous vous répondons rapidement avec des conseils adaptés à votre profil d&apos;immigration.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* 📬 Formulaire Interactif (7 colonnes) */}
        <div className="lg:col-span-7 rounded-3xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold">Sélectionnez l&apos;objet de votre demande</h2>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIntent("CANDIDATE")}
                className={`rounded-xl border p-3 text-left font-semibold transition-all ${
                  intent === "CANDIDATE"
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                🎓 Candidat Individuel
                <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                  Conseil formule ou méthode
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIntent("URGENT")}
                className={`rounded-xl border p-3 text-left font-semibold transition-all ${
                  intent === "URGENT"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                ⚡ Urgence Examen
                <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                  Passation dans &lt; 7 jours
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIntent("B2B")}
                className={`rounded-xl border p-3 text-left font-semibold transition-all ${
                  intent === "B2B"
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                🏢 École / Agence CRIC
                <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                  Écoles &amp; Cabinets Partenaires
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIntent("TECH")}
                className={`rounded-xl border p-3 text-left font-semibold transition-all ${
                  intent === "TECH"
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                🛠️ Support Technique
                <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                  Accès, audio ou facturation
                </span>
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <h3 className="font-display text-xl font-bold text-foreground">
                Message bien reçu !
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Merci {formData.name}. Un conseiller pédagogique Super4C2 analyse votre demande et vous répondra à <strong>{formData.email}</strong> dans un délai maximal de 2 heures ouvrées.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nom complet <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border bg-muted/30 px-3.5 py-2.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Adresse e-mail <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="candidat@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border bg-muted/30 px-3.5 py-2.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Téléphone (WhatsApp recommandé)
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border bg-muted/30 px-3.5 py-2.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Date prévue de votre examen (optionnel)
                  </label>
                  <DatePicker
                    date={formData.examDate ? new Date(formData.examDate) : null}
                    onSelect={(d) =>
                      setFormData({
                        ...formData,
                        examDate: d ? d.toISOString().split("T")[0] : "",
                      })
                    }
                    placeholder="Sélectionner la date de votre session..."
                    className="h-10 text-xs bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Votre message ou situation actuelle <span className="text-primary">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez votre niveau actuel, vos blocages (ex: Compréhension Écrite, Tâche 3...) ou votre besoin..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border bg-muted/30 p-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark font-bold text-white h-11">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Envoi en cours...
                  </span>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Envoyer ma demande
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* 🛡️ Informations & Engagements de Service (5 colonnes) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border bg-card p-6 sm:p-7 space-y-4 shadow-sm">
            <h3 className="font-display text-lg font-bold">Nos Engagements d&apos;Assistance</h3>
            
            <div className="space-y-3.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Réponse garantie sous 2h ouvrées</strong>
                  Nos formateurs traitent vos questions 7j/7 pendant vos périodes de révision intensive.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Orientation NCLC & Entrée Express</strong>
                  Conseils neutres et personnalisés selon vos dates limites d&apos;extraction IRCC.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Écoles &amp; Partenariats</strong>
                  Espace dédié pour intégrer Super4C2 dans votre école ou votre cabinet d&apos;avocats.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Email direct :{" "}
                <a href="mailto:contact@super4c2.com" className="font-semibold text-primary underline">
                  contact@super4c2.com
                </a>
              </p>
            </div>
          </div>

          {/* Conciergerie WhatsApp VIP */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <MessageSquare className="h-4 w-4" /> Conciergerie Directe Candidats
            </div>
            <h4 className="font-display text-base font-bold text-foreground">
              Besoin d&apos;un conseil immédiat sur WhatsApp ?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rejoignez notre canal officiel pour poser vos questions rapides à nos tuteurs linguistiques.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 font-bold"
            >
              <Link href="/communaute">
                Rejoindre la Communauté WhatsApp & Telegram →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
