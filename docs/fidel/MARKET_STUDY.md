# Étude de marché — Fidel (SaaS de fidélisation digitale pour commerces tunisiens)

**Périmètre :** cafés, restaurants, fast-food, boulangeries/pâtisseries, glaciers, hôtels, salons de beauté, barbiers et commerces de proximité.
**Date de recherche :** 18 août 2026.
**Source :** étude produite par Gemini (recherche web live) à partir du [prompt de recherche](GEMINI_MARKET_STUDY_PROMPT.md) préparé pour ce projet. Reproduite ici verbatim comme document de référence.

> Ce document est la donnée d'entrée factuelle du projet. Les conclusions produit/prix/roadmap dérivées de cette étude sont à synchroniser dans [`BLUEPRINT.md`](BLUEPRINT.md) (voir note en fin de fichier).

---

## Méthodologie

- **Fait vérifié** = donnée publiée par une source identifiable.
- **Inférence** = conclusion calculée ou déduite à partir de plusieurs données.
- **Hypothèse** = paramètre que je recommande de tester, pas une statistique officielle.

Le principal problème de données est important : le RNE de l'INS couvre les entreprises patentées/formelles et ne mesure donc pas directement l'économie informelle. L'édition 2024 du RNE décrit la situation 2023, avec une publication en juin 2025. L'INS indique aussi que 25 % des cessations sont déclarées plus de deux ans après la cessation réelle et que la couverture globale du RNE est de 77 % pour le secteur privé hors exploitants agricoles, ce qui impose de la prudence dans les comparaisons.

---

## PART 1 — Market Sizing Tunisia

### 1.1 Cafés

**Fait vérifié**

La Chambre nationale des propriétaires de cafés, citée par Tuniscope le 25 mars 2024, estimait qu'il y avait plus de 20 000 cafés en Tunisie et environ 120 000 travailleurs permanents, sans compter les travailleurs temporaires.

Le chiffre est donc cohérent avec le point de départ, mais il faut le qualifier : ce n'est pas un recensement exhaustif INS. C'est une estimation sectorielle provenant de la profession.

**Formal / informal**

Je n'ai pas trouvé dans les sources publiques consultées un tableau officiel 2024–2026 permettant de séparer proprement :
- cafés légalement enregistrés ;
- cafés non autorisés ;
- cafés enregistrés mais administrativement encore actifs ;
- établissements saisonniers.

Les affirmations parfois rencontrées de 15 000–20 000 cafés informels ou 40 000 cafés au total ne sont donc pas assez robustes pour être utilisées comme faits dans une étude financière.

**Conclusion :**

| Indicateur | Valeur | Statut |
|---|---|---|
| Cafés en Tunisie | >20 000 | Fait vérifié, estimation de la Chambre professionnelle |
| Travailleurs permanents dans les cafés | ~120 000 | Fait vérifié, même source |
| Cafés informels | 15 000–20 000 | Non suffisamment vérifié |
| Cafés totaux incluant informel | ~40 000 | Non suffisamment vérifié |

**Ce que cela signifie pour le SaaS**

Le marché café est suffisamment grand pour constituer à lui seul un vertical initial. Mais il est déconseillé d'utiliser 40 000 comme TAM officiel.

### 1.2 Restaurants

Il n'existe pas, dans les données publiques facilement exploitables de l'INS, un compteur national récent séparant clairement : restaurant traditionnel, fast-food indépendant, chaîne, snack, salon de thé, café-restaurant.

Le meilleur proxy officiel est le secteur « Hébergement et Restauration » du RNE. L'INS comptait **47 475 entreprises en 2022** et **48 065 en 2023**.

**Attention :** cette catégorie est beaucoup plus large que les restaurants. Elle comprend aussi l'hébergement.

Pour les seuls restaurants touristiques, l'OCDE, sur données ONTT, recensait **374 restaurants touristiques en 2019**, dont 125 à Tunis-Nord, 77 à Nabeul-Hammamet, 57 à Sousse et 28 à Djerba. Le ministère du Tourisme indique désormais **418 restaurants touristiques**, dans une mise à jour récente de son programme hôtelier.

**Conclusion restaurant**

| Segment | Valeur | Statut |
|---|---|---|
| Hébergement + restauration, entreprises RNE 2023 | 48 065 | Fait vérifié |
| Restaurants touristiques | 418 | Fait vérifié, ministère du Tourisme |
| Restaurants tous types | — | Pas de compteur public suffisamment fiable trouvé |
| Fast-food indépendants | — | Pas trouvé |
| Chaînes fast-food | — | Pas trouvé comme stock national homogène |

**Point important :** le chiffre de 48 065 ne doit absolument pas être présenté comme « nombre de restaurants ».

