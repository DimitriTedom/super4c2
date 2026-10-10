import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, CheckCircle2, Lock, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageCookiesButton } from "@/components/legal/manage-cookies-button";

export const metadata = {
  title: "Politique Relative aux Cookies & Traceurs — Super4C2",
  description:
    "Transparence totale sur l'utilisation des cookies et traceurs sur Super4C2. Conformité RGPD, ePrivacy et Loi 25 (Québec).",
};

export default function CookiesPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8 px-4 sm:px-6">
      {/* En-tête */}
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l&apos;accueil
          </Link>
        </Button>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson flex items-center gap-1.5">
          <Cookie className="h-4 w-4" /> Protection des Candidats &amp; Traçabilité
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          Politique Relative aux Cookies &amp; Traceurs
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Super4C2 applique une politique de stricte minimisation des données : zéro cookie publicitaire tiers, zéro revente de données personnelles.
        </p>

        <div className="pt-2">
          <ManageCookiesButton />
        </div>
      </div>

      {/* Contenu textuel structuré */}
      <div className="space-y-8 text-sm text-foreground/90 leading-relaxed rounded-3xl border bg-card p-6 sm:p-10 shadow-sm">
        {/* Section 1 : Qu'est-ce qu'un cookie ? */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <span>1. Qu&apos;est-ce qu&apos;un cookie et pourquoi l&apos;utilisons-nous ?</span>
          </h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d&apos;une plateforme web. Chez <strong>Super4C2</strong>, les cookies et le stockage local (<code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">localStorage</code>) sont exclusivement employés pour assurer le bon fonctionnement technique de vos simulations d&apos;examen CBT, la conservation de votre session connectée et l&apos;ancrage mémoriel de vos révisions.
          </p>
        </section>

        {/* Section 2 : Tableau des cookies utilisés */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            2. Tableau d&apos;inventaire des traceurs sur Super4C2
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/60 text-foreground font-semibold">
                  <th className="p-3">Nom du traceur</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Finalité</th>
                  <th className="p-3">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-mono text-foreground font-semibold">sb-*-auth-token</td>
                  <td className="p-3">Cookie essentiel</td>
                  <td className="p-3">Maintien de votre session sécurisée candidat via Supabase Auth.</td>
                  <td className="p-3">Session / 7 jours</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-mono text-foreground font-semibold">super4c2_cookie_consent_v1</td>
                  <td className="p-3">Stockage local</td>
                  <td className="p-3">Mémorisation de vos préférences de consentement aux cookies.</td>
                  <td className="p-3">6 mois</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-mono text-foreground font-semibold">super4c2:srs_cards</td>
                  <td className="p-3">Stockage fonctionnel</td>
                  <td className="p-3">Coffre de mémorisation du Carnet d&apos;Erreurs SRS SuperMemo-2 (révisions J+1, J+3, J+7).</td>
                  <td className="p-3">Persistant</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-mono text-foreground font-semibold">super4c2-cbt-audio-speed</td>
                  <td className="p-3">Stockage fonctionnel</td>
                  <td className="p-3">Mémorisation de la vitesse de lecture audio préférée en Compréhension Orale (0.8x, 1.0x, 1.2x).</td>
                  <td className="p-3">1 an</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-mono text-foreground font-semibold">theme</td>
                  <td className="p-3">Stockage local</td>
                  <td className="p-3">Préférence d&apos;apparence visuelle (Thème Clair / Thème Sombre).</td>
                  <td className="p-3">Persistant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 : Catégorisation */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            3. Catégories de consentement
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Lock className="h-4 w-4" /> Strictement Nécessaires
              </div>
              <p className="text-xs text-muted-foreground">
                Indispensables pour naviguer sur le site, passer les examens en conditions réelles et enregistrer vos notes. Ne peuvent pas être désactivés.
              </p>
            </div>

            <div className="rounded-2xl border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <SlidersHorizontal className="h-4 w-4" /> Fonctionnels &amp; SRS
              </div>
              <p className="text-xs text-muted-foreground">
                Améliorent votre confort d&apos;apprentissage : personnalisation du lecteur audio studio, algorithme de répétition espacée et sauvegarde de vos préférences.
              </p>
            </div>

            <div className="rounded-2xl border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="h-4 w-4" /> Télémétrie &amp; IA
              </div>
              <p className="text-xs text-muted-foreground">
                Mesure anonyme du temps de calcul de la correction IA FEI et de la voix studio pour anticiper les charges serveurs et éliminer toute latence.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 : Comment modifier votre choix */}
        <section className="space-y-3 pt-4 border-t border-border/60">
          <h2 className="font-display text-xl font-bold text-foreground">
            4. Comment gérer ou retirer votre consentement ?
          </h2>
          <p>
            Conformément au RGPD européen et à la <strong>Loi 25 du Québec</strong> sur la protection des renseignements personnels, vous disposez du droit absolu de modifier ou révoquer vos consentements à tout moment, sans conséquence sur votre accès aux simulations de base.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <ManageCookiesButton />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/confidentialite">Consulter la Politique de Confidentialité →</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
