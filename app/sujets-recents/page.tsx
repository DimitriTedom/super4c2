"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  BookMarked,
  Lightbulb,
  CheckCircle2,
  Lock,
  Unlock,
  Download,
  MessageSquare,
  FileText,
  Mic,
  PenTool,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SujetLeadDialog } from "@/components/sujets/sujet-lead-dialog";
import { SujetBehavioralSlideIn } from "@/components/sujets/sujet-behavioral-slidein";

interface ExamTopic {
  id: string;
  discipline: "EE" | "EO";
  taskNumber: 1 | 2 | 3;
  taskLabel: string;
  title: string;
  sessionDate: string;
  testCenter: string;
  prompt: string;
  c1Vocabulary: string[];
  recommendedArguments: string[];
  mentorAdvice: string;
  modelAnswerC2: string;
  isDemoFree?: boolean; // 2 sujets libres pour donner envie, les autres verrouillés
  targetHref: string;
}

const RECENT_TOPICS: ExamTopic[] = [
  {
    id: "topic-ee-3-01",
    discipline: "EE",
    taskNumber: 3,
    taskLabel: "Expression Écrite — Tâche 3 (Essai Débat)",
    title: "L'interdiction des écrans et téléphones portables dans les établissements scolaires",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Paris & Alger",
    prompt:
      "Faut-il bannir totalement les téléphones intelligents et tablettes de l'école primaire au lycée ? Rédigez un texte argumenté (120 à 180 mots) en présentant les arguments pour et contre avant de formuler une position nuancée.",
    c1Vocabulary: [
      "Inféodé aux technologies",
      "Facteur d'aliénation cognitive",
      "Vecteur pédagogique incontournable",
      "Ériger un cadre coercitif",
      "Nonobstant ces réticences",
    ],
    recommendedArguments: [
      "Pour : Préservation de l'attention, réduction du cyberharcèlement et recul de la sédentarité.",
      "Contre : Éducation numérique indispensable, usage des manuels interactifs et préparation au monde professionnel.",
    ],
    mentorAdvice:
      "En Tâche 3, ne prenez jamais une posture binaire sans nuance. Consacrez 45 mots à la thèse, 45 mots à l'antithèse, et concluez par une synthèse équilibrée (ex : régulation pédagogique plutôt qu'interdiction aveugle).",
    modelAnswerC2:
      "L'omniprésence des outils numériques en milieu éducatif suscite de vives controverses. D'aucuns préconisent une proscription absolue, arguée par la nécessité d'endiguer la dispersion cognitive et de prémunir les élèves contre les dérives du cyberharcèlement. En effet, la sanctuarisation de la salle de classe favorise une concentration accrue et revitalise les interactions interpersonnelles directes. Néanmoins, bannir unilatéralement ces terminaux paraît anachronique : intégrés judicieusement, ils constituent d'inestimables leviers pédagogiques et préparent les apprenants aux exigences d'un marché du travail résolument informatisé. Dès lors, plutôt que d'ériger une interdiction coercitive vouée à l'échec, il convient d'instaurer une éducation rigoureuse aux médias, alliant temps de déconnexion obligatoire et apprentissage critique des technologies.",
    isDemoFree: true,
    targetHref: "/examens/demo-101-ee/intro",
  },
  {
    id: "topic-ee-3-02",
    discipline: "EE",
    taskNumber: 3,
    taskLabel: "Expression Écrite — Tâche 3 (Essai Débat)",
    title: "Le télétravail obligatoire : solution écologique ou menace pour la cohésion sociale ?",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Beyrouth & Yaoundé",
    prompt:
      "Face aux enjeux climatiques, certains gouvernements envisagent d'imposer deux à trois jours de télétravail obligatoire par semaine pour les postes éligibles. Partagez-vous cette mesure coercitive ? Rédigez un texte argumenté (120 à 180 mots).",
    c1Vocabulary: [
      "Frugalité énergétique",
      "Dilution du sentiment d'appartenance",
      "Iniquité statutaire flagrante",
      "Décongestionner les artères urbaines",
      "Paradigme organisationnel vertueux",
    ],
    recommendedArguments: [
      "Pour : Réduction drastique des émissions de carbone liées aux transports domicile-travail et meilleure conciliation vie pro/perso.",
      "Contre : Isolement des salariés, rupture du lien social et sentiment d'injustice pour les travailleurs de première ligne (santé, logistique).",
    ],
    mentorAdvice:
      "Ce sujet teste votre capacité à mobiliser le lexique du monde du travail et de l'environnement. Utilisez impérativement des connecteurs d'opposition formels (Certes, force est de constater, pour autant).",
    modelAnswerC2:
      "L'instauration d'un télétravail obligatoire au service de l'urgence climatique divise profondément l'opinion publique. Certes, restreindre les déplacements pendulaires permet de décongestionner les métropoles et d'atténuer significativement l'empreinte carbone collective. De surcroît, nombre d'employés y trouvent un équilibre accru entre engagements professionnels et obligations familiales. Pour autant, systématiser cette contrainte soulève de légitimes réserves : elle engendre une iniquité manifeste vis-à-vis des travailleurs manuels non éligibles et précipite l'isolement psychologique de certains collaborateurs en érodant la culture d'entreprise. En somme, une flexibilité concertée au sein de chaque branche professionnelle s'avère infiniment plus vertueuse qu'un diktat étatique uniforme.",
    isDemoFree: false,
    targetHref: "/examens/demo-101-ee/intro",
  },
  {
    id: "topic-ee-2-01",
    discipline: "EE",
    taskNumber: 2,
    taskLabel: "Expression Écrite — Tâche 2 (Récit / Article)",
    title: "Le bénévolat ou l'engagement associatif qui a transformé votre vision du monde",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Montréal & Dakar",
    prompt:
      "Dans le cadre d'un journal municipal ou d'un blog de quartier, racontez une expérience de volontariat ou d'entraide communautaire à laquelle vous avez pris part. Décrivez vos motivations initiales, les difficultés surmontées et l'impact émotionnel ressenti (120 à 150 mots).",
    c1Vocabulary: [
      "Dénouement providentiel",
      "Altruisme désintéressé",
      "Tisser des liens pérennes",
      "Une prise de conscience salutaire",
      "S'investir sans compter",
    ],
    recommendedArguments: [
      "Mettre en scène un moment d'hésitation initial suivi d'une immersion enrichissante.",
      "Employer les temps du récit variés : imparfait (décor), passé composé (actions) et subjonctif.",
    ],
    mentorAdvice:
      "La Tâche 2 est un récit d'expérience : soignez la tonalité chaleureuse, employez des adjectifs évocateurs et montrez une évolution psychologique claire entre le début et la fin de l'anecdote.",
    modelAnswerC2:
      "C'est avec une certaine appréhension que j'ai franchi, l'hiver dernier, les portes de la banque alimentaire de mon quartier. Désireux de me rendre utile, j'ignorais à quel point cette immersion allait bousculer mes certitudes. Confronté à la détresse de familles fragilisées par la hausse du coût de la vie, j'ai d'abord ressenti une profonde impuissance. Pourtant, au fil des permanences, la chaleur des sourires échangés et la solidarité exemplaire des bénévoles ont dissipé mes craintes. Distribuer ces colis représentait bien plus qu'une aide matérielle : c'était un acte de considération mutuelle. Cette aventure humaine m'a fait comprendre que l'altruisme n'est pas un sacrifice, mais un formidable catalyseur d'épanouissement personnel et de résilience collective.",
    isDemoFree: true,
    targetHref: "/examens/demo-101-ee/intro",
  },
  {
    id: "topic-ee-1-01",
    discipline: "EE",
    taskNumber: 1,
    taskLabel: "Expression Écrite — Tâche 1 (Message Informatif)",
    title: "Organisation d'une collecte solidaire et invitation à la fête des voisins",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Douala & Casablanca",
    prompt:
      "Vous organisez une collecte de vêtements d'hiver et une fête des voisins dans votre immeuble. Rédigez un message court et courtois destiné aux résidents sur le panneau d'affichage (60 à 120 mots maximum). Précisez la date, les modalités et incitez-les à participer.",
    c1Vocabulary: [
      "Convivialité partagée",
      "Élan de générosité",
      "Se rassembler autour d'un buffet participatif",
      "Restant à votre entière disposition",
    ],
    recommendedArguments: [
      "Clarté des informations pratiques : date, heure, lieu précis de collecte.",
      "Formule de politesse soignée et dynamique invitant au partage.",
    ],
    mentorAdvice:
      "En Tâche 1, le barème FEI pénalise lourdement le hors-sujet ou le dépassement de mots. Soyez concis, percutant et élégant (60 à 100 mots suffisent amplement).",
    modelAnswerC2:
      "Chers voisins, Dans le cadre de notre engagement citoyen, nous organisons ce samedi 15 novembre une grande collecte de vêtements chauds au profit d'un foyer local. Nous vous invitons à déposer vos dons dans le hall d'entrée dès 10 heures. Pour célébrer cet élan solidaire, nous aurons le grand plaisir de nous réunir autour d'un buffet participatif à compter de 18 heures dans la cour intérieure. Chacun est convié à apporter une boisson ou une spécialité culinaire à partager. Venez nombreux échanger et renforcer les liens de notre copropriété !",
    isDemoFree: false,
    targetHref: "/examens/demo-101-ee/intro",
  },
  {
    id: "topic-eo-2-01",
    discipline: "EO",
    taskNumber: 2,
    taskLabel: "Expression Orale — Tâche 2 (Jeu de Rôle Interactif)",
    title: "Convaincre un ami d'adopter le covoiturage pour ses trajets quotidiens",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Douala & Beyrouth",
    prompt:
      "Vous avez lu une annonce proposant un système de covoiturage d'entreprise avantageux. Votre collègue (l'examinateur) préfère sa voiture individuelle par habitude. Vous essayez de le convaincre de tester la formule pendant un mois (environ 3 min 30 s).",
    c1Vocabulary: [
      "Amortir les coûts d'entretien",
      "Une démarche éco-responsable",
      "Bénéfice collatéral indéniable",
      "Alléger la charge mentale des embouteillages",
      "Essai à blanc sans engagement",
    ],
    recommendedArguments: [
      "Réfuter l'argument du manque de liberté en proposant un essai sans engagement d'une semaine.",
      "Souligner l'économie financière concrète sur le carburant et le stationnement.",
    ],
    mentorAdvice:
      "En Tâche 2 orale, l'examinateur jouera délibérément l'opposant sceptique. Ne baissez jamais les bras ! Relancez avec des questions ouvertes : 'Pourquoi ne pas tester juste deux jours pour voir ?'",
    modelAnswerC2:
      "« Écoute Laurent, je comprends parfaitement ton attachement au confort de ta propre voiture. Cependant, regarde les chiffres : avec le prix actuel des carburants et les péages urbains, tu consacres près de 300 dollars par mois à ces allers-retours solitaires. En partageant le trajet avec notre collègue Sophie, non seulement nous réduisons ces frais de moitié, mais nous pouvons aussi emprunter les voies réservées aux covoitureurs, ce qui nous épargne vingt minutes de bouchons chaque matin. Pourquoi refuser avant même d'avoir essayé ? Accordons-nous une période test d'une semaine : si cela ne te convient pas, nous reprendrons nos habitudes habituelles ! »",
    isDemoFree: false,
    targetHref: "/examens/demo-101-eo/intro",
  },
  {
    id: "topic-eo-3-01",
    discipline: "EO",
    taskNumber: 3,
    taskLabel: "Expression Orale — Tâche 3 (Monologue Argumenté)",
    title: "La semaine de travail de 4 jours : utopie sociale ou impératif économique ?",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Tunis & Yaoundé",
    prompt:
      "L'examinateur vous pose la question suivante : 'Pensez-vous que la réduction du temps de travail à 4 jours hebdomadaires améliore réellement la productivité et le bien-être des salariés ?' Vous devez exposer votre point de vue de manière structurée et continue pendant 4 minutes 30.",
    c1Vocabulary: [
      "Conciliation vie professionnelle / vie privée",
      "Gain substantiel d'efficience",
      "Gouffre financier pour les PME",
      "Repenser le paradigme salarial",
      "Gage d'attractivité des talents",
    ],
    recommendedArguments: [
      "Partie 1 : Baisse du surmenage (burnout) et regain de motivation.",
      "Partie 2 : Limites logistiques dans les secteurs de la santé ou du service continu.",
      "Conclusion : Nécessité d'une modulation par branche d'activité.",
    ],
    mentorAdvice:
      "Structurez votre discours avec un plan ternaire limpide : Introduction avec annonce du plan, Débat contradictoire étayé d'exemples économiques, et Conclusion synthétique ouverte.",
    modelAnswerC2:
      "« Monsieur l'examinateur, la transition vers une semaine de travail condensée sur quatre jours constitue un débat sociétal majeur. Selon moi, loin d'être une simple lubie idéaliste, cette réforme répond à une nécessité économique et sanitaire contemporaine. D'une part, les multiples expérimentations menées au Royaume-Uni et au Canada démontrent un recul spectaculaire du surmenage et une baisse de 65 % des congés maladie, sans la moindre perte de rendement. Néanmoins, il serait chimérique d'appliquer cette mesure de façon uniforme à des secteurs fonctionnant en flux continu, tels que les soins hospitaliers ou la sécurité publique, sous peine de pénurie de personnel. En conclusion, cette évolution doit être encouragée par des incitations fiscales ciblées, tout en préservant la flexibilité propre à chaque filière industrielle. »",
    isDemoFree: false,
    targetHref: "/examens/demo-101-eo/intro",
  },
  {
    id: "topic-eo-2-02",
    discipline: "EO",
    taskNumber: 2,
    taskLabel: "Expression Orale — Tâche 2 (Jeu de Rôle Interactif)",
    title: "Convaincre un propriétaire réticent de vous louer un logement sans garant local",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Montréal & Paris",
    prompt:
      "Vous venez d'immigrer au Canada. Vous visitez un appartement idéal, mais le propriétaire hésite car vous n'avez pas encore d'historique de crédit canadien. Tentez de le rassurer et de le convaincre de signer le bail avec vous (environ 3 min 30 s).",
    c1Vocabulary: [
      "Gages de solvabilité irréprochables",
      "Lettre d'embauche permanente",
      "Avancer un dépôt de garantie",
      "Disposer d'une caution bancaire bloquée",
      "Établir une relation de confiance pérenne",
    ],
    recommendedArguments: [
      "Mettre en avant un contrat de travail à durée indéterminée avec salaire stable.",
      "Proposer le versement anticipé de deux mois de loyer ou une caution bancaire.",
      "Souligner votre profil soigné et respectueux du bien immobilier.",
    ],
    mentorAdvice:
      "Ce sujet est extrêmement fréquent au TCF Canada car il reflète la réalité de l'immigration. Restez courtois, professionnel et très concret sur vos garanties financières.",
    modelAnswerC2:
      "« Bonjour Monsieur, je comprends tout à fait votre prudence concernant l'absence d'historique de crédit canadien, c'est une réaction légitime pour protéger votre patrimoine. Permettez-moi toutefois de vous apporter des garanties tangibles : voici ma confirmation officielle de résidence permanente ainsi que mon contrat de travail à temps plein chez CGI avec une rémunération annuelle de 75 000 dollars. Pour vous prouver ma bonne foi, je suis tout à fait disposé à vous verser d'emblée deux mois de loyer d'avance et à vous fournir l'attestation de mon employeur certifiant la fin de ma période d'essai. Vous aurez en moi un locataire exemplaire, calme et ponctuel. Pouvons-nous finaliser l'entente aujourd'hui ? »",
    isDemoFree: false,
    targetHref: "/examens/demo-101-eo/intro",
  },
  {
    id: "topic-eo-3-02",
    discipline: "EO",
    taskNumber: 3,
    taskLabel: "Expression Orale — Tâche 3 (Monologue Argumenté)",
    title: "L'intelligence artificielle menace-t-elle l'esprit critique de la jeunesse ?",
    sessionDate: "Session Récente 2026",
    testCenter: "Centre Agréé Dakar & Alger",
    prompt:
      "Face à la prolifération des assistants d'IA générative dans les devoirs et la rédaction, certains éducateurs s'inquiètent d'un nivellement par le bas de la réflexion des élèves. Quel est votre avis sur cette question ? Exposez vos arguments pendant 4 min 30 s.",
    c1Vocabulary: [
      "Atrophie du raisonnement logique",
      "Béquille intellectuelle fallacieuse",
      "Puissant émulateur de créativité",
      "Discernement épistémologique",
      "Former des esprits éclairés",
    ],
    recommendedArguments: [
      "Risque : Paresse intellectuelle et confiance aveugle dans des synthèses parfois erronées.",
      "Opportunité : Accélération de la recherche documentaire et apprentissage du prompt critique.",
      "Synthèse : L'école doit réinventer ses critères d'évaluation en valorisant l'argumentation orale et l'analyse critique.",
    ],
    mentorAdvice:
      "Le thème de l'IA est le sujet roi de 2026. Montrez que vous maîtrisez la nuance : l'outil n'est ni un démon ni un miracle, tout dépend de l'éducation reçue pour s'en servir.",
    modelAnswerC2:
      "« L'émergence fulgurante des intelligences artificielles génératives interpelle au premier chef le monde éducatif. D'un côté, la tentation de la facilité guette : déléguer la rédaction de dissertations ou la résolution de problèmes complexes risque d'engendrer une atrophie progressive de l'effort analytique. Pour autant, diaboliser cette technologie serait une faute stratégique. L'IA se révèle être un formidable sparring-partner intellectuel capable de vulgariser des concepts obscurs et de stimuler l'imagination. La véritable urgence ne réside donc pas dans la prohibition, mais dans la métamorphose de notre enseignement : réhabiliter la confrontation orale, tester la véracité des faits générés et inculquer aux jeunes générations un doute méthodique salvateur. »",
    isDemoFree: false,
    targetHref: "/examens/demo-101-eo/intro",
  },
];

