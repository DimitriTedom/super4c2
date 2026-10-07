import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Politique de Confidentialité & Protection des Données — Super4C2",
  description:
    "Engagement de Super4C2 sur la protection des données personnelles, la confidentialité des enregistrements et la sécurité.",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l&apos;accueil
          </Link>
        </Button>
        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Lock className="h-4 w-4" /> Protection & Vie Privée
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Politique de Confidentialité
        </h1>
        <p className="text-sm text-muted-foreground">
          Conformité RGPD et protection stricte des enregistrements des candidats.
        </p>
      </div>

      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed rounded-3xl border bg-card p-6 sm:p-8">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">1. Collecte Minimale des Données</h2>
          <p>
            Nous ne collectons que les informations strictement indispensables à votre entraînement :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Adresse e-mail (pour l&apos;accès à votre compte et la sauvegarde de vos séries).</li>
            <li>Historique de vos réponses aux simulations CBT (pour calculer votre progression NCLC et alimenter votre Carnet d&apos;Erreurs SRS).</li>
            <li>Textes rédigés et flux audio lors des épreuves d&apos;expression (exclusivement traités pour l&apos;évaluation linguistique et la génération des feedbacks pédagogiques).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">2. Aucun Partage Commercial</h2>
          <p>
            Vos données d&apos;entraînement, enregistrements vocaux et rédactions ne sont <strong>jamais vendus, ni cédés, ni partagés avec des régies publicitaires tierces</strong>. Vos progrès vous appartiennent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">3. Sécurité des Paiements</h2>
          <p>
            Toutes les transactions financières sont traitées de manière chiffrée par <strong>Stripe</strong> via le protocole TLS 1.3 avec chiffrement AES 256 bits. Super4C2 n&apos;a jamais accès à vos numéros de carte bancaire.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">4. Vos Droits & Suppression</h2>
          <p>
            Conformément aux réglementations sur la protection des données personnelles, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement complet de l&apos;ensemble de vos données d&apos;entraînement sur simple demande à <a href="mailto:contact@super4c2.com" className="text-primary underline">contact@super4c2.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