### 1.3 Boulangeries / pâtisseries

Une donnée professionnelle publiée en avril 2024 donne environ **3 700 boulangeries classées** en Tunisie. C'est l'un des chiffres sectoriels les plus crédibles trouvés pour ce marché. Le chiffre des pâtisseries/glaciers séparément n'a pas été trouvé avec une qualité comparable.

| Segment | Nombre |
|---|---|
| Boulangeries classées | ~3 700 |
| Pâtisseries indépendantes | Non trouvé |
| Glaciers | Non trouvé |

### 1.4 Hôtels

Les données officielles du ministère du Tourisme ont évolué. La page actuelle du programme PMNH indique : **696 établissements d'hébergement touristique**, environ **230 000 lits**, **418 restaurants touristiques**, **1 813 agences de voyages**. Le même ministère rappelle que 2024 a généré environ 7,5 milliards TND de recettes touristiques et près de 10,3 millions d'arrivées de touristes étrangers.

**Attention à une divergence apparente :** d'autres pages du ministère affichent encore 876 unités / 236 000 lits, correspondant à une version plus ancienne de la page. Retenu pour cette étude : la valeur 696 / 230 000, issue de la page du ministère présentant explicitement les chiffres 2024.

### 1.5 Beauty salons / barbershops

L'INS dispose bien d'une classification spécifique couvrant notamment : coiffure hommes, soins esthétiques, manucure/pédicure, autres soins de beauté. Mais aucune publication 2024–2026 donnant un total national public fiable du type « X salons de coiffure » n'a été trouvée.

L'INS donne en revanche **23 530 entreprises en « Autres services personnels » en 2023**. Cette catégorie est beaucoup plus large que les salons/barbiers et ne doit pas leur être assimilée.

- **Fait vérifié :** 23 530 entreprises dans « autres services personnels » en 2023.
- **Pas un fait :** « 23 530 salons/barbiers ».

### 1.6 Répartition géographique

Le RNE 2023 donne une couverture territoriale beaucoup plus solide que les estimations sectorielles. Pour l'ensemble des entreprises privées :

| Territoire | Entreprises privées 2023 |
|---|---|
| Tunis | 148 622 |
| Ariana | 60 564 |
| Sousse | 63 310 |
| Sfax | 82 704 |

Les chiffres viennent des tableaux RNE 2024/édition 2024. Un nombre de cafés/restaurants par gouvernorat n'a pas été extrait ici car ce serait trompeur de substituer le nombre total d'entreprises au nombre d'établissements de restauration. Le RNE contient bien des croisements « activité × gouvernorat » et « activité × région », donc la donnée existe dans la publication, mais elle ne permet pas automatiquement une séparation parfaite « café / restaurant / fast-food » à partir des catégories synthétiques utilisées dans les tableaux.

### 1.7 Profil de taille

Le RNE est extrêmement instructif pour ce SaaS. En 2023, la grande majorité des entreprises privées se situait dans les très petites tailles : **726 920 entreprises avec 0 salarié**, **59 733 avec 1–2 salariés**, **22 089 avec 3–5 salariés**, **8 136 avec 6–9 salariés**. La photographie globale est donc clairement dominée par la micro-entreprise.

**Fait vérifié :** le RNE définit les micro-entreprises comme celles ayant moins de 6 salariés.

**Inférence :** pour un SaaS de fidélité, le client cible typique n'est pas « une entreprise avec un département marketing ». C'est plutôt : un propriétaire + quelques employés + Facebook/Instagram/WhatsApp + caisse basique ou même pas de POS sophistiqué. C'est déterminant pour le produit.

### 1.8 Churn des entreprises

Le RNE permet d'avoir une première mesure. En 2023, tous secteurs confondus, les entrées et sorties restent élevées. Pour Hébergement et Restauration, les sorties étaient : **1 784 en 2021**, **3 862 en 2022**. Cependant, l'INS avertit que le décalage administratif rend l'année de sortie imparfaite : les entreprises peuvent rester « actives » administrativement après leur cessation réelle.

**Inférence :** le churn réel des clients du SaaS sera donc probablement plus élevé que le simple churn SaaS : exposition à la fermeture, au changement de propriétaire ou à l'arrêt du commerce.

### 1.9 TAM / SAM

Il faut éviter une erreur classique : additionner les catégories officielles. Par exemple, 48 065 hébergement/restauration + 20 000 cafés serait du double comptage, puisque les cafés sont déjà à l'intérieur du secteur restauration.

**TAM professionnel réaliste — trois scénarios :**

| Scénario | Entreprises réellement pertinentes | Statut |
|---|---|---|
| Bas | ~55 000 | Inférence |
| Central | ~70 000–80 000 | Inférence |
| Haut | ~90 000–100 000 | Hypothèse haute |