export default function SujetsRecentsPage() {
  const [filter, setFilter] = useState<"ALL" | "EE" | "EO">("ALL");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [selectedTopicForDialog, setSelectedTopicForDialog] = useState<ExamTopic | null>(null);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState<boolean>(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const vip = localStorage.getItem("super4c2:vip_topics_unlocked") === "true";
      if (vip) setIsUnlocked(true);
    } catch {}
  }, []);

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = RECENT_TOPICS.filter((t) => {
    if (filter === "ALL") return true;
    if (filter === "EE") return t.discipline === "EE";
    if (filter === "EO") return t.discipline === "EO";
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-4">
      {/* 🧭 EN-TÊTE PRINCIPAL AVEC BADGES OFFICIELS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1.5 border border-primary/20">
              <BookMarked className="h-3.5 w-3.5" /> Veille Continue des Centres Agréés FEI 2026
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" /> Mis à jour ce mois-ci
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Banque des Sujets Récents d&apos;Expression
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Consultez les véritables thèmes rapportés par les candidats lors des sessions officielles du TCF Canada (Paris, Montréal, Alger, Douala, Dakar, Tunis). Chaque sujet inclut son analyse d&apos;examinateur, son lexique C1/C2 et son modèle de rédaction intégral.
          </p>
        </div>

        <div className="shrink-0 hidden sm:flex items-center justify-center p-2 rounded-3xl bg-primary/5 border border-primary/20 shadow-sm">
          <Image
            src="/brand/icons-3d/radar-recent-topics.png"
            alt="Veille Sujets Récents 3D"
            width={90}
            height={90}
            className="h-20 w-20 object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* 📥 BANDEAU LEAD MAGNET MAJEUR : PACK PDF 50 SUJETS RÉCENTS */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-500/15 via-card to-primary/10 p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                🎁 Recueil Gratuit PDF
              </Badge>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Édition Officielle 2026
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
              Le Recueil des 50 Sujets Réels du TCF Canada avec Modèles C1/C2
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Téléchargez le guide complet regroupant les 50 sujets récents les plus fréquents en Expression Écrite et Orale, annotés avec leurs connecteurs formels et corrigés types par nos mentors FEI.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setIsPdfDialogOpen(true)}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm h-12 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger le Pack PDF</span>
          </Button>
        </div>
      </div>

      {/* 🔍 FILTRES & STATUT VIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b pb-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "ALL", label: `Tous les Sujets (${RECENT_TOPICS.length})` },
              { key: "EE", label: "Expression Écrite" },
              { key: "EO", label: "Expression Orale" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer",
                filter === f.key
                  ? "bg-primary text-white shadow-xs"
                  : "border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isUnlocked ? (
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold gap-1 shadow-2xs py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Accès VIP Débloqué (Tous les Corrigés C1/C2 Accessibles)</span>
            </Badge>
          ) : (
            <button
              type="button"
              onClick={() => setIsPdfDialogOpen(true)}
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-xs"
            >
              <Lock className="h-3 w-3 text-amber-500" />
              <span>Vous consultez la version découverte • Débloquer l&apos;accès VIP</span>
            </button>
          )}
        </div>
      </div>

      {/* 📚 LISTE DES SUJETS RÉCENTS */}
      <div className="space-y-8">
        {filtered.map((topic) => {
          const isItemLocked = !isUnlocked && !topic.isDemoFree;
          const isExpanded = !!expandedTopics[topic.id];

          return (
            <div
              key={topic.id}
              className={cn(
                "rounded-3xl border bg-card p-6 sm:p-8 shadow-xs transition-all space-y-6 relative overflow-hidden",
                isItemLocked
                  ? "border-border/80 hover:border-primary/30"
                  : "border-primary/20 hover:border-primary/50 shadow-sm"
              )}
            >
              {/* Entête du sujet : Badge discipline, Date, Centre */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-lg px-2.5 py-1 font-black text-[11px] flex items-center gap-1.5 border shadow-2xs",
                      topic.discipline === "EE"
                        ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
                    )}
                  >
                    {topic.discipline === "EE" ? (
                      <PenTool className="h-3 w-3" />
                    ) : (
                      <Mic className="h-3 w-3" />
                    )}
                    {topic.taskLabel}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground font-mono text-[11px]">
                    <Calendar className="h-3.5 w-3.5" /> {topic.sessionDate}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-muted-foreground font-medium text-xs">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {topic.testCenter}
                  </span>
                  {topic.isDemoFree && (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 font-bold text-[10px]">
                      Exemple Libre
                    </Badge>
                  )}
                </div>
              </div>

              {/* Titre et Consigne Officielle */}
              <div className="space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                  {topic.title}
                </h3>
                <div className="rounded-2xl border bg-muted/40 p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-serif">
                  « {topic.prompt} »
                </div>
              </div>

              {/* Conseil Stratégique du Mentor M. Laurent */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1.5 text-xs">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Conseil Méthodologique du Mentor M. Laurent :</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {topic.mentorAdvice}
                </p>
              </div>

              {/* Boîte à Outils Lexicale & Pistes d'Argumentation */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BookMarked className="h-3.5 w-3.5 text-primary" /> Lexique &amp; Tournures C1/C2
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {topic.c1Vocabulary.map((vocab, vIdx) => (
                      <li key={vIdx} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <strong className="text-foreground font-medium">{vocab}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Pistes d&apos;Argumentation NCLC 7+
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {topic.recommendedArguments.map((arg, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 🌟 ZONE CORRIGÉ TYPE C1/C2 INTÉGRAL (GATED OU LIBRE) */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-display text-sm font-bold text-foreground">
                      Modèle de Rédaction Intégral C1/C2 Élite
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Norme FEI &amp; Magic Rewrite
                  </span>
                </div>

                {isItemLocked ? (
                  // Aperçu flouté avec appel à débloquer via WhatsApp / Email
                  <div className="relative overflow-hidden rounded-xl border border-border/60 p-4 bg-muted/30">
                    <p className="text-xs text-foreground/50 filter blur-[4px] select-none leading-relaxed line-clamp-3">
                      {topic.modelAnswerC2}
                    </p>

                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600">
                        <Lock className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-foreground max-w-sm">
                        Le modèle C1/C2 intégral et les tournures de style de ce sujet sont réservés aux membres du Cercle Candidat.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setSelectedTopicForDialog(topic)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-9 rounded-xl shadow-md gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Débloquer le Corrigé C1/C2 (Gratuit sur WhatsApp)</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modèle C1/C2 Débloqué et Visible
                  <div className="space-y-3">
                    <div className="rounded-xl border border-emerald-500/20 bg-background/80 p-4 text-xs sm:text-sm text-foreground leading-relaxed font-serif shadow-inner">
                      {isExpanded ? (
                        topic.modelAnswerC2
                      ) : (
                        <>
                          {topic.modelAnswerC2.slice(0, 220)}...
                        </>
                      )}
                    </div>
                    {topic.modelAnswerC2.length > 220 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(topic.id)}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" />
                            <span>Réduire le corrigé</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            <span>Lire le corrigé C1/C2 intégral</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pied de Carte : Accès direct au Simulateur d'Examen */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  Pratiquez ce sujet en conditions réelles sous chronomètre officiel dans nos simulateurs CBT.
                </p>

                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-10 w-full sm:w-auto rounded-xl shadow-md">
                  <Link href={topic.targetHref}>
                    <span>S&apos;entraîner sur ce sujet en mode CBT</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 💬 MODALE DE CAPTURE DE LEAD (POUR UN SUJET SPÉCIFIQUE) */}
      <SujetLeadDialog
        open={!!selectedTopicForDialog}
        onOpenChange={(open) => {
          if (!open) setSelectedTopicForDialog(null);
        }}
        topicTitle={selectedTopicForDialog?.title}
        onSuccess={handleUnlockSuccess}
      />

      {/* 📥 MODALE DE CAPTURE DE LEAD (POUR LE PACK PDF 50 SUJETS) */}
      <SujetLeadDialog
        open={isPdfDialogOpen}
        onOpenChange={setIsPdfDialogOpen}
        isPdfPack={true}
        onSuccess={handleUnlockSuccess}
      />

      {/* 🚀 DÉCLENCHEUR COMPORTEMENTAL DISCRET SUR VISITES RÉCURRENTES */}
      <SujetBehavioralSlideIn
        isUnlocked={isUnlocked}
        onOpenLeadDialog={() => setIsPdfDialogOpen(true)}
      />
    </div>
  );
}
