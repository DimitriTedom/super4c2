import type { WrittenExamSeries } from "./written-types";

export const MOCK_WRITTEN_SERIES_101: WrittenExamSeries = {
  id: "demo-101-ee",
  seriesNumber: 101,
  title: "TCF Canada — Expression Écrite, Sujet 101 (Officiel)",
  durationSeconds: 60 * 60, // 60 minutes
  tasks: [
    {
      taskNumber: 1,
      title: "Tâche 1 : Message descriptif / informatif",
      minWords: 60,
      maxWords: 120,
      suggestedDurationMinutes: 15,
      topic:
        "Vous venez d'emménager dans un nouvel appartement. Vous écrivez un message à un(e) ami(e) pour lui décrire votre nouveau logement et l'inviter à venir le visiter ce week-end.",
      context:
        "Respectez la consigne : décrivez brièvement le logement (pièces, luminosité, quartier) et proposez une date/heure précise pour l'invitation.",
    },
    {
      taskNumber: 2,
      title: "Tâche 2 : Récit d'expérience et opinion",
      minWords: 120,
      maxWords: 150,
      suggestedDurationMinutes: 20,
      topic:
        "Vous avez récemment participé à un événement culturel ou associatif dans votre ville (festival, journée de nettoyage, fête des voisins). Vous écrivez un article pour le blog de votre quartier dans lequel vous racontez cette expérience et expliquez pourquoi ce genre d'initiative est essentiel pour la vie collective.",
      context:
        "Structurez votre propos : racontez les faits au passé (déroulement, ressenti) puis développez votre opinion argumentée sur l'impact social.",
    },
    {
      taskNumber: 3,
      title: "Tâche 3 : Analyse comparative et prise de position",
      minWords: 120,
      maxWords: 180,
      suggestedDurationMinutes: 25,
      topic:
        "Faut-il interdire totalement les smartphones dans les écoles et lycées ?\n\nDocument 1 : Selon certains éducateurs, l'interdiction stricte améliore la concentration des élèves et favorise les interactions sociales réelles pendant les récréations.\n\nDocument 2 : D'autres experts estiment que le smartphone est un outil pédagogique incontournable qu'il faut apprendre à maîtriser plutôt que de le bannir.",
      context:
        "Dans votre texte, résumez brièvement les deux points de vue opposés exprimés dans les documents, puis prenez clairement position en illustrant votre avis par des arguments personnels.",
    },
  ],
};

const WRITTEN_SERIES_MAP: Record<string, WrittenExamSeries> = {
  [MOCK_WRITTEN_SERIES_101.id]: MOCK_WRITTEN_SERIES_101,
  "demo-101": MOCK_WRITTEN_SERIES_101,
  "demo-101-ce": MOCK_WRITTEN_SERIES_101,
  "101": MOCK_WRITTEN_SERIES_101,
};

export function getWrittenSeries(id: string): WrittenExamSeries | undefined {
  return WRITTEN_SERIES_MAP[id];
}

export function listWrittenSeries(): WrittenExamSeries[] {
  return Object.values(WRITTEN_SERIES_MAP);
}