**Construction du scénario central :** repose principalement sur 48 065 entreprises officielles du bloc hébergement/restauration en 2023 ; 23 530 « autres services personnels », dont seule une partie est réellement beauty/barber ; ~3 700 boulangeries classées ; corrections pour les activités informelles et les segments de commerce de proximité compatibles ; moins les activités qui ne correspondent pas au profil « fréquence de visite + fidélisation ».

**SAM : Grand Tunis + Sousse + Sfax** — recommandation de ne pas présenter un chiffre précis comme fait officiel sans extraction complète du tableau RNE activité × gouvernorat. Estimation opérationnelle : **~35 000–45 000 établissements potentiellement adressables** dans Grand Tunis + Sousse + Sfax. Statut : INFÉRENCE, pas donnée INS. Pour un lancement bootstrappé, le SAM est donc suffisamment grand même avec une définition conservatrice.

---

## PART 2 — Direct Competitors Tunisia

La recherche révèle un point important : le marché tunisien n'est pas vide. Plusieurs acteurs ont été identifiés, et surtout une nouvelle génération de solutions locales absente de la liste initiale.

### 2.1 Carte concurrentielle

| Acteur | Positionnement | Fidélité | Wallet | CRM / data | Messages | Prix public |
|---|---|---|---|---|---|---|
| Digital Menu | restaurant/café all-in-one | Points + VIP + récompenses | Non clairement mis en avant | Oui | Marketing intégré | à partir de 16 DT/mois |
| TMS Tunisia | application de fidélité / retail | Points | App | Oui | Non clairement documenté | Non trouvé |
| Raba7ni | agrégateur de cartes | Points + récompenses | App | Plateforme B2C | Non clairement documenté | Partenaire : non trouvé |
| ZEROSIX | fidélité / CRM avancé | Points, récompenses | Apple + Google Wallet | Oui | Campagnes marketing | Devis |
| FlousBack | cashback/loyalty B2C | Points/cashback | App / QR | Consumer ecosystem | Offres partenaires | Gratuit côté consommateur |
| Sourdi | fidélité locale | Cartes, coupons, mini-jeux | PWA / mobile | Oui | Push | Non trouvé |
| Stampi | fidélité SMB | carte digitale | PWA | Oui | Push | gratuit |
| POS>lik | POS restaurant | Fidélité intégrée | Digital | POS data | Possible | Devis |
| Cesta Food | POS restauration | cartes + fidélité | Non mis en avant | client database | Non | Devis |
| Sarra Card | cartes physiques | Cartes plastiques | Non | Non | Non | Devis |
| Point M | loyalty interne retail | Carte Point M | Non | CRM interne | offres | interne |

**Sources et détails :**

- Digital Menu annonce un prix « à partir de 16 DT/mois » et combine menu QR, commande, fidélité et outils marketing. Son programme fidélité utilise des points, un espace client B2C, historique, récompenses et niveaux VIP.
- TMS Tunisia présente une application de fidélité numérique permettant notamment d'attribuer et suivre les points.
- Raba7ni se présente comme une plateforme tunisienne réunissant plusieurs cartes de fidélité, avec points, cadeaux et réductions auprès de commerces partenaires.
- ZEROSIX annonce plus de 4 000 commerçants, plus de 60/70 intégrations selon ses pages, la gestion multi-sites, les programmes de fidélité, campagnes marketing, CRM, statistiques et espaces Apple/Google Wallet.
- Sourdi cible explicitement les commerces tunisiens avec cartes digitales, coupons, mini-jeux, QR Google Reviews et push notifications.
- Stampi annonce actuellement une offre 100 % gratuite pour les commerces et une carte de fidélité accessible via QR sans téléchargement traditionnel depuis l'App Store.
- FlousBack revendique 800+ partenaires mais sa page affiche également des valeurs marketing incohérentes telles que « 10+ partner stores » et « 14+ active members » ; ces chiffres ne sont donc pas assez fiables pour un benchmark financier.

### 2.2 Le concurrent le plus intéressant : ZEROSIX

ZEROSIX mérite une attention particulière. Il ne s'agit pas simplement d'une carte de fidélité. Le produit comprend : fidélité, campagnes marketing, segmentation, CRM, Apple Wallet, Google Wallet, multi-établissement, intégrations POS, parrainage, statistiques.

ZEROSIX affirme avoir 30 collaborateurs, 10 ans d'existence en 2025, une entreprise rentable et des milliers de commerçants équipés.

