import type { OralSeries } from "./oral-types";

export const MOCK_ORAL_SERIES_101: OralSeries = {
  id: "demo-101-eo",
  seriesNumber: 101,
  title: "TCF Canada — Expression Orale, Série 101 (Officiel)",
  tasks: [
    {
      taskNumber: 1,
      type: "task1_presentation",
      title: "Tâche 1 : Entretien dirigé sans préparation",
      durationSeconds: 120, // 2 minutes
      examinerPrompt:
        "Bonjour et bienvenue à cette épreuve d'expression orale du TCF Canada. Pour commencer, pouvez-vous vous présenter, me parler de vos activités quotidiennes et m'expliquer ce qui vous motive dans votre projet d'immigration ?",
    },
    {
      taskNumber: 2,
      type: "task2_roleplay",
      title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
      durationSeconds: 210, // 3 minutes 30s
      examinerPrompt:
        "Nous allons passer à la Tâche 2. Vous avez vu une annonce pour des cours de cuisine écoresponsable en soirée. Je suis le responsable de l'atelier. Vous devez me poser un maximum de questions pour obtenir tous les détails pratiques. Vous commencez !",
      roleplayScenario: {
        candidatRole: "Candidat intéressé par les cours de cuisine",
        examinerRole: "Responsable des inscriptions à l'atelier culinaire",
        situation: "Demande d'informations détaillées pour une inscription en cours du soir",
        objectives: [
          "Demander les horaires et la fréquence des ateliers",
          "Se renseigner sur les tarifs et les réductions éventuelles",
          "Vérifier si le matériel et les ingrédients sont fournis",
          "Interroger sur le niveau requis pour les débutants",
        ],
      },
    },
    {
      taskNumber: 3,
      type: "task3_opinion",
      title: "Tâche 3 : Expression d'un point de vue argumenté",
      durationSeconds: 270, // 4 minutes 30s
      examinerPrompt:
        "Pour cette dernière tâche, voici votre sujet : « Pensez-vous que les villes modernes devraient interdire totalement la circulation des voitures individuelles dans leurs centres-villes ? » Vous devez développer votre point de vue avec des arguments convaincants. Je vous écoute.",
    },
  ],
};

const ORAL_SERIES_MAP: Record<string, OralSeries> = {
  [MOCK_ORAL_SERIES_101.id]: MOCK_ORAL_SERIES_101,
  "demo-101": MOCK_ORAL_SERIES_101,
  "demo-101-ce": MOCK_ORAL_SERIES_101,
  "101": MOCK_ORAL_SERIES_101,
};

export function getOralSeries(id: string): OralSeries | undefined {
  return ORAL_SERIES_MAP[id];
}

export function listOralSeries(): OralSeries[] {
  return Object.values(ORAL_SERIES_MAP);
}
