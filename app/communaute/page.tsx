import Image from "next/image";
import {
  Users,
  MessageCircle,
  Send,
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export const metadata = {
  title: "Communauté & Groupes d'Entraide VIP TCF & TEF Canada — Super4C2",
  description:
    "Rejoignez les groupes Telegram et WhatsApp officiels Super4C2 pour échanger sur les sujets récents tombés en centre d'examen et vous entraîner avec d'autres candidats.",
};

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.22.25-.86.84-.86 2.06 0 1.21.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

export default function CommunautePage() {
  const groups = [
    {
      title: "Canal Telegram VIP — Alertes Sujets 2026",
      desc: "Diffusion en temps réel des sujets récents d'Expression Écrite et Orale rapportés par les candidats sortant des centres d'examen dans le monde entier (Paris, Alger, Dakar, Douala, Beyrouth, Montréal).",
      badge: "Indispensable Veille Examen",
      icon: TelegramIcon,
      members: "3 840+ candidats",
      color: "bg-[#229ED9]/15 text-[#229ED9] border-[#229ED9]/30",
      btnText: "Rejoindre le Canal Telegram",
      btnHref: "https://t.me/super4c2_tcf",
    },
    {
      title: "Groupe WhatsApp — Objectif NCLC 7+",
      desc: "Salon d'entraide interactif modéré par nos formateurs. Trouvez un binôme pour simuler la Tâche 2 d'Expression Orale (Jeu de rôle) et partagez vos questions de grammaire et syntaxe.",
      badge: "Entraide & Binômes",
      icon: WhatsAppIcon,
      members: "1 250+ membres actifs",
      color: "bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30",
      btnText: "Rejoindre le Groupe WhatsApp",
      btnHref: "https://chat.whatsapp.com/super4c2_nclc7",
    },
    {
      title: "Salon Feedback Centres & Retours d'Expérience",
      desc: "Échanges sur les conditions matérielles réelles de passation : qualité des casques audio en Compréhension Orale, interface CBT, attitude des jurys et conseils pratiques.",
      badge: "Retours d'Expérience",
      icon: Globe,
      members: "920+ retours d'expérience",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      btnText: "Accéder aux Retours d'Expérience",
      btnHref: "https://t.me/super4c2_centres",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-4">
      {/* 🧭 En-tête */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-center p-2 rounded-3xl bg-primary/5 border border-primary/20 shadow-sm">
          <Image
            src="/brand/icons-3d/vip-community-shield.png"
            alt="Communauté VIP 3D"
            width={84}
            height={84}
            className="h-20 w-20 object-contain drop-shadow-md"
            priority
          />
        </div>
        <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Réseau d&apos;Entraide International
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Rejoignez la Première Communauté de Candidats NCLC 7
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Ne restez pas isolé dans votre préparation. Échangez avec des candidats qui visent les mêmes +50 points CRS que vous et accédez aux sujets récents tombés cette semaine.
        </p>
      </div>

      {/* 🚀 Cartes des Groupes VIP */}
      <div className="grid gap-6 md:grid-cols-3">
        {groups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${group.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {group.members}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    {group.badge}
                  </span>
                  <h2 className="font-display text-lg font-bold text-foreground mt-1">
                    {group.title}
                  </h2>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {group.desc}
                </p>
              </div>

              <div className="pt-2 border-t">
                <Button asChild className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs h-10">
                  <a href={group.btnHref} target="_blank" rel="noopener noreferrer">
                    {group.btnText}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📜 Charte de Bienveillance */}
      <div className="rounded-3xl border bg-muted/20 p-8 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ShieldCheck className="h-5 w-5" /> Charte de la Communauté Super4C2
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
          Nos canaux sont modérés quotidiennement par l&apos;équipe pédagogique afin de garantir un environnement de travail d&apos;excellence. Toute publicité non autorisée, démarchage d&apos;agences ou attitude discourtoise entraîne l&apos;exclusion immédiate.
        </p>
        <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs font-medium text-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Entraide mutuelle et constructive</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Zéro spam et zéro sollicitation commerciale</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Partage de vrais retours d&apos;examen</span>
          </div>
        </div>
      </div>

      {/* 🎯 CTA simulateur */}
      <div className="rounded-3xl border bg-gradient-to-r from-card to-primary/5 p-8 text-center space-y-4">
        <h3 className="font-display text-2xl font-black">
          Combinez l&apos;Entraide avec le Simulateur CBT Conforme
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Les groupes communautaires vous apportent les thèmes d&apos;actualité, et Super4C2 vous offre le simulateur CBT conforme pour valider votre rythme.
        </p>
        <div className="pt-2">
          <ShimmerButton
            href="/examens"
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-7"
          >
            Accéder aux Séries d&apos;Entraînement TCF
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
}