**Faiblesse stratégique en Tunisie :** son avantage technologique n'implique pas une forte pénétration tunisienne. Aucune preuve publique solide n'a été trouvée montrant que ZEROSIX possède une base marchande tunisienne significative. **Inférence :** son produit est un concurrent technologique sérieux, mais la localisation tunisienne, le prix, les habitudes de paiement et l'intégration WhatsApp restent des opportunités locales.

---

## PART 3 — Indirect Competitors

### 3.1 Carte plastique

Sarra Card existe depuis 1998 et produit des cartes PVC, cartes de fidélité, cartes magnétiques et cartes sans contact. La société indique avoir travaillé avec Carrefour, Monoprix, Hammadi Abid, Evertek, Citroën et d'autres grandes enseignes. Prix publics de commande pour carte fidélité : non trouvé — modèle typiquement devis/impression.

**Threat : HIGH** — parce qu'il est tangible, connu, simple, déjà compris par le commerçant.

### 3.2 Cartes papier / tampons

Aucune statistique nationale fiable mesurant le pourcentage de cafés utilisant encore les cartes papier n'a été trouvée. Mais c'est un benchmark comportemental critique. Une carte papier coûte pratiquement zéro en logiciel, ne nécessite ni smartphone du client ni onboarding, et l'employé sait déjà l'utiliser.

**Threat : VERY HIGH** — c'est probablement un substitut plus dangereux que plusieurs startups digitales.

### 3.3 WhatsApp / Facebook / Instagram

La meilleure donnée trouvée est une enquête **CAWTAR/GIZ menée auprès de 547 entrepreneuses tunisiennes**. Elle rapportait notamment : réseaux sociaux **84,7 %** ; WhatsApp Business **78,3 %** ; CRM **18,7 %** ; e-mail marketing **24,3 %**.

**Interprétation — extrêmement important :** le commerçant tunisien connaît déjà WhatsApp. Il ne connaît pas forcément un CRM. Donc le produit ne doit pas être présenté comme « installez un CRM ». Il doit être vendu comme « récupérez vos clients fidèles et faites-les revenir automatiquement sur WhatsApp / leur téléphone ».

### 3.4 POS

Des POS tunisiens commencent déjà à intégrer la fidélité :

- **POS>lik** — vise exclusivement la restauration et annonce notamment des cartes de fidélité digitales.
- **Cesta Food** — POS restauration comprenant une gestion de fidélité et de cartes, ainsi qu'une capacité multi-restaurants/multi-cafés.
- **TNPOS** — produit restaurant/café incluant commande, caisse, stocks, clients, employés et données clients.
- **Al-Makhzan** — logiciel ciblant directement le marché tunisien, combinant POS, stocks, menu QR, cuisine et back-office. Tarif affiché : **79 DT/mois**, avec 39 DT le premier mois dans son offre de lancement.

**Threat : MEDIUM-HIGH** — le risque n'est pas seulement qu'un POS copie le produit. Le risque est que le POS devienne le système central du commerçant et absorbe progressivement la fidélité.

### 3.5 Classement des substituts

| Alternative | Threat |
|---|---|
| WhatsApp / Facebook / Instagram manuel | VERY HIGH |
| Carte papier | VERY HIGH |
| Carte plastique | HIGH |
| POS avec fidélité intégrée | HIGH |
| Digital menu avec fidélité | HIGH |
| CRM générique | MEDIUM |
| Loyalty SaaS étranger | MEDIUM |
| Solution enterprise | LOW pour le SMB |

---

## PART 4 — Direct Competitors Worldwide

### 4.1 Benchmark prix

Conversions utilisées à titre indicatif 2026 (hypothèses, pas des taux BCT cités) : 1 EUR ≈ 3.38 TND, 1 USD ≈ 2.92 TND.

| Produit | Prix public | Approx. TND/mois | Positionnement |
|---|---|---|---|
| Loopy Loyalty | $25 | ~73 DT | SMB |
| Stamp Me | €29 | ~98 DT | SMB |
| Loyally.ai | $12–17 | ~35–50 DT | SMB |
| Stampeo | €20 | ~68 DT | SMB |
| PassKit | $39.50+ | ~115 DT+ | platform/API |
| Stampede | $50+ selon offre | ~146 DT+ | hospitality |
| Perkville | $159+ | ~464 DT+ | salons/gyms |
| Boomerangme | $199 | ~581 DT | advanced loyalty |
| LoyaltyLion | $199 | ~581 DT | ecommerce |
| ZEROSIX | Devis | — | advanced retail/restaurant |

**Détails par acteur :**

