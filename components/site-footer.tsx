import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ShieldCheck, Sparkles, Award, MapPin, Mail, Users } from "lucide-react";
import { NewsletterCard } from "@/components/newsletter-card";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/60 backdrop-blur-md text-foreground transition-colors">
      {/* Bandeau de réassurance / Confiance */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Normes FEI 2026</p>
                <p className="text-[11px] text-muted-foreground">Conditions réelles CBT</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Seuil NCLC 7 Garanti</p>
                <p className="text-[11px] text-muted-foreground">+50 points Entrée Express</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">SRS Répétition Espacée</p>
                <p className="text-[11px] text-muted-foreground">Mémorisation J+1, J+3, J+7</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Immigration Canada</p>
                <p className="text-[11px] text-muted-foreground">Conforme aux barèmes IRCC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale du footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Colonne 1 : Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <BrandLogo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              La plateforme d&apos;entraînement de référence au TCF Canada et TEF Canada.
              Simulateur CBT officiel, analyse des pièges FEI et répétition espacée pour sécuriser votre palier NCLC 7 et débloquer les +50 points bonus CRS.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 font-mono text-[11px]">
                🇨🇦 Conçu pour l&apos;Immigration Canadienne
              </span>
            </div>

            {/* Réseaux Sociaux & Communautés Officielles */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Rejoindre la Communauté &amp; Suivre nos Décryptages :</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {/* YouTube */}
                <a
                  href="https://youtube.com/@Super4C2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg border border-border/70 bg-background/80 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 text-muted-foreground flex items-center justify-center transition-all duration-200 shadow-2xs group"
                  title="Chaîne YouTube Officielle Super4C2 (Cours, Décryptages & Sujets réels)"
                  aria-label="YouTube Super4C2"
                >
                  <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/super4c2_canada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg border border-border/70 bg-background/80 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-500 text-muted-foreground flex items-center justify-center transition-all duration-200 shadow-2xs group"
                  title="Groupe Telegram Candidats TCF/TEF (Partage de sujets du jour)"
                  aria-label="Telegram Super4C2"
                >
                  <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
                  </svg>
                </a>

                {/* Communauté VIP Hub */}
                <Link
                  href="/communaute"
                  className="h-8 px-2.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center gap-1.5 transition-all duration-200 shadow-2xs group text-xs font-bold"
                  title="Accéder à la Communauté VIP des 4 C2"
                  aria-label="Communauté VIP Super4C2"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Communauté VIP</span>
                </Link>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/super4c2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg border border-border/70 bg-background/80 hover:bg-blue-600/10 hover:border-blue-600/40 hover:text-blue-600 text-muted-foreground flex items-center justify-center transition-all duration-200 shadow-2xs group"
                  title="Page LinkedIn Officielle Super4C2"
                  aria-label="LinkedIn Super4C2"
                >
                  <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com/Super4C2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg border border-border/70 bg-background/80 hover:bg-foreground/10 hover:border-foreground/40 hover:text-foreground text-muted-foreground flex items-center justify-center transition-all duration-200 shadow-2xs group"
                  title="Compte X / Twitter Super4C2"
                  aria-label="X (Twitter) Super4C2"
                >
                  <svg className="h-3.5 w-3.5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@super4c2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg border border-border/70 bg-background/80 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-500 text-muted-foreground flex items-center justify-center transition-all duration-200 shadow-2xs group"
                  title="TikTok Super4C2 (Micro-conseils TCF & Entrée Express)"
                  aria-label="TikTok Super4C2"
                >
                  <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="pt-2 max-w-sm">
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Alertes Sujets &amp; Conseils NCLC 7
              </p>
              <NewsletterCard source="footer" />
            </div>
          </div>

          {/* Colonne 2 : Simulateurs d'Examen */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Simulateurs TCF
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/examens/demo-101-ce/ce" className="transition-colors hover:text-primary">
                  Compréhension Écrite (39Q)
                </Link>
              </li>
              <li>
                <Link href="/examens/demo-101-co/co" className="transition-colors hover:text-primary">
                  Compréhension Orale (39Q)
                </Link>
              </li>
              <li>
                <Link href="/examens/demo-101-ee/intro" className="transition-colors hover:text-primary">
                  Expression Écrite (3 tâches)
                </Link>
              </li>
              <li>
                <Link href="/examens/demo-101-eo/intro" className="transition-colors hover:text-primary">
                  Expression Orale (Jeu de rôle IA)
                </Link>
              </li>
              <li>
                <Link href="/sujets-recents" className="transition-colors hover:text-primary font-semibold text-primary">
                  Sujets Récents 2026 (Veille FEI)
                </Link>
              </li>
              <li>
                <Link href="/examens" className="transition-colors hover:text-primary font-semibold text-foreground">
                  Toutes les Séries TCF →
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Outils Pédagogiques */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Outils & Contenu
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/blog" className="transition-colors hover:text-primary font-semibold text-foreground">
                  Blog & Stratégies IRCC
                </Link>
              </li>
              <li>
                <Link href="/test-gratuit" className="transition-colors hover:text-primary">
                  Test Diagnostique Gratuit
                </Link>
              </li>
              <li>
                <Link href="/nclc-calculator" className="transition-colors hover:text-primary">
                  Simulateur de Points CRS (+50)
                </Link>
              </li>
              <li>
                <Link href="/carnet-erreurs" className="transition-colors hover:text-primary">
                  Carnet d&apos;Erreurs SRS
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="transition-colors hover:text-primary font-semibold text-primary">
                  Tarifs & Formules d&apos;Accès
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Compte, Communauté & Support */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Communauté & Contact
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/communaute" className="transition-colors hover:text-primary font-semibold text-primary">
                  Communauté & Groupes VIP
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-primary font-semibold text-primary">
                  Foire Aux Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Conciergerie & Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="transition-colors hover:text-primary">
                  Connexion Candidat
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition-colors hover:text-primary">
                  Mon Espace & NCLC 7
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="transition-colors hover:text-primary">
                  Mentions Légales & CGU
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="transition-colors hover:text-primary">
                  Confidentialité des Données
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition-colors hover:text-primary">
                  Cookies &amp; Traceurs
                </Link>
              </li>
              <li className="pt-2 border-t border-border/40">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 font-medium text-[11px] text-muted-foreground hover:text-brand-crimson transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson" />
                  <span>Portail Back-Office &amp; Partenaires B2B</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 border-t pt-8 space-y-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed text-center sm:text-left">
            <strong>Avis légal d&apos;indépendance :</strong> Super4C2 est un simulateur pédagogique indépendant développé pour la préparation aux tests linguistiques. TCF (Test de Connaissance du Français) est une marque déposée de France Éducation International (FEI). TEF (Test d&apos;Évaluation de Français) est une marque déposée de la Chambre de Commerce et d&apos;Industrie de Paris Île-de-France (CCI). Super4C2 n&apos;est affilié à aucun de ces organismes officiels.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              <p>© {new Date().getFullYear()} Super4C2. Tous droits réservés.</p>
              <span className="hidden sm:inline text-border">•</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Moteur CBT Opérationnel (99.9% Uptime)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-end">
              <Link href="/mentions-legales" className="hover:text-primary transition-colors text-[11px]">
                Conditions Générales
              </Link>
              <Link href="/confidentialite" className="hover:text-primary transition-colors text-[11px]">
                Protection des Données
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors text-[11px]">
                Gestion des Cookies
              </Link>
              <a
                href="mailto:contact@super4c2.com"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
              >
                <Mail className="h-3.5 w-3.5 text-brand-crimson" />
                Support Candidat
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
