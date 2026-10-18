import type { OralTaskType } from "./oral-types";

export interface StaticWrittenTask {
  taskNumber: 1 | 2 | 3;
  title: string;
  minWords: number;
  maxWords: number;
  suggestedDurationMinutes: number;
  topic: string;
  context?: string;
  sampleModelC2?: string;
}

export interface StaticWrittenSeries {
  seriesNumber: number;
  title: string;
  durationSeconds: number;
  tasks: [StaticWrittenTask, StaticWrittenTask, StaticWrittenTask];
}

export interface StaticOralTask {
  taskNumber: 1 | 2 | 3;
  type: OralTaskType;
  title: string;
  durationSeconds: number;
  examinerPrompt: string;
  roleplayScenario?: {
    candidatRole: string;
    examinerRole: string;
    situation: string;
    objectives: string[];
  };
}

export interface StaticOralSeries {
  seriesNumber: number;
  title: string;
  durationSeconds: number;
  tasks: [StaticOralTask, StaticOralTask, StaticOralTask];
}

export const MULTI_SERIES_EE: StaticWrittenSeries[] = [
  {
    seriesNumber: 101,
    title: "TCF Canada — Expression Écrite, Série 101 (Conforme FEI)",
    durationSeconds: 3600,
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
        sampleModelC2:
          "Salut Thomas ! J'ai enfin posé mes cartons dans mon nouvel appartement du quartier Montcalm et je suis ravi. C'est un 3 pièces baigné de lumière naturelle, doté d'un parquet chaleureux et d'une cuisine ouverte idéale pour cuisiner. Le voisinage est très paisible et nous avons une boulangerie artisanale au coin de la rue. Es-tu disponible ce samedi vers 18h pour pendre la crémaillère autour d'un apéritif convivial ? Confirme-moi vite ta venue !",
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
        sampleModelC2:
          "Dimanche dernier, j'ai eu l'immense privilège de participer à la grande journée écocitoyenne de nettoyage organisée le long des berges de notre rivière. Dès potron-minet, plus d'une centaine de riverains de toutes générations se sont mobilisés dans un élan de solidarité remarquable. Armés de gants et de sacs biodégradables, nous avons collecté près de trois cents kilos d'immondices dans une ambiance profondément festive et bienveillante. Au-delà de l'indéniable impact environnemental, cette aventure a forgé un authentique sentiment d'appartenance. Dans une société contemporaine souvent gangrenée par l'individualisme et l'isolement urbain, de telles initiatives constituent le ciment indispensable du vivre-ensemble et ravivent notre conscience civique commune.",
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
        sampleModelC2:
          "La prolifération des terminaux mobiles en milieu scolaire suscite une polarisation marquée. D'un côté, les partisans d'une prohibition rigoureuse font valoir la sauvegarde de l'attention cognitive et la résurgence d'interactions humaines spontanées lors des pauses. À l'opposé, les pédagogues progressistes appréhendent le smartphone comme un puissant catalyseur d'apprentissage numérique dont l'école ne saurait s'affranchir. Pour ma part, je préconise une régulation mesurée plutôt qu'un bannissement aveugle. Si la sanctuarisation des salles de classe demeure impérative pour préserver la quiétude didactique, confisquer systématiquement les appareils prive les apprenants d'une éducation aux médias pourtant indispensable au XXIe siècle. En somme, tempérance et responsabilisation doivent prévaloir sur la simple censure.",
      },
    ],
  },
  {
    seriesNumber: 102,
    title: "TCF Canada — Expression Écrite, Série 102 (Conforme FEI)",
    durationSeconds: 3600,
    tasks: [
      {
        taskNumber: 1,
        title: "Tâche 1 : Message descriptif / informatif",
        minWords: 60,
        maxWords: 120,
        suggestedDurationMinutes: 15,
        topic:
          "Vous écrivez à un(e) collègue de travail pour lui faire part de la découverte d'un café-librairie très agréable près de votre bureau. Vous lui décrivez les lieux et lui proposez de vous y retrouver pour déjeuner demain midi.",
        context:
          "Respectez la consigne : décrivez l'ambiance et la carte du café, puis fixez l'heure du rendez-vous.",
        sampleModelC2:
          "Bonjour Élodie, j'ai déniché ce matin une pépite absolue à deux pas du bureau : « Les Mots Gourmands », un ravissant café-librairie niché rue des Remparts. L'atmosphère y est feutrée et chaleureuse, agrémentée de canapés en velours et d'une musique acoustique apaisante. Ils proposent chaque midi un menu de saison sain et abordable avec des quiches artisanales savoureuses. Serais-tu tentée d'y faire une pause demain à 12h30 pour échanger sur nos dossiers en toute décontraction ? Tiens-moi au courant !",
      },
      {
        taskNumber: 2,
        title: "Tâche 2 : Récit d'expérience et opinion",
        minWords: 120,
        maxWords: 150,
        suggestedDurationMinutes: 20,
        topic:
          "Vous avez décidé de privilégier les commerces de proximité et les marchés locaux pendant un mois pour faire toutes vos courses. Vous écrivez un article sur les réseaux sociaux pour raconter cette expérience et donner votre opinion sur ce mode de consommation.",
        context:
          "Racontez votre expérience au passé, évoquez les changements dans votre routine et analysez les bienfaits pour l'économie locale et la santé.",
        sampleModelC2:
          "Durant tout le mois écoulé, j'ai délibérément banni les hypermarchés impersonnels pour m'approvisionner exclusivement auprès des commerçants de mon quartier et des maraîchers locaux. Au départ, cette transition a bousculé mes réflexes de rapidité et requis une planification plus rigoureuse. Toutefois, le charme des échanges humains, la fraîcheur incomparable des denrées de saison et les précieux conseils culinaires de mon artisan boucher ont transformé une simple corvée logistique en un authentique plaisir sensoriel. Certes, les tarifs se révèlent parfois légèrement plus onéreux, mais ce surcoût est largement compensé par la réduction drastique du gaspillage alimentaire. Consommer local constitue un acte citoyen salutaire qui redynamise le tissu économique de nos centres-villes tout en préservant notre santé.",
      },
      {
        taskNumber: 3,
        title: "Tâche 3 : Analyse comparative et prise de position",
        minWords: 120,
        maxWords: 180,
        suggestedDurationMinutes: 25,
        topic:
          "Faut-il généraliser la semaine de travail de 4 jours (32 heures) ?\n\nDocument 1 : Selon plusieurs études sociologiques, la réduction du temps de travail à 4 jours hebdomadaires augmente l'efficacité des salariés, diminue l'épuisement professionnel et favorise l'équilibre familial.\n\nDocument 2 : De nombreux chefs d'entreprise craignent une baisse de compétitivité, une désorganisation des services continus et une hausse insoutenable des charges salariales.",
        context:
          "Analysez les arguments antagonistes présentés dans les deux documents, puis prenez position en illustrant votre réflexion par des exemples concrets.",
        sampleModelC2:
          "La modulation du temps de travail vers une semaine de quatre jours polarise le monde socio-économique contemporain. Pour ses fervents défenseurs, ce paradigme allège la charge mentale, enraye l'épuisement professionnel et stimule l'efficience globale des équipes grâce à une récupération physique accrue. En revanche, les détracteurs pointent avec insistance la fragilisation financière des PME ainsi que l'extrême complexité logistique inhérente aux services exigeant une continuité ininterrompue. Selon moi, l'instauration d'une semaine de 32 heures sans perte de salaire s'avère hautement vertueuse si elle demeure adaptée aux réalités sectorielles. L'expérience prouve que des collaborateurs épanouis génèrent une plus-value supérieure, compensant amplement le jour chômé.",
      },
    ],
  },
  {
    seriesNumber: 103,
    title: "TCF Canada — Expression Écrite, Série 103 (Conforme FEI)",
    durationSeconds: 3600,
    tasks: [
      {
        taskNumber: 1,
        title: "Tâche 1 : Message descriptif / informatif",
        minWords: 60,
        maxWords: 120,
        suggestedDurationMinutes: 15,
        topic:
          "Vous organisez une excursion d'une journée dans un parc national pour un groupe d'amis. Vous écrivez un courriel pour leur donner les informations pratiques indispensables (équipement à prévoir, nourriture, heure et lieu de rassemblement).",
        context:
          "Soyez précis : détaillez le matériel (chaussures, imperméable), précisez l'horaire matinal et le point de covoiturage.",
        sampleModelC2:
          "Chers amis, notre randonnée au Parc National de la Jacques-Cartier aura lieu ce dimanche ! Prévoyez des chaussures de marche montantes, une veste imperméable et une gourde d'au moins deux litres. Nous partagerons un pique-nique zéro déchet au sommet du sentier des Loups. Le rendez-vous est fixé à 7h45 précises sur le stationnement de la station Laurier pour organiser le covoiturage. Pensez à recharger vos téléphones pour immortaliser les paysages d'automne. À dimanche !",
      },
      {
        taskNumber: 2,
        title: "Tâche 2 : Récit d'expérience et opinion",
        minWords: 120,
        maxWords: 150,
        suggestedDurationMinutes: 20,
        topic:
          "Votre foyer ou votre colocation a relevé un défi « Zéro Déchet » pendant trois semaines. Vous rédigez un compte-rendu pour un magazine environnemental en racontant les obstacles rencontrés et votre sentiment sur la viabilité de cette démarche.",
        context:
          "Racontez l'évolution de vos habitudes au passé et concluez sur la portée écologique d'un tel changement.",
        sampleModelC2:
          "Le mois dernier, nous avons relevé le pari audacieux d'éradiquer tout emballage jetable de notre quotidien durant trois semaines. Les prémices se sont révélées laborieuses : scruter méthodiquement chaque étiquette, transporter ses propres bocaux en verre et dénicher des savonnettes solides ont exigé un effort d'adaptation considérable. Néanmoins, en substituant le vrac aux produits industriels suremballés, notre poubelle ménagère s'est délestée des trois quarts de son volume habituel ! Cette expérience salutaire a démontré qu'une sobriété choisie n'équivaut nullement à une privation austère. Si le zéro déchet absolu demeure une utopie dans notre société de consommation de masse, amorcer cette transition permet d'alléger drastiquement notre empreinte carbone tout en réapprenant à valoriser l'essentiel.",
      },
      {
        taskNumber: 3,
        title: "Tâche 3 : Analyse comparative et prise de position",
        minWords: 120,
        maxWords: 180,
        suggestedDurationMinutes: 25,
        topic:
          "Faut-il instaurer une taxe environnementale dissuasive sur les billets d'avion court-courriers ?\n\nDocument 1 : Face à l'urgence climatique, taxer fortement l'aviation civile permet de financer les infrastructures ferroviaires et d'inciter les voyageurs à emprunter le train pour les distances inférieures à cinq cents kilomètres.\n\nDocument 2 : De nombreuses fédérations professionnelles s'insurgent contre une telle mesure, estimant qu'elle pénalise la mobilité des travailleurs, isole les régions enclavées et freine l'économie touristique.",
        context:
          "Confrontez les points de vue contradictoires des deux documents, puis exprimez votre opinion personnelle étayée.",
        sampleModelC2:
          "L'opportunité d'une fiscalité punitive sur les liaisons aériennes régionales suscite de vives controverses. D'un côté, les écologistes prônent une taxation substantielle des vols court-courriers afin de juguler les émissions de gaz à effet de serre et de réorienter les financements vers le maillage ferroviaire. À l'opposé, les acteurs économiques et touristiques alertent sur le risque d'enclavement territorial et la dégradation de la compétitivité des travailleurs mobiles. Selon ma perspective, surtaxer les vols intérieurs est une nécessité écologique inéluctable, à l'unique condition d'offrir des alternatives ferroviaires fiables, rapides et financièrement accessibles. Sanctionner sans proposer de substitution viable reviendrait à punir injustement les citoyens plutôt qu'à impulser une transition soutenable.",
      },
    ],
  },
  {
    seriesNumber: 104,
    title: "TCF Canada — Expression Écrite, Série 104 (Conforme FEI)",
    durationSeconds: 3600,
    tasks: [
      {
        taskNumber: 1,
        title: "Tâche 1 : Message descriptif / informatif",
        minWords: 60,
        maxWords: 120,
        suggestedDurationMinutes: 15,
        topic:
          "Vous avez passé quelques jours de vacances chez des amis d'enfance au Canada. De retour chez vous, vous leur écrivez un message chaleureux pour les remercier de leur accueil et leur proposer de venir chez vous aux prochaines vacances.",
        context:
          "Remerciez pour l'hébergement et les activités, mentionnez un souvenir fort et formulez une invitation réciproque.",
        sampleModelC2:
          "Chers Sophie et Marc, je tenais à vous remercier du fond du cœur pour votre accueil exceptionnel lors de mon séjour à Montréal. Notre escapade au mont Royal et la soirée poutine resteront gravées dans ma mémoire ! Je suis bien rentré chez moi la tête pleine de merveilleux souvenirs. C'est désormais à mon tour de vous recevoir : ma porte vous est grande ouverte pour les prochaines vacances d'été. Prenez grand soin de vous et à très vite !",
      },
      {
        taskNumber: 2,
        title: "Tâche 2 : Récit d'expérience et opinion",
        minWords: 120,
        maxWords: 150,
        suggestedDurationMinutes: 20,
        topic:
          "Vous avez assisté à un festival interculturel réunissant traditions culinaires, danses et artisanat du monde entier. Vous écrivez un témoignage dans la gazette de votre commune pour raconter votre journée et exprimer l'importance de ce type de manifestations pour l'intégration.",
        context:
          "Racontez l'événement, les découvertes artistiques et culinaires, et défendez la richesse du multiculturalisme.",
        sampleModelC2:
          "Samedi après-midi, notre place municipale s'est métamorphosée en un véritable carrefour des cultures à l'occasion du grand festival des peuples du monde. Bercé par les polyphonies d'Afrique centrale et les mélodies envoûtantes d'Europe orientale, j'ai déambulé parmi des échoppes chamarrées où les artisans partageaient leurs coutumes avec une générosité désarmante. Déguster un plat traditionnel tout en découvrant les subtilités d'un costume traditionnel m'a rappelé combien l'altérité est une source intarissable d'élévation mutuelle. De tels rassemblements populaires abattent les préjugés tenaces et constituent le plus beau tremplin pour l'intégration harmonieuse des nouveaux arrivants dans notre société plurielle.",
      },
      {
        taskNumber: 3,
        title: "Tâche 3 : Analyse comparative et prise de position",
        minWords: 120,
        maxWords: 180,
        suggestedDurationMinutes: 25,
        topic:
          "Faut-il rendre l'accès aux musées et expositions patrimoniales gratuit pour l'ensemble des citoyens ?\n\nDocument 1 : Rendre les musées gratuits démocratise l'art, attire les populations défavorisées et éveille la curiosité des jeunes générations en abolissant les barrières financières.\n\nDocument 2 : La gratuité universelle fragilise les finances des institutions publiques, nuit à la préservation des œuvres et prive les musées de ressources indispensables à l'acquisition de nouvelles collections.",
        context:
          "Présentez de façon synthétique les arguments des deux documents, puis défendez votre point de vue avec des arguments personnels.",
        sampleModelC2:
          "La gratuité intégrale des établissements muséaux fait l'objet d'un débat passionné. Les tenants de la libéralisation tarifaire soutiennent que la culture est un bien commun inaliénable dont l'accès doit être affranchi de toute barrière pécuniaire afin d'émanciper les publics marginalisés. À l'inverse, les gestionnaires de patrimoine soulignent que les droits d'entrée financent l'entretien minutieux des collections historiques et la modernisation technologique des scénographies. En ce qui me concerne, je préconise un modèle hybride : une gratuité ciblée pour les étudiants, demandeurs d'emploi et jeunes adultes, couplée à des journées d'ouverture libre mensuelles pour le grand public. Concilier viabilité financière et mission émancipatrice demeure la seule voie pérenne.",
      },
    ],
  },
  {
    seriesNumber: 105,
    title: "TCF Canada — Expression Écrite, Série 105 (Conforme FEI)",
    durationSeconds: 3600,
    tasks: [
      {
        taskNumber: 1,
        title: "Tâche 1 : Message descriptif / informatif",
        minWords: 60,
        maxWords: 120,
        suggestedDurationMinutes: 15,
        topic:
          "Vous avez commencé à utiliser une application mobile dédiée à la pratique d'activités physiques et au bien-être. Vous écrivez à un(e) collègue pour lui recommander cette application et lui proposer de relever un défi sportif ensemble.",
        context:
          "Présentez les fonctionnalités de l'application (suivi des pas, conseils, défis) et proposez un challenge amical.",
        sampleModelC2:
          "Bonjour Karim, j'ai récemment téléchargé l'application « Vitalis » pour optimiser mes séances d'entraînement hebdomadaires et j'en suis conquis ! Elle permet de mesurer précisément le rythme cardiaque, compte les foulées et offre des programmes de renforcement musculaire sur mesure. Que dirais-tu de relever ensemble le défi des 10 000 pas quotidiens durant tout le mois de novembre ? C'est parfait pour garder la forme malgré le froid. Fais-moi signe si tu es partant !",
      },
      {
        taskNumber: 2,
        title: "Tâche 2 : Récit d'expérience et opinion",
        minWords: 120,
        maxWords: 150,
        suggestedDurationMinutes: 20,
        topic:
          "Vous avez fait l'expérience d'une déconnexion numérique complète (sans smartphone, réseaux sociaux ni télévision) pendant tout un week-end. Vous écrivez un billet pour un blog bien-être pour relater votre ressenti et les enseignements tirés.",
        context:
          "Racontez votre expérience au passé : le sevrage initial, les activités retrouvées et les bienfaits sur votre concentration.",
        sampleModelC2:
          "Samedi matin, j'ai éteint mon téléphone et débranché ma box Internet pour vivre quarante-huit heures de déconnexion totale. Les premières heures ont provoqué un réflexe quasi pavlovien : tapoter machinalement l'écran noir en quête de notifications illusoires. Mais très vite, cette anxiété sourde a cédé la place à une sérénité inespérée. J'ai dévoré un roman en une seule journée, cuisiné sans regarder l'heure et renoué avec de longues promenades contemplatives en forêt. Cette parenthèse enchantée m'a ouvert les yeux sur la tyrannie insidieuse de l'immédiateté numérique. Nous consacrons un temps précieux à scruter la vie d'autrui au détriment de notre propre introspection. Une telle cure de désintoxication technologique devrait être prescrite régulièrement pour préserver notre santé mentale.",
      },
      {
        taskNumber: 3,
        title: "Tâche 3 : Analyse comparative et prise de position",
        minWords: 120,
        maxWords: 180,
        suggestedDurationMinutes: 25,
        topic:
          "Les consultations médicales à distance (téléconsultations) doivent-elles remplacer les visites médicales physiques pour les pathologies courantes ?\n\nDocument 1 : La télémédecine permet de désengorger les urgences, réduit les délais d'attente et offre une solution médicale immédiate aux habitants des déserts médicaux.\n\nDocument 2 : De nombreux praticiens rappellent que l'examen clinique tactile et l'observation physique directe restent indispensables pour poser un diagnostic fiable et éviter les erreurs médicales graves.",
        context:
          "Confrontez les points de vue développés dans les documents, puis argumentez votre propre position de manière nuancée.",
        sampleModelC2:
          "L'expansion spectaculaire de la télémédecine cristallise des visions divergentes de l'avenir des soins. D'un côté, ses promoteurs vantent un désengorgement salutaire des salles d'attente et un accès aux soins salvateur pour les contrées rurales dénuées de praticiens de proximité. D'un autre côté, le corps médical met en garde contre les dérives d'une médecine déshumanisée où l'absence de palpation et d'auscultation physique majore le risque d'erreurs diagnostiques irréversibles. Pour ma part, j'estime que la téléconsultation constitue un outil d'appoint remarquable pour le renouvellement d'ordonnances ou le suivi post-opératoire bénin. Néanmoins, elle ne saurait en aucun cas supplanter le colloque singulier et l'examen clinique direct qui fondent l'essence même de l'art médical.",
      },
    ],
  },
];

