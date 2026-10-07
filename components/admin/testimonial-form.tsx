"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  MessageSquareQuote,
  Star,
  Globe,
  Award,
  Sparkles,
  TrendingUp,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownField } from "@/components/admin/markdown-field";

export const TESTIMONIAL_COUNTRIES = [
  "Cameroun",
  "Côte d'Ivoire",
  "Sénégal",
  "Maroc",
  "Algérie",
  "Tunisie",
  "France",
  "Bénin",
  "Togo",
  "RDC",
  "Liban",
  "Autre",
] as const;

export const NCLC_LEVELS = [
  "NCLC 7 (Seuil Express)",
  "NCLC 8 (Sécurisé)",
  "NCLC 9 (Maximum CRS)",
  "NCLC 10 (Bilinguisme)",
  "NCLC 6",
] as const;

interface TestimonialData {
  id?: string;
  candidateName: string;
  country: string;
  targetScore: string;
  achievedNclc: string;
  crsPointsGained: number;
  quote: string;
  avatar?: string | null;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

interface TestimonialFormProps {
  action: (formData: FormData) => Promise<void>;
  testimonial?: TestimonialData;
  submitLabel?: string;
}

export function TestimonialForm({
  action,
  testimonial,
  submitLabel = "Enregistrer le Témoignage",
}: TestimonialFormProps) {
  const [candidateName, setCandidateName] = useState(
    testimonial?.candidateName || ""
  );
  const [country, setCountry] = useState(testimonial?.country || "Cameroun");
  const [targetScore, setTargetScore] = useState(
    testimonial?.targetScore || "NCLC 7"
  );
  const [achievedNclc, setAchievedNclc] = useState(
    testimonial?.achievedNclc || "NCLC 8"
  );
  const [crsPointsGained, setCrsPointsGained] = useState(
    testimonial?.crsPointsGained ?? 50
  );
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [avatar, setAvatar] = useState(testimonial?.avatar || "");
  const [quote] = useState(
    testimonial?.quote ||
      "Grâce à Super4C2, j'ai décroché mon NCLC 8 en seulement 4 semaines d'entraînement intensif CBT. Les simulations d'Expression Écrite et les corrigés types m'ont débloqué +50 points CRS décisifs pour mon tirage Entrée Express !"
  );
  const [isFeatured, setIsFeatured] = useState(testimonial?.isFeatured ?? true);
  const [isActive, setIsActive] = useState(testimonial?.isActive ?? true);
  const [order, setOrder] = useState(testimonial?.order ?? 0);

  const getInitials = (name: string) => {
    if (!name) return "CA";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <Link
            href="/admin/temoignages"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux Témoignages
          </Link>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquareQuote className="h-6 w-6 text-primary" />
            {testimonial ? "Modifier le Témoignage" : "Nouveau Témoignage Candidat"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Mettez en valeur les réussites NCLC 7+ et les points CRS débloqués pour inspirer de futurs candidats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Formulaire Admin (7 cols) */}
        <div className="lg:col-span-7">
          <form action={action} className="space-y-6">
            {testimonial?.id && (
              <input type="hidden" name="id" value={testimonial.id} />
            )}
            <input type="hidden" name="country" value={country} />
            <input type="hidden" name="targetScore" value={targetScore} />
            <input type="hidden" name="achievedNclc" value={achievedNclc} />
            <input type="hidden" name="rating" value={rating} />
            <input
              type="hidden"
              name="isFeatured"
              value={isFeatured ? "true" : "false"}
            />
            <input
              type="hidden"
              name="isActive"
              value={isActive ? "true" : "false"}
            />

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <h2 className="text-base font-semibold flex items-center gap-2 border-b pb-3">
                <User className="h-4 w-4 text-primary" />
                Profil du Candidat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nom & Prénom <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="candidateName"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Ex: Christian M. ou Aminata D."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pays de résidence / Origine
                  </label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner le pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {TESTIMONIAL_COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" />
                  URL de l&apos;Avatar / Photo (Optionnel)
                </label>
                <Input
                  name="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/... ou laisser vide pour initiales"
                />
              </div>
            </div>

            {/* Score & NCLC */}
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <h2 className="text-base font-semibold flex items-center gap-2 border-b pb-3">
                <Award className="h-4 w-4 text-primary" />
                Performances & Points Entrée Express
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Score Visé
                  </label>
                  <Input
                    name="targetScore"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    placeholder="Ex: NCLC 7"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Niveau Décroché <span className="text-destructive">*</span>
                  </label>
                  <Select value={achievedNclc} onValueChange={setAchievedNclc}>
                    <SelectTrigger className="w-full font-semibold text-emerald-600 dark:text-emerald-400">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {NCLC_LEVELS.map((lvl) => (
                        <SelectItem key={lvl} value={lvl.split(" ")[0]}>
                          {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    Points CRS Gagnés
                  </label>
                  <Input
                    type="number"
                    name="crsPointsGained"
                    value={crsPointsGained}
                    onChange={(e) =>
                      setCrsPointsGained(parseInt(e.target.value, 10) || 0)
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Note / Étoiles (1 à 5)
                  </label>
                  <Select
                    value={String(rating)}
                    onValueChange={(val) => setRating(parseInt(val, 10))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Étoiles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 5 / 5 (Excellente recommandation)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 4 / 5 (Très satisfait)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 3 / 5 (Satisfait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ordre d&apos;affichage
                  </label>
                  <Input
                    type="number"
                    name="order"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Markdown Témoignage */}
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-primary" />
                  Citation & Témoignage Candidat (Markdown)
                </h2>
                <span className="text-xs text-muted-foreground">
                  Supporte le gras, l&apos;italique, et les citations
                </span>
              </div>

              <MarkdownField
                id="quote"
                name="quote"
                label="Texte du Témoignage"
                description="Mentionnez le score obtenu, le temps d'entraînement, et le sentiment de confiance le jour de l'examen."
                defaultValue={quote}
                rows={5}
                required
                placeholder="Rédigez ou collez le retour d'expérience du candidat..."
              />
            </div>

            {/* Statuts & Visibilité */}
            <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium">Actif & Visible</span>
                  <p className="text-xs text-muted-foreground">
                    Affiché dans les sections publiques et landing page
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium">⭐ Coup de cœur / À la une</span>
                  <p className="text-xs text-muted-foreground">
                    Prioritaire dans le carrousel principal
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Link href="/admin/temoignages">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" className="gap-2 font-semibold">
                <Save className="h-4 w-4" />
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>

        {/* Colonne Live Preview Landing Page (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Aperçu Carte Témoignage Public
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Live Rendering
            </span>
          </div>

          <div className="rounded-2xl border bg-gradient-to-b from-card to-card/60 p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden space-y-5">
            {/* Top row: stars + CRS badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              {crsPointsGained > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-3 w-3" />
                  +{crsPointsGained} pts CRS
                </div>
              )}
            </div>

            {/* Quote with rich markdown / styling */}
            <div className="relative">
              <MessageSquareQuote className="h-8 w-8 text-primary/15 absolute -top-3 -left-2 -z-0" />
              <blockquote className="relative z-10 text-sm leading-relaxed text-foreground/90 italic pl-3 border-l-2 border-primary/30">
                &ldquo;{quote || "Votre citation apparaîtra ici..."}&rdquo;
              </blockquote>
            </div>

            {/* Candidate footer */}
            <div className="flex items-center gap-3 pt-3 border-t">
              {avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatar}
                  alt={candidateName}
                  className="h-11 w-11 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                  {getInitials(candidateName)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm truncate">
                    {candidateName || "Nom du Candidat"}
                  </h4>
                  {isFeatured && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                      ★ Vedette
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {country}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-primary">
                    {achievedNclc}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/40 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground">💡 Conseil Rédaction Témoignage :</p>
            <p>
              Les candidats à l&apos;immigration canadienne cherchent la réassurance. Mettez en avant le temps de préparation (ex: 3 semaines) et le soulagement d&apos;avoir validé le seuil NCLC 7 du premier coup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