- **Loopy Loyalty** — $25/mois Starter, $69/mois Growth, $95/mois Ultimate. Supporte Apple Wallet et Google Wallet, clients illimités et push notifications.
- **Stamp Me** — €29/mois Lite, offre Pro/Elite plus élevée. Carte de tampons digitale, application, plusieurs programmes, pas de facturation par client.
- **Loyally.ai** — prix agressif : $12/mois annuel (Starter), $17/mois mensuel, $24/mois annuel (Growth), $30/mois mensuel (Growth). Inclut CRM, analytics, push, Apple/Google Wallet, SMS/email et intégrations WhatsApp/Messenger/Telegram.
- **Stampeo** — Starter €20/mois (actuellement €10/mois à vie pour founding partners), Growth €40/mois (actuellement €20), Pro €60/mois.
- **PassKit** — plateforme à partir de $39.50/mois pour un utilisateur, évolue selon les utilisateurs. Supporte Apple Wallet et Google Wallet pour cartes de fidélité et autres pass.
- **Boomerangme** — offre SMB à partir de $199/mois (mensuel), $164/mois en annuel. Cartes, promotions, geofencing, managers, API/webhooks.
- **Perkville** — à partir de $159/location/mois jusqu'à 2 500 clients, puis augmente avec le nombre de clients.
- **LoyaltyLion** — plan Classic à partir de $199/mois avec 500 commandes/mois (e-commerce).

### 4.2 Stampede — probablement le benchmark produit le plus intéressant

Stampede cible l'hospitality et revendique **2 500+ établissements au Royaume-Uni**. Système : Apple Wallet, Google Wallet, points, récompenses, CRM, opt-in marketing, connexion POS, Wi-Fi, réservations, reviews, referrals. Offre Growth annoncée à $50/outlet/mois, Scale à $99/outlet/mois.

**Conclusion :** Stampede montre où évolue le marché — la carte de fidélité devient une couche CRM branchée sur les données du restaurant. Ce n'est plus simplement « 8 tampons = un café ».

### 4.3 Tapcarry

Particulièrement pertinent pour ce projet. Se positionne comme « **Apple Wallet loyalty — no app required** ». Fonctionnalités : carte de tampons, Apple Wallet, QR onboarding, scanner employé, anti-self-stamping, dashboard, analytics, push vers le lock screen, récompenses, branding, zéro téléchargement, zéro matériel, installation annoncée en environ 10 minutes.

Prix : Sprout €0, Grow $29/mois.

**Limitation majeure — particulièrement importante pour la Tunisie :** Tapcarry est actuellement **Apple-first** et indique que Google Wallet est encore sur sa roadmap.

### 4.4 Menace internationale pour la Tunisie

Aucune preuve publique suffisamment solide n'a été trouvée qu'un acteur comme Loopy Loyalty, Stamp Me, Boomerangme, Tapcarry ou Stampede soit actuellement en train de construire une distribution commerciale spécifique en Tunisie. Cela ne signifie pas qu'ils ne peuvent pas vendre en Tunisie — cela signifie **absence de preuve publique d'un go-to-market tunisien dédié**. Le risque est donc davantage un risque futur d'entrée qu'une domination internationale déjà établie.

---

## PART 5 — Business Owner Behavior / Willingness to Pay

### 5.1 La contradiction centrale du marché

Les données disponibles suggèrent : digitalisation de communication forte, digitalisation structurée du CRM faible. L'enquête CAWTAR/GIZ donne WhatsApp Business **78,3 %**, réseaux sociaux **84,7 %**, CRM seulement **18,7 %**.

**Inférence :** le marché n'a pas principalement besoin d'un logiciel « riche ». Il a besoin d'un logiciel simple, immédiatement compréhensible, très bon marché, mobile, sans installation, compatible avec les habitudes existantes.

### 5.2 Prix observés

Digital Menu démarre à 16 DT/mois. Al-Makhzan affiche 79 DT/mois après une promotion initiale à 39 DT. Cela donne un benchmark tunisien particulièrement intéressant : **~15–80 DT/mois** couvre déjà une grande partie de la zone « SaaS SMB local ». À l'inverse, les solutions internationales de loyalty sont fréquemment dans la zone **~35–150 DT+/mois** avant même certains coûts de messagerie.

### 5.3 Paiement B2B SaaS

**Konnect** annonce : aucune installation, aucun abonnement, cartes tunisiennes 1,3 %, e-Dinar 1,3 %, cartes internationales 2,9 %, virement bancaire 2 TND.

**Flouci Enterprise** annonce : aucune installation, aucun frais mensuel, cartes tunisiennes et wallets 1,3 % HT, cartes internationales 3 % HT.

**Inférence :** un SaaS B2B tunisien peut donc supporter paiement par lien, carte, wallet, virement — sans nécessiter un modèle Stripe international classique. Cela réduit fortement la friction commerciale.

---

## PART 6 — Tunisian Consumer Behavior

### 6.1 Internet / mobile