export const MULTI_SERIES_EO: StaticOralSeries[] = [
  {
    seriesNumber: 101,
    title: "TCF Canada — Expression Orale, Série 101 (Conforme FEI)",
    durationSeconds: 720,
    tasks: [
      {
        taskNumber: 1,
        type: "task1_presentation",
        title: "Tâche 1 : Entretien dirigé sans préparation",
        durationSeconds: 120,
        examinerPrompt:
          "Bonjour et bienvenue à cette épreuve d'expression orale du TCF Canada. Pour commencer, pouvez-vous vous présenter, me parler de vos activités quotidiennes et m'expliquer ce qui vous motive dans votre projet d'immigration au Canada ?",
      },
      {
        taskNumber: 2,
        type: "task2_roleplay",
        title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
        durationSeconds: 210,
        examinerPrompt:
          "Nous allons passer à la Tâche 2. Vous avez vu une annonce pour des cours de cuisine écoresponsable en soirée. Je suis le responsable de l'atelier culinaire. Vous devez me poser un maximum de questions pour obtenir tous les détails pratiques. Vous commencez !",
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
        durationSeconds: 270,
        examinerPrompt:
          "Pour cette dernière tâche, voici votre sujet : « Pensez-vous que les villes modernes devraient interdire totalement la circulation des voitures individuelles dans leurs centres-villes ? » Vous devez développer votre point de vue avec des arguments convaincants. Je vous écoute.",
      },
    ],
  },
  {
    seriesNumber: 102,
    title: "TCF Canada — Expression Orale, Série 102 (Conforme FEI)",
    durationSeconds: 720,
    tasks: [
      {
        taskNumber: 1,
        type: "task1_presentation",
        title: "Tâche 1 : Entretien dirigé sans préparation",
        durationSeconds: 120,
        examinerPrompt:
          "Bonjour ! Présentez-vous s'il vous plaît. Parlez-moi de votre parcours professionnel, de vos compétences principales et de la façon dont vous comptez vous intégrer sur le marché du travail canadien.",
      },
      {
        taskNumber: 2,
        type: "task2_roleplay",
        title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
        durationSeconds: 210,
        examinerPrompt:
          "Passons à la Tâche 2. Vous avez lu une note interne sur la mise en place d'une plateforme de covoiturage dans notre entreprise. Je suis votre collègue de travail et j'hésite beaucoup à y participer car j'aime ma liberté en voiture. Vous tentez de me convaincre d'essayer le covoiturage avec vous. Allez-y !",
        roleplayScenario: {
          candidatRole: "Salarié convaincu par le covoiturage",
          examinerRole: "Collègue de bureau réticent et attaché à sa voiture personnelle",
          situation: "Persuader un collègue d'adopter le covoiturage pour les trajets quotidiens",
          objectives: [
            "Proposer un partage équitable des frais de carburant et de péage",
            "Rassurer sur la flexibilité horaire et les imprévus",
            "Souligner les bénéfices écologiques et la réduction du stress dans les embouteillages",
            "Proposer une période d'essai d'une semaine sans engagement",
          ],
        },
      },
      {
        taskNumber: 3,
        type: "task3_opinion",
        title: "Tâche 3 : Expression d'un point de vue argumenté",
        durationSeconds: 270,
        examinerPrompt:
          "Voici votre sujet pour la Tâche 3 : « Le développement exponentiel de l'intelligence artificielle représente-t-il une menace pour l'emploi ou une opportunité d'émancipation humaine ? » Exposez votre réflexion de façon structurée.",
      },
    ],
  },
  {
    seriesNumber: 103,
    title: "TCF Canada — Expression Orale, Série 103 (Conforme FEI)",
    durationSeconds: 720,
    tasks: [
      {
        taskNumber: 1,
        type: "task1_presentation",
        title: "Tâche 1 : Entretien dirigé sans préparation",
        durationSeconds: 120,
        examinerPrompt:
          "Bonjour et bienvenue. Pouvez-vous vous présenter brièvement, me décrire votre lieu de résidence actuel et m'expliquer ce que vous aimez faire pendant votre temps libre ?",
      },
      {
        taskNumber: 2,
        type: "task2_roleplay",
        title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
        durationSeconds: 210,
        examinerPrompt:
          "Nous passons à la Tâche 2. Vous avez découvert une annonce pour rejoindre une coopérative locale qui installe des panneaux solaires partagés. Je suis le représentant de la coopérative. Vous me posez des questions pour comprendre le fonctionnement, les coûts et les bénéfices. Je vous écoute !",
        roleplayScenario: {
          candidatRole: "Citoyen intéressé par l'énergie solaire coopérative",
          examinerRole: "Conseiller et représentant de la coopérative citoyenne d'énergie",
          situation: "Renseignements sur l'adhésion et l'investissement dans des panneaux solaires de quartier",
          objectives: [
            "Demander le montant de l'adhésion et des parts sociales",
            "Comprendre comment l'électricité produite est réinjectée ou déduite de la facture",
            "Interroger sur la maintenance des installations et la durée d'engagement",
            "Demander des exemples de projets solaires déjà opérationnels",
          ],
        },
      },
      {
        taskNumber: 3,
        type: "task3_opinion",
        title: "Tâche 3 : Expression d'un point de vue argumenté",
        durationSeconds: 270,
        examinerPrompt:
          "Pour la Tâche 3, voici votre question : « Pensez-vous que les voyages touristiques de masse détruisent irrémédiablement le patrimoine naturel et culturel des pays hôtes ? » Développez vos arguments.",
      },
    ],
  },
  {
    seriesNumber: 104,
    title: "TCF Canada — Expression Orale, Série 104 (Conforme FEI)",
    durationSeconds: 720,
    tasks: [
      {
        taskNumber: 1,
        type: "task1_presentation",
        title: "Tâche 1 : Entretien dirigé sans préparation",
        durationSeconds: 120,
        examinerPrompt:
          "Bonjour. Présentez-vous s'il vous plaît. Parlez-moi de vos centres d'intérêt culturels, de vos lectures ou des films qui ont marqué votre personnalité.",
      },
      {
        taskNumber: 2,
        type: "task2_roleplay",
        title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
        durationSeconds: 210,
        examinerPrompt:
          "Passons à la Tâche 2. Vous avez vu une affiche pour des cours de théâtre amateur dans votre quartier. Je suis le metteur en scène de la troupe. Vous me posez des questions précises sur le programme, l'expérience exigée et les représentations publiques. C'est à vous !",
        roleplayScenario: {
          candidatRole: "Débutant souhaitant faire du théâtre",
          examinerRole: "Metteur en scène et responsable de la troupe théâtrale de quartier",
          situation: "Prise de contact pour rejoindre un atelier d'expression théâtrale amateur",
          objectives: [
            "Demander si une expérience préalable de la scène est exigée",
            "Connaître les jours, horaires et lieu des répétitions",
            "Se renseigner sur le type de pièces travaillées (classique, moderne, improvisation)",
            "Interroger sur la date et le lieu du spectacle de fin d'année",
          ],
        },
      },
      {
        taskNumber: 3,
        type: "task3_opinion",
        title: "Tâche 3 : Expression d'un point de vue argumenté",
        durationSeconds: 270,
        examinerPrompt:
          "Pour cette dernière tâche : « L'obligation du port de l'uniforme à l'école est-elle une solution pertinente pour réduire les discriminations sociales entre élèves ? » Exposez votre point de vue avec nuance.",
      },
    ],
  },
  {
    seriesNumber: 105,
    title: "TCF Canada — Expression Orale, Série 105 (Conforme FEI)",
    durationSeconds: 720,
    tasks: [
      {
        taskNumber: 1,
        type: "task1_presentation",
        title: "Tâche 1 : Entretien dirigé sans préparation",
        durationSeconds: 120,
        examinerPrompt:
          "Bonjour ! Présentez-vous s'il vous plaît. Décrivez-moi une journée type dans votre vie, votre routine matinale et ce que vous faites pour maintenir votre équilibre au quotidien.",
      },
      {
        taskNumber: 2,
        type: "task2_roleplay",
        title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
        durationSeconds: 210,
        examinerPrompt:
          "Nous abordons la Tâche 2. Vous voulez vous inscrire dans une salle de sport ouverte 24 heures sur 24. Je suis le responsable d'accueil de la salle. Vous me posez toutes les questions nécessaires avant de vous engager. Commencez quand vous voulez !",
        roleplayScenario: {
          candidatRole: "Futur adhérent soucieux de sa santé et de ses horaires atypiques",
          examinerRole: "Conseiller de vente et responsable d'accueil du club de sport",
          situation: "Demande de renseignements complets sur l'abonnement et la sécurité d'une salle 24/7",
          objectives: [
            "Vérifier les conditions d'accès nocturne et le dispositif de surveillance",
            "Demander le tarif mensuel et les frais d'inscription",
            "Savoir si des coachs sportifs sont disponibles pour établir un programme",
            "Demander s'il est possible de faire une séance d'essai gratuite",
          ],
        },
      },
      {
        taskNumber: 3,
        type: "task3_opinion",
        title: "Tâche 3 : Expression d'un point de vue argumenté",
        durationSeconds: 270,
        examinerPrompt:
          "Voici votre sujet : « Devrait-on interdire légalement l'accès aux réseaux sociaux aux mineurs de moins de 15 ans pour protéger leur santé mentale ? » Développez votre argumentation.",
      },
    ],
  },
];
