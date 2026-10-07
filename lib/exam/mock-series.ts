import type { ExamSeriesData } from "./types";

export const MOCK_SERIES_CE_101: ExamSeriesData = {
  id: "demo-101",
  seriesNumber: 101,
  title: "TCF Canada — Compréhension écrite, Série 101 (démo)",
  discipline: "CE",
  durationSeconds: 60 * 60,
  questions: [
    {
      id: "q1",
      questionNumber: 1,
      nclcTargetLevel: 4,
      documentText:
        "AVIS AUX LOCATAIRES\n\nEn raison de travaux de réfection de la toiture, l'accès au local à vélos sera fermé du lundi 12 au vendredi 23 mai. Les vélos peuvent être déposés temporairement dans le garage n°2, au sous-sol. Nous vous remercions de votre compréhension.\n\nLa gérance",
      prompt: "Pourquoi le local à vélos sera-t-il fermé ?",
      options: {
        A: "Il va être agrandi.",
        B: "Le toit de l'immeuble est en réparation.",
        C: "Des vols ont eu lieu.",
        D: "Il sera transformé en garage.",
      },
      correctOption: "B",
      explanation:
        "L'avis mentionne explicitement « travaux de réfection de la toiture » : la cause est la réparation du toit.",
      trapAnalysis:
        "A et D inventent une transformation du local. C n'est jamais évoqué. Le garage n°2 n'est qu'un abri temporaire.",
    },
    {
      id: "q2",
      questionNumber: 2,
      nclcTargetLevel: 5,
      documentText:
        "Offre d'emploi — Assistant(e) administratif(ve)\n\nNous recherchons une personne organisée pour assurer l'accueil téléphonique, la gestion de l'agenda de la direction et la préparation de dossiers clients. Une première expérience de deux ans minimum est exigée. Poste à temps partiel (24 h/semaine), à pourvoir dès le 1er septembre.",
      prompt: "Quelle condition est obligatoire pour ce poste ?",
      options: {
        A: "Travailler à temps plein.",
        B: "Parler plusieurs langues.",
        C: "Avoir au moins deux ans d'expérience.",
        D: "Être disponible le week-end.",
      },
      correctOption: "C",
      explanation: "« Une première expérience de deux ans minimum est exigée » : l'expérience est requise.",
      trapAnalysis:
        "A contredit « temps partiel ». B et D ne sont pas mentionnés dans l'annonce.",
    },
    {
      id: "q3",
      questionNumber: 3,
      nclcTargetLevel: 6,
      documentText:
        "Le télétravail s'est durablement installé dans le paysage professionnel. Si 68 % des salariés l'apprécient pour le gain de temps de transport, une étude récente souligne que près d'un tiers d'entre eux déclarent se sentir isolés. Les entreprises tentent donc de trouver un équilibre en instaurant des journées de présence obligatoires.",
      prompt: "Quelle est l'idée principale du texte ?",
      options: {
        A: "Le télétravail est rejeté par la majorité des salariés.",
        B: "Le télétravail séduit mais pose un problème d'isolement.",
        C: "Les entreprises interdisent désormais le télétravail.",
        D: "Les transports sont le principal obstacle au télétravail.",
      },
      correctOption: "B",
      explanation:
        "Le texte oppose l'avantage (gain de temps, 68 %) à l'inconvénient (isolement d'un tiers) et évoque un équilibre.",
      trapAnalysis:
        "A est faux (68 % apprécient). C exagère : on parle de jours de présence, pas d'interdiction. D inverse la logique des transports.",
    },
    {
      id: "q4",
      questionNumber: 4,
      nclcTargetLevel: 7,
      documentText:
        "Bien qu'il ait annoncé sa démission à plusieurs reprises, le ministre n'a jamais franchi le pas, ce qui alimente les critiques de l'opposition. Selon un proche du dossier, il attendrait la fin de la session parlementaire pour se prononcer.",
      prompt: "Que laisse entendre l'auteur à propos du ministre ?",
      options: {
        A: "Il a déjà quitté ses fonctions.",
        B: "Il hésite à tenir sa promesse de départ.",
        C: "Il a été renvoyé par l'opposition.",
        D: "Il soutient les critiques formulées contre lui.",
      },
      correctOption: "B",
      explanation:
        "« Annoncé à plusieurs reprises » mais « jamais franchi le pas » : il tarde à concrétiser sa démission.",
      trapAnalysis:
        "A est contredit par « jamais franchi le pas ». C et D confondent les rôles de l'opposition et du ministre.",
    },
    {
      id: "q5",
      questionNumber: 5,
      nclcTargetLevel: 9,
      documentText:
        "Loin de se réduire à une simple inflation des prix, la crise du logement traduit un déséquilibre structurel : la construction neuve, entravée par la rareté du foncier et la lourdeur des procédures, ne parvient plus à absorber une demande démographique soutenue. Les mesures ponctuelles de plafonnement des loyers n'en traitent donc que les symptômes.",
      prompt: "Selon l'auteur, pourquoi le plafonnement des loyers est-il insuffisant ?",
      options: {
        A: "Il fait augmenter la demande démographique.",
        B: "Il ne s'attaque pas aux causes profondes du problème.",
        C: "Il empêche la construction de logements neufs.",
        D: "Il est trop coûteux pour l'État.",
      },
      correctOption: "B",
      explanation:
        "L'auteur dit que ces mesures « ne traitent que les symptômes » d'un déséquilibre structurel, c'est-à-dire pas les causes.",
      trapAnalysis:
        "A, C et D attribuent au plafonnement des effets que le texte ne mentionne pas ; seule B reformule « symptômes » par « causes profondes ».",
    },
  ],
};