DataReportal 2026 indique qu'à la fin 2025 : **15,5 millions de connexions mobiles** ; **10,4 millions d'internautes** ; pénétration Internet **84,3 %** ; **7,83 millions d'identités social media** ; social media **63,3 %** de la population.

### 6.2 Android vs iPhone

StatCounter donne pour juin 2026 : **Android 84,85 %** ; **iOS 15,14 %**.

**Conséquence produit :** un produit Apple Wallet only est mal adapté au marché tunisien de masse. Le cas Tapcarry est excellent techniquement mais son positionnement Apple-first est une faiblesse locale.

### 6.3 Facebook / Instagram / WhatsApp

DataReportal indique en 2025 : Facebook **7,25 millions** d'utilisateurs atteignables par publicité, Instagram **3,45 millions**, Messenger **5,55 millions**. L'enquête CAWTAR/GIZ montre **78,3 %** d'utilisation de WhatsApp Business parmi les entrepreneuses interrogées.

**Conclusion :** pour ce produit, WhatsApp > email comme canal de conception commerciale.

### 6.4 Apple Wallet / Google Wallet

Apple Wallet et Google Wallet sont supportés techniquement par plusieurs solutions internationales (Loopy Loyalty, PassKit, ZEROSIX). Mais aucune statistique tunisienne sérieuse permettant de dire « X % des Tunisiens utilisent Apple Wallet » ou « Google Wallet compte X utilisateurs en Tunisie » n'a été trouvée. **Adoption locale quantitative = non trouvée.**

---

## PART 7 — Regulatory & Payment Environment

### 7.1 Protection des données personnelles

La loi principale est toujours la **Loi organique n°2004-63 du 27 juillet 2004** sur la protection des données personnelles. Elle s'applique aux traitements automatisés et non automatisés réalisés par personnes physiques ou morales. L'INPDP indique qu'avant de traiter des données personnelles, le responsable doit effectuer les procédures prévues par la loi : déclaration auprès de l'INPDP, autorisations spécifiques pour certains traitements, procédure spécifique de transfert de données à l'étranger, possibilité de plainte concernant les SMS indésirables.

**Pour ce SaaS :** stockage potentiel de numéro de téléphone, nom, historique de fidélité, préférences, consentement marketing. La privacy ne peut donc pas être ajoutée à la fin du projet — elle doit être conçue dans : onboarding, consentement, opt-out, historique du consentement, suppression/export des données, stockage, transfert éventuel vers des services étrangers.

### 7.2 WhatsApp Business API

Probablement le point économique le plus important de tout le projet. Les messages WhatsApp Business Platform sont tarifés selon la catégorie de message et le pays du destinataire. Une grille tarifaire effective au 1er juillet 2026 publiée par un fournisseur utilisant les tarifs Meta indique par exemple : Égypte Marketing $0,0773 ; Algérie ~$0,0225 (grille 2026 différente) ; « Rest of Africa » $0,0270 marketing sur cette grille.

**Problème :** aucune ligne publique suffisamment claire n'a été obtenue permettant d'affirmer un tarif Meta définitif spécifique au numéro tunisien (+216). **Tarif WhatsApp exact Tunisia 2026 : non vérifié dans les sources publiques obtenues.**

**Conséquence produit :** ne surtout pas mettre dans le business plan « WhatsApp gratuit ». Il faut traiter le WhatsApp API comme un **COGS variable**.

### 7.3 Risque juridique WhatsApp

Distinction importante entre **transactional/utility** et **marketing**. La réactivation type « Tu n'es pas venu depuis 30 jours, voici 10 % » est beaucoup plus proche d'un cas marketing que d'une simple notification opérationnelle. Le modèle économique doit donc facturer les clients selon la consommation ou limiter certaines campagnes.

---

## PART 8 — Synthesis & Recommendation

### 8.1 Taille du marché

| Niveau | Business potentiellement adressables |
|---|---|
| LOW | ~55 000 |
| MID | ~70 000–80 000 |
| HIGH | ~90 000–100 000 |

**Statut : INFÉRENCE**, construite à partir des données RNE + sources sectorielles, pas un chiffre publié officiellement. Le noyau dur formel est déjà conséquent : 48 065 entreprises Hébergement/Restauration (2023), 23 530 Autres services personnels, ~3 700 boulangeries classées, >20 000 cafés selon l'organisation professionnelle. Le TAM de 70–80k est une hypothèse de travail beaucoup plus défendable que 100 000+.

### 8.2 À quel pourcentage peut-on réellement vendre ?

Il ne faut pas appliquer immédiatement une pénétration de 20–30 %.

| Pénétration | Clients sur TAM central ~75k |
|---|---|
| 1 % | ~750 |
| 3 % | ~2 250 |
| 5 % | ~3 750 |
| 10 % | ~7 500 |

