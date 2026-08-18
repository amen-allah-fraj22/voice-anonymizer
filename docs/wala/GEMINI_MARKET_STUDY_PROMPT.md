# Prompt for Gemini — Tunisia Loyalty/Retention Market Study

> **How to use this file:** copy everything under the line "COPY FROM HERE" into Gemini (ideally Gemini with web search/grounding enabled — ask it explicitly to search live). It is one long prompt. If Gemini truncates or you want to go deeper, you can paste each numbered PART separately as a follow-up in the same chat.

---

## COPY FROM HERE

You are a **senior market research analyst** specializing in African/MENA retail-tech and SaaS markets. Your job is to produce a **rigorous, evidence-based market study**, not a generic essay. I am evaluating whether to build a digital customer-loyalty SaaS ("digital stamp/points card that replaces the paper punch card, with a customer contact database and WhatsApp/SMS re-engagement") targeted at **Tunisian small businesses with recurring customers**: cafés, restaurants, fast-food, bakeries, ice-cream shops, hotels, beauty salons, barbershops, and retail shops.

**Ground rules for your research:**
- Use live web search for everything. Do not rely on memory for numbers, prices, or company facts — they go stale fast and I need current data (search with 2024–2026 in mind).
- **Every factual claim, statistic, or price needs a cited source (name + URL).** If you cannot find a source, explicitly say "not found / estimate" and explain your reasoning — never invent a number and present it as fact.
- Clearly separate: **(a) verified fact with source, (b) reasonable inference from partial data, (c) your own assumption.** Label each.
- Where sources disagree (this happens a lot with Tunisian informal-economy numbers), **show the range and explain why sources differ** rather than picking one arbitrarily.
- Prioritize **Tunisian-language sources** (French and Arabic) in addition to English — a lot of the ground truth here is only published in French/Arabic (INS, La Presse, Espace Manager, Tuniscope, Webdo, Business News, African Manager, government portals).
- I already have some starting data points below — **verify, update, and go deeper than these**, don't just repeat them.