export const MOCK_SERIES_CO_101: ExamSeriesData = {
  id: "demo-101-co",
  seriesNumber: 101,
  title: "TCF Canada — Compréhension orale, Série 101 (démo)",
  discipline: "CO",
  durationSeconds: 40 * 60,
  questions: [
    {
      id: "co1",
      questionNumber: 1,
      nclcTargetLevel: 4,
      audioTranscript:
        "Bonjour, je voudrais réserver une table pour quatre personnes, ce samedi soir, vers vingt heures, s'il vous plaît.",
      prompt: "Que veut faire la personne ?",
      options: {
        A: "Annuler une réservation.",
        B: "Réserver une table au restaurant.",
        C: "Commander à emporter.",
        D: "Changer l'heure d'un rendez-vous.",
      },
      correctOption: "B",
      explanation: "« Je voudrais réserver une table pour quatre personnes » : c'est une réservation.",
      trapAnalysis: "A et D parlent de modifier/annuler, ce qui n'est pas dit. C est une autre demande.",
    },
    {
      id: "co2",
      questionNumber: 2,
      nclcTargetLevel: 6,
      audioTranscript:
        "Attention, mesdames et messieurs, en raison d'un incident technique, le train à destination de Lyon aura quarante minutes de retard. Nous vous prions de nous excuser pour ce désagrément.",
      prompt: "Quelle information est donnée ?",
      options: {
        A: "Le train pour Lyon est supprimé.",
        B: "Le train pour Lyon part en avance.",
        C: "Le train pour Lyon est en retard.",
        D: "Le quai du train a changé.",
      },
      correctOption: "C",
      explanation: "« Aura quarante minutes de retard » : le train est retardé, pas supprimé.",
      trapAnalysis: "A exagère (suppression). B est l'inverse. D n'est pas mentionné.",
    },
  ],
};

import { FULL_SERIES_CE_101 } from "./series-ce-101";
import { FULL_SERIES_CO_101 } from "./series-co-101";

export { FULL_SERIES_CO_101 };

const SERIES: Record<string, ExamSeriesData> = {
  [FULL_SERIES_CE_101.id]: FULL_SERIES_CE_101,
  "demo-101": FULL_SERIES_CE_101,
  "101": FULL_SERIES_CE_101,
  "100": FULL_SERIES_CE_101,
  [FULL_SERIES_CO_101.id]: FULL_SERIES_CO_101,
  "demo-101-co": FULL_SERIES_CO_101,
  "demo-101-ce": FULL_SERIES_CE_101,
};

export function getMockSeries(id: string): ExamSeriesData | undefined {
  return SERIES[id];
}

export function listMockSeries(): ExamSeriesData[] {
  return [FULL_SERIES_CE_101, FULL_SERIES_CO_101];
}