**Lecture startup :** même 3 % du marché central représente déjà environ 2 250 commerces. Le problème n'est pas le manque de TAM. Le problème est : combien de commerçants accepteront effectivement de payer tous les mois ?

### 8.3 Le marché est-il underserved ou crowded ?

**Réponse : partiellement underserved.** Crowded techniquement, mais underserved commercialement. Acteurs déjà présents : Digital Menu, TMS, Raba7ni, ZEROSIX, Sourdi, Stampi, POS, cartes plastiques. Mais aucun acteur vérifié ne domine clairement le positionnement : **« Loyalty + CRM simple + WhatsApp-first + ultra-local + petit prix + sans application client »**.

**Le plus gros concurrent : WhatsApp + carte papier.** Pas ZEROSIX, pas Stampede, pas Loopy — parce que c'est gratuit, déjà utilisé, compris, immédiat, sans onboarding logiciel.

### 8.4 Prix recommandé

Benchmark tunisien : Digital Menu à partir de 16 DT/mois, Al-Makhzan 79 DT/mois, solutions internationales souvent ~35–150+ DT/mois.

| Offre | Prix cible |
|---|---|
| Starter | 19 DT/mois |
| Growth | 39 DT/mois |
| Pro | 69 DT/mois |

Ne pas commencer à 99–149 DT sur le SMB tunisien généraliste. Le prix psychologique le plus intéressant : **19–39 DT/mois**, avec un free trial de 14–30 jours.

### 8.5 Le différenciateur stratégique

Le meilleur angle n'est pas « Digital loyalty card » (déjà commoditisé). C'est :

> **WhatsApp-first retention engine for Tunisian SMBs**

Architecture : QR at counter → customer joins → digital loyalty card → CRM → segmentation → automatic reactivation → WhatsApp/SMS → analytics.

Exemple : « Client venu 7 fois mais absent depuis 21 jours » → le système propose automatiquement une campagne de réactivation. Le commerçant ne doit pas réfléchir à la campagne. C'est le passage de **loyalty card** à **customer retention automation**.

### 8.6 Pourquoi ne pas faire une app consommateur ?

Le marché Android est autour de 84,85 %, l'iOS autour de 15,14 %. Une app impose téléchargement, compte, mot de passe, notifications, stockage, maintenance, acquisition B2C. Le problème le plus coûteux est probablement l'acquisition consommateur.

**Architecture recommandée : PWA / QR / WhatsApp / Wallet**, plutôt qu'une app native B2C au départ.

### 8.7 Top 3 risques à valider avant de coder

**RISQUE 1 — Les commerçants aiment le concept mais ne paient pas.** Le niveau d'utilisation des réseaux sociaux et WhatsApp est beaucoup plus élevé que celui du CRM. *Validation :* ne pas demander « Est-ce que vous aimez l'idée ? » mais « Si je vous donne cela aujourd'hui pour 19 DT/mois, est-ce que vous payez maintenant ? ». Encore mieux : obtenir 10 paiements réels avant de développer la plateforme complète.

**RISQUE 2 — WhatsApp coûte plus cher que prévu.** Le coût API varie selon le pays et la catégorie de message. *Validation :* calculer le COGS par 1 000 clients × X campagnes × coût/message avant de promettre « messages illimités ».

**RISQUE 3 — Les POS deviennent le concurrent.** POS>lik, Cesta Food et Al-Makhzan possèdent déjà des données transactionnelles, des clients ou des modules de fidélité. *Réponse :* ne pas essayer initialement de remplacer le POS. Construire la couche CRM/retention qui fonctionne au-dessus du POS ou sans POS — cela augmente le marché au lieu de le réduire.

### Verdict final

**GO, mais pas comme « une simple carte de fidélité numérique ».**

| Critère | Verdict |
|---|---|
| Taille du marché | Large |
| Concurrence | Réelle mais fragmentée |
| Concurrence locale | Déjà présente |
| Concurrence internationale | Technologiquement forte |
| Digital adoption | Bonne côté social/messaging |
| CRM adoption | Encore faible |
| Paiement SaaS | Faisable localement |
| WhatsApp | Très intéressant mais à coût variable |
| App obligatoire | À éviter |
| Prix recommandé | 19–39 DT/mois |
| Positionnement recommandé | Retention / WhatsApp-first |
| Risque principal | Willingness-to-pay |
| Second risque | WhatsApp API economics |
| Troisième risque | POS convergence |

