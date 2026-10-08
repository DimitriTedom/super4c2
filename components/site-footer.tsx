import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ShieldCheck, Sparkles, Award, MapPin, Mail } from "lucide-react";
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
            <p>© {new Date().getFullYear()} Super4C2. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <Link href="/mentions-legales" className="hover:text-primary transition-colors">
                Conditions Générales
              </Link>
              <Link href="/confidentialite" className="hover:text-primary transition-colors">
                Protection des Données
              </Link>
              <a
                href="mailto:contact@super4c2.com"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Support Candidat
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
