import type { ExamQuestion, ExamSeriesData } from "./types";

export const QUESTIONS_CE_101: ExamQuestion[] = [
  // ==========================================
  // NIVEAU A1 (Questions 1 à 6)
  // ==========================================
  {
    id: "ce-101-q1",
    questionNumber: 1,
    nclcTargetLevel: 3,
    documentText:
      "BOULANGERIE DU PARC\n\nOuvert du mardi au samedi de 6h30 à 19h30.\nLe dimanche de 7h00 à 13h00.\nFermé le lundi toute la journée.",
    prompt: "Quand la boulangerie est-elle fermée ?",
    options: {
      A: "Le dimanche après-midi et le lundi.",
      B: "Le samedi toute la journée.",
      C: "Le mardi matin.",
      D: "Tous les soirs à 18h00.",
    },
    correctOption: "A",
    explanation:
      "La boulangerie ferme le dimanche à 13h00 (donc fermée l'après-midi) et est fermée le lundi toute la journée.",
    trapAnalysis:
      "B et C sont des jours d'ouverture. D indique une mauvaise heure (fermeture à 19h30 du mardi au samedi).",
  },
  {
    id: "ce-101-q2",
    questionNumber: 2,
    nclcTargetLevel: 3,
    documentText:
      "MESSAGE TÉLÉPHONIQUE\n\nDe : Sophie\nPour : Thomas\nDate : 14 mai, 10h15\n\nJ'ai réservé deux places pour le concert de vendredi soir. Le spectacle commence à 20h30. Retrouve-moi devant l'entrée de la salle à 20h00.",
    prompt: "À quelle heure Thomas et Sophie doivent-ils se retrouver ?",
    options: {
      A: "À 10h15.",
      B: "À 14h00.",
      C: "À 20h00.",
      D: "À 20h30.",
    },
    correctOption: "C",
    explanation:
      "Sophie écrit : « Retrouve-moi devant l'entrée de la salle à 20h00 ».",
    trapAnalysis:
      "A est l'heure de rédaction du message. D est l'heure du début du concert.",
  },
  {
    id: "ce-101-q3",
    questionNumber: 3,
    nclcTargetLevel: 3,
    documentText:
      "BIBLIOTHÈQUE MUNICIPALE\n\nPrêt de livres gratuit pour les enfants de moins de 12 ans.\nTarif adulte : 15 € par an.\nInscription obligatoire avec un justificatif de domicile.",
    prompt: "Que faut-il apporter pour s'inscrire ?",
    options: {
      A: "Une photo d'identité.",
      B: "Un justificatif de domicile.",
      C: "Un certificat de scolarité.",
      D: "Une autorisation parentale.",
    },
    correctOption: "B",
    explanation:
      "L'affiche précise : « Inscription obligatoire avec un justificatif de domicile ».",
    trapAnalysis:
      "A, C et D ne sont jamais mentionnés dans le document.",
  },
  {
    id: "ce-101-q4",
    questionNumber: 4,
    nclcTargetLevel: 4,
    documentText:
      "AVIS AUX VOYAGEURS — LIGNE DE BUS 12\n\nEn raison de travaux rue des Lilas, les arrêts « Mairie » et « Église » ne seront pas desservis du 1er au 10 juin. Veuillez vous reporter à l'arrêt provisoire situé place de la Gare.",
    prompt: "Où les usagers doivent-ils prendre le bus pendant les travaux ?",
    options: {
      A: "Rue des Lilas.",
      B: "À l'arrêt Mairie.",
      C: "À l'arrêt Église.",
      D: "Place de la Gare.",
    },
    correctOption: "D",
    explanation:
      "Le document indique de « se reporter à l'arrêt provisoire situé place de la Gare ».",
    trapAnalysis:
      "A est la rue des travaux. B et C sont les arrêts supprimés temporairement.",
  },
  {
    id: "ce-101-q5",
    questionNumber: 5,
    nclcTargetLevel: 4,
    documentText:
      "CENTRE COMMERCIAL LES QUATRE SAISONS\n\nChers clients, le parking souterrain est gratuit les deux premières heures pour tout achat supérieur à 20 € dans l'une de nos boutiques. Présentez votre ticket en caisse.",
    prompt: "Pour bénéficier du parking gratuit pendant deux heures, il faut :",
    options: {
      A: "Effectuer un achat d'au moins 20 €.",
      B: "Venir uniquement le matin.",
      C: "Posséder la carte fidélité du centre.",
      D: "Rester moins d'une heure au centre.",
    },
    correctOption: "A",
    explanation:
      "La condition est : « pour tout achat supérieur à 20 € ».",
    trapAnalysis:
      "B et C sont des suppositions non mentionnées. D est inexact (la gratuité couvre 2 heures, pas 1 heure).",
  },
  {
    id: "ce-101-q6",
    questionNumber: 6,
    nclcTargetLevel: 4,
    documentText:
      "CABINET MÉDICAL DU DOCTEUR MOREAU\n\nConsultations sans rendez-vous tous les matins de 8h30 à 11h30.\nConsultations sur rendez-vous les après-midis.\nPour toute urgence vitale, composez immédiatement le 15.",
    prompt: "Comment consulter le docteur Moreau l'après-midi ?",
    options: {
      A: "Il faut venir sans rendez-vous.",
      B: "Il est obligatoire d'avoir un rendez-vous.",
      C: "Il faut appeler le numéro 15.",
      D: "Le cabinet est fermé l'après-midi.",
    },
    correctOption: "B",
    explanation:
      "L'affiche indique : « Consultations sur rendez-vous les après-midis ».",
    trapAnalysis:
      "A concerne les matins. C est réservé aux urgences vitales. D est faux puisque le docteur consulte sur rendez-vous.",
  },

  // ==========================================
  // NIVEAU A2 (Questions 7 à 12)
  // ==========================================
  {
    id: "ce-101-q7",
    questionNumber: 7,
    nclcTargetLevel: 4,
    documentText:
      "AVIS AUX LOCATAIRES\n\nEn raison de travaux de réfection de la toiture, l'accès au local à vélos sera fermé du lundi 12 au vendredi 23 mai. Les vélos peuvent être déposés temporairement dans le garage n°2, au sous-sol. Nous vous remercions de votre compréhension.\n\nLa gérance",
    prompt: "Pourquoi le local à vélos sera-t-il fermé ?",
    options: {
      A: "Il va être agrandi.",
      B: "Le toit de l'immeuble est en réparation.",
      C: "Des vols ont eu lieu récemment.",
      D: "Il sera définitivement transformé en garage.",
    },
    correctOption: "B",
    explanation:
      "L'avis mentionne : « réfection de la toiture », ce qui correspond à la réparation du toit.",
    trapAnalysis:
      "A et D imaginent une modification des locaux. C n'est jamais mentionné. Le garage n°2 est seulement un abri temporaire.",
  },
  {
    id: "ce-101-q8",
    questionNumber: 8,
    nclcTargetLevel: 5,
    documentText:
      "OFFRE D'EMPLOI — ASSISTANT(E) ADMINISTRATIF(VE)\n\nNous recherchons une personne rigoureuse pour assurer l'accueil téléphonique, la gestion de l'agenda de la direction et le classement des dossiers clients. Une première expérience de deux ans minimum est exigée. Poste à temps partiel (24 h/semaine), à pourvoir dès le 1er septembre.",
    prompt: "Quelle condition est obligatoire pour postuler à cette annonce ?",
    options: {
      A: "Être disponible à temps complet.",
      B: "Maîtriser trois langues étrangères.",
      C: "Avoir au moins deux ans d'expérience.",
      D: "Accepter de travailler les samedis et dimanches.",
    },
    correctOption: "C",
    explanation:
      "L'annonce stipule : « Une première expérience de deux ans minimum est exigée ».",
    trapAnalysis:
      "A contredit « temps partiel (24 h/semaine) ». B et D ne sont pas formulés dans le texte.",
  },
  {
    id: "ce-101-q9",
    questionNumber: 9,
    nclcTargetLevel: 5,
    documentText:
      "CLUB SPORTIF DU LITTORAL\n\nRenouvellement des licences sportives :\nLes dossiers complets doivent être retournés avant le 30 juin pour garantir votre place à la rentrée. Tout dossier déposé après cette date sera soumis à une majoration de 15 €.",
    prompt: "Que se passe-t-il si un dossier est rendu après le 30 juin ?",
    options: {
      A: "L'inscription est automatiquement annulée.",
      B: "Le membre doit payer un supplément de 15 €.",
      C: "Le club refuse tout nouvel adhérent.",
      D: "Le tarif annuel est réduit de 15 €.",
    },
    correctOption: "B",
    explanation:
      "Le document précise qu'il y aura une « majoration de 15 € » (c'est-à-dire un coût supplémentaire).",
    trapAnalysis:
      "A est faux (le dossier est accepté mais avec surcoût). D confond majoration et réduction.",
  },
  {
    id: "ce-101-q10",
    questionNumber: 10,
    nclcTargetLevel: 5,
    documentText:
      "SALON DE THÉ « L'INSTANT GOURMAND »\n\nÀ l'occasion de notre anniversaire, nous offrons une boisson chaude pour toute pâtisserie achetée le mercredi après-midi. Offre non cumulable avec les cartes cadeaux et limitée à une boisson par client.",
    prompt: "Quelle est la condition pour obtenir une boisson chaude gratuite ?",
    options: {
      A: "Acheter un gâteau le mercredi après-midi.",
      B: "Venir avec une carte cadeau.",
      C: "Consommer plus de trois boissons.",
      D: "Être client depuis plus d'un an.",
    },
    correctOption: "A",
    explanation:
      "L'offre est valable « pour toute pâtisserie achetée le mercredi après-midi ».",
    trapAnalysis:
      "B est exclu (« non cumulable avec les cartes cadeaux »). D est un contresens sur « anniversaire » du salon.",
  },
  {
    id: "ce-101-q11",
    questionNumber: 11,
    nclcTargetLevel: 5,
    documentText:
      "APPARTEMENT À LOUER — QUARTIER MONTCALM\n\nBeau 3 pièces de 65 m², cuisine équipée, balcon sans vis-à-vis. Chauffage électrique individuel non compris dans les charges. Animaux non admis. Libre immédiatement.",
    prompt: "Quelle dépense n'est pas incluse dans le montant des charges ?",
    options: {
      A: "L'accès au balcon.",
      B: "Le loyer principal.",
      C: "Le chauffage de l'appartement.",
      D: "L'équipement de la cuisine.",
    },
    correctOption: "C",
    explanation:
      "Le texte précise : « Chauffage électrique individuel non compris dans les charges ».",
    trapAnalysis:
      "A et D font partie intégrante de la description du logement. B est le loyer lui-même, pas une composante des charges.",
  },
  {
    id: "ce-101-q12",
    questionNumber: 12,
    nclcTargetLevel: 5,
    documentText:
      "ATELIER D'INITIATION À LA CÉRAMIQUE\n\nVenez créer votre premier bol artisanal le samedi 22 avril de 14h à 17h. Tout le matériel ainsi que la cuisson des pièces sont inclus dans le prix d'entrée (40 €). Pensez simplement à porter des vêtements confortables.",
    prompt: "Que doivent prévoir les participants pour cet atelier ?",
    options: {
      A: "Leur propre argile et leurs outils.",
      B: "Une tenue confortable.",
      C: "Un supplément pour la cuisson.",
      D: "Un récipient pour transporter l'argile.",
    },
    correctOption: "B",
    explanation:
      "L'annonce recommande : « Pensez simplement à porter des vêtements confortables ».",
    trapAnalysis:
      "A et C sont explicitement compris dans le tarif (« matériel ainsi que cuisson inclus »).",
  },

  // ==========================================
  // NIVEAU B1 (Questions 13 à 18)
  // ==========================================
  {
    id: "ce-101-q13",
    questionNumber: 13,
    nclcTargetLevel: 6,
    documentText:
      "Le télétravail s'est durablement installé dans les entreprises. Si 68 % des salariés l'apprécient pour l'économie de temps de trajet, une étude récente souligne que près d'un tiers d'entre eux ressentent un sentiment d'isolement social. Pour y remédier, de plus en plus de directions instaurent des journées présentielles obligatoires afin de maintenir la cohésion d'équipe.",
    prompt: "Quelle est l'idée directrice du paragraphe ?",
    options: {
      A: "Le télétravail est rejeté par une large majorité de travailleurs.",
      B: "Les entreprises suppriment définitivement le travail à distance.",
      C: "Le télétravail est plébiscité mais nécessite un encadrement pour éviter l'isolement.",
      D: "Le temps de transport n'a aucun impact sur le bien-être des salariés.",
    },
    correctOption: "C",
    explanation:
      "Le texte met en balance l'appréciation du gain de temps (68 %) et l'inconvénient de l'isolement (un tiers), justifiant la recherche d'un équilibre.",
    trapAnalysis:
      "A est contredit par les 68 %. B est une exagération. D contredit le début du texte.",
  },
  {
    id: "ce-101-q14",
    questionNumber: 14,
    nclcTargetLevel: 6,
    documentText:
      "CONSIGNE DE SÉCURITÉ EN LABORATOIRE\n\nLe port de lunettes de protection et de gants en nitrile est impératif dès l'entrée dans la zone de manipulation. Toute personne refusant de se conformer à ces directives sera immédiatement invitée à quitter les lieux par le responsable d'hygiène.",
    prompt: "Que risque un intervenant qui n'applique pas ces consignes ?",
    options: {
      A: "Une amende financière immédiate.",
      B: "L'obligation de nettoyer la zone de travail.",
      C: "L'exclusion immédiate de la zone de manipulation.",
      D: "Le renouvellement de son matériel aux frais du laboratoire.",
    },
    correctOption: "C",
    explanation:
      "Le texte énonce : « sera immédiatement invitée à quitter les lieux », ce qui équivaut à une exclusion.",
    trapAnalysis:
      "A, B et D ne figurent pas dans les sanctions prévues par la note.",
  },
  {
    id: "ce-101-q15",
    questionNumber: 15,
    nclcTargetLevel: 6,
    documentText:
      "GUIDE DE CONSOMMATION RESPONSABLE\n\nPrivilégier les fruits et légumes de saison ne permet pas seulement de soutenir l'agriculture locale : cette habitude garantit également un meilleur apport nutritionnel. Les produits cueillis à maturité conservent en effet l'essentiel de leurs vitamines, contrairement aux denrées transportées pendant des semaines en cales réfrigérées.",
    prompt: "D'après ce guide, quel est le bénéfice nutritionnel des produits de saison ?",
    options: {
      A: "Ils sont moins caloriques que les produits importés.",
      B: "Ils préservent une teneur en vitamines supérieure.",
      C: "Ils se conservent plus longtemps au réfrigérateur.",
      D: "Ils sont exempts de toute trace de minéraux.",
    },
    correctOption: "B",
    explanation:
      "Le texte explique que « cueillis à maturité, ils conservent l'essentiel de leurs vitamines ».",
    trapAnalysis:
      "A, C et D sont absents de l'argumentation ou scientifiquement faux dans ce contexte.",
  },
  {
    id: "ce-101-q16",
    questionNumber: 16,
    nclcTargetLevel: 6,
    documentText:
      "COMMUNIQUÉ DE LA COMPAGNIE FERROVIAIRE\n\nAfin de moderniser le système d'aiguillage, d'importants travaux nocturnes seront menés entre 23h00 et 5h00 du matin sur l'axe principal. Bien que la circulation des trains de jour ne soit pas interrompue, des ralentissements temporaires de 10 à 15 minutes sont à prévoir sur les premiers départs matinaux.",
    prompt: "Quel impact ces travaux auront-ils sur les usagers ?",
    options: {
      A: "Tous les trains de journée seront supprimés.",
      B: "Les premiers trains du matin subiront de légers retards.",
      C: "Aucun train ne circulera le week-end.",
      D: "Les départs en soirée seront avancés d'une heure.",
    },
    correctOption: "B",
    explanation:
      "Le communiqué prévoit « des ralentissements temporaires de 10 à 15 minutes sur les premiers départs matinaux ».",
    trapAnalysis:
      "A contredit « la circulation des trains de jour n'est pas interrompue ». C et D inventent des mesures non écrites.",
  },
  {
    id: "ce-101-q17",
    questionNumber: 17,
    nclcTargetLevel: 6,
    documentText:
      "L'essor des vélos en libre-service a transformé la mobilité urbaine. En facilitant les trajets intermédiaires de moins de trois kilomètres, ce dispositif désengorge sensiblement les transports en commun souterrains aux heures de pointe. Les municipalités constatent toutefois que l'entretien du parc et la redistribution des vélos représentent un défi logistique permanent.",
    prompt: "Quelle difficulté est soulignée concernant ce service de vélos ?",
    options: {
      A: "Le manque d'intérêt flagrant des citadins.",
      B: "L'augmentation des accidents dans les stations de métro.",
      C: "La gestion logistique et la maintenance de la flotte.",
      D: "Le coût excessif des abonnements pour les usagers.",
    },
    correctOption: "C",
    explanation:
      "La phrase finale mentionne : « l'entretien du parc et la redistribution des vélos représentent un défi logistique permanent ».",
    trapAnalysis:
      "A est contredit par « essor des vélos ». B et D ne sont pas formulés.",
  },
  {
    id: "ce-101-q18",
    questionNumber: 18,
    nclcTargetLevel: 6,
    documentText:
      "RAPPORT SUR LE TRI DES DÉCHETS EN ENTREPRISE\n\nSi la mise en place de poubelles de tri sélectif est désormais généralisée, l'efficacité réelle du recyclage reste tributaire du civisme des usagers. L'introduction d'un seul emballage souillé dans le bac de papier peut en effet contraindre le centre de traitement à réorienter l'ensemble du lot vers l'incinération.",
    prompt: "Quelle conséquence peut entraîner une erreur de tri dans une poubelle de papier ?",
    options: {
      A: "L'arrêt définitif du centre de traitement.",
      B: "L'obligation d'incinérer toute la benne concernée.",
      C: "Une sanction disciplinaire automatique contre l'employé.",
      D: "Une baisse immédiate du prix du papier recyclé.",
    },
    correctOption: "B",
    explanation:
      "Le texte note qu'une erreur peut « contraindre le centre à réorienter l'ensemble du lot vers l'incinération ».",
    trapAnalysis:
      "A est disproportionné. C et D n'ont aucun rapport avec le texte.",
  },

  // ==========================================
  // NIVEAU B2 (Questions 19 à 28 — PALIER NCLC 7)
  // ==========================================
  {
    id: "ce-101-q19",
    questionNumber: 19,
    nclcTargetLevel: 7,
    documentText:
      "L'économie circulaire ne se résume plus à une simple démarche de recyclage : elle propose une refonte complète des modes de production. En concevant des objets réparables et en valorisant les coproduits industriels, elle cherche à dissocier la croissance économique de la consommation brute de ressources vierges. Pour les industriels, cette transition exige d'abandonner l'obsolescence programmée au profit de modèles fondés sur l'usage et la durabilité.",
    prompt: "Selon l'auteur, quelle rupture fondamentale impose l'économie circulaire aux industriels ?",
    options: {
      A: "Elle les incite à privilégier l'usage durable des biens plutôt que leur renouvellement accéléré.",
      B: "Elle les oblige à cesser immédiatement toute activité commerciale à l'international.",
      C: "Elle leur impose d'utiliser exclusivement des matériaux synthétiques non recyclables.",
      D: "Elle réduit leur rentabilité sans apporter de bénéfice écologique tangible.",
    },
    correctOption: "A",
    explanation:
      "Le texte affirme qu'elle exige d'« abandonner l'obsolescence programmée au profit de modèles fondés sur l'usage et la durabilité ».",
    trapAnalysis:
      "B est une exagération. C est le contraire de la valorisation des ressources. D est un jugement pessimiste absent du texte.",
  },
  {
    id: "ce-101-q20",
    questionNumber: 20,
    nclcTargetLevel: 7,
    documentText:
      "L'attractivité des centres-villes repose sur un équilibre précaire entre dynamisme commercial et préservation du patrimoine architectural. Si la piétonnisation intégrale d'un quartier stimule la fréquentation des terrasses et des commerces de bouche, elle peut simultanément fragiliser les commerces traditionnels de proximité dont la clientèle dépendait de facilités d'accès en véhicule. Les urbanistes doivent dès lors concevoir des dessertes de substitution adaptées.",
    prompt: "Quel paradoxe la piétonnisation des centres-villes révèle-t-elle ?",
    options: {
      A: "Elle augmente la pollution atmosphérique en créant des bouchons aux abords immédiats.",
      B: "Elle favorise certains secteurs d'activité tout en pénalisant d'autres types de commerces.",
      C: "Elle attire les touristes mais fait fuir la totalité des investisseurs immobiliers.",
      D: "Elle est moins coûteuse que prévu mais suscite le mécontentement général des piétons.",
    },
    correctOption: "B",
    explanation:
      "Le texte oppose le fait qu'elle « stimule les terrasses et commerces de bouche » mais « fragilise les commerces traditionnels dont la clientèle dépendait du véhicule ».",
    trapAnalysis:
      "A n'est pas le point central développé. C et D contiennent des affirmations extrêmes non étayées.",
  },
  {
    id: "ce-101-q21",
    questionNumber: 21,
    nclcTargetLevel: 7,
    documentText:
      "Dans le milieu éducatif, l'introduction des manuels scolaires numériques suscite des débats passionnés. Leurs partisans mettent en avant l'allègement du cartable des élèves et la possibilité d'intégrer des vidéos interactives explicatives. À l'inverse, plusieurs neurologues s'alarment d'une diminution mesurable de la mémorisation en profondeur, la lecture sur écran favorisant un balayage rapide de l'information plutôt qu'une analyse critique.",
    prompt: "Quel inconvénient majeur les spécialistes du cerveau attribuent-ils à la lecture sur écran ?",
    options: {
      A: "Une fatigue oculaire qui empêche toute concentration prolongée en classe.",
      B: "Une assimilation superficielle des textes au détriment d'une compréhension approfondie.",
      C: "Une dépendance excessive aux réseaux sociaux pendant les heures d'étude.",
      D: "Une incapacité totale à déchiffrer les schémas et graphiques scientifiques.",
    },
    correctOption: "B",
    explanation:
      "Le texte souligne une « diminution de la mémorisation en profondeur » due au fait que l'écran favorise un « balayage rapide plutôt qu'une analyse critique ».",
    trapAnalysis:
      "A est un problème physique souvent cité mais non mentionné ici. C dérive sur les réseaux sociaux. D est une exagération.",
  },
  {
    id: "ce-101-q22",
    questionNumber: 22,
    nclcTargetLevel: 7,
    documentText:
      "La préservation des forêts boréales canadiennes est devenue un enjeu stratégique planétaire. Ces immenses étendues végétales stockent des quantités colossales de carbone organique dans leurs sols tourbeux. Or, l'accélération des feux de végétation, amplifiée par les sécheresses récurrentes, risque d'inverser ce mécanisme : au lieu de piéger les gaz à effet de serre, la forêt boréale pourrait se transformer en source émettrice majeure.",
    prompt: "Quelle menace écologique spécifique le texte met-il en exergue ?",
    options: {
      A: "La disparition complète de la faune sauvage d'ici une décennie.",
      B: "La reconversion des forêts en terres agricoles intensives.",
      C: "La transformation d'un puits de carbone naturel en émetteur de gaz à effet de serre.",
      D: "L'inondation permanente des sols tourbeux due aux fortes précipitations.",
    },
    correctOption: "C",
    explanation:
      "Le texte explicite : « au lieu de piéger les gaz à effet de serre, la forêt pourrait se transformer en source émettrice majeure ».",
    trapAnalysis:
      "A est alarmiste sans base textuelle. B n'est pas le sujet. D dit l'inverse (on parle de sécheresses, pas d'inondations).",
  },
  {
    id: "ce-101-q23",
    questionNumber: 23,
    nclcTargetLevel: 7,
    documentText:
      "L'engouement contemporain pour les applications de bien-être et de suivi personnel (sommeil, nutrition, activité physique) reflète une volonté d'autonomie accrue face à sa propre santé. Néanmoins, certains sociologues préviennent que cette quantification constante des constantes biologiques peut engendrer une anxiété de performance contre-productive, l'individu se jugeant continuellement à l'aune de données numériques normées.",
    prompt: "Quelle dérive potentielle est associée à l'usage systématique de ces applications ?",
    options: {
      A: "La substitution des médecins généralistes par des algorithmes non certifiés.",
      B: "Le développement d'un stress lié à la quête permanente d'indicateurs optimaux.",
      C: "La hausse incontrôlée des dépenses pharmaceutiques chez les jeunes adultes.",
      D: "Une perte d'intérêt rapide conduisant à l'abandon de toute pratique sportive.",
    },
    correctOption: "B",
    explanation:
      "Les sociologues pointent une « anxiété de performance contre-productive, l'individu se jugeant continuellement à l'aune de données normées ».",
    trapAnalysis:
      "A déforme le propos. C et D ne sont pas formulés.",
  },
  {
    id: "ce-101-q24",
    questionNumber: 24,
    nclcTargetLevel: 8,
    documentText:
      "La pénurie de main-d'œuvre qualifiée dans les régions canadiennes a incité les provinces à repenser leurs critères de sélection des immigrants. En valorisant les profils techniques et médicaux capables de s'installer en dehors des grandes métropoles comme Montréal, Toronto ou Vancouver, les programmes provinciaux entendent revitaliser le tissu économique rural et freiner le vieillissement démographique local.",
    prompt: "Quel objectif fondamental poursuivent les réformes provinciales d'immigration évoquées ?",
    options: {
      A: "Restreindre l'accueil des travailleurs étrangers aux seuls postes d'encadrement supérieur.",
      B: "Concentrer les investissements publics exclusivement dans les mégapoles du pays.",
      C: "Répartir l'apport migratoire vers les régions pour répondre aux besoins économiques locaux.",
      D: "Réduire les exigences linguistiques requises pour les professions de la santé.",
    },
    correctOption: "C",
    explanation:
      "Le texte met en avant la volonté de sélectionner des profils « en dehors des grandes métropoles » pour « revitaliser le tissu économique rural et freiner le vieillissement ».",
    trapAnalysis:
      "A et B vont à l'encontre de la décentralisation expliquée. D est un contresens complet.",
  },
  {
    id: "ce-101-q25",
    questionNumber: 25,
    nclcTargetLevel: 8,
    documentText:
      "L'essor des plateformes de streaming musical a démocratisé l'accès au répertoire mondial, mais a profondément bouleversé le modèle économique des artistes. Avec un système de rémunération au prorata des flux globaux, les revenus se concentrent massivement sur une poignée de vedettes internationales, laissant les créateurs émergents et les musiques de niche dans une précarité financière sans précédent.",
    prompt: "Quelle critique principale est adressée au modèle de redistribution du streaming ?",
    options: {
      A: "Il bloque la diffusion des œuvres auprès des jeunes générations.",
      B: "Il défavorise les artistes indépendants au profit des têtes d'affiche mondiales.",
      C: "Il oblige les créateurs à produire exclusivement des albums acoustiques.",
      D: "Il détériore irrémédiablement la qualité d'enregistrement des morceaux studio.",
    },
    correctOption: "B",
    explanation:
      "Le texte dénonce que « les revenus se concentrent massivement sur une poignée de vedettes, laissant les créateurs émergents dans une précarité sans précédent ».",
    trapAnalysis:
      "A est faux (démocratisation de l'accès). C et D sont hors sujet.",
  },
  {
    id: "ce-101-q26",
    questionNumber: 26,
    nclcTargetLevel: 8,
    documentText:
      "Les micro-forêts urbaines, inspirées de la méthode du botaniste Akira Miyawaki, gagnent en popularité dans les métropoles denses. En plantant des espèces indigènes très rapprochées sur des parcelles réduites, on accélère la croissance végétale et la création de corridors de biodiversité. Si leur capacité d'absorption thermique locale est incontestable, certains paysagistes rappellent qu'elles ne sauraient remplacer de vastes parcs publics ouverts à la promenade collective.",
    prompt: "Quelle nuance les paysagistes apportent-ils quant à l'utilité des micro-forêts ?",
    options: {
      A: "Leur coût de plantation est exorbitant comparé aux bénéfices écologiques.",
      B: "Elles ne peuvent pas se substituer aux grands espaces verts d'agrément pour les citoyens.",
      C: "Les espèces végétales choisies dépérissent rapidement en milieu urbain pollué.",
      D: "Elles augmentent la température ambiante au lieu de la réguler.",
    },
    correctOption: "B",
    explanation:
      "Les paysagistes précisent qu'« elles ne sauraient remplacer de vastes parcs publics ouverts à la promenade collective ».",
    trapAnalysis:
      "A et C ne sont pas évoqués. D est contredit par « capacité d'absorption thermique locale incontestable ».",
  },
  {
    id: "ce-101-q27",
    questionNumber: 27,
    nclcTargetLevel: 8,
    documentText:
      "La généralisation du télétravail a bousculé le droit à la déconnexion. Lorsque le domicile devient le lieu de production, la frontière poreuse entre vie professionnelle et sphère intime incite les cadres à répondre aux courriels tard le soir. Les conventions collectives doivent désormais formaliser des plages d'inaccessibilité numérique stricte pour prémunir les équipes contre l'épuisement professionnel.",
    prompt: "Pourquoi la formalisation du droit à la déconnexion devient-elle indispensable ?",
    options: {
      A: "Pour réduire la facture d'électricité des salariés qui travaillent chez eux.",
      B: "Pour éviter que la confusion entre espace privé et travail n'entraîne un surmenage.",
      C: "Pour contraindre les employés à terminer leurs tâches avant dix-sept heures précises.",
      D: "Pour supprimer l'usage des téléphones mobiles dans le cadre professionnel.",
    },
    correctOption: "B",
    explanation:
      "Le texte explique que la « frontière poreuse entre vie professionnelle et intime » incite au travail tardif et requiert des règles pour « prémunir contre l'épuisement ».",
    trapAnalysis:
      "A, C et D extrapolent de manière erronée des détails administratifs non pertinents.",
  },
  {
    id: "ce-101-q28",
    questionNumber: 28,
    nclcTargetLevel: 8,
    documentText:
      "L'architecture bioclimatique privilégie l'orientation du bâti et les matériaux à forte inertie thermique pour limiter le recours aux systèmes de climatisation mécanique. En exploitant la trajectoire solaire hivernale et la ventilation naturelle nocturne, ces édifices consomment jusqu'à 70 % d'énergie en moins. Leur conception nécessite toutefois une expertise d'ingénierie fine dès la phase d'esquisse, excluant les modèles de construction standardisés.",
    prompt: "Quelle exigence fondamentale caractérise la conception bioclimatique ?",
    options: {
      A: "L'obligation d'installer des climatiseurs de dernière génération dans chaque pièce.",
      B: "L'emploi exclusif de verre teinté pour bloquer l'intégralité du rayonnement solaire.",
      C: "Une personnalisation technique poussée dès la genèse du projet architectural.",
      D: "L'interdiction formelle d'ouvrir les fenêtres durant la nuit en période estivale.",
    },
    correctOption: "C",
    explanation:
      "Le texte conclut que leur conception « nécessite une expertise d'ingénierie fine dès la phase d'esquisse, excluant les modèles standardisés ».",
    trapAnalysis:
      "A contredit « limiter le recours à la climatisation ». B et D sont l'inverse des principes de captation solaire et de ventilation naturelle.",
  },

  // ==========================================
  // NIVEAU C1 (Questions 29 à 35)
  // ==========================================
  {
    id: "ce-101-q29",
    questionNumber: 29,
    nclcTargetLevel: 9,
    documentText:
      "L'illusion de gratuité entretenue par les géants du numérique a forgé une économie de l'attention où le temps de cerveau disponible constitue la véritable marchandise. En concevant des interfaces fondées sur la gratification instantanée et les récompenses aléatoires, ces plateformes court-circuitent les mécanismes de régulation réflexive de l'utilisateur. Dès lors, invoquer le seul libre arbitre individuel face à des architectures comportementales savamment calibrées relève d'une candeur feinte ou d'une mauvaise foi patentée.",
    prompt: "Quelle thèse l'auteur soutient-il avec vigueur dans cet extrait ?",
    options: {
      A: "Les utilisateurs conservent une maîtrise souveraine de leur consommation d'écrans.",
      B: "La gratuité apparente dissimule une ingénierie de captation cognitive qui outrepasse la seule volonté individuelle.",
      C: "Le modèle publicitaire numérique a échoué à monétiser le temps passé par les internautes.",
      D: "Les interfaces algorithmiques sont développées dans l'unique but d'améliorer les facultés d'analyse des jeunes.",
    },
    correctOption: "B",
    explanation:
      "L'auteur fustige l'idée selon laquelle la volonté individuelle suffirait face à des « architectures comportementales savamment calibrées » conçues pour court-circuiter la réflexivité.",
    trapAnalysis:
      "A est précisément la thèse que l'auteur réfute (« candeur feinte »). C et D sont contraires au texte.",
  },
  {
    id: "ce-101-q30",
    questionNumber: 30,
    nclcTargetLevel: 9,
    documentText:
      "La patrimonialisation excessive de certains centres historiques européens les fige dans une scénographie muséale qui expulse subrepticement les populations autochtones. Sous couvert de préserver l'authenticité des façades, on voit proliférer des résidences touristiques éphémères et des échoppes standardisées au détriment du tissu commercial vernaculaire. La ville perd ainsi sa fonction première d'organisme vivant pour devenir un décor factice destiné à la consommation visuelle des visiteurs transitoires.",
    prompt: "Quel processus l'auteur dénonce-t-il sous le terme de scénographie muséale ?",
    options: {
      A: "La rénovation énergétique indispensable des bâtisses anciennes.",
      B: "La transformation d'un espace urbain vivant en parc d'attractions pour touristes au détriment des habitants réels.",
      C: "La fermeture définitive de tous les musées d'art contemporain dans les capitales.",
      D: "L'expropriation brutale ordonnée par l'État pour bâtir des zones industrielles.",
    },
    correctOption: "B",
    explanation:
      "Le texte décrit une dérive où la ville « expulse subrepticement les populations autochtones » pour devenir « un décor factice destiné à la consommation visuelle des visiteurs ».",
    trapAnalysis:
      "A, C et D travestissent le texte ou introduisent des concepts sans rapport avec la muséification urbaine.",
  },
  {
    id: "ce-101-q31",
    questionNumber: 31,
    nclcTargetLevel: 9,
    documentText:
      "Le concept de sobriété énergétique, longtemps relégué aux marges de la pensée technocratique, s'impose désormais comme le pivot incontournable de toute transition viable. Les promesses d'efficacité technique — consommer moins par unité produite — se heurtent immanquablement à l'effet rebond : les gains d'efficience sont engloutis par une hausse exponentielle des volumes globaux. Sans une modération délibérée des usages et un questionnement lucide sur nos besoins réels, l'innovation technique ne fait que repousser l'échéance des ruptures écologiques.",
    prompt: "Selon l'auteur, pourquoi l'efficacité technique est-elle insuffisante pour endiguer la crise écologique ?",
    options: {
      A: "Parce que les coûts financiers de la recherche fondamentale restent prohibitifs.",
      B: "Parce que l'effet rebond annule les bénéfices unitaires par un accroissement de la consommation totale.",
      C: "Parce que les énergies renouvelables sont incapables de produire de l'électricité en continu.",
      D: "Parce que les citoyens refusent catégoriquement de changer d'appareils électroménagers.",
    },
    correctOption: "B",
    explanation:
      "L'auteur argumente que « les gains d'efficience sont engloutis par une hausse exponentielle des volumes globaux » (l'effet rebond).",
    trapAnalysis:
      "A, C et D soulèvent d'autres débats techniques absents de la démonstration rigoureuse de l'auteur.",
  },
  {
    id: "ce-101-q32",
    questionNumber: 32,
    nclcTargetLevel: 9,
    documentText:
      "L'idéologie du mérite individuel, pierre angulaire des démocraties contemporaines, occulte commodément le rôle déterminant du capital social et culturel hérité. En proclamant l'égalité des chances au départ, elle confère aux vainqueurs de la compétition scolaire une légitimité morale injustifiée, tout en infligeant aux vaincus le fardeau culpabilisant de leur propre échec. Cette méritocratie formelle tend ainsi à naturaliser les inégalités structurelles sous les dehors séduisants d'une justice distributive impartiale.",
    prompt: "Quel effet pervers de la méritocratie l'auteur met-il en lumière ?",
    options: {
      A: "Elle dissuade les enfants de milieux défavorisés de fréquenter l'école primaire.",
      B: "Elle légitime moralement les privilèges des favorisés en imputant l'échec aux seuls individus.",
      C: "Elle récompense exclusivement l'ancienneté au détriment des compétences réelles.",
      D: "Elle supprime toute forme de hiérarchie dans les entreprises privées.",
    },
    correctOption: "B",
    explanation:
      "Le texte dénonce le fait qu'elle « confère aux vainqueurs une légitimité morale injustifiée, tout en infligeant aux vaincus le fardeau culpabilisant de leur propre échec ».",
    trapAnalysis:
      "A est une conséquence non formulée. C et D contredisent les fondements mêmes de la critique méritocratique.",
  },
  {
    id: "ce-101-q33",
    questionNumber: 33,
    nclcTargetLevel: 9,
    documentText:
      "La diffusion des outils d'intelligence artificielle générative dans la sphère créative renouvelle la querelle séculaire sur le statut de l'auteur. L'automatisation de la production textuelle ou iconographique ne disqualifie pas tant l'artiste qu'elle ne déplace son rôle vers l'orchestration critique et le discernement éthique. Dès lors que la virtuosité technique se banalise par le truchement de l'algorithme, la singularité esthétique réside moins dans l'exécution matérielle que dans l'intention conceptuelle qui préside à l'assemblage des fragments.",
    prompt: "D'après l'extrait, comment l'artiste redéfinit-il sa valeur à l'ère de l'intelligence artificielle ?",
    options: {
      A: "En apprenant à coder lui-même les réseaux neuronaux sans intermédiaire.",
      B: "En se concentrant sur la posture conceptuelle et le jugement critique plutôt que sur la dextérité technique.",
      C: "En rejetant catégoriquement tout apport numérique pour revenir aux pigments artisanaux.",
      D: "En revendiquant des droits d'auteur exclusifs sur les bases de données d'apprentissage.",
    },
    correctOption: "B",
    explanation:
      "Le texte affirme que la singularité réside « moins dans l'exécution matérielle que dans l'intention conceptuelle » et déplace le rôle vers « l'orchestration critique ».",
    trapAnalysis:
      "A est une vision informatique étroite. C est un passéisme non prôné ici. D est une dimension juridique secondaire.",
  },
  {
    id: "ce-101-q34",
    questionNumber: 34,
    nclcTargetLevel: 10,
    documentText:
      "La crise de représentativité des institutions politiques occidentales ne découle pas d'une apathie citoyenne, mais plutôt d'un désajustement temporel. Alors que la décision publique obéit à des protocoles délibératifs lents et procéduriers, les flux d'information numériques façonnent des attentes d'immédiateté et de réactivité instantanée. Incapable de rivaliser avec la vitesse de réaction des arènes virtuelles, l'action publique apparaît désespérément anachronique aux yeux d'un corps électoral accoutumé à l'instantanéité transactionnelle.",
    prompt: "Quelle cause fondamentale l'auteur identifie-t-il au désamour démocratique ?",
    options: {
      A: "La corruption systémique généralisée des élus de proximité.",
      B: "Le refus délibéré des citoyens de s'informer sur les enjeux électoraux majeurs.",
      C: "Le fossé temporel entre la lenteur de la délibération institutionnelle et l'exigence d'instantanéité numérique.",
      D: "L'absence d'outils de vote électronique sécurisés lors des scrutins nationaux.",
    },
    correctOption: "C",
    explanation:
      "L'auteur parle explicitement d'un « désajustement temporel » entre « protocoles lents » et « attentes d'immédiateté façonnées par les flux numériques ».",
    trapAnalysis:
      "A et B sont des stéréotypes réfutés dès la première phrase. D est une considération purement matérielle.",
  },
  {
    id: "ce-101-q35",
    questionNumber: 35,
    nclcTargetLevel: 10,
    documentText:
      "L'injonction contemporaine à la transparence intégrale, souvent parée des vertus cardinales de l'intégrité démocratique, recèle un paradoxe insidieux. En éradiquant toute zone d'ombre et tout recul intime, elle instaure un panoptique social où chaque parole est scrutée, décontextualisée et jugée à l'aune d'une pureté morale intransigeante. Loin d'assainir le débat public, cette surexposition permanente paralyse la nuance, inhibe l'audace intellectuelle et contraint les acteurs à un conformisme prudent.",
    prompt: "Quelle conséquence néfaste de l'idéologie de la transparence l'auteur dénonce-t-il ?",
    options: {
      A: "La disparition de la presse d'investigation indépendante.",
      B: "L'inhibition de la pensée nuancée au profit d'un conformisme frileux.",
      C: "L'augmentation des fraudes fiscales permise par la dissimulation légale.",
      D: "La contestation des décisions judiciaires par des tribunaux populaires.",
    },
    correctOption: "B",
    explanation:
      "La conclusion de l'auteur est sans appel : cette surexposition « paralyse la nuance, inhibe l'audace intellectuelle et contraint les acteurs à un conformisme prudent ».",
    trapAnalysis:
      "A, C et D sont hors sujet ou contraires à la thèse développée par l'auteur sur la transparence excessive.",
  },

  // ==========================================
  // NIVEAU C2 (Questions 36 à 39)
  // ==========================================
  {
    id: "ce-101-q36",
    questionNumber: 36,
    nclcTargetLevel: 10,
    documentText:
      "L'exercice de la critique littéraire contemporaine vacille souvent entre deux écueils symétriques : le formalisme désincarné, qui réduit l'œuvre à une combinatoire mécanique de signifiants, et l'historicisme paresseux, qui dissout sa singularité stylistique dans les déterminismes sociologiques de son époque. Dans les deux cas, on fait l'économie de la rencontre intime avec le texte, c'est-à-dire de cette trouée poétique où une voix singulière subvertit la langue commune pour fonder une vérité qui lui est propre.",
    prompt: "Que reproche fondamentalement l'auteur aux deux approches critiques qu'il met en parallèle ?",
    options: {
      A: "Elles privilégient la biographie anecdotique de l'écrivain au mépris des archives historiques.",
      B: "Elles éludent l'expérience esthétique vivante et la puissance poétique singulière de l'écriture.",
      C: "Elles se montrent excessivement complaisantes envers les œuvres de divertissement populaire.",
      D: "Elles négligent l'étude de la grammaire normative au profit de jargons étrangers.",
    },
    correctOption: "B",
    explanation:
      "L'auteur fustige le fait que « dans les deux cas, on fait l'économie de la rencontre intime avec le texte... où une voix singulière subvertit la langue commune ».",
    trapAnalysis:
      "A contredit la critique de l'historicisme. C et D inventent des griefs absents du texte.",
  },
  {
    id: "ce-101-q37",
    questionNumber: 37,
    nclcTargetLevel: 10,
    documentText:
      "La nostalgie, longtemps disqualifiée comme une pathologie régressive ou un refuge mélancolique stérile, peut paradoxalement opérer comme un vecteur de résistance critique. En confrontant les promesses non tenues de la modernité marchande aux utopies inaccomplies du passé, le regard rétrospectif dénaturalise l'ordre établi. Il rappelle que le présent n'est pas le dénouement inéluctable de l'Histoire, mais la résultante contingente de bifurcations où d'autres possibles furent étouffés.",
    prompt: "Quelle fonction subversive l'auteur attribue-t-il à la posture nostalgique ?",
    options: {
      A: "Elle rétablit les coutumes féodales en tant que modèle d'organisation communautaire.",
      B: "Elle réactive des espérances historiques délaissées pour contester la fatalité de l'ordre actuel.",
      C: "Elle guérit les traumatismes individuels par le rejet des technologies numériques.",
      D: "Elle réconcilie les classes sociales dans un culte unanime des traditions nationales.",
    },
    correctOption: "B",
    explanation:
      "Le texte souligne qu'en confrontant le présent « aux utopies inaccomplies du passé », elle montre que le présent « n'est pas le dénouement inéluctable » et dénaturalise l'ordre établi.",
    trapAnalysis:
      "A est une caricature réactionnaire. C et D dévient complètement du propos philosophique de l'auteur.",
  },
  {
    id: "ce-101-q38",
    questionNumber: 38,
    nclcTargetLevel: 10,
    documentText:
      "L'épistémologie des sciences du vivant traverse une révolution sourde avec l'effritement du paradigme mécaniste hérité des Lumières. L'organisme n'est plus concevable comme un assemblage d'organes-rouages soumis à un programme génétique déterministe, mais comme un réseau d'interactions dynamiques ouvert sur son environnement. Cette ontologie relationnelle brouille les démarcations classiques entre le soi et le non-soi, obligeant la biologie à abandonner le modèle de la forteresse immunitaire pour celui du métissage symbiotique.",
    prompt: "Quel revirement conceptuel majeur l'auteur décrit-il dans la compréhension du vivant ?",
    options: {
      A: "Le triomphe définitif du réductionnisme génétique sur l'écologie des populations.",
      B: "Le passage d'une vision mécanique et défensive à une approche relationnelle et symbiotique de l'organisme.",
      C: "La démonstration mathématique de l'inutilité des défenses immunitaires naturelles.",
      D: "L'abandon complet de l'expérimentation clinique au bénéfice de pures déductions théoriques.",
    },
    correctOption: "B",
    explanation:
      "L'auteur décrit l'abandon de l'organisme comme « assemblage d'organes-rouages » et « forteresse immunitaire » au profit d'une « ontologie relationnelle » et d'un « métissage symbiotique ».",
    trapAnalysis:
      "A est exactement le paradigme qui s'effrite. C est une exagération absurde. D n'est pas mentionné.",
  },
  {
    id: "ce-101-q39",
    questionNumber: 39,
    nclcTargetLevel: 10,
    documentText:
      "L'éloquence contemporaine, contaminée par la concision péremptoire des slogans publicitaires et la brièveté des messages virtuels, a largement abdiqué sa vocation maïeutique. On ne cherche plus à cheminer patiemment à travers les apories du réel, mais à sidérer l'auditoire par la formule lapidaire qui claque et disqualifie l'adversaire. En sacrifiant le temps long de la syntaxe articulée au profit de la fulgurance polémique, c'est la possibilité même d'un désaccord fécond et d'une pensée commune qui se trouve insidieusement liquidée.",
    prompt: "Quel péril ultime l'auteur associe-t-il à la dégradation de l'art oratoire moderne ?",
    options: {
      A: "La disparition programmée des cours d'art dramatique dans les académies.",
      B: "L'anéantissement de la délibération contradictoire constructive au profit d'une brutalisation du verbe.",
      C: "La domination sans partage des figures politiques âgées sur les débats télévisés.",
      D: "L'incompréhension croissante des textes juridiques par les justiciables ordinaires.",
    },
    correctOption: "B",
    explanation:
      "Le texte conclut qu'en sacrifiant « le temps long de la syntaxe » pour « la fulgurance polémique », c'est « la possibilité même d'un désaccord fécond et d'une pensée commune qui se trouve liquidée ».",
    trapAnalysis:
      "A, C et D sont des extrapolations sans fondement par rapport au réquisitoire philosophique de l'auteur contre la brutalisation du débat.",
  },
];

export const FULL_SERIES_CE_101: ExamSeriesData = {
  id: "demo-101-ce",
  seriesNumber: 101,
  title: "TCF Canada — Compréhension Écrite, Série 101 (Conforme FEI)",
  discipline: "CE",
  durationSeconds: 60 * 60, // 60 minutes
  questions: QUESTIONS_CE_101,
};