**What I already know (verify + expand, don't just restate):**
- Estimates put **organized/formal Tunisian cafés at ~20,000**, with a further **~15,000–20,000 operating informally** (unlicensed) — sources disagree on total (some cite ~40,000 total). [Espace Manager, La Presse]
- Tunisia had **~38,031 registered "accommodation and restaurants" companies** as of 2016 per INS/CEIC data — this is outdated, I need current figures.
- Tunisia had **10.25 million tourists in 2024** (record year), ~14% of GDP from tourism, 240,000 classified hotel beds. [ONTT/eTunisie]
- Known Tunisian players in or adjacent to this space (direct + indirect), to verify and expand: **Raba7ni** (consumer loyalty aggregator app), **Digital Menu** (digitalmenu.tn — QR menu/ordering with loyalty as a feature), **TMS Tunisia** (tmstunisia.com — digital loyalty card app), **ZeroSix** (zerosix.com — loyalty card/CRM), **Ben Rahim** (benrahim.tn — in-house retail loyalty), **flousback** (cashback app), **Sarra Card** (sarracard.com — physical/plastic loyalty card printer), **Point M** (pointm.tn — physical loyalty card), **Qamarero** (EU digital loyalty vendor sometimes serving MENA).
- Known worldwide direct competitors in the "Wallet-based digital stamp card" category, to verify and expand: **Loopy Loyalty**, **Stamp Me**, **Fivestars**, **Punchh**, **Stampede**, **Boomerangme**, **Loyally.ai**, **Stampeo**, **PassKit**, **Tap2Wafa** (MENA-focused). Also check **Tapcarry** (tapcarry.com) specifically — I was unable to access its site directly; get its actual feature list, pricing, and positioning.
- Local payment reality to factor in: Tunisia has **cash-first commerce**; digital wallets (Flouci, D17, Konnect/e-DINAR) reached **~2.5M active wallets and 1.8B TND in online transactions in 2025 (+42% YoY)**, but card-on-file / recurring billing is not the norm for small merchants. WhatsApp and Facebook/Instagram are the dominant small-business marketing channels, not email.

---

### PART 1 — Market Sizing (Tunisia)

1. **How many cafés exist in Tunisia** — nationally, and broken out by governorate/city if possible, especially **Grand Tunis (Tunis, Ariana, Ben Arous, Manouba), Sousse, Sfax, and other major cities**. Distinguish formal/registered vs. informal. Cite INS (Institut National de la Statistique), the Chambre Nationale des Cafetiers, or any trade association.
2. **How many restaurants** (all types — traditional, fast-food, fine dining) exist nationally and in the same cities. Separate by category if data allows (fast-food chains vs. independent).
3. **How many bakeries (boulangeries/pâtisseries), ice-cream shops (glaciers), hotels (classified + unclassified), beauty salons, and barbershops** exist — find whatever official or trade-body counts are published (Chambre Syndicale, ONTT for hotels, Ministry of Commerce registries, INS business census).
4. What is the **average number of employees / size profile** of a typical Tunisian café or restaurant (micro-business vs. chain)? What % are independently owned vs. part of a chain (2–5+ locations)?
5. What is the **churn/turnover rate of these businesses** (how many open/close per year)? This affects SaaS retention risk.
6. Estimate a **realistic total addressable market (TAM)**: total count of businesses across all these categories in Tunisia, and a **serviceable addressable market (SAM)** for Grand Tunis + Sousse + Sfax specifically (where a bootstrapped SaaS would likely launch first).
7. What % of these businesses currently use **any digital tool** (POS software, digital menu, social media ordering, existing loyalty app)? Find any survey or study on Tunisian SMB digitalization (possibly from ITES, Smart Tunisia, GIZ, World Bank, or local digital agencies).

### PART 2 — Direct Competitors (Tunisia)

For **every company you can find in Tunisia offering digital loyalty cards, digital stamp/points programs, or loyalty-focused CRM for local merchants** (starting from my list above, but actively search for more — search in French and Arabic too, e.g. "carte de fidélité digitale Tunisie", "برنامج ولاء رقمي تونس", "application fidélité commerçant Tunisie"):
- Company name, website, founding year if known, funding/backing if known.
- Exact feature set (stamp cards? points? Apple/Google Wallet? plain web card? SMS/WhatsApp integration? POS integration?).
- Pricing (monthly/annual, in TND if available).
- Target customer segment (cafés specifically? all retail? enterprise chains?).
- How they position themselves (marketing angle, taglines).
- Any visible customer count, notable clients, or market traction (social media followers, App Store/Play Store install counts and ratings, Google reviews, press coverage).
- Strengths and weaknesses as best you can assess from public info.
- Do they support **Apple Wallet / Google Wallet** or are they app-based / plastic-card-based / WhatsApp-based?

### PART 3 — Indirect Competitors (Tunisia)

Loyalty doesn't only compete with other loyalty software. Investigate what Tunisian cafés/restaurants **actually use today** to retain customers, since this is who we're really displacing:
1. **Physical/plastic loyalty card printers** (Sarra Card, Point M, local print shops/imprimeries offering "carte de fidélité") — pricing, how merchants order them, typical stamp-card designs used.
2. **Paper punch cards** — how common is this still, any data or anecdotal reporting on Tunisian café habits.
3. **WhatsApp Business / Instagram / Facebook** used informally by owners to message regulars (broadcast lists, groups, DMs) — how prevalent is this practice, any local case studies or articles about Tunisian SMB social-media marketing habits.
4. **QR-menu / ordering platforms** with loyalty as a side feature (Digital Menu, and any others) — are merchants adopting these primarily for menu digitization or for loyalty?
5. **POS software vendors in Tunisia** (local or regional) that might bundle loyalty features — search for Tunisian POS/caisse enregistreuse software companies and check if any offer loyalty modules.
6. **Generic CRM/marketing tools** (Mailchimp, generic SMS blast services) that a Tunisian business owner might use instead of a purpose-built loyalty tool.
7. Rank these indirect alternatives by **how big a substitute threat** each represents (cheap/free and already habitual = high threat; expensive/unfamiliar = low threat).

### PART 4 — Direct Competitors (Worldwide) — To Understand the Category and What Could Enter Tunisia

1. Deep-dive the **major global/regional players** in Wallet-based digital loyalty for SMBs: **Loopy Loyalty, Stamp Me, Fivestars, Punchh, Stampede, Boomerangme, Loyally.ai, Stampeo, PassKit, Perkville, Belly, LoyaltyLion (e-commerce-focused, for contrast), Tap2Wafa, and Tapcarry**. For each: business model, pricing (convert to TND for comparison), target customer size, feature depth, whether they have any MENA/Africa presence or Arabic-language support today.
2. Are any of these already **actively operating, advertising, or onboarding merchants in Tunisia or nearby markets (Morocco, Algeria, Egypt)?** Search for evidence (App Store listings targeting Tunisia, Arabic marketing content, local case studies, LinkedIn job posts for MENA sales roles, etc.). This tells us the realistic threat of a foreign player entering before we do.
3. What is the **typical time-to-market and cost** these companies report for going into a new emerging market (any public statements, blog posts, interviews)?
4. What is the **category's overall growth trend** globally (industry reports, market-size estimates for "digital loyalty" or "customer retention SaaS" — Grand View Research, Statista, Mordor Intelligence, or similar, if accessible)?

### PART 5 — Tunisian Business-Owner Behavior & Willingness to Pay

1. Find any **surveys, studies, or news articles** about Tunisian SMB owners' attitudes toward paid software subscriptions (SaaS adoption in Tunisia, digital transformation studies from Smart Tunisia, GIZ, World Bank, ITES, or local business publications like Business News, Webmanagercenter, African Manager).
2. What price points have **succeeded or failed** for other Tunisian SMB SaaS tools (Digital Menu's pricing if public, any POS software pricing, any published case studies of Tunisian merchants adopting/dropping a paid tool)?
3. Investigate **local payment habits for B2B SaaS specifically**: do Tunisian merchants pay by bank transfer, cash, Konnect/Flouci links, or something else for their existing software subscriptions? Any evidence from Digital Menu, POS vendors, or hosting/domain companies operating in Tunisia.
4. What **objections or failure reasons** are documented (blog posts, forum discussions, reviews) when Tunisian small businesses reject or abandon digital tools?

### PART 6 — Tunisian Consumer Behavior

1. What % of Tunisians use **smartphones**, and what is the **Android vs. iPhone split** specifically in Tunisia (search operator/market reports, StatCounter Tunisia data, or similar)?
2. How prevalent is **WhatsApp usage** in Tunisia vs. SMS vs. email for receiving business communications/promotions? Any local digital-marketing agency reports or StatCounter/DataReportal "Digital Tunisia" yearly reports (these are usually a good source — search "Digital 2025 Tunisia DataReportal" or "Digital 2026 Tunisia").
3. Are Tunisian consumers already familiar with **Apple Wallet / Google Wallet** for anything (boarding passes, transit, event tickets, bank cards)? Any evidence of adoption.
4. How do Tunisians currently feel about **sharing personal data (name, phone, email)** with a business in exchange for a loyalty reward — any consumer trust/privacy studies specific to Tunisia or the wider MENA region.

### PART 7 — Regulatory & Payment Environment

1. Confirm the **current legal framework for personal data protection in Tunisia** (Organic Law 2004-63 and any amendments), and the role of **INPDP** (Instance Nationale de Protection des Données Personnelles) — what obligations would apply to a company collecting customer name/phone/email for marketing purposes. Cite official sources where possible.
2. Confirm current **fees and requirements for Konnect, Flouci, and e-DINAR/D17** for a SaaS business collecting recurring merchant subscription payments (not consumer payments) — get the latest published rates.
3. Any **WhatsApp Business API / Meta Business Messaging** restrictions or costs specific to sending marketing messages to Tunisian phone numbers.

### PART 8 — Synthesis & Recommendation

Based on everything above, answer directly:
1. **Total realistic addressable market size** in Tunisia (business count × realistic penetration %) — give a low/mid/high estimate with your reasoning shown.
2. **Is the market underserved or already crowded?** Name the single biggest competitive threat (local or global) and explain why.
3. **What price point (in TND/month) is realistically achievable** given what Tunisian SMBs currently pay for comparable tools?
4. **What is the single most differentiating thing** a new entrant could do that none of the current players (local or global) are doing well in Tunisia today?
5. **What are the top 3 risks** this market study surfaces that a founder should validate before writing code (e.g., "few businesses will pay upfront," "WhatsApp API costs are higher than assumed," "a global player is already entering MENA")?
6. List **every source you used** in a clean bibliography at the end, grouped by section.

**Formatting requirements for your answer:** Use clear headers matching PART 1–8 above. Use tables wherever you're comparing multiple companies or listing multiple statistics. Bold every number that came from a live search result. Do not pad with generic filler — if you found nothing solid on a sub-question, say so plainly and suggest where a human could go get it (e.g., "no public data — recommend contacting the Chambre Nationale des Cafetiers directly").

## COPY UNTIL HERE
