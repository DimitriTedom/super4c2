import type { ExamQuestion, ExamSeriesData } from "./types";

export const QUESTIONS_CO_101: ExamQuestion[] = [
  // ==========================================
  // NIVEAU A1 (Questions 1 à 6)
  // ==========================================
  {
    id: "co-101-q1",
    questionNumber: 1,
    nclcTargetLevel: 3,
    audioUrl: "/audio/co/co-101-q1.mp3",
    documentImageUrl: "/images/co/co-101-q1.png",
    audioTranscript:
      "Bonjour, je voudrais réserver une table pour quatre personnes, ce samedi soir, vers vingt heures, s'il vous plaît.",
    prompt: "Que veut faire la personne ?",
    options: {
      A: "Annuler une réservation.",
      B: "Réserver une table au restaurant.",
      C: "Commander un repas à emporter.",
      D: "Changer l'heure d'un rendez-vous.",
    },
    correctOption: "B",
    explanation: "« Je voudrais réserver une table pour quatre personnes » : c'est une demande de réservation.",
    trapAnalysis: "A et D parlent d'annuler ou modifier, ce qui n'est pas mentionné. C est une autre prestation.",
  },
  {
    id: "co-101-q2",
    questionNumber: 2,
    nclcTargetLevel: 3,
    audioUrl: "/audio/co/co-101-q2.mp3",
    documentImageUrl: "/images/co/co-101-q2.png",
    audioTranscript:
      "Attention, mesdames et messieurs, en raison d'un incident technique, le train à destination de Lyon aura quarante minutes de retard. Nous vous prions de nous excuser pour ce désagrément.",
    prompt: "Quelle information est donnée ?",
    options: {
      A: "Le train pour Lyon est supprimé.",
      B: "Le train pour Lyon part en avance.",
      C: "Le train pour Lyon est en retard.",
      D: "Le quai du train pour Lyon a changé.",
    },
    correctOption: "C",
    explanation: "« Le train à destination de Lyon aura quarante minutes de retard ».",
    trapAnalysis: "A affirme qu'il est supprimé, ce qui est faux. B et D inventent des détails non audibles.",
  },
  {
    id: "co-101-q3",
    questionNumber: 3,
    nclcTargetLevel: 3,
    audioUrl: "/audio/co/co-101-q3.mp3",
    documentImageUrl: "/images/co/co-101-q3.png",
    audioTranscript:
      "Salut Julien, c'est Marc. Je t'appelle pour te confirmer qu'on se retrouve demain à midi et quart devant le cinéma pour déjeuner ensemble. Rappelle-moi dès que tu as ce message !",
    prompt: "À quelle heure ont-ils rendez-vous ?",
    options: {
      A: "À midi pile.",
      B: "À midi et quart.",
      C: "À midi et demi.",
      D: "À treize heures.",
    },
    correctOption: "B",
    explanation: "Marc dit explicitement : « on se retrouve demain à midi et quart ».",
    trapAnalysis: "Les options A, C et D sont des pièges temporels classiques du niveau A1.",
  },
  {
    id: "co-101-q4",
    questionNumber: 4,
    nclcTargetLevel: 4,
    audioUrl: "/audio/co/co-101-q4.mp3",
    documentImageUrl: "/images/co/co-101-q4.png",
    audioTranscript:
      "Chers clients, votre supermarché fermera ses portes exceptionnellement aujourd'hui à dix-neuf heures au lieu de vingt heures trente. Merci de vous diriger vers les caisses.",
    prompt: "Que demande l'annonce aux clients ?",
    options: {
      A: "De faire leurs achats plus vite.",
      B: "De se diriger vers les caisses.",
      C: "De revenir demain matin.",
      D: "De déposer leurs chariots à l'entrée.",
    },
    correctOption: "B",
    explanation: "La consigne finale est : « Merci de vous diriger vers les caisses ».",
    trapAnalysis: "A est une déduction subjective. B est l'action exacte et concrète demandée.",
  },
  {
    id: "co-101-q5",
    questionNumber: 5,
    nclcTargetLevel: 4,
    audioUrl: "/audio/co/co-101-q5.mp3",
    documentImageUrl: "/images/co/co-101-q5.png",
    audioTranscript:
      "Bonjour madame, ce pantalon noir est à trente-cinq euros, mais avec les soldes, vous bénéficiez d'une réduction de dix euros immédiate en caisse.",
    prompt: "Quel est le prix final du pantalon après réduction ?",
    options: {
      A: "Vingt-cinq euros.",
      B: "Trente euros.",
      C: "Trente-cinq euros.",
      D: "Quarante-cinq euros.",
    },
    correctOption: "A",
    explanation: "35 € moins 10 € de réduction immédiate = 25 €.",
    trapAnalysis: "C est le prix initial. D ajoute la réduction au lieu de la déduire.",
  },
  {
    id: "co-101-q6",
    questionNumber: 6,
    nclcTargetLevel: 4,
    audioUrl: "/audio/co/co-101-q6.mp3",
    documentImageUrl: "/images/co/co-101-q6.png",
    audioTranscript:
      "Météo locale pour votre journée de jeudi : de fortes averses de pluie sont attendues dans la matinée avec des températures ne dépassant pas douze degrés. Le soleil reviendra en fin d'après-midi.",
    prompt: "Quel temps fera-t-il jeudi matin ?",
    options: {
      A: "Il fera beau et chaud.",
      B: "Il neigera en plaine.",
      C: "Il y aura de la pluie.",
      D: "Il y aura un grand vent sec.",
    },
    correctOption: "C",
    explanation: "« de fortes averses de pluie sont attendues dans la matinée ».",
    trapAnalysis: "A confond avec la fin d'après-midi. B et D mentionnent des phénomènes absents.",
  },

  // ==========================================
  // NIVEAU A2 (Questions 7 à 12)
  // ==========================================
  {
    id: "co-101-q7",
    questionNumber: 7,
    nclcTargetLevel: 5,
    audioUrl: "/audio/co/co-101-q7.mp3",
    audioTranscript:
      "Ici le cabinet médical du docteur Laurent. Notre secrétariat est ouvert du lundi au vendredi de huit heures à seize heures. En cas d'urgence en dehors de ces horaires, veuillez composer le quinze.",
    prompt: "Que devez-vous faire en cas d'urgence la nuit ?",
    options: {
      A: "Laisser un message sur le répondeur.",
      B: "Composer le numéro quinze.",
      C: "Venir directement au cabinet à huit heures.",
      D: "Envoyer un courrier électronique.",
    },
    correctOption: "B",
    explanation: "« En cas d'urgence en dehors de ces horaires, veuillez composer le quinze ».",
    trapAnalysis: "A et C s'appliquent aux rendez-vous ordinaires, pas aux urgences nocturnes.",
  },
  {
    id: "co-101-q8",
    questionNumber: 8,
    nclcTargetLevel: 5,
    audioUrl: "/audio/co/co-101-q8.mp3",
    audioTranscript:
      "Bonjour Lucas, c'est ta mère. J'ai laissé les clés de la maison chez notre voisine madame Dupont au deuxième étage. Passe les récupérer avant de rentrer car je ne serai là qu'à dix-neuf heures.",
    prompt: "Où Lucas doit-il récupérer les clés ?",
    options: {
      A: "Dans sa boîte aux lettres.",
      B: "Chez la voisine madame Dupont.",
      C: "Au travail de sa mère.",
      D: "Sous le paillasson de l'entrée.",
    },
    correctOption: "B",
    explanation: "« J'ai laissé les clés de la maison chez notre voisine madame Dupont ».",
    trapAnalysis: "A et D sont des distracteurs plausibles dans la vie quotidienne mais non cités.",
  },
  {
    id: "co-101-q9",
    questionNumber: 9,
    nclcTargetLevel: 5,
    audioUrl: "/audio/co/co-101-q9.mp3",
    audioTranscript:
      "Pour emprunter un vélo en libre-service à cette borne, veuillez insérer votre carte bancaire ou scanner le code avec votre application mobile. Le port du casque est vivement recommandé.",
    prompt: "Comment peut-on débloquer un vélo ?",
    options: {
      A: "En payant uniquement en espèces.",
      B: "Avec une carte d'identité.",
      C: "Par carte bancaire ou via l'application mobile.",
      D: "En demandant à un agent sur place.",
    },
    correctOption: "C",
    explanation: "« insérer votre carte bancaire ou scanner le code avec votre application mobile ».",
    trapAnalysis: "A et B contredisent les deux moyens de paiement automatisés décrits.",
  },
  {
    id: "co-101-q10",
    questionNumber: 10,
    nclcTargetLevel: 6,
    audioUrl: "/audio/co/co-101-q10.mp3",
    audioTranscript:
      "Bonjour monsieur, nous avons bien reçu votre commande de livres. Cependant, l'un des titres est en rupture chez l'éditeur. Le reste de votre colis partira aujourd'hui et vous parviendra d'ici quarante-huit heures.",
    prompt: "Quel est le problème avec la commande ?",
    options: {
      A: "Le paiement a été refusé.",
      B: "L'adresse de livraison est incorrecte.",
      C: "Un livre est en rupture de stock.",
      D: "Le colis est totalement annulé.",
    },
    correctOption: "C",
    explanation: "« l'un des titres est en rupture chez l'éditeur ».",
    trapAnalysis: "D est excessif : le reste du colis partira normalement.",
  },
  {
    id: "co-101-q11",
    questionNumber: 11,
    nclcTargetLevel: 6,
    audioUrl: "/audio/co/co-101-q11.mp3",
    audioTranscript:
      "Le musée d'Art contemporain informe ses visiteurs que l'exposition temporaire fermera exceptionnellement à dix-sept heures ce soir pour les préparatifs du vernissage officiel. La collection permanente reste accessible jusqu'à dix-neuf heures.",
    prompt: "Quelle partie du musée ferme plus tôt ce soir ?",
    options: {
      A: "La librairie-boutique.",
      B: "L'exposition temporaire.",
      C: "La collection permanente.",
      D: "Le restaurant du musée.",
    },
    correctOption: "B",
    explanation: "« l'exposition temporaire fermera exceptionnellement à dix-sept heures ce soir ».",
    trapAnalysis: "C reste accessible jusqu'à dix-neuf heures, donc ne ferme pas plus tôt.",
  },
  {
    id: "co-101-q12",
    questionNumber: 12,
    nclcTargetLevel: 6,
    audioUrl: "/audio/co/co-101-q12.mp3",
    audioTranscript:
      "N'oubliez pas que les inscriptions aux cours de natation pour le trimestre de printemps débuteront ce samedi dès huit heures sur le site de la ville. Les places étant limitées, nous vous conseillons de créer votre compte au préalable.",
    prompt: "Quel conseil est donné aux usagers ?",
    options: {
      A: "Venir directement à la piscine samedi.",
      B: "Créer un compte en ligne à l'avance.",
      C: "Payer les cours en plusieurs fois.",
      D: "Attendre le début des cours en mai.",
    },
    correctOption: "B",
    explanation: "« nous vous conseillons de créer votre compte au préalable ».",
    trapAnalysis: "A propose une démarche physique alors que tout se passe en ligne.",
  },

  // ==========================================
  // NIVEAU B1 (Questions 13 à 18)
  // ==========================================
  {
    id: "co-101-q13",
    questionNumber: 13,
    nclcTargetLevel: 6,
    audioUrl: "/audio/co/co-101-q13.mp3",
    audioTranscript:
      "Bonjour à tous. Concernant le réaménagement de nos bureaux en espace ouvert, la direction a entendu vos remarques sur le niveau sonore. Des cabines acoustiques individuelles pour téléphoner seront installées d'ici la fin du mois.",
    prompt: "Quelle mesure la direction a-t-elle adoptée ?",
    options: {
      A: "Supprimer totalement les appels téléphoniques.",
      B: "Réinstaller des bureaux cloisonnés pour chacun.",
      C: "Installer des cabines acoustiques individuelles.",
      D: "Imposer le télétravail à plein temps.",
    },
    correctOption: "C",
    explanation: "« Des cabines acoustiques individuelles pour téléphoner seront installées ».",
    trapAnalysis: "A, B et D sont des solutions extrêmes non retenues par la direction.",
  },
  {
    id: "co-101-q14",
    questionNumber: 14,
    nclcTargetLevel: 6,
    audioUrl: "/audio/co/co-101-q14.mp3",
    audioTranscript:
      "À la radio : la municipalité lance dès lundi une expérimentation de tri des biodéchets dans les quartiers nord. Chaque foyer recevra un seau aéré et des sacs compostables. L'objectif est de réduire d'un tiers le poids de nos poubelles grises d'ici un an.",
    prompt: "Quel est l'objectif principal de cette expérimentation ?",
    options: {
      A: "Interdire l'usage du plastique dans toute la ville.",
      B: "Réduire le volume des ordures ménagères non recyclées.",
      C: "Faire payer une taxe au poids sur les déchets.",
      D: "Distribuer des engrais gratuits aux agriculteurs.",
    },
    correctOption: "B",
    explanation: "« réduire d'un tiers le poids de nos poubelles grises » (ordures ménagères non recyclées).",
    trapAnalysis: "C introduit une taxe non mentionnée ; B reformule fidèlement l'objectif chiffré.",
  },
  {
    id: "co-101-q15",
    questionNumber: 15,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q15.mp3",
    audioTranscript:
      "Entretien avec une architecte : « Contrairement à une idée répandue, rénover un bâtiment ancien coûte rarement plus cher que de le démolir pour reconstruire. En préservant la structure, on économise une immense quantité d'énergie grise tout en conservant le patrimoine historique du quartier. »",
    prompt: "Que soutient l'architecte interviewée ?",
    options: {
      A: "Démolir est toujours plus économique que rénover.",
      B: "Les bâtiments anciens sont trop polluants à conserver.",
      C: "Rénover l'ancien présente des avantages économiques et écologiques.",
      D: "Le patrimoine historique freine la modernisation urbaine.",
    },
    correctOption: "C",
    explanation: "L'architecte souligne que rénover coûte rarement plus cher et économise l'énergie grise.",
    trapAnalysis: "A affirme l'inverse de son propos (« Contrairement à une idée répandue... »).",
  },
  {
    id: "co-101-q16",
    questionNumber: 16,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q16.mp3",
    audioTranscript:
      "Chronique vie pratique : « Beaucoup d'épargnants hésitent à investir dans les obligations vertes par crainte d'un rendement inférieur. Or, les études récentes démontrent que leur performance financière est équivalente à celle des fonds classiques, avec un risque souvent mieux maîtrisé sur le long terme. »",
    prompt: "D'après la chronique, que révèlent les obligations vertes ?",
    options: {
      A: "Elles rapportent beaucoup moins que les fonds classiques.",
      B: "Leur rentabilité financière est comparable aux investissements traditionnels.",
      C: "Elles comportent des risques imprévisibles à court terme.",
      D: "Elles ne sont accessibles qu'aux grandes institutions financières.",
    },
    correctOption: "B",
    explanation: "« leur performance financière est équivalente à celle des fonds classiques ».",
    trapAnalysis: "A reflète l'a priori des épargnants que l'étude dément formellement.",
  },
  {
    id: "co-101-q17",
    questionNumber: 17,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q17.mp3",
    audioTranscript:
      "Témoignage d'un artisan : « Quand j'ai commencé la menuiserie il y a vingt ans, tout le monde me disait que les meubles sur-mesure allaient disparaître face aux grandes enseignes industrielles. Aujourd'hui, les clients recherchent au contraire l'authenticité, la réparabilité et la traçabilité des bois locaux. »",
    prompt: "Quelle évolution l'artisan constate-t-il dans la demande ?",
    options: {
      A: "Les clients privilégient désormais les meubles industriels jetables.",
      B: "Les clients recherchent des produits durables, réparables et locaux.",
      C: "Le métier d'artisan est en voie d'extinction rapide.",
      D: "Le bois local est devenu trop cher pour les particuliers.",
    },
    correctOption: "B",
    explanation: "« les clients recherchent au contraire l'authenticité, la réparabilité et la traçabilité des bois locaux ».",
    trapAnalysis: "A et C reflètent les prédictions passées erronées des années 2000.",
  },
  {
    id: "co-101-q18",
    questionNumber: 18,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q18.mp3",
    audioTranscript:
      "Message du service des ressources humaines : « Dans le cadre de notre démarche de qualité de vie au travail, nous invitons chaque collaborateur à définir sa charte de joignabilité. Aucun e-mail envoyé après dix-neuf heures ni le week-end ne nécessitera de réponse avant le jour ouvré suivant. »",
    prompt: "Quelle règle est rappelée par les ressources humaines ?",
    options: {
      A: "L'obligation d'éteindre son téléphone professionnel le soir.",
      B: "Le droit de ne pas répondre aux messages professionnels hors des horaires de travail.",
      C: "L'interdiction absolue de rédiger des courriels le soir.",
      D: "La réduction obligatoire du temps de travail hebdomadaire.",
    },
    correctOption: "B",
    explanation: "« Aucun e-mail envoyé après dix-neuf heures... ne nécessitera de réponse avant le jour ouvré suivant » (droit à la déconnexion).",
    trapAnalysis: "C parle d'interdire la rédaction, or la consigne concerne l'obligation de réponse.",
  },

  // ==========================================
  // NIVEAU B2 (Questions 19 à 28 — Seuil NCLC 7)
  // ==========================================
  {
    id: "co-101-q19",
    questionNumber: 19,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q19.mp3",
    audioTranscript:
      "Reportage Radio-Canada : « Au Québec, plusieurs PME manufacturières font face à une pénurie sans précédent d'opérateurs qualifiés. Plutôt que de refuser des contrats, elles choisissent d'investir massivement dans la robotisation collaborative, où les machines assistent les ouvriers sans les remplacer, réduisant ainsi les troubles musculosquelettiques. »",
    prompt: "Quelle stratégie ces PME adoptent-elles face au manque de main-d'œuvre ?",
    options: {
      A: "Elles délocalisent leur production dans d'autres provinces.",
      B: "Elles remplacent intégralement leurs ouvriers par des robots autonomes.",
      C: "Elles intègrent des robots d'assistance pour soutenir leurs équipes actuelles.",
      D: "Elles refusent désormais tous les nouveaux contrats d'exportation.",
    },
    correctOption: "C",
    explanation: "« la robotisation collaborative, où les machines assistent les ouvriers sans les remplacer ».",
    trapAnalysis: "B prétend remplacer tout le personnel, alors qu'il s'agit de cobotique d'assistance.",
  },
  {
    id: "co-101-q20",
    questionNumber: 20,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q20.mp3",
    audioTranscript:
      "Interview d'un économiste : « L'essor du télétravail a profondément bouleversé le modèle des centres urbains. Si la baisse de fréquentation des restaurants de quartier le midi est indéniable, on observe en contrepartie une revitalisation spectaculaire des commerces de proximité dans les zones périphériques et les banlieues résidentielles. »",
    prompt: "D'après l'économiste, quel est l'effet géographique du travail à distance ?",
    options: {
      A: "Une faillite généralisée du commerce de détail dans tout le pays.",
      B: "Un transfert de l'activité commerciale des centres-villes vers les zones résidentielles.",
      C: "Une concentration accrue des services au cœur des métropoles.",
      D: "Un abandon progressif des banlieues au profit des campagnes éloignées.",
    },
    correctOption: "B",
    explanation: "L'économiste oppose la baisse au centre-ville à la « revitalisation spectaculaire des commerces... dans les banlieues ».",
    trapAnalysis: "A généralise abusivement ; C dit l'exact contraire du rééquilibrage observé.",
  },
  {
    id: "co-101-q21",
    questionNumber: 21,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q21.mp3",
    audioTranscript:
      "Chronique environnementale : « Le recyclage mécanique du plastique a montré ses limites : à chaque cycle thermique, les chaînes polymères se dégradent et perdent leurs propriétés structurelles. C'est pourquoi la recherche se tourne désormais vers le recyclage enzymatique, capable de décomposer le plastique en monomères purs réutilisables à l'infini. »",
    prompt: "Quel avantage le recyclage enzymatique offre-t-il par rapport au recyclage mécanique ?",
    options: {
      A: "Il ne nécessite aucune dépense énergétique.",
      B: "Il préserve la qualité originelle de la matière sans dégradation au fil des cycles.",
      C: "Il coûte dix fois moins cher dès aujourd'hui.",
      D: "Il permet d'incinérer les déchets sans émettre de fumées toxiques.",
    },
    correctOption: "B",
    explanation: "Le recyclage enzymatique produit des « monomères purs réutilisables à l'infini », évitant la dégradation des chaînes polymères.",
    trapAnalysis: "A et C promettent la gratuité ou des coûts dérisoires non mentionnés.",
  },
  {
    id: "co-101-q22",
    questionNumber: 22,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q22.mp3",
    audioTranscript:
      "Débat sur la mobilité durable : « Opposer les transports en commun au vélo est une impasse idéologique. Dans les agglomérations bien conçues, le vélo sert de rabattement sur les gares ferroviaires pour les premiers et derniers kilomètres, démultipliant ainsi le rayon d'attraction des trains régionaux. »",
    prompt: "Selon l'intervenant, quelle est la relation optimale entre le vélo et le train ?",
    options: {
      A: "Le vélo doit remplacer définitivement les lignes de train secondaires.",
      B: "Le train et le vélo sont des modes concurrents et incompatibles.",
      C: "Le vélo complète le réseau ferroviaire en facilitant l'accès aux gares.",
      D: "Les trains ne doivent plus accepter de vélos à leur bord aux heures de pointe.",
    },
    correctOption: "C",
    explanation: "« le vélo sert de rabattement sur les gares ferroviaires... démultipliant ainsi le rayon d'attraction » (complémentarité multimodale).",
    trapAnalysis: "A et B défendent l'opposition frontale que l'intervenant qualifie précisément d'« impasse ».",
  },
  {
    id: "co-101-q23",
    questionNumber: 23,
    nclcTargetLevel: 7,
    audioUrl: "/audio/co/co-101-q23.mp3",
    audioTranscript:
      "Interview d'une sociologue : « Le sentiment d'isolement exprimé par certains télétravailleurs ne résulte pas d'un manque d'outils de communication : nous n'avons jamais échangé autant de messages instantanés. Il découle plutôt de la disparition des micro-interactions informelles à la machine à café, où se tissaient la confiance et le sentiment d'appartenance. »",
    prompt: "À quoi la sociologue attribue-t-elle l'isolement des télétravailleurs ?",
    options: {
      A: "À des connexions internet trop lentes à domicile.",
      B: "À la perte des échanges spontanés et informels du quotidien au bureau.",
      C: "Au refus des salariés d'utiliser les messageries instantanées.",
      D: "À une surcharge excessive d'heures de travail imposée par les managers.",
    },
    correctOption: "B",
    explanation: "Elle souligne « la disparition des micro-interactions informelles... où se tissaient la confiance ».",
    trapAnalysis: "C est démenti (« nous n'avons jamais échangé autant de messages ») ; A invente une panne.",
  },
  {
    id: "co-101-q24",
    questionNumber: 24,
    nclcTargetLevel: 8,
    audioUrl: "/audio/co/co-101-q24.mp3",
    audioTranscript:
      "Émission scientifique : « La préservation des zones humides côtières ne relève pas seulement de la protection de la biodiversité. Ces écosystèmes agissent comme de gigantesques éponges naturelles capables d'atténuer la force des vagues lors des tempêtes et de stocker jusqu'à cinq fois plus de carbone par hectare que les forêts boréales. »",
    prompt: "Quel rôle primordial les zones humides côtières jouent-elles en plus de la biodiversité ?",
    options: {
      A: "Elles fournissent de l'eau potable directement aux métropoles côtières.",
      B: "Elles protègent le littoral contre l'assaut des tempêtes et séquestrent massivement le carbone.",
      C: "Elles permettent d'étendre les terres agricoles au détriment des mers.",
      D: "Elles stabilisent les températures de l'océan profond à l'échelle globale.",
    },
    correctOption: "B",
    explanation: "« atténuer la force des vagues lors des tempêtes et stocker jusqu'à cinq fois plus de carbone ».",
    trapAnalysis: "A et C proposent des usages d'artificialisation humaine contraires au rôle écologique décrit.",
  },
  {
    id: "co-101-q25",
    questionNumber: 25,
    nclcTargetLevel: 8,
    audioUrl: "/audio/co/co-101-q25.mp3",
    audioTranscript:
      "Discussion managériale : « L'évaluation annuelle des performances individuelle est aujourd'hui obsolète dans nos organisations matricielles. Lorsqu'un projet implique dix collaborateurs de trois départements différents, évaluer la contribution de chacun de manière étanche décourage l'entraide au profit de rivalités stériles. »",
    prompt: "Quel défaut de l'entretien individuel annuel le manager met-il en exergue ?",
    options: {
      A: "Il demande trop de temps aux services de ressources humaines.",
      B: "Il nuit à la collaboration collective en favorisant des concurrences individuelles.",
      C: "Il conduit systématiquement à des augmentations de salaire injustifiées.",
      D: "Il est rejeté en bloc par l'ensemble des syndicats professionnels.",
    },
    correctOption: "B",
    explanation: "« évaluer la contribution de chacun de manière étanche décourage l'entraide au profit de rivalités stériles ».",
    trapAnalysis: "A est un problème logistique mineur non évoqué ; B capture le fond managérial.",
  },
  {
    id: "co-101-q26",
    questionNumber: 26,
    nclcTargetLevel: 8,
    audioUrl: "/audio/co/co-101-q26.mp3",
    audioTranscript:
      "Chronique alimentation & santé : « Les produits ultra-transformés ne se caractérisent pas uniquement par leurs teneurs élevées en gras saturés et en sucre. Leur structure physique même, déstructurée et predigérée par les procédés industriels, réduit le travail mécanique de la mastication et retarde considérablement l'envoi des signaux de satiété au cerveau. »",
    prompt: "Pourquoi les aliments ultra-transformés incitent-ils à trop manger ?",
    options: {
      A: "Leur emballage coloré stimule compulsivement l'appétit des consommateurs.",
      B: "Leur texture modifiée limite la mastication et retarde la sensation d'être rassasié.",
      C: "Ils contiennent des stimulants chimiques qui empêchent de dormir la nuit.",
      D: "Leur faible coût pousse à acheter des portions gigantesques au supermarché.",
    },
    correctOption: "B",
    explanation: "« réduit le travail mécanique de la mastication et retarde considérablement l'envoi des signaux de satiété ».",
    trapAnalysis: "A et D mentionnent des biais marketing/prix réels mais non évoqués dans cette explication physiologique.",
  },
  {
    id: "co-101-q27",
    questionNumber: 27,
    nclcTargetLevel: 8,
    audioUrl: "/audio/co/co-101-q27.mp3",
    audioTranscript:
      "Émission économique : « Beaucoup d'observateurs assimilent la sobriété énergétique à une forme de récession économique subie. C'est une vision réductrice : l'efficacité énergétique génère au contraire un immense gisement d'innovations techniques et crée des emplois locaux non délocalisables dans la rénovation thermique et l'ingénierie des réseaux intelligents. »",
    prompt: "Quelle thèse le chroniqueur économique défend-il ?",
    options: {
      A: "La sobriété énergétique ralentit inéluctablement la croissance du PIB.",
      B: "L'efficacité énergétique stimule l'innovation et soutient l'emploi local qualifié.",
      C: "Les énergies fossiles restent le seul moteur viable de la prospérité moderne.",
      D: "La rénovation thermique doit être entièrement financée par des emprunts d'État.",
    },
    correctOption: "B",
    explanation: "L'efficacité « génère... un immense gisement d'innovations... et crée des emplois locaux non délocalisables ».",
    trapAnalysis: "A reprend la « vision réductrice » que le chroniqueur s'attache à déconstruire.",
  },
  {
    id: "co-101-q28",
    questionNumber: 28,
    nclcTargetLevel: 8,
    audioUrl: "/audio/co/co-101-q28.mp3",
    audioTranscript:
      "Débat sur l'apprentissage des langues : « L'immersion linguistique totale ne suffit pas si elle ne s'accompagne pas d'une analyse métalinguistique régulière. Les apprenants qui progressent le plus vite sont ceux qui alternent des phases de communication intuitive avec des moments de décodage grammatical conscient de leurs propres erreurs. »",
    prompt: "Selon l'expert, comment maximise-t-on les progrès en langue étrangère ?",
    options: {
      A: "En proscrivant totalement l'étude de la grammaire au profit de la pratique orale.",
      B: "En se limitant exclusivement à des exercices de syntaxe théorique sur papier.",
      C: "En combinant des échanges spontanés avec une réflexion structurée sur les règles.",
      D: "En évitant de corriger ses erreurs pour ne pas bloquer sa confiance en soi.",
    },
    correctOption: "C",
    explanation: "« alternent des phases de communication intuitive avec des moments de décodage grammatical conscient ».",
    trapAnalysis: "A et B adoptent des positions monolithiques que l'expert réfute en préconisant l'alternance équilibrée.",
  },

  // ==========================================
  // NIVEAU C1 (Questions 29 à 35)
  // ==========================================
  {
    id: "co-101-q29",
    questionNumber: 29,
    nclcTargetLevel: 9,
    audioUrl: "/audio/co/co-101-q29.mp3",
    audioTranscript:
      "Conférence de philosophie politique : « Il existe une tension irréductible entre la quête d'efficacité algorithmique et les exigences de la délibération démocratique. Là où les plateformes numériques privilégient l'instantanéité et la polarisation des affects pour maximiser le temps de consultation, le débat républicain requiert la décantation des arguments, l'écoute patiente de la contradiction et l'acceptation de la lenteur. »",
    prompt: "Quel conflit fondamental le conférencier met-il en lumière ?",
    options: {
      A: "L'opposition entre le coût exorbitant des serveurs et les budgets des démocraties.",
      B: "La contradiction entre la logique d'immédiateté des algorithmes et la temporalité réflexive du débat démocratique.",
      C: "La supériorité incontestable du vote électronique sur le scrutin papier traditionnel.",
      D: "L'incapacité des citoyens âgés à appréhender les enjeux du vote par internet.",
    },
    correctOption: "B",
    explanation: "Le texte oppose « l'instantanéité et la polarisation » des plateformes à « la décantation des arguments et l'acceptation de la lenteur ».",
    trapAnalysis: "A et D détournent le propos vers des aspects financiers ou générationnels hors sujet.",
  },
  {
    id: "co-101-q30",
    questionNumber: 30,
    nclcTargetLevel: 9,
    audioUrl: "/audio/co/co-101-q30.mp3",
    audioTranscript:
      "Chronique d'un critique culturel : « On reproche souvent aux productions cinématographiques contemporaines leur manque de souffle épique ou d'audace formelle. Mais force est de constater que face à la fragmentation de l'attention collective orchestrée par les réseaux sociaux, les cinéastes sont contraints d'adopter un montage syncopé sous peine de perdre un spectateur dont le seuil de tolérance à la contemplation s'est effondré. »",
    prompt: "Quelle explication le critique avance-t-il pour justifier le style du cinéma actuel ?",
    options: {
      A: "Les réalisateurs manquent cruellement de formation technique et artistique.",
      B: "L'esthétique cinématographique s'adapte à la baisse générale de la capacité d'attention des spectateurs.",
      C: "Les budgets de production ont diminué de moitié au cours de la dernière décennie.",
      D: "Le public refuse désormais toute présence d'effets spéciaux dans les films dramatiques.",
    },
    correctOption: "B",
    explanation: "Les cinéastes adoptent un montage syncopé car « le seuil de tolérance à la contemplation s'est effondré ».",
    trapAnalysis: "A porte un jugement de compétence que le critique récuse en reportant la cause sur l'attention.",
  },
  {
    id: "co-101-q31",
    questionNumber: 31,
    nclcTargetLevel: 9,
    audioUrl: "/audio/co/co-101-q31.mp3",
    audioTranscript:
      "Débat économique à la radio : « Brandir la relocalisation industrielle comme un remède universel à nos vulnérabilités stratégiques relève de l'illusion romantique. Dans une économie globalisée aux chaînes de valeur hyper-spécialisées, relocaliser une usine sans sécuriser l'approvisionnement amont en composants de précision et en terres rares ne fait que déplacer le point de rupture logistique sans restaurer une quelconque souveraineté. »",
    prompt: "Quelle limite majeure l'économiste pointe-t-il concernant la relocalisation ?",
    options: {
      A: "Elle est rejetée par les consommateurs en raison des coûts de transport accrus.",
      B: "Elle demeure inopérante si l'on ne maîtrise pas l'ensemble des matières premières et composants indispensables en amont.",
      C: "Elle entraîne une baisse irrémédiable de la qualité des produits manufacturés finaux.",
      D: "Elle provoque des pénuries immédiates dans le secteur des services tertiaires.",
    },
    correctOption: "B",
    explanation: "Relocaliser sans sécuriser « l'approvisionnement amont en composants... ne fait que déplacer le point de rupture ».",
    trapAnalysis: "A et C introduisent des griefs inexistants dans le discours.",
  },
  {
    id: "co-101-q32",
    questionNumber: 32,
    nclcTargetLevel: 9,
    audioUrl: "/audio/co/co-101-q32.mp3",
    audioTranscript:
      "Interview d'une neurobiologiste : « La plasticité neuronale n'est pas un privilège réservé à la prime enfance. Si le cerveau adulte demande un effort d'attention plus soutenu et une charge émotionnelle plus intense pour réorganiser ses synapses, la capacité à forger de nouveaux réseaux d'apprentissage persiste tout au long de l'existence, pourvu que l'environnement offre une stimulation intellectuelle renouvelée. »",
    prompt: "Que démontrent les découvertes récentes exposées par la chercheuse ?",
    options: {
      A: "Le cerveau humain cesse définitivement d'évoluer après l'âge de vingt-cinq ans.",
      B: "L'adulte conserve la faculté d'apprendre et de reconfigurer ses circuits cérébraux sous réserve de stimulations adaptées.",
      C: "Les émotions négatives constituent le moteur principal de la mémorisation chez l'enfant.",
      D: "L'apprentissage adulte se fait avec la même facilité passive que chez le nouveau-né.",
    },
    correctOption: "B",
    explanation: "« la capacité à forger de nouveaux réseaux d'apprentissage persiste tout au long de l'existence, pourvu que l'environnement offre une stimulation ».",
    trapAnalysis: "A est le mythe biologique que la chercheuse combat ; D minimise l'effort requis chez l'adulte.",
  },
  {
    id: "co-101-q33",
    questionNumber: 33,
    nclcTargetLevel: 9,
    audioUrl: "/audio/co/co-101-q33.mp3",
    audioTranscript:
      "Tribune d'un urbaniste : « L'utopie de la ville intelligente hyper-connectée repose sur une foi aveugle dans la prédictibilité des comportements humains. En prétendant fluidifier les flux par des capteurs ubiquitaires, on évacue la part d'imprévu, de friction féconde et de sérendipité qui fait précisément le sel de la vie citadine et permet aux sous-cultures urbaines de réinventer l'espace public. »",
    prompt: "Quel reproche central l'auteur adresse-t-il au modèle de la « smart city » ?",
    options: {
      A: "Son coût d'entretien matériel ruine les finances locales des municipalités.",
      B: "Elle étouffe la spontanéité sociale et la créativité humaine au profit d'une optimisation mécanique rigide.",
      C: "Elle empêche les véhicules de circuler dans les grands boulevards historiques.",
      D: "Elle augmente la criminalité urbaine en désorientant les forces de police.",
    },
    correctOption: "B",
    explanation: "Elle « évacue la part d'imprévu, de friction féconde et de sérendipité qui fait... le sel de la vie citadine ».",
    trapAnalysis: "A, C et D sont des griefs matériels banals qui passent à côté de la critique sociologique de l'urbaniste.",
  },
  {
    id: "co-101-q34",
    questionNumber: 34,
    nclcTargetLevel: 10,
    audioUrl: "/audio/co/co-101-q34.mp3",
    audioTranscript:
      "Analyse géopolitique : « La diplomatie des semi-conducteurs illustre une inversion des paradigmes de puissance. Jadis, l'influence géostratégique reposait sur le contrôle des voies maritimes et des réserves d'hydrocarbures. Désormais, le véritable verrou hégémonique réside dans la maîtrise de quelques étapes technologiques d'une complexité vertigineuse, comme la lithographie ultraviolette extrême, concentrée entre les mains d'un oligopole restreint d'ingénieurs. »",
    prompt: "Selon l'analyste, comment la nature de la puissance internationale s'est-elle transformée ?",
    options: {
      A: "Elle dépend désormais de monopoles technologiques ultra-pointus plutôt que de la simple géographie physique des ressources.",
      B: "Elle a cessé d'exister au profit d'une gouvernance mondiale entièrement collégiale.",
      C: "Elle repose dorénavant uniquement sur le nombre de soldats déployés sur le terrain.",
      D: "Elle est devenue accessible à n'importe quel pays émergent sans investissement préalable.",
    },
    correctOption: "A",
    explanation: "La puissance est passée des hydrocarbures/voies maritimes au « verrou hégémonique... dans la maîtrise de quelques étapes technologiques... entre les mains d'un oligopole ».",
    trapAnalysis: "B et D relèvent du contresens total sur la concentration oligopolistique décrite.",
  },
  {
    id: "co-101-q35",
    questionNumber: 35,
    nclcTargetLevel: 10,
    audioUrl: "/audio/co/co-101-q35.mp3",
    audioTranscript:
      "Chronique littéraire : « Ce qui frappe dans la prose de cet auteur québécois, ce n'est pas tant le pittoresque de son lexique régional que son habileté à ériger la digression en principe architectural de son récit. L'intrigue ne chemine jamais en ligne droite : elle procède par cercles concentriques, retardant l'élucidation du mystère pour mieux sonder les tourments intimes de ses protagonistes. »",
    prompt: "Quelle caractéristique majeure de l'œuvre le critique met-il en valeur ?",
    options: {
      A: "L'utilisation exclusive d'un vocabulaire archaïque incompréhensible pour le grand public.",
      B: "Une construction narrative non linéaire privilégiant la profondeur psychologique au rythme des événements.",
      C: "Une intrigue policière menée à un train d'enfer sans aucune description introspective.",
      D: "Une condamnation sans appel des traditions culturelles de sa région natale.",
    },
    correctOption: "B",
    explanation: "« elle procède par cercles concentriques, retardant l'élucidation... pour mieux sonder les tourments intimes ».",
    trapAnalysis: "C dit l'exact opposé (« retardant l'élucidation » vs « train d'enfer ») ; A caricature le lexique.",
  },

  // ==========================================
  // NIVEAU C2 (Questions 36 à 39 — Élite)
  // ==========================================
  {
    id: "co-101-q36",
    questionNumber: 36,
    nclcTargetLevel: 10,
    audioUrl: "/audio/co/co-101-q36.mp3",
    audioTranscript:
      "Colloque de linguistique : « Prétendre figer l'orthographe ou la syntaxe sous prétexte de préserver la pureté de la langue procède d'une méprise épistémologique fondamentale. Une langue vivante n'est jamais un monument muséal immuable ; elle est un écosystème dynamique dont les mutations, loin de constituer des corruptions, attestent au contraire de sa vigueur adaptative face aux réalités mouvantes du monde. »",
    prompt: "Quelle conception de l'évolution linguistique l'orateur défend-il avec vigueur ?",
    options: {
      A: "Toute modification de la grammaire affaiblit inévitablement la portée culturelle d'une nation.",
      B: "Les variations linguistiques sont les manifestations normales et saines d'un organisme vivant en perpétuelle adaptation.",
      C: "L'enseignement scolaire doit interdire tout emprunt lexical aux langues étrangères.",
      D: "Seules les académies officielles possèdent la légitimité pour modifier l'usage des mots.",
    },
    correctOption: "B",
    explanation: "L'orateur définit la langue comme « un écosystème dynamique dont les mutations... attestent au contraire de sa vigueur adaptative ».",
    trapAnalysis: "A et C reflètent le purisme conservateur que l'orateur qualifie de « méprise épistémologique ».",
  },
  {
    id: "co-101-q37",
    questionNumber: 37,
    nclcTargetLevel: 10,
    audioUrl: "/audio/co/co-101-q37.mp3",
    audioTranscript:
      "Essai radiophonique sur l'hyper-communication : « Le paradoxe de notre siècle saturé de flux continus ne réside pas dans l'amenuisement de l'expression, mais dans son hypertrophie assourdissante. En sommant chacun de réagir à chaud sur tout et en tout lieu, la société contemporaine a confondu l'expression d'un avis impulsif avec l'exercice éclairé du jugement critique, substituant le bruit de l'opinion au silence fécond de la pensée. »",
    prompt: "Quelle dérive sociétale l'auteur dénonce-t-il à travers ce constat ?",
    options: {
      A: "La censure institutionnelle qui empêche les citoyens de s'exprimer sur les réseaux.",
      B: "L'injonction à l'immédiateté verbale qui étouffe le recul et l'authentique réflexion intellectuelle.",
      C: "Le déclin de la production éditoriale imprimée au profit des formats audios courts.",
      D: "L'impossibilité technique de diffuser des messages d'alerte en cas de crise sanitaire.",
    },
    correctOption: "B",
    explanation: "« la société... a confondu l'expression d'un avis impulsif avec l'exercice éclairé du jugement critique, substituant le bruit... au silence fécond de la pensée ».",
    trapAnalysis: "A est contredit (« notre siècle... hypertrophie assourdissante ») ; C et D sont hors de propos.",
  },
  {
    id: "co-101-q38",
    questionNumber: 38,
    nclcTargetLevel: 10,
    audioUrl: "/audio/co/co-101-q38.mp3",
    audioTranscript:
      "Chronique d'épistémologie des sciences : « L'illusion positiviste selon laquelle la prolifération des mégadonnées permettrait de se dispenser de toute théorie explicative préalable commet un contresens méthodologique majeur. Corrélation n'a jamais valu causalité. Sans cadre conceptuel rigoureux pour formuler des hypothèses falsifiables, les modèles prédictifs les plus sophistiqués ne font qu'extrapoler des coïncidences statistiques tout en demeurant aveugles aux mécanismes sous-jacents des phénomènes qu'ils prétendent gouverner. »",
    prompt: "Quelle mise en garde l'épistémologue formule-t-il à l'égard du culte du « Big Data » ?",
    options: {
      A: "Les ordinateurs quantiques ne possèdent pas une puissance de calcul suffisante pour traiter les données.",
      B: "L'accumulation de données brutes ne saurait remplacer la nécessité d'une modélisation théorique causale solide.",
      C: "Les statistiques mathématiques sont systématiquement falsifiées par les instituts de recherche privés.",
      D: "L'intelligence artificielle rendra bientôt caduque l'ensemble des sciences fondamentales.",
    },
    correctOption: "B",
    explanation: "« Corrélation n'a jamais valu causalité. Sans cadre conceptuel rigoureux... les modèles... demeurent aveugles aux mécanismes sous-jacents ».",
    trapAnalysis: "A invente une contrainte technique ; C suggère un complot calomnieux opposé au propos épistémologique.",
  },
  {
    id: "co-101-q39",
    questionNumber: 39,
    nclcTargetLevel: 10,
    audioUrl: "/audio/co/co-101-q39.mp3",
    audioTranscript:
      "Méditation sur l'art contemporain et la mémoire : « L'obsolescence programmée des objets manufacturés a trouvé son pendant spirituel dans l'amnésie délibérée de nos célébrations esthétiques. En célébrant l'éphémère comme fin suprême de la création, nous nous sommes privés de cette tension tragique avec la postérité qui conférait aux chefs-d'œuvre du passé leur troublante gravité. L'œuvre d'art ne défie plus le temps : elle se dissout complaisamment dans l'écume fugitive du présent. »",
    prompt: "Quelle analyse critique le conférencier livre-t-il sur l'art de notre époque ?",
    options: {
      A: "Il déplore la perte du dialogue avec la durée et la postérité au profit d'un culte complaisant de l'instantanéité.",
      B: "Il se réjouit de l'émancipation définitive des artistes vis-à-vis des canons esthétiques classiques.",
      C: "Il dénonce les prix stratosphériques atteints par les toiles de maîtres dans les maisons de vente.",
      D: "Il prédit la disparition pure et simple des musées et des galeries d'exposition d'ici dix ans.",
    },
    correctOption: "A",
    explanation: "« L'œuvre d'art ne défie plus le temps : elle se dissout complaisamment dans l'écume fugitive du présent » (perte de la postérité).",
    trapAnalysis: "B prend l'éloge inverse ; C et D se focalisent sur l'aspect marchand ou spéculatif ignoré par la réflexion métaphysique.",
  },
];

export const FULL_SERIES_CO_101: ExamSeriesData = {
  id: "demo-101-co",
  seriesNumber: 101,
  title: "TCF Canada — Compréhension Orale, Série 101 (Officiel)",
  discipline: "CO",
  durationSeconds: 40 * 60, // 40 minutes officielles FEI
  questions: QUESTIONS_CO_101,
};