**Conclusion stratégique :** le marché n'est pas vierge, mais il est encore possible de créer une position forte avec une proposition très spécifique : **« Le CRM de fidélité WhatsApp des petits commerces tunisiens. »** La vraie bataille ne sera pas « Qui possède la meilleure carte digitale ? » mais **« Qui arrive à faire revenir le client sans demander au commerçant de devenir un expert du marketing digital ? »** C'est là que se trouve l'espace de différenciation le plus intéressant.

---

## Bibliographie

**INS / marché tunisien**
- Institut National de la Statistique — Statistiques issues du Répertoire National des Entreprises 2023 / édition 2024. (INS — RNE 2024)
- INS — Statistiques démographiques des entreprises. (INS — Démographie des entreprises)
- INS — Nombre d'entreprises / emploi formel par secteur. (INS — Entreprises et salariés)
- INS — Publication RNE 2023. (INS — Publication RNE 2023)

**Cafés / restauration / tourisme**
- Tuniscope — Déclaration de la Chambre nationale des propriétaires de cafés, mars 2024.
- Ministère du Tourisme — Programme de mise à niveau des établissements hôteliers (PMNH).
- OCDE — Services de restauration : examen de la concurrence en Tunisie 2023.
- Tunisie Tribune — Nombre de boulangeries classées.

**Digital / consumer**
- DataReportal — Digital 2026: Tunisia.
- DataReportal — Digital 2025: Tunisia.
- StatCounter — Mobile OS Market Share Tunisia, June 2026.
- CAWTAR/GIZ dataset reproduit dans un rapport public — Digitalisation et entrepreneuriat féminin en Tunisie.

**Loyalty competitors (Tunisie)**
- Digital Menu Tunisia · TMS Tunisia · Raba7ni · ZEROSIX · Sourdi Tunisia · Stampi Tunisia · Sarra Card · FlousBack · POS>lik · Cesta Food · Al-Makhzan.

**International competitors**
- Loopy Loyalty · Stamp Me · Loyally.ai · Stampeo · PassKit · Stampede · Boomerangme · Perkville · LoyaltyLion · Tapcarry (pricing pages).

**Payments / regulatory**
- INPDP — Formulaires et procédures de traitement des données personnelles.
- Loi organique n° 2004-63 relative à la protection des données personnelles.
- Konnect — Pricing.
- Flouci — Enterprise payments.
- World Bank — Tunisia Enterprise Survey 2024.

**Lacunes restantes à combler directement auprès des organismes professionnels :** nombre exact de cafés/restaurants par gouvernorat, nombre national de salons de coiffure/barbiers, nombre de glaciers, split indépendants vs chaînes, statistiques publiques de paiement B2B SaaS. Meilleure prochaine source : demande directe à la Chambre Nationale des Cafetiers, aux chambres syndicales concernées, à l'INS/RNE, et au Ministère du Commerce — plutôt que des chiffres de blogs ou de réseaux sociaux.

---

## Ce que ça change pour Fidel (à synchroniser dans BLUEPRINT.md)

Cette étude confirme et affine plusieurs décisions déjà prises en §0.1 du blueprint, et en corrige/précise d'autres :

1. **TAM révisé :** ~70 000–80 000 (central), pas 90-100k+. SAM Grand Tunis + Sousse + Sfax ≈ 35 000–45 000. Remplace les chiffres §7/§13 du blueprint qui citaient ~20-40k cafés seuls comme proxy.
2. **Prix à revoir à la baisse :** 19 / 39 / 69 DT (Starter/Growth/Pro) au lieu de 39 / 89 / 199 DT — aligné sur le benchmark local réel (Digital Menu 16 DT, Al-Makhzan 79 DT), pas sur le benchmark international (35-150+ DT).
3. **Positionnement à resserrer :** pas "digital loyalty card" (commoditisé) mais **"WhatsApp-first retention engine"** — le vrai concurrent est WhatsApp manuel + carte papier, pas les autres SaaS.
4. **Concurrents locaux à intégrer dans l'analyse concurrentielle :** ZEROSIX (le plus sérieux techniquement), Sourdi, Stampi, POS>lik, Cesta Food, Al-Makhzan — absents de la v1 du blueprint.
5. **WhatsApp = COGS variable, jamais "gratuit"** dans le pricing — pas de tarif Tunisie confirmé, à négocier/tester directement avec un BSP avant de fixer les quotas des plans.
6. **Confirme** : Android-first (84,85% vs 15,14% iOS), pas d'app consommateur native, PWA/web-first, WhatsApp > email, paiement marchand via Konnect/Flouci/virement (pas de carte internationale requise).
7. **Validation à faire avant de coder** (déjà aligné avec le pilote §27 du blueprint, mais à durcir) : ne pas se contenter d'un accord verbal des cafetiers — obtenir un **engagement de paiement réel** (10 paiements) avant de construire la plateforme complète.
