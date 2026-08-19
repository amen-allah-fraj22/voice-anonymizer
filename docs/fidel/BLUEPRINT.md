# Fidel — Tunisian Customer-Loyalty SaaS · Implementation Blueprint

> **Brand:** **Fidel** (from French *fidélité* = "loyalty"; reads naturally in French and Arabic script *فيدال*). Short, brandable, `.tn`/`.com` availability **to be verified before commitment**.
>
> **Author's note on sources.** `tapcarry.com` was blocked by this environment's network egress proxy, so I could **not** directly observe its pages. My "Tapcarry deconstruction" is therefore reconstructed from (a) the well-documented Apple/Google-Wallet digital-loyalty product category to which it belongs — Loopy Loyalty, Stampede, Boomerangme, Stamp Me, Loyally.ai, Stampeo, etc. — and (b) public search snippets. **I mark every such statement as an inference, not an observed fact.** Before finalizing product decisions, re-verify Tapcarry's exact feature set and pricing directly from its site.

**Legend used throughout:** `[FACT]` = directly verifiable / documented · `[INFERENCE]` = reasonable technical deduction · `[ASSUMPTION]` = my working assumption, to validate.

---

## 0.1 Tunisia Ground Adaptation (v2 — SUPERSEDES the sections it names)

Based on founder input reflecting Tunisian reality. **Where this section conflicts with anything later in the doc, this section wins.**

**Two decisions:**

1. **No customer mobile payment. Ever.** Tunisia is cash-first and mobile payment is weak, but that's fine — **loyalty is not payment.** The customer keeps paying at the counter however they already do (cash/card). The app never touches the customer's money. The *only* place money flows through the platform is **the business paying its monthly Fidel subscription**, and even that supports **manual bank transfer / cash / Konnect-Flouci link** — no card-on-file required. → **Supersedes §20–21 framing:** treat customer payment as out-of-scope; keep merchant billing only, manual-first.

2. **The product is the digital fill-in card + captured customer contact.** The old paper punch card (where the customer writes their name/phone) becomes a **digital form + digital stamp card**. When a customer joins, the business captures **name + phone + email (with consent)**. That contact list — plus visit history — is the real asset and the moat. Apple/Google Wallet becomes an **optional bonus**, not the main path.

**Primary customer flow becomes (web-first, Wallet optional):**
```
Counter QR  →  mobile web page  →  quick form (name, phone*, email, ✔ consent)
            →  digital card issued (web card, works on ANY phone)
            →  [optional] "Also add to Apple/Google Wallet" button
            →  identity = PHONE NUMBER (always works, even old phones / no Wallet)
   * phone is the primary identity + the WhatsApp/SMS channel
```

**Why phone-first, not Wallet-first:** most Tunisian customers are on Android, many won't bother adding a Wallet pass, and the **phone number is what the business actually wants** (for WhatsApp/SMS "come back" messages). So we lead with the simple web card + form; Wallet is a nice-to-have we offer *after* capture, never a requirement.

**What changes in the rest of the doc:**
- **§9 Module 3 / §11 Customer screens:** the **web card + join form is the primary experience**; Apple Wallet (§15) and Google Wallet (§16) become *optional add-ons* a customer may tap after joining. Build the web card + form FIRST; add Wallet passes second.
- **§10 MVP:** enrollment form (name/phone/email + consent) is now a **core MVP feature**; Wallet passes can even be a fast-follow if timelines are tight — the web card alone is shippable.
- **§13 DB:** `customers.phone` becomes the **primary identity** (already `UNIQUE(business_id, phone)`); a customer can exist with **no Wallet pass at all** (`loyalty_cards.wallet_pass_serial` / `google_object_id` are nullable — already are).
- **§20–21 Pricing/economics:** remove customer-payment processing from cost model; merchant subscription is the only money flow; **manual/bank-transfer billing is the default at pilot**, Konnect/Flouci is the convenience upgrade.
- **§14 APIs:** `POST /join/{slug}` now always collects the contact form; `/wallet/apple` and `/wallet/google` are optional follow-on calls, not part of the required join path.

**Consent is mandatory at capture** (one checkbox on the form): Tunisia's data-protection law (INPDP) and WhatsApp's rules both require opt-in before you message people. Cheap to add, expensive to skip.

---

## 0. Executive Summary

**What we are building.** Fidel is a **multi-tenant SaaS for customer loyalty and retention**, purpose-built for Tunisian small businesses (cafés, restaurants, fast-food, bakeries, ice-cream shops, hotels, salons, barbershops, retail). It replaces the **paper fill-in punch card**: a customer **scans a QR at the counter → fills a quick form (name, phone, email + consent) → gets a digital stamp card that works on any phone** (a plain web card, with Apple/Google Wallet as an optional add-on). Staff stamp customers with a phone/tablet scanner; the business builds a **customer contact list it owns** and sends **WhatsApp/SMS/push** "come back" messages. **No customer payment is involved — the customer pays at the counter as always; the only money flow is the business's monthly subscription (manual/bank-transfer-friendly).** See **§0.1** for the Tunisia-adapted, phone-first model that governs the rest of this doc.

**Why it can work in Tunisia.** The Wallet-loyalty model consistently produces **60–75% enrollment vs 10–20% for app-based loyalty** `[FACT — category data, Loopy/Loyally-class vendors]` because there's no app-install friction. Tunisia has a large SMS/WhatsApp culture, a fast-digitizing café/resto sector (QR menus are already normal), and **no dominant local Wallet-native loyalty player** — the closest, **Raba7ni**, is a *consumer aggregator* (one app, many shops) rather than a per-merchant branded-Wallet product `[INFERENCE from Raba7ni public description]`.

**The wedge.** Ship the narrowest thing a real café will pay for: **branded Wallet stamp card + counter scanner + "bring them back" WhatsApp/push**, priced in TND, French-first UI, Arabic + English at the data layer from day one.

**Verdict (detailed in §33): BUILD — as a tightly-scoped MVP and a 5–10 business pilot first.** The technical risk is well-understood (PassKit/Google Wallet are mature), the market gap is real, and the model is proven abroad. The real risks are commercial (Tunisian SMB willingness-to-pay, distribution, churn), not technical. Validate those in the pilot before scaling spend.

**Solo-founder path:** modular monolith (Next.js + FastAPI + Postgres/Supabase), ~**10–14 weeks to a pilot-ready MVP** for one focused builder, ~6–8 weeks with a small team. Buy Wallet infra logic yourself (it's the moat-adjacent core), rent everything else (auth, email, SMS/WhatsApp, payments).

---

## 1. Tapcarry Product Deconstruction

> Reconstructed from the Wallet-loyalty category. Treat all as `[INFERENCE]` unless noted.

**Product category.** A "digital loyalty card" SaaS whose signature primitive is the **Apple Wallet / Google Wallet loyalty pass**. The merchant configures a stamp or points card; customers add it to their phone's native wallet; the merchant "stamps" via a scanner; passes auto-update over the air; the merchant messages customers via Wallet push (and usually email/SMS).

**Likely public pages** (typical for this category): Home, How it works, Features, Pricing, FAQ, Demo/Book-a-call, Card designer preview, Login/Signup, Blog, Legal (Privacy, Terms). `[ASSUMPTION]`

**Core value proposition (category).** "Replace paper punch cards with a digital card that lives in the phone's wallet — no app, higher signup, and a direct push channel back to the customer." `[FACT — category positioning]`

**Per-feature analysis** (the 13 lenses requested, applied to the category's core features):

| Feature | Problem solved | Who uses | Backend concept | Fraud risk | MVP? |
|---|---|---|---|---|---|
| **Wallet stamp/points card** | Paper cards lost; no data | Customer | Signed pass (PassKit/Google), server-of-record for balance | Screenshot reuse, shared pass | **MVP** |
| **QR enrollment page** | Signup friction | Customer | Public landing → generate pass → "Add to Wallet" | Bot signups | **MVP** |
| **Counter scanner** | Award stamps | Employee | Scan card token → validate → increment balance | Self-stamping, over-stamping | **MVP** |
| **Reward redemption** | Give the free item | Employee | Mark reward used; decrement | Double-redeem, unauthorized reward | **MVP** |
| **Card designer** | Brand the card | Owner | Pass template (colors, logo, fields) | — | **MVP (basic)** |
| **Wallet push messages** | Bring customers back | Owner | Update pass → APNs/Google push | Spam / opt-out | **MVP (basic)** |
| **Customer list / CRM** | Know your regulars | Owner | Customers table + visit events | PII exposure | **MVP (basic)** |
| **Analytics** | Prove ROI | Owner | Aggregations over events | — | V1 |
| **Campaigns/segments** | Targeted marketing | Owner | Segment query → batch push/SMS | Spam | V1 |
| **Multi-location / roles** | Chains | Owner/Manager | Location scoping, RBAC | Cross-location abuse | V1/V2 |
| **Referrals / tiers / birthday** | Growth loops | Owner/Customer | Rules engine | Gaming referrals | V2 |
| **Subscription/billing** | Monetize | Owner/Platform | Plans, entitlements, payments | Payment fraud | MVP (manual ok at pilot) |

**Failure/edge handling the category must solve** `[INFERENCE]`: pass fails to add (browser quirks), offline scanner at counter, duplicate stamp taps, customer changes phone, reward redeemed on two devices, Apple/Google push delivery delays.

**Security & fraud themes** (expanded in §17–18): the pass is **display-only**; the **balance is authoritative on the server**, never trusted from the pass; scans must be idempotent and rate-limited; employees must be attributable for every stamp/redeem.

---

## 2. Feature Inventory (Functional Decomposition)

### A. Business Owner
Registration · Login (email+password / OTP) · Business profile (name, type, logo, colors, locations) · Brand configuration (card template) · Loyalty-program creation (stamp N→reward, or points) · Stamp config (stamps-per-visit, per-amount, daily cap) · Reward config (what, cost in stamps/points, expiry, terms) · Card customization (logo, colors, strip image, fields, back-of-card info) · Customer management (list, search, profile, manual adjust, notes) · Employee management (invite, PIN, role) · Employee permissions (stamp / redeem / refund / view) · Notifications (Wallet push composer) · Analytics (dashboard) · Settings (locale, currency=TND, timezone=Africa/Tunis, opening hours) · Subscription (plan, entitlements) · Billing (invoices, payment method) · Support (help, contact).

### B. Customer
Discover program (QR at counter, link in bio, receipt) · Scan QR → landing → see program & reward · Join (optionally name/phone; can be anonymous-token) · Add card to Wallet / save PWA card · View card (barcode + balance) · Receive stamps (auto over-the-air update) · Complete reward (balance reaches threshold → "reward ready") · Redeem reward (show card, staff confirms) · Receive push/WhatsApp · Return to business.

### C. Employee
Login (staff PIN or magic device link) · Scanner (camera QR) · Customer verification (see name/balance/last visit) · Stamp validation (one tap, idempotent) · Reward redemption (confirm → mark used) · Fraud prevention (daily caps, cooldown, manager approval for edge cases) · Activity history (my stamps/redeems today).

### D. Platform Administrator (SaaS owner)
Businesses (list, status, impersonate-with-consent) · Users · Subscriptions & plans · Payments/invoices · Usage & quotas (passes, SMS, push) · Customers (aggregate, GDPR requests) · Employees · Loyalty programs · **Abuse/fraud monitoring** (velocity anomalies) · Support tickets · Platform analytics (MRR, churn, active merchants) · System config (feature flags, plan definitions, Wallet certs health, provider keys).

---

## 3. User Journeys (ASCII)

**Business onboarding**
```
Visitor → Signup(email+pwd/OTP) → Verify email → Create business(name,type,locale)
   → Create loyalty program(stamp: buy 9 get 10th) → Customize card(logo,colors)
   → Auto-generate enrollment QR + poster PDF → Invite staff / set PIN → LAUNCH
Edge: email taken · weak pwd · logo too large · closes mid-setup (resume draft)
```

**Customer onboarding**
```
QR scan → mobile web landing(program + reward shown) → [iPhone] Add to Apple Wallet
                                                     → [Android] Add to Google Wallet
                                                     → [fallback] Save PWA/web card
   → (optional) enter name/phone → pass appears in wallet → confirmation screen
Edge: unsupported browser · declines Wallet (offer web card) · double-add (dedupe by device)
```

**Loyalty interaction (stamp)**
```
Customer visits → opens card → shows QR/barcode → Employee scanner reads token
   → server validates(token, cooldown, cap, employee perms) → +1 stamp (idempotent txn)
   → pass push-updated OTA → customer sees new balance → if threshold: "Reward ready!"
Edge: offline(queue) · double-tap(idempotency key) · cap hit(reject+reason) · unknown token
```

**Reward redemption**
```
Reward ready → Customer shows card → Employee taps "Redeem" → confirm item
   → server marks redemption USED (single-use code) → balance decremented → receipt event
   → pass updated (reward cleared) → push "Enjoy! See you soon"
Edge: already redeemed(reject) · expired reward · manager-approval-required threshold
```

**Marketing**
```
Owner → new campaign → pick segment(e.g. inactive 30d) → channel(push/WhatsApp/SMS)
   → compose(FR/AR) → preview → send(respect quota, quiet hours, opt-out)
   → customer receives → returns → stamp → visit logged → campaign attribution
Edge: over quota · opt-out list · rate limit · failed delivery(retry/report)
```

**Subscription**
```
Business → 14-day trial → choose plan → pay(card/Flouci/Konnect or manual bank transfer)
   → active → monthly renewal → [fail] grace 7d(read-only warnings) → dunning
   → recovered→active | not→downgrade to Free(cap features) or cancel(export data)
Edge: card declined · partial period · upgrade proration · cancel keeps data 90d
```

---

## 4. Business Model (Tapcarry-class, reconstructed)

`[INFERENCE]` Classic vertical SaaS: **tiered monthly/annual subscription** gated by locations, staff seats, customer/contact volume, message quotas, and branding. Land with a single café, expand to multi-location. Category ACV abroad is roughly **$25–$100+/mo**; Tunisia needs a re-priced model (see §21). Value metric = *active businesses × retention*, not headcount of end-customers. Optional add-ons: SMS/WhatsApp bundles, extra locations, white-label.

---

## 5. Tunisian Market Analysis

**Context `[FACT/known]`:** ~12M population, very high mobile penetration, WhatsApp is the default messaging channel, Facebook/Instagram dominant for SMB marketing, growing QR-menu adoption post-2020. Payment reality: **cash-first**, but digital wallets rising — **2.5M active mobile wallets (Flouci, D17, Konnect combined); 1.8B TND online transactions in 2025 (+42% YoY)** ([Smartegy 2025](https://smartegy.tn/les-moyens-de-paiement-e-commerce-en-tunisie-ou-en-est-on-en-2025/)). Card ownership is dominated by **e-DINAR (La Poste)** — the most democratized online card. Konnect fees: **1.3% local / 2.9% intl / 2 TND transfer, no subscription** ([Konnect](https://konnect.network/en/)).

**Device split `[ASSUMPTION — validate]`:** Android majority (likely 75–85%+), iPhone minority but concentrated in higher-spend segments (hotels, upscale cafés/salons). **This makes Android-first non-negotiable** — a lesson foreign Apple-Wallet-centric competitors get wrong for Tunisia.

**Business reality:** many owners are non-technical, run on cash, have WhatsApp Business, thin margins, and are skeptical of monthly fees but pay for things that visibly bring customers back. Internet at the counter can be flaky → **scanner must tolerate offline**.

---

## 6. Competitor Analysis

| Player | URL | Target | What it is | Pricing | Strength | Weakness / gap for us |
|---|---|---|---|---|---|---|
| **Raba7ni** | raba7ni.com | TN consumers + shops | **Consumer loyalty aggregator** (one app/site, many shops, points→gifts), QR to join, no download | n/d publicly | Local, multi-merchant network, TN brand | Aggregator not per-merchant branded Wallet; merchant doesn't own the channel; not Apple/Google-Wallet-native `[INFERENCE]` |
| **Digital Menu (digitalmenu.tn)** | digitalmenu.tn | TN restos/cafés | QR **menu + ordering** + integrated loyalty as a feature | n/d | Local, resto-focused, ordering | Loyalty is secondary; not Wallet-native; different core job |
| **Ben Rahim** | benrahim.tn | TN retail (own brand) | In-house loyalty system | — | — | Single-brand, not SaaS |
| **flousback** | flousback.com | Cashback | Cashback loyalty | n/d | Consumer pull | Different model (cashback), not merchant tool |
| **Fidelys (Tunisair)** | fidelys.tunisair.com | Airline | Miles program | — | — | Not relevant SMB |
| **Qamarero** | qamarero.com | EU restos | Digital loyalty + scratch, CRM, no app | EU pricing | Polished | Not TN-localized, EUR pricing, no TND/WhatsApp focus |
| **Stamp Me / Loopy / Stampede / Boomerangme / Loyally / Stampeo** | various | Global SMB | Wallet stamp-card SaaS (our exact category) | ~$25–100+/mo | Mature Wallet infra | English/EUR/USD, no TN payments, no WhatsApp-first, no Arabic, no local support |
| **Tap2Wafa** | tap2wafa.com | MENA/global | Apple+Google Wallet loyalty | n/d | Wallet-native, "wafa" branding | Not TN-specific pricing/support; validate coverage |

**Takeaway:** No competitor combines **(a) per-merchant branded Apple+Google Wallet card, (b) TND pricing, (c) WhatsApp/SMS-first re-engagement, (d) Arabic+French UI, (e) local payment + local support.** That intersection is the opening.

Sources: [Raba7ni](https://raba7ni.com/en-us) · [Digital Menu](https://digitalmenu.tn/) · [Qamarero](https://qamarero.com/fr/programme-fidelite-restaurant/) · [Stamp Me](https://www.stampme.com/cafes-and-restaurants) · [Tap2Wafa](https://tap2wafa.com/) · [flousback](https://flousback.com/).

---

## 7. Market Gap

- **Commoditized:** stamp-card mechanic, QR enrollment, basic Wallet pass, basic analytics.
- **Hard to copy:** reliable OTA Wallet update infra + APNs/Google plumbing at scale; distribution/relationships with TN merchants; accumulated customer-visit data; local payment integration; trusted local support/onboarding.
- **Missing in Tunisia:** a *merchant-owned, branded, Wallet-native* loyalty product with **TND pricing, WhatsApp-first campaigns, Arabic UI, offline-tolerant scanner, and hands-on local onboarding.**
- **What cafés actually need:** more repeat visits, a way to message regulars (they already do this ad-hoc on WhatsApp/Instagram), zero counter friction, no new hardware, something staff can use without training.
- **What owners will pay for:** visible returning customers + a message channel. **What customers will use:** something already in their phone (Wallet) or one tap (web card), no app.
- **What makes them reject it:** complexity, extra hardware, per-message costs they can't predict, anything that slows the counter, unclear ROI, French-only if staff read Arabic.

**10 differentiators, ranked** (score 1–5; higher=better except Difficulty/Cost where higher=harder/costlier):

| # | Differentiator | Cust. value | Tech difficulty | Cost | Comp. advantage | Monetization | Time-to-MVP |
|---|---|---|---|---|---|---|---|
| 1 | **WhatsApp-first re-engagement** (templated, opt-in) | 5 | 3 | 3 | 5 | 5 | 3 |
| 2 | **True Android + iPhone parity** (Google+Apple Wallet + PWA) | 5 | 3 | 2 | 4 | 3 | 2 |
| 3 | **Offline-tolerant counter scanner** (queue+sync) | 4 | 3 | 2 | 4 | 2 | 3 |
| 4 | **TND pricing + local payment (Konnect/Flouci) + bank-transfer/manual** | 5 | 2 | 2 | 4 | 4 | 2 |
| 5 | **Arabic + Tunisian-dialect + French UI** | 4 | 2 | 1 | 4 | 2 | 2 |
| 6 | **1-tap poster + WhatsApp share kit** (merchant growth) | 3 | 1 | 1 | 3 | 2 | 1 |
| 7 | **Anti-fraud tuned for speed** (idempotent, caps, staff attribution) | 3 | 3 | 2 | 3 | 2 | 3 |
| 8 | **Owner WhatsApp support + done-for-you setup** | 4 | 1 | 3 (human) | 5 | 3 | 1 |
| 9 | **Simple, honest analytics** (returning %, visit gap) | 3 | 2 | 1 | 2 | 2 | 2 |
| 10 | **Referral + birthday loops** | 4 | 3 | 2 | 3 | 3 | 4 |

**Priority ordering for the moat:** #4, #2, #1, #8 first (they decide adoption in Tunisia), then #3, #5, #6, #9, then #7 hardened, #10 later.

---

## 8. Our Product Concept (Part 10)

- **Core proposition (one sentence):** *Fidel turns every Tunisian café, restaurant, or shop into a repeat-visit machine — a branded loyalty card that lives in the customer's phone wallet, stamped in one tap at the counter, with WhatsApp/push to bring them back — no app, priced in dinars.*
- **Target customer (ICP):** owner-operated Tunisian café / fast-food / bakery / ice-cream / salon / barbershop with **recurring customers, 1–3 locations, WhatsApp Business, no loyalty tooling today.** Beachhead: **specialty cafés & bakeries in Grand Tunis + Sousse/Sfax**.
- **Customer problem:** paper cards get lost; no reason to remember which café; no reminders.
- **Business problem:** can't identify or reach regulars; marketing is random; retention is invisible.
- **Product solution:** branded Wallet/PWA card + one-tap scanner + targeted WhatsApp/push + honest retention analytics.
- **Main differentiator:** **Tunisia-native** (TND, Arabic/French, WhatsApp-first, local payment & support) on top of **true Android+iPhone Wallet parity**.
- **Brand positioning:** the friendly, local, *"card in your phone"* loyalty tool — modern but not intimidating; warm, trustworthy, "for us here."
- **Product philosophy:** *fewer taps at the counter, dinars-clear pricing, works on flaky wifi, Arabic-first hearts / French-first UI, buy trust with support.*

---

## 9. Product Modules (Part 11) — MVP / V2 / V3

**Module 1 — Business dashboard:** Overview, Customers, Loyalty program, Card designer, Employees, Scanner (web), Rewards, Campaigns, Notifications, Analytics, Locations, Settings, Subscription. *MVP:* Overview, Customers(list/search/adjust), 1 program, basic card designer, employees(PIN), web scanner, rewards, basic push, basic analytics, settings, billing. *V2:* segments/campaigns, multi-location, richer analytics. *V3:* API/webhooks, white-label.

**Module 2 — Loyalty engine.** *MVP:* **stamp cards** (buy N get 1), single active reward, visit tracking, per-visit + daily cap, reward expiry. *V2:* points mode, multiple rewards, birthday reward, referral reward, tiers. *V3:* campaign-linked rewards, rules engine, coalition/multi-brand.

**Module 3 — Customer experience (web-first per §0.1).** No app. **Primary path (all phones):** QR → web page → **quick form (name, phone, email + consent)** → **web/PWA stamp card** (works everywhere, identity = phone number). **Optional add-on after joining:** *iPhone* → "Add to Apple Wallet"; *Android* → "Add to Google Wallet" for OTA updates + wallet convenience. *Returning:* recognized by phone/card token; if they change phones, re-issue from the join link and merge by verified phone. Wallet passes are a bonus, never required.

**Module 4 — Employee scanner (web/PWA).** Login (staff PIN + device bind), camera scan, customer result (name/balance/last visit/flags), one-tap stamp (idempotent), redeem (confirm), fraud guards (cap/cooldown/attribution), my-history, permissions.

**Module 5 — Marketing automation.** *MVP:* manual broadcast (push + one WhatsApp/SMS template) with opt-out + quiet hours. *V2:* segments (inactive Nd, new, VIP, birthday), scheduled, A/B. *V3:* triggered journeys. **Anti-spam:** double opt-in for SMS/WhatsApp, per-customer frequency cap, quiet hours (Africa/Tunis), one-click STOP, quota ceilings per plan.

**Module 6 — Analytics (with exact formulas):**
- *Active customers* = distinct customers with ≥1 visit in window.
- *New customers* = enrollments in window.
- *Returning customers* = customers with ≥2 lifetime visits AND ≥1 visit in window; *Return rate* = returning / active.
- *Visit frequency* = total visits / active customers (per window).
- *Average visit gap (days)* = mean over customers of mean(diff between consecutive visit dates).
- *Stamps issued* = count(stamp events).
- *Redemption rate* = rewards redeemed / rewards earned (window).
- *Retention (cohort)* = of customers first-seen in month M, % with ≥1 visit in month M+n.
- *CLV (proxy)* = avg visits/customer/period × avg spend/visit (spend optional/manual) × gross margin × expected lifetime; MVP shows visit-based proxy only.
- *Campaign performance* = sends, delivered, opens (push), and **attributed return visits** = visits within N days of send by recipients minus baseline.
- *Reward performance* = earned / redeemed / expired per reward.
- *Employee activity* = stamps & redeems per employee (fraud lens).

---

## 10. MVP Definition (Part 14)

**MVP = one café can run its whole loyalty program on it.**

**IN:** signup/login; 1 business, up to 2 locations; 1 stamp program + 1 reward; basic card designer (logo, 2 colors, reward text); **Apple Wallet + Google Wallet passes + PWA web-card fallback**; QR enrollment page + printable poster; web scanner with PIN login, idempotent stamp, redeem, per-visit/daily caps, staff attribution, **offline queue**; customers list/search/manual adjust; **basic push** + **one WhatsApp/SMS broadcast** with opt-out; core analytics (active, new, returning, visit gap, redemption); settings (FR/AR, TND, TZ); **billing** (Free/Starter/Pro; payment can be manual/bank-transfer + Konnect link at pilot); audit log.

**OUT (and why):** points mode (stamps validate first); tiers/referral/birthday (added complexity, not needed to prove retention); segments/journeys (need volume/data first); multi-brand/coalition (huge scope); public API/white-label (no demand yet); native mobile apps (Wallet+PWA removes the need); advanced RBAC beyond owner/manager/staff (over-engineering); in-app POS/ordering (different product — stay focused).

**MVP journey:** owner signs up → builds card in 10 min → prints poster → staff get PIN → customers scan+add → staff stamp → customers return → owner sends one WhatsApp "we miss you" → sees returning-% rise.

MVP architecture/DB/APIs/screens/deploy: see §12–16 and §19 (all "MVP" tags).

---

## 11. UX/UI Specification (Part 15)

For each screen: role · purpose · key components · states (empty/error/loading) · responsive note. **All merchant screens desktop+mobile; scanner & customer screens mobile-first.**

**Marketing site:** *Home* (hero, how-it-works 3 steps, wallet mockup, social proof, CTA), *Features*, *Pricing* (TND toggle mo/yr), *Demo* (book/live sample card), *FAQ*, *Login*, *Signup* (email/OTP). Empty=n/a; Error=form validation; Loading=skeleton.

**Business dashboard:**
- *Dashboard/Overview* — role: owner/manager. KPI cards (active, new, returning, redemptions), 30-day trend, recent activity feed, quick actions. Empty="no customers yet → share your QR". Loading=skeletons. Error=retry banner.
- *Loyalty program* — reward rule editor (buy N get 1), stamp caps, expiry. Validation errors inline.
- *Card designer* — live Wallet-card preview (Apple/Google/PWA toggle), logo upload (size/format errors), colors, fields, back info. Empty=default template.
- *Customers* — searchable table (name, phone, stamps, last visit, status), profile drawer (visit history, manual +/- with reason, notes, opt-out toggle). Empty state + import later.
- *Employees* — list, invite, PIN reset, role, active toggle. 
- *Scanner (web)* — see below.
- *Rewards* — list, add/edit, active/expired.
- *Campaigns* — composer (channel, segment(V2), FR/AR text, preview, quota meter, send/schedule). Confirm-before-send modal. Error=quota exceeded.
- *Notifications* — push composer + history + delivery status.
- *Analytics* — charts + definitions tooltip; date range; export CSV(V1). Empty="collect more visits".
- *Locations* — CRUD, per-location QR.
- *Settings* — profile, locale/currency/TZ, hours, opt-in text, danger zone (export/delete).
- *Billing* — plan, usage vs quota, invoices, payment method, upgrade/cancel.

**Customer:** *Join loyalty* (program + reward, Add-to-Wallet buttons by platform, optional name/phone, consent checkbox), *Loyalty card* (PWA fallback: barcode, balance, reward progress, business info), *Reward* (ready/redeem instructions), *History* (visits). Error=invalid link; Loading=spinner; Empty=fresh card 0/N.

**Employee:** *Login* (business code + PIN, device bind), *Scanner* (camera + manual code entry fallback, torch), *Customer result* (photo-less: name/initials, balance, last visit, flags, big Stamp button, Redeem if ready), *Stamp confirmation* (checkmark + new balance + undo 10s), *Redemption confirmation* (item + marked used). Offline banner + queued-count indicator. Error=unknown/blocked token with reason.

---

## 12. Technical Architecture (Parts 5, 22, 23)

**Recommended stack (final, §23 rationale):**
- **Frontend:** **Next.js (React, App Router) + TypeScript + Tailwind + shadcn/ui**, deployed on **Vercel**. Merchant dashboard, marketing site, customer web-card/PWA, and employee scanner PWA are all Next.js routes/segments (one web app, role-gated). PWA for scanner + customer card (installable, offline via service worker + IndexedDB queue).
- **Backend:** **FastAPI (Python) modular monolith** on **Railway** (or Fly.io). Why FastAPI over Node: your Python/FastAPI strength, excellent for the Wallet-signing + APNs/Google jobs, async, typed (Pydantic). One deployable, clear module boundaries (auth, business, loyalty, wallet, messaging, billing, admin). A small **background worker** (same codebase, RQ/Celery/Arq + Redis) handles pass pushes, campaigns, dunning.
- **Database:** **PostgreSQL** via **Supabase** (managed PG + Auth + Storage + Row-Level-Security). Supabase gives you auth, file storage (logos, pass assets), and RLS for tenant isolation with minimal ops. (If you prefer full control later, plain Postgres on Railway/RDS.)
- **Auth:** **Supabase Auth** — email+password + **OTP/magic link** for owners; **staff PIN** is app-level (not Supabase users) bound to a device token; customers are **anonymous tokens** (no login) with optional phone verification.
- **Cache/queue:** **Redis** (Railway/Upstash) for jobs, rate limits, idempotency keys, session/QR nonces.
- **Notifications:** APNs (Apple Wallet), Google Wallet API (Android), **Web Push (VAPID)** for PWA, **email** (Resend/Postmark), **SMS/WhatsApp** via a provider with TN reach (Twilio, or a **local aggregator** — validate; WhatsApp via Meta Cloud API / BSP).
- **Payments:** **Konnect** (cards + e-DINAR, 1.3% local) and/or **Flouci**; **manual bank transfer** for pilot; Stripe only for any non-TND/intl.
- **Infra/observability:** Cloudflare (DNS, CDN, WAF) in front; Sentry (errors), Logtail/Better Stack (logs), UptimeRobot/BetterUptime (uptime), Supabase automated backups.

**Approach comparison (why not the alternatives):**
- *Frontend:* Next.js beats plain React (SSR/SEO for marketing, one framework for all surfaces) and beats a separate native app (Wallet+PWA removes app-store friction, huge for Tunisia adoption).
- *Backend:* FastAPI over NestJS (your stack; Python great for crypto/signing/scripting) and over Django (lighter, async, API-first). Modular monolith over microservices (solo/small team — avoid ops overhead, §22).
- *DB:* Supabase over raw PG for speed (auth+storage+RLS bundled) — but keep SQL portable so you can leave. Not a document DB — this is relational, multi-tenant, reporting-heavy.
- *Infra:* Vercel+Railway+Supabase over AWS for MVP (minutes not weeks, cheap, scales to thousands of merchants). Move DB to dedicated PG and workers to dedicated infra only at the 1,000+ merchant stage (§19).

---

## 13. Database Architecture (Part 4)

**Tenant isolation strategy:** **shared schema, `business_id` on every tenant-scoped row**, enforced by **Postgres Row-Level Security** (Supabase) — every query filtered by the authenticated business/JWT claim; service-role used only in trusted backend jobs. Simpler than schema-per-tenant, scales to thousands; revisit schema-per-tenant only for very large enterprise tenants later. **All PKs = UUID v4.** Timestamps `timestamptz` (UTC), display in Africa/Tunis. Money = TND, integer millimes (avoid float). Soft-delete via `deleted_at` where needed; hard audit via `audit_logs`.

**Core tables (columns · keys · notable indexes/constraints):**

- **users** (platform + owner/staff-admin accounts) — `id PK`, `email UNIQUE`, `password_hash|null`(Supabase-managed), `full_name`, `phone`, `role`(platform_admin|owner|manager|staff_admin), `locale`(fr|ar|en), `created_at`, `last_login_at`, `deleted_at`. *idx(email)*.
- **businesses** (tenant root) — `id PK`, `owner_user_id FK→users`, `name`, `slug UNIQUE`, `type`(cafe|resto|fastfood|bakery|icecream|hotel|salon|barber|retail|other), `logo_url`, `brand_primary`, `brand_secondary`, `locale_default`, `currency`('TND'), `timezone`('Africa/Tunis'), `status`(trial|active|past_due|suspended|cancelled), `plan_id FK`, `created_at`, `deleted_at`. *idx(status), idx(plan_id)*.
- **locations** — `id PK`, `business_id FK`, `name`, `address`, `lat/lng`, `phone`, `hours_json`, `active`. *idx(business_id)*.
- **employees** — `id PK`, `business_id FK`, `location_id FK|null`, `display_name`, `pin_hash`, `role`(manager|staff), `perms_json`(stamp,redeem,refund,view), `active`, `created_at`, `last_active_at`. *UNIQUE(business_id, pin_hash) not used — PINs may repeat; auth via business+employee code+PIN*. *idx(business_id)*.
- **devices** — `id PK`, `business_id FK`, `location_id FK|null`, `employee_id FK|null`, `type`(scanner|customer_wallet|customer_pwa), `device_token`, `platform`(ios|android|web), `push_token`(APNs/FCM/VAPID), `pass_type`(apple|google|pwa|null), `last_seen_at`, `revoked_at`. *idx(business_id), idx(device_token)*.
- **customers** — `id PK`, `business_id FK`, `external_ref`, `first_name|null`, `phone|null`, `email|null`, `locale`, `consent_marketing`(bool), `consent_channel_json`(push/sms/whatsapp/email), `opt_out_at|null`, `birthday|null`, `status`(active|blocked), `created_at`, `last_visit_at`, `deleted_at`. *UNIQUE(business_id, phone) WHERE phone NOT NULL; idx(business_id,last_visit_at)*.
- **loyalty_programs** — `id PK`, `business_id FK`, `name`, `mode`('stamp'|'points'), `stamps_required`(int, stamp mode), `points_config_json`(V2), `active`, `rules_json`(per_visit_max, daily_cap, cooldown_minutes), `created_at`. *idx(business_id)*.
- **rewards** — `id PK`, `program_id FK`, `business_id FK`, `title`, `description`, `cost`(stamps/points int), `type`(free_item|discount|custom), `expiry_days|null`, `terms`, `active`. *idx(program_id)*.
- **loyalty_cards** — `id PK`, `business_id FK`, `customer_id FK`, `program_id FK`, `card_token UNIQUE`(the scanned/enrolled id, high-entropy), `balance`(int, current stamps/points), `lifetime_stamps`, `status`(active|revoked|replaced), `wallet_pass_serial`(Apple)/`google_object_id`, `created_at`, `last_stamp_at`. *UNIQUE(business_id, customer_id, program_id); idx(card_token)*.
- **stamp_events / transactions** (event-sourced ledger) — `id PK`, `business_id FK`, `card_id FK`, `location_id FK`, `employee_id FK|null`, `type`(stamp|redeem|manual_adjust|refund|enroll|expire), `delta`(int, +/-), `balance_after`, `reward_id FK|null`, `idempotency_key UNIQUE`, `source`(scanner|admin|system), `meta_json`, `created_at`. *idx(business_id,created_at), idx(card_id,created_at), UNIQUE(idempotency_key)*. **This ledger is the source of truth; `loyalty_cards.balance` is a materialized convenience recomputable from it.**
- **redemptions** — `id PK`, `business_id FK`, `card_id FK`, `reward_id FK`, `employee_id FK`, `location_id FK`, `redeem_code UNIQUE`, `status`(pending|used|expired|void), `used_at`, `created_at`, `expires_at`. *idx(business_id,status)*.
- **qr_tokens / nonces** — `id PK`, `business_id FK`, `purpose`(enroll|scan_session), `token UNIQUE`, `location_id FK|null`, `expires_at`, `used_at|null`. *idx(token)*. (Enrollment QR is static per location; scan sessions use short-lived rotating nonces to resist replay.)
- **campaigns** — `id PK`, `business_id FK`, `name`, `channel`(push|whatsapp|sms|email), `segment_json`, `body_fr`,`body_ar`,`body_en`, `status`(draft|scheduled|sending|sent|failed), `scheduled_at`, `sent_at`, `stats_json`(sent/delivered/failed/attributed). *idx(business_id,status)*.
- **notifications / messages** (per-recipient) — `id PK`, `campaign_id FK|null`, `business_id FK`, `customer_id FK`, `channel`, `provider_msg_id`, `status`(queued|sent|delivered|failed|optout), `error`, `created_at`. *idx(campaign_id), idx(business_id,created_at)*.
- **plans** — `id PK`, `code`(free|starter|pro|business|enterprise), `name`, `price_month_millimes`, `price_year_millimes`, `limits_json`(locations, staff, customers, monthly_push, monthly_sms, campaigns, analytics_level, branding), `active`.
- **subscriptions** — `id PK`, `business_id FK`, `plan_id FK`, `status`(trialing|active|past_due|grace|cancelled), `trial_ends_at`, `current_period_start/end`, `cancel_at`, `provider`(konnect|flouci|manual|stripe), `provider_ref`. *idx(business_id)*.
- **payments** — `id PK`, `business_id FK`, `subscription_id FK`, `amount_millimes`, `currency`('TND'), `status`(pending|paid|failed|refunded), `provider`, `provider_ref`, `invoice_url`, `paid_at`, `created_at`. *idx(business_id,status)*.
- **usage_counters** — `id PK`, `business_id FK`, `period_ym`, `metric`(push|sms|whatsapp|customers), `count`. *UNIQUE(business_id,period_ym,metric)* — for quota enforcement.
- **audit_logs** — `id PK`, `business_id FK|null`, `actor_type`(user|employee|system|platform_admin), `actor_id`, `action`, `entity_type`, `entity_id`, `ip`, `ua`, `meta_json`, `created_at`. *idx(business_id,created_at)*. Append-only.
- **sessions** — managed by Supabase Auth for owners; employee scanner sessions in `devices` + short-lived JWT; store refresh/rotation server-side.

**ERD (text):**
```
users 1─* businesses 1─* locations
businesses 1─* employees ·─* devices
businesses 1─* customers 1─* loyalty_cards *─1 loyalty_programs 1─* rewards
loyalty_cards 1─* stamp_events(ledger)   loyalty_cards 1─* redemptions *─1 rewards
businesses 1─* campaigns 1─* notifications *─1 customers
businesses 1─1 subscription *─1 plans ; businesses 1─* payments
businesses 1─* usage_counters ; * ─ audit_logs (append-only)
qr_tokens/nonces ─ businesses/locations
```
Every tenant table carries `business_id` + RLS policy `business_id = auth.jwt() ->> 'business_id'`.

---

## 14. API Architecture (Part 16)

REST, `/. ../api/v1`, JSON, JWT (owner/manager) or device-scoped token (scanner) or public signed link (customer). All mutating scan/redeem endpoints require an **`Idempotency-Key`** header. Standard errors: `400 validation`, `401 unauth`, `403 forbidden (role/tenant)`, `404`, `409 conflict/duplicate`, `422`, `429 rate-limited`, `5xx`. Every response tenant-scoped by JWT `business_id`.

**Auth** — `POST /auth/signup`, `/auth/login`, `/auth/otp/request`, `/auth/otp/verify`, `/auth/refresh`, `POST /auth/employee/login`(business_code+employee_code+PIN → device token), `/auth/logout`.

**Business** — `POST/GET/PATCH /businesses/{id}`, `GET/POST /businesses/{id}/locations`, `GET/POST/PATCH/DELETE /employees`, `GET /me`.

**Loyalty** — `POST /loyalty/programs`, `GET/PATCH /loyalty/programs/{id}`, `POST /rewards`, `GET/PATCH /rewards/{id}`.

**Customer / enrollment (public, signed)** — `GET /join/{business_slug}` (landing data), `POST /join/{business_slug}` (create customer+card, returns pass URLs), `GET /cards/{card_token}` (PWA card state), `GET /wallet/apple/{card_token}` (returns `.pkpass`), `GET /wallet/google/{card_token}` (returns save-to-Google JWT/link).

**Scan / stamp / redeem (device-scoped)** — `POST /scan/resolve` {card_token|nonce} → customer+card summary + allowed actions; `POST /scan/stamp` {card_token, Idempotency-Key} → new balance (+ reward_ready?); `POST /scan/redeem` {card_token, reward_id, Idempotency-Key} → redemption; `POST /scan/sync` (offline batch of queued events).

**Campaigns / notifications** — `POST /campaigns`, `GET /campaigns`, `POST /campaigns/{id}/send`, `GET /campaigns/{id}/stats`; `POST /notifications/push` (ad-hoc).

**Analytics** — `GET /analytics/overview?from&to`, `/analytics/retention`, `/analytics/customers`, `/analytics/campaigns/{id}`, `/analytics/employees`.

**Subscription/billing** — `GET /plans`, `POST /subscriptions`, `GET /subscriptions/me`, `POST /billing/checkout` (Konnect/Flouci link), `POST /webhooks/konnect` (payment callbacks), `GET /payments`.

**Wallet web-service (Apple, spec-mandated paths)** — `POST /wallet/apple/v1/devices/{deviceLibraryId}/registrations/{passTypeId}/{serial}` (register), `DELETE ...` (unregister), `GET /wallet/apple/v1/devices/{deviceLibraryId}/registrations/{passTypeId}?passesUpdatedSince=` (list updated), `GET /wallet/apple/v1/passes/{passTypeId}/{serial}` (latest pass), `POST /wallet/apple/v1/log`. Google Wallet updates are push via API (§16).

**Admin (platform)** — `GET /admin/businesses`, `/admin/subscriptions`, `/admin/usage`, `/admin/fraud/alerts`, `/admin/tickets`, `/admin/metrics`.

Example — `POST /api/v1/scan/stamp`: **Auth** device token · **Role** employee(stamp) · **Req** `{card_token, location_id, Idempotency-Key hdr}` · **Res 200** `{card_id, balance, lifetime, reward_ready:bool, redemption_code?}` · **Errors** 403 no-perm, 404 unknown token, 409 duplicate idempotency (returns original result), 422 cap/cooldown with `reason`, 429 velocity.

---

## 15. Apple Wallet Architecture (Part 6)

`[FACT — Apple PassKit]` unless noted.
1. **How passes work:** a `.pkpass` is a signed ZIP (`pass.json` + images + `manifest.json` + `signature`) added to Wallet; updates arrive OTA via APNs → device fetches latest from your web service.
2. **Pass type for loyalty:** **`storeCard`** style (loyalty). Use `primaryFields` for balance ("Stamps 7/10"), `secondaryFields` for reward, `barcode` = the `card_token` (QR/PDF417).
3. **Server generates pass:** build `pass.json` (passTypeIdentifier, teamIdentifier, serialNumber=card, `webServiceURL`, `authenticationToken`, fields, barcode) → add images → SHA-1 `manifest.json` → sign → zip → serve as `application/vnd.apple.pkpass`.
4. **Signing:** CMS/PKCS#7 detached signature over `manifest.json` using your **Pass Type ID certificate + private key + Apple WWDR intermediate** ([TN2302](https://developer.apple.com/library/archive/technotes/tn2302/_index.html)). Missing WWDR intermediate is the #1 signing failure.
5. **Certificates required:** Apple Developer account; **Pass Type ID** (`pass.com.fidel.loyalty`) + its cert; **Apple WWDR intermediate**; **APNs auth** (the same Pass Type cert/key is used to push pass updates).
6. **Pass updates:** change balance server-side → send an **empty APNs push** to each registered device's pushToken → device calls your web service `GET passes/{type}/{serial}` → you return the new `.pkpass`.
7. **Device receipt:** device registers via the web-service `register` endpoint (stores deviceLibraryId + pushToken + serial); your empty push wakes it to pull the update.
8. **Displayable info:** balance, reward, business name/logo, colors, barcode, back-of-card terms/contact, relevant-date/location (optional lock-screen relevance).
9. **Do NOT store on the pass:** anything sensitive — no full PII beyond first name, no payment data, no auth secrets beyond the per-pass `authenticationToken`; **balance is display-only, server is authoritative.**
10. **Barcode scanning:** barcode encodes `card_token`; scanner reads it, calls `/scan/resolve`.
11. **Employee scanner:** web/PWA camera (see §17/§18) — not an Apple-specific component.
12. **Customer identity:** the **`card_token`** (opaque, high-entropy, per business+customer+program), not phone/email; PII kept server-side.
13. **Lost/new phone:** re-issue by re-adding from the join link (same customer if phone verified → same card_token; else new card, offer merge by phone/code). Revoke old pass serial.
14. **Non-Apple devices:** covered by **Google Wallet + PWA** (§16). **Never assume Android can use Apple Wallet.**

`[ASSUMPTION]` We host our own PassKit web service (in FastAPI) rather than a 3rd-party pass provider — keeps the OTA-update core proprietary (§32 moat). A provider (PassNinja/PassSlot/Passcreator) is a valid *time-to-market* shortcut for the very first pilot; plan to internalize.

---

## 16. Android Architecture (Part 7)

**Options compared:**

| Option | Cost | Dev complexity | Friction | Reliability | Security | TN adoption fit | Maintenance | Scalability |
|---|---|---|---|---|---|---|---|---|
| **Google Wallet pass** | Low (free API) | Medium (JWT/issuer setup) | Low (1 tap) | High | High | High (native, OTA push) | Low | High |
| **PWA web card** | Very low | Low | Low (save to home) | Med (no native push on some) | Med | High (works everywhere) | Low | High |
| **Plain web card (link)** | Very low | Very low | Low | Med | Med | High | Low | High |
| **QR-only identity (no card UI)** | Very low | Very low | Low | High | Med | Med | Low | High |
| **NFC tap** | Med (tags/hardware) | High | Low at counter | Med | Med | Low (device/reader variance) | Med | Med |
| **Native Android app** | High | High | **High (install)** | High | High | **Low (install barrier)** | High | High |

**Recommendation (Android MVP):** **Google Wallet pass as primary + PWA web card as universal fallback.** Google Wallet gives native OTA updates + push on modern Android; PWA covers everyone else and adds installable home-screen + Web Push (VAPID). Skip native app and NFC for MVP.

**Google Wallet technicals `[FACT]`:** Google Cloud project + **Google Wallet API** + **Issuer account** (Business Console); define a **LoyaltyClass**; per customer create a **LoyaltyObject**; generate **"Add to Google Wallet"** via a **signed JWT** (`iss`=service-account email, `aud`=google, `typ`=savetowallet, `iat`, `payload.loyaltyObjects`, `origins`) signed with the **service-account key** ([Google Wallet JWT](https://developers.google.com/wallet/reference/rest/v1/Jwt)). **Updates** = PATCH the LoyaltyObject via REST → Google pushes OTA. Same `card_token` in the object's barcode.

**PWA:** Next.js PWA (manifest + service worker), offline card view via cached state, Web Push (VAPID) for notifications where supported; balance always confirmed from server when online.

---

## 17. Security Architecture (Part 17)

- **Multi-tenancy:** `business_id` on all rows + **Postgres RLS**; backend also asserts tenant in every query; never trust client-supplied business_id. Automated tenant-isolation tests (attempt cross-tenant read/write → expect 403/empty).
- **AuthN:** owners via Supabase (email+pwd w/ bcrypt/argon2 + OTP/magic link); staff via business+employee code+**PIN (argon2, rate-limited, lockout)** bound to device token; customers anonymous token (+ optional phone OTP).
- **AuthZ/RBAC:** roles platform_admin/owner/manager/staff + per-employee perms(stamp/redeem/refund/view); enforce server-side per endpoint.
- **Session:** short-lived access JWT + rotating refresh; device tokens revocable; scanner sessions expire + require re-PIN after inactivity.
- **QR/replay fraud:** enrollment QR static per location but rate-limited; **scan uses idempotency keys + optional short-lived rotating nonce**; server is source of truth so a stale pass can't inflate balance.
- **Screenshot fraud:** balance shown on pass is cosmetic; staff action always hits server which re-checks; redemptions are **single-use codes** (marked USED atomically).
- **Employee abuse:** every stamp/redeem attributed to employee_id + device + location; **daily caps, cooldown per card, velocity anomaly alerts**; manager approval for manual adjusts above threshold; self-stamp detection (employee's own customer card flagged).
- **API abuse / rate limiting:** per-IP, per-device, per-business token buckets (Redis); WAF (Cloudflare); bot protection on public join endpoint (turnstile).
- **Injection/XSS/CSRF:** parameterized queries/ORM (SQLi), output encoding + CSP (XSS), same-site cookies + CSRF tokens for cookie flows (APIs use bearer tokens), strict input validation (Pydantic).
- **Secrets:** in platform secret manager (Railway/Vercel/Supabase env), never in repo; **Wallet certs + APNs keys + service-account keys encrypted at rest**, rotated, least-privileged.
- **Encryption:** TLS everywhere (Cloudflare + platform), Postgres encryption at rest (Supabase), sensitive columns (phone) consider app-level encryption; PINs/passwords hashed.
- **Audit logs:** append-only for all privileged/mutating actions.
- **Backup/recovery:** Supabase automated daily backups + PITR (paid tier); test restores quarterly; documented RTO/RPO.
- **Privacy/GDPR-style + Tunisian law:** Tunisia's **Law 2004-63** on personal data protection + **INPDP** authority `[FACT — verify current with counsel]`; support consent capture, data export, deletion, retention limits, marketing opt-in/opt-out. **Get Tunisian legal review before launch (§30).**

---

## 18. Anti-Fraud Architecture (Part 18)

**Design principle: default is ONE TAP; friction only on anomaly.**

- **Screenshot reuse:** balance is display-only; award only via server → a screenshot grants nothing.
- **Multiple stamps per visit:** per-card **cooldown** (e.g. no 2nd stamp within N minutes) + **per-visit max** + **daily cap**; extra taps return "already stamped" (idempotent).
- **Employee self-stamping:** flag when the scanning employee is linked to the customer card / same phone; cap employee's own-card stamps; surface in fraud dashboard.
- **Unauthorized rewards:** only `redeem`-permitted employees; high-value rewards can require manager PIN; redemption is single-use code, atomic USED.
- **Shared QR / pass:** enrollment QR is fine to share (that's growth); the *card* token drives balance and is per-customer — sharing a card just means shared stamps (acceptable). Abnormal velocity on one card → soft cap + alert.
- **Old/replayed pass:** server recomputes from ledger; stale pass shows old balance but can't double-award; redemptions can't be replayed (USED).
- **Balance of security vs speed:** normal path = scan→stamp (1 tap, <1s). Only anomalies (cap hit, self-stamp, high-value reward) add a step. No 10-step counter flow — ever.

---

## 19. Infrastructure & Cost by Scale (Part 19)

| Stage | DB | Backend | Frontend | Storage | CDN | Email | SMS/WhatsApp | Push | Monitoring/Logs/Backup | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **10 biz (pilot)** | Supabase free/pro | 1 Railway svc + worker | Vercel hobby/pro | Supabase | Cloudflare free | Resend free | pay-per-msg | free (APNs/FCM/VAPID) | Sentry free, Better Stack free, Supabase backups | Manual billing ok. **~$0–60/mo** |
| **100 biz** | Supabase Pro | Railway small + worker + Redis | Vercel Pro | Supabase | Cloudflare | Resend paid | metered bundles | free | paid tiers | **~$150–400/mo** |
| **1,000 biz** | **Dedicated Postgres** (RDS/Neon) + read replica | 2–3 API instances + worker pool | Vercel/CDN | S3/R2 | Cloudflare | Postmark | volume contracts (local aggregator) | free | full observability + PITR | Move off shared Supabase DB; queue scaling. **~$1.5–4k/mo** |
| **10,000 biz** | HA Postgres cluster + replicas + partitioning (events) | Autoscaled API + dedicated push/campaign workers + Redis cluster | CDN | R2 + lifecycle | Cloudflare + WAF | Postmark/SES | multi-provider failover | sharded push jobs | SRE-grade, on-call | Consider event-table partitioning by month; regional. **~$10–30k/mo** |

**When to graduate:** stay on Supabase+Railway+Vercel until ~1,000 merchants or DB CPU/connection pressure; then dedicated Postgres + worker pool; introduce partitioning on `stamp_events`/`notifications` when they pass tens of millions of rows.

---

## 20. Pricing (Part 13)

**Reasoning:** TN SMB is price-sensitive and cash-first; anchor low, monetize on locations + message quotas + advanced features. Keep a real **Free** tier to drive bottom-up adoption; most cafés land on **Starter/Pro**. Annual = ~2 months free. **All TND, per month (annual in parens).** `[ASSUMPTION — validate willingness-to-pay in pilot]`

| Plan | Price/mo | /yr | Locations | Staff | Customers | Programs | Push | SMS/WA | Analytics | Branding | Support |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Free** | 0 | 0 | 1 | 1 | 200 | 1 | 100/mo | 0 (buy) | basic | "Powered by Fidel" | community |
| **Starter** | **39 TND** | 390 | 1 | 3 | 1,000 | 1 | 1,000/mo | 200/mo | core | remove badge | email/WhatsApp |
| **Pro** | **89 TND** | 890 | 2 | 8 | 5,000 | 3 | 5,000/mo | 1,000/mo | full + export | full | priority WhatsApp |
| **Business** | **199 TND** | 1,990 | 5 | 25 | 20,000 | 10 | 20,000/mo | 5,000/mo | full + cohorts | full + custom domain | priority + onboarding |
| **Enterprise** | custom | custom | unlimited | unlimited | unlimited | unlimited | custom | custom | full + API | white-label | dedicated |

SMS/WhatsApp overage sold in bundles (pass-through + margin). **Rationale:** 39 TND ≈ price of a few coffees — an easy "yes" if it brings back a handful of customers; Pro targets busy cafés/multi-staff; Business targets small chains/hotels.

**Cost/economics inputs (§21):** infra cost/merchant at scale ≈ **$1–4/mo**; payment processing **1.3% (Konnect local)**; SMS ≈ local per-message (validate, often 0.03–0.08 TND); WhatsApp per-conversation (Meta pricing, MENA rates — validate); Apple/Google Wallet **API free**, cost is only your compute for signing/pushes.

---

## 21. Unit Economics (Part 29)

`[ASSUMPTION-heavy — placeholders to validate in pilot]`. Blended ARPU assume **65 TND/mo** (mix across tiers, some Free). Gross margin target **~85%** (infra+messaging ~15%). CAC assume **~250 TND** (early: founder-led sales, low cash cost but real time; later paid+partners). Monthly churn assume **4%** early → target **2.5%**. Avg lifetime = 1/churn.

| Merchants | MRR (65 TND ARPU) | Annualized | Gross profit (85%) | Notes |
|---|---|---|---|---|
| 100 | 6,500 TND | 78k | ~66k/yr | pilot→early; founder support |
| 500 | 32,500 TND | 390k | ~332k/yr | need 1–2 support/sales |
| 1,000 | 65,000 TND | 780k | ~663k/yr | dedicated infra tier |
| 5,000 | 325,000 TND | 3.9M | ~3.3M/yr | SRE + team; multi-provider messaging |

**LTV** (ARPU 65 × margin 85% ÷ churn 4%) ≈ **~1,380 TND**; **LTV:CAC ≈ 5.5:1** if CAC≈250 — healthy *if churn and ARPU hold*. **Payback ≈ 4–5 months.** The entire model lives or dies on **churn** (does the café keep paying after month 3?) and **real ARPU** (do they upgrade / buy messages?). **These are the #1 things the pilot must measure.**

---

## 22. Development Roadmap (Part 20) & Priority (Part 21)

**Phases (objectives · key tasks · deps · deliverable · difficulty · parallelizable):**

- **P0 Research** — validate Tapcarry facts, TN payment/SMS/WhatsApp providers, legal (INPDP), 10 merchant interviews. *Deliverable:* validated assumptions doc. Easy. (∥ with P1 design.)
- **P1 Architecture** — finalize stack, schema, API contract, Wallet cert accounts (Apple Dev, Google issuer). Medium. Blocks build.
- **P2 UI/UX** — design system (FR/AR RTL), key screens, card designer, scanner flow. Medium. (∥ with P3/P4.)
- **P3 Database** — migrations, RLS policies, seed. Medium. Blocks backend.
- **P4 Backend core** — auth, businesses, employees, loyalty engine, ledger, idempotency. Medium-hard. Depends P3.
- **P5 Business dashboard** — CRUD screens, card designer, customers, analytics-lite. Medium. Depends P4.
- **P6 Customer experience** — join page, PWA card, enrollment. Medium. Depends P4.
- **P7 Employee scanner** — PWA scan/stamp/redeem + **offline queue**. Hard (offline). Depends P4.
- **P8 Apple Wallet** — pass gen, signing, web service, APNs updates. **Hard** (certs/crypto). Depends P4/P6. (∥ P9.)
- **P9 Android/Google Wallet** — LoyaltyClass/Object, JWT, updates + PWA push. Medium-hard. (∥ P8.)
- **P10 Notifications** — push composer, WhatsApp/SMS broadcast, opt-out, quotas. Medium. Depends P4.
- **P11 Analytics** — metrics jobs + dashboards. Medium. Depends P4 events.
- **P12 Payments/subscriptions** — plans, entitlements, Konnect/Flouci, manual billing, dunning. Medium-hard. Depends P4.
- **P13 Security hardening** — RLS tests, rate limits, audit, pen-test pass. Medium. Cross-cutting.
- **P14 Beta** — 5–10 pilots, telemetry, fixes. — Depends most.
- **P15 Production** — SLOs, backups, docs, launch. —

**Critical path:** P1→P3→P4→(P6+P7+P8/P9)→P10/P12→P14. Wallet (P8/P9) is the longest technical pole — start its cert accounts in P1.

**Priority matrix:**
- **P0 (must):** auth, tenant isolation/RLS, loyalty ledger, scanner stamp/redeem (idempotent+offline), Apple+Google Wallet+PWA card, join/enrollment, basic push, billing entitlements, audit.
- **P1 (important):** card designer, customers CRM, WhatsApp/SMS broadcast, core analytics, Konnect payment, manager RBAC.
- **P2 (useful):** segments/campaigns, multi-location, richer analytics/export, birthday/referral.
- **P3 (future):** points mode, tiers, journeys, public API, white-label, native app, POS/ordering, coalition.

**Exact build order:** P0 research → repo+CI+envs → schema+RLS → auth → loyalty engine+ledger → join/enrollment → PWA customer card → scanner(stamp/redeem/offline) → Apple Wallet → Google Wallet → dashboard(customers, program, card designer) → push → analytics-lite → billing/entitlements → security hardening → pilot.

---

## 23. Recommended Tech Stack — final (Part 23)

**Next.js/TS/Tailwind/shadcn (Vercel)** + **FastAPI modular monolith + worker (Railway)** + **PostgreSQL via Supabase (Auth, Storage, RLS)** + **Redis (Upstash)** + **APNs/Google Wallet/Web Push + Resend + WhatsApp(Meta Cloud API/BSP)/SMS(local aggregator or Twilio)** + **Konnect/Flouci payments** + **Cloudflare + Sentry + Better Stack**. Chosen for: your existing skills (Python/FastAPI/React/Next/PG/Supabase/Vercel/Railway), lowest initial cost, fast iteration, secure defaults (RLS), and a clean path to scale (swap Supabase→dedicated PG, monolith→extract workers) without rewrites.

---

## 24. Repository Structure (Part 24)

```
fidel/                      # monorepo (pnpm + turbo optional)
├─ apps/
│  ├─ web/                 # Next.js: marketing + dashboard + customer card + scanner PWA
│  │  ├─ app/(marketing)/  # home, pricing, faq
│  │  ├─ app/(dash)/       # business dashboard (role-gated)
│  │  ├─ app/(scan)/       # employee scanner PWA
│  │  ├─ app/(card)/       # customer web/PWA card + join
│  │  └─ lib/, components/, i18n/(fr,ar,en)
│  └─ api/                 # FastAPI modular monolith
│     ├─ app/modules/{auth,business,loyalty,wallet,messaging,billing,admin,analytics}/
│     ├─ app/core/         # config, db, rls, security, idempotency, rate_limit
│     ├─ app/wallet/       # apple(passkit signing, webservice), google(jwt, objects)
│     ├─ app/workers/      # push, campaigns, dunning, analytics jobs
│     └─ tests/
├─ packages/
│  ├─ db/                  # SQL migrations, RLS policies, seed
│  ├─ shared/              # shared TS types / OpenAPI client
│  └─ config/              # eslint, tsconfig, tailwind preset
├─ infra/                  # IaC, deploy configs, Cloudflare, env templates
├─ docs/                   # this blueprint, ADRs, runbooks, API spec (OpenAPI)
├─ scripts/                # cert tooling, seed, backups
└─ .github/workflows/      # CI/CD
```
**Responsibilities:** `apps/web` all user-facing surfaces; `apps/api` all business logic + Wallet/crypto + jobs; `packages/db` schema-as-code + RLS (source of truth for tenancy); `packages/shared` one type contract; `infra` reproducible envs; `docs` decisions + runbooks.

---

## 25. GitHub Strategy (Part 25)

- **Branches:** trunk-based — `main` (protected, deployable) + short-lived `feat/*`, `fix/*`; PR required, 1 review (or self-review checklist solo), squash-merge. Optional `develop`→`staging` if needed.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`…).
- **PRs:** template (what/why/test plan/screenshots), CI green required, no secrets, migration review.
- **Environments:** `development` (local + Supabase branch), `staging` (Vercel/Railway preview + staging Supabase), `production`. Separate Wallet certs/keys per env.
- **Secrets:** platform secret stores + GitHub Actions encrypted secrets; never in repo; `.env.example` only.
- **CI/CD:** on PR — lint, typecheck, unit+integration (ephemeral PG), build; on merge to `main` — deploy staging → smoke tests → promote to prod (Vercel auto + Railway deploy). DB migrations gated + backward-compatible.
- **Testing gates:** coverage floor on core (loyalty engine, wallet, auth), RLS isolation tests must pass.

---

## 26. Testing Strategy (Part 26)

- **Unit:** loyalty engine (stamp caps, cooldown, threshold→reward), pass.json builder, JWT builder, entitlement checks.
- **Integration:** API + real Postgres (testcontainers), RLS enforcement, idempotency, billing webhooks.
- **API/contract:** OpenAPI schema tests, auth/role matrices, error codes.
- **DB:** migration up/down, constraint & index correctness, ledger↔balance consistency (recompute equals stored).
- **Security:** cross-tenant access (must 403/empty), rate-limit, PIN lockout, injection/XSS fuzz, secret leakage scan.
- **Wallet:** `.pkpass` validity (manifest hashes, signature verifies with WWDR), APNs update flow (sandbox), Google JWT signature + object update.
- **QR/scan:** token resolve, replay/duplicate → idempotent, offline queue → sync reconciliation (no double stamp).
- **Mobile/browser:** iOS Safari Add-to-Wallet, Android Chrome Add-to-Google-Wallet + PWA install, RTL Arabic layout.
- **Load:** counter-scan burst (peak hour), campaign fan-out (push/SMS), analytics query time.
- **E2E:** signup→program→card→enroll→stamp→reward→redeem→campaign→return (Playwright).

**Most important cases:** (1) no double-stamp under duplicate/offline, (2) cross-tenant isolation, (3) redemption single-use atomicity, (4) valid signed passes + OTA update, (5) entitlement/quota enforcement.

---

## 27. Pilot Strategy (Part 27)

**Target 5–10 businesses:** specialty cafés + a bakery + a barbershop + one small resto in **one neighborhood of Grand Tunis (or Sousse)** — owner-operated, busy with regulars, active on Instagram/WhatsApp, owner reachable. **Why:** high visit frequency (fast loyalty loop), owners feel retention pain, dense area = word-of-mouth.

**Approach:** founder-led, in person; offer **3 months free + free done-for-you setup + printed poster** in exchange for weekly feedback and data. Sit at the counter during setup; train staff (5 min).

**Collect:** enrollment rate (scans→adds), stamps/day, returning-customer %, redemption rate, staff friction incidents, offline events, owner qualitative (would you pay? how much?), customer qualitative.

**Duration:** **6–8 weeks** (long enough for repeat-visit cycles).

**PMF metrics:** ≥50% of offered customers enroll; ≥30% of enrolled make a 2nd visit within 30 days; owners say they'd pay ≥ Starter price; ≥1 owner refers a peer unprompted; staff use it without complaint.

**Owner questions:** Do you see returning customers? Would you pay X TND/mo? What's missing? Is the counter fast enough? Would you recommend it? **Customer questions:** Was adding the card easy? Do you like it in your wallet? Did a message bring you back? Anything annoying?

---

## 28. Go-To-Market (Part 28)

**Prioritize (early):** **direct founder sales** (walk into cafés) + **referrals** + **Instagram/Facebook** (where TN SMB lives) + **WhatsApp** outreach. Later: **partnerships** (POS vendors, coffee/supply distributors, hospitality associations, web agencies) for leverage; TikTok for brand/demos.

- **First 10:** founder door-to-door in one district; free setup; make them love it.
- **First 50:** referrals + case-study reels ("this café's returning customers +X%") + Instagram DMs + neighborhood clustering.
- **First 100:** one distributor/POS partnership + paid social to lookalikes + a lightweight reseller/agency program.
- **First 500:** partner-led + inside sales + content (Arabic/French) + regional expansion (Sousse, Sfax) + retention playbook to keep churn low.

**Why:** in Tunisia trust + face-to-face + WhatsApp beat cold digital funnels early; distribution partnerships are the scalable channel (and a moat, §32).

---

## 29. Legal / Compliance (Part 30)

`[Not legal advice — verify with Tunisian counsel.]`
- **Tunisian personal-data law (Law 2004-63) + INPDP** authority: likely registration/notification obligations, consent, data-subject rights — **confirm current requirements and any 2020s updates with counsel.**
- **Privacy Policy + Terms** (FR + AR), **customer consent** capture at enrollment (marketing separate from service), **marketing opt-in/opt-out** (WhatsApp/SMS require explicit opt-in + STOP), **cookies** notice, **data retention** policy + deletion/export flows, **business data** ownership clause, **employee data** handling, **analytics** anonymization where possible.
- **Apple/Google Wallet terms:** comply with PassKit + Google Wallet API branding/usage terms; don't store prohibited data on passes; honor their content policies.
- **WhatsApp/Meta** Business Policy compliance for template messages + opt-in.
- **Action:** engage a Tunisian data-protection lawyer before pilot's marketing messaging; draft policies early.

---

## 30. Competitive Moat (Part 32)

If it works, what stops a copycat? Ranked moats:
1. **Distribution + local relationships** (partners, installed base, on-the-ground trust) — strongest, compounding.
2. **Switching costs / accumulated data** (customer history + Wallet passes already in thousands of phones — ripping out loses their loyalty base).
3. **Brand + local support reputation** (the trusted "card in your phone" name for TN SMBs).
4. **Integrations** (POS/payment/WhatsApp done well and locally).
5. **Operational knowledge** (offline scanner reliability, Wallet OTA at scale, TN messaging deliverability) — hard-won, not obvious.
6. **Network effects (weaker here)** unless you add a consumer aggregator layer later (careful — different product).
**Strategy:** win **distribution + switching costs** first (get passes into phones and merchants dependent on the retention channel), back it with **local brand + support**; treat features as commodity and relationships/data as the moat.

---

## 31. What NOT to Build Yet (Part 31)

| Feature | Why tempting | Why dangerous now | Cost/complexity | Why it can wait |
|---|---|---|---|---|
| Native mobile apps | "Real app" feel | Install barrier kills TN adoption; 2× maintenance | High | Wallet+PWA already covers it |
| POS / ordering / menu | Bigger contract | Different product; crowded (Digital Menu); scope explosion | High | Integrate later, don't build |
| Points + tiers + gamification | Looks rich | Confuses cafés; stamp is enough to prove retention | Med | V2 once stamp works |
| Consumer aggregator app | Network effects | Splits focus; chicken-egg; that's Raba7ni's lane | High | Only after merchant base exists |
| Public API / white-label | Enterprise dreams | No demand yet; support burden | Med | V3 when asked+paid |
| Advanced marketing journeys | "Automation!" | Needs data/volume; spam risk | Med | After segments prove value |
| Multi-country / multi-currency | Ambition | Distracts from TN PMF | Med | After TN traction |
| NFC hardware | Cool factor | Device variance, cost, support | Med | Rarely needed |
| Own payment rails | Margin | Regulated, hard; Konnect/Flouci exist | High | Never (rent it) |

---

## 32. Risks (Part 34 — investor lens)

**10 reasons it could fail:** (1) TN SMB won't pay monthly SaaS; (2) high churn after novelty; (3) cash-first owners see no ROI; (4) staff won't adopt at counter; (5) Android/Wallet fragmentation friction; (6) WhatsApp/SMS deliverability + cost; (7) Raba7ni/local incumbents move faster; (8) payment collection (dunning) hard in TN; (9) solo-founder bandwidth vs 34-part scope; (10) regulatory/consent misstep.

**10 reasons it could succeed:** (1) proven Wallet-loyalty model (60–75% enroll); (2) clear local gap (no TN Wallet-native merchant tool); (3) TND pricing + local payment lowers barrier; (4) WhatsApp-first fits TN behavior; (5) no-app = mass reach; (6) sticky (passes in phones, data); (7) founder-market fit (your stack); (8) low infra cost/high margin; (9) distribution partnerships available; (10) expandable to wider MENA later.

**10 assumptions to validate:** willingness-to-pay ≥39 TND; churn <4%; enrollment ≥50%; return-lift is real+attributable; Android/Google Wallet UX smooth in TN; WhatsApp cost/deliverability viable; Konnect/Flouci integration smooth; staff adoption; INPDP requirements manageable; CAC via founder sales sustainable.

**10 questions for owners:** How do you keep regulars now? Would you pay X/mo? What would make you cancel? Is the counter fast enough? Do you message customers today (how)? What's a "returning customer" worth? Who stamps — you or staff? Do you trust digital? What报告 do you want? Would you refer a peer?

**10 questions for customers:** Was adding the card easy? Do you keep it in your wallet? Would a message bring you back? Do you prefer this to a paper card? Any privacy worry? Did the counter feel slow? Would you join at other shops? iPhone or Android? Do you use Wallet already? What reward excites you?

- **Biggest technical risk:** Wallet OTA reliability + offline scanner correctness at scale (no double-stamp, valid signed passes).
- **Biggest business risk:** merchant churn / weak willingness-to-pay.
- **Biggest regulatory risk:** personal-data/consent (INPDP) + WhatsApp marketing compliance.
- **Biggest competitive risk:** a faster local/regional player (or Raba7ni) shipping merchant-branded Wallet first.
- **Strongest opportunity:** own the *merchant-branded, Wallet-native, WhatsApp-first, TND-priced* loyalty category in Tunisia before anyone else, then MENA.

---

## 33. Final Product Blueprint + Recommendation (Parts 33–34)

**Product:** merchant-branded digital loyalty (stamp) card in Apple/Google Wallet + PWA, with counter scanner + WhatsApp/push re-engagement + retention analytics. **Target (pays):** owner-operated TN cafés/food/service businesses. **Customer (uses):** their repeat patrons (no app). **Core value:** more repeat visits + a direct channel to regulars, in dinars, no app. **MVP:** §10. **Tech/Architecture/DB/APIs/UX/Pricing/Launch/Roadmap:** §12–16, §13, §14, §3/§11, §20, §27–28, §22. **Effort:** solo ~**10–14 weeks** to pilot MVP (Wallet is the long pole); small team ~6–8 weeks.

**RECOMMENDATION: BUILD** — scoped to the MVP in §10 and a 5–10 merchant pilot (§27) **before** any scale spend. The model is proven, the local gap is real, the stack fits the founder, and technical risk is manageable. The decisive unknowns are commercial — **willingness-to-pay and churn** — so the mandate is: **build the narrow MVP, run the pilot, and let pilot retention/ARPU data green-light (or reshape) the scale-up.** Do **not** build the full 34-part platform up front.

---

## 34. Exact First 30 Development Tasks (Day 1 →)

1. **Decide & trademark-check the brand/domain** (Fidel or alt); register `.tn` + `.com`; set up Google Workspace email.
2. **Interview 8–10 target café/resto owners** (retention pain, willingness-to-pay, "returning customer" value) — capture in a validation doc.
3. **Confirm Tapcarry's real feature set + pricing** directly (unblock/visit site) and adjust assumptions.
4. **Validate providers:** open **Apple Developer** ($99/yr) + **Google Cloud/Wallet issuer** accounts; shortlist **WhatsApp BSP + SMS aggregator** with TN reach; confirm **Konnect/Flouci** merchant onboarding + fees.
5. **Consult a Tunisian data-protection lawyer** (INPDP/Law 2004-63 obligations, consent, retention) — get a checklist.
6. **Write ADRs + finalize architecture** (this blueprint's stack) and the **OpenAPI contract** (§14) as the source of truth.
7. **Create the monorepo** (§24), GitHub, branch protection, PR template, Conventional Commits, `.env.example`.
8. **Set up envs:** Supabase (dev), Vercel, Railway projects; Cloudflare DNS; Sentry + Better Stack; secrets in platform stores.
9. **Author DB migrations + RLS policies** (§13) in `packages/db`; seed script; verify tenant isolation locally.
10. **Stand up FastAPI skeleton** (modules, config, DB, security, idempotency, rate-limit middleware, healthcheck) + CI (lint/type/test/build).
11. **Implement Auth:** owner signup/login + OTP (Supabase), JWT with `business_id` claim, **employee PIN login + device binding**.
12. **Build the loyalty engine + ledger** (stamp events, caps, cooldown, threshold→reward) with unit tests; balance = recompute-from-ledger.
13. **Implement scan APIs** (`/scan/resolve|stamp|redeem`) with **Idempotency-Key** + single-use redemption codes + audit logging.
14. **Design system + i18n** (Tailwind/shadcn, FR default, AR RTL, EN) and the shared TS/OpenAPI client.
15. **Build the customer join/enrollment** page + `card_token` issuance + consent capture (`/join`, `/cards/{token}`).
16. **Build the PWA customer card** (barcode, balance, reward progress, offline-cached view, Web Push VAPID).
17. **Build the employee scanner PWA** (camera scan, customer result, one-tap stamp/redeem, **offline queue + sync**, manual code fallback).
18. **Apple Wallet:** generate `pass.json` (`storeCard`), images, `manifest`, **sign with Pass Type cert + WWDR**, serve `.pkpass`; implement the **PassKit web service** (register/unregister/list/getlatest) + **APNs update push**; validate a real pass on an iPhone.
19. **Google Wallet:** create **LoyaltyClass**, per-customer **LoyaltyObject**, **signed Add-to-Google-Wallet JWT**, and **PATCH-based OTA updates**; validate on Android.
20. **Business dashboard core:** Overview KPIs, Customers (list/search/profile/manual adjust), Loyalty program editor, Rewards.
21. **Card designer** (logo upload to Supabase Storage, colors, reward text) with live Apple/Google/PWA preview → drives pass templates.
22. **Employees management** (invite, PIN, role, perms) + **audit log** surfacing.
23. **Notifications MVP:** Wallet/Web **push composer**; **one WhatsApp + one SMS broadcast** with **opt-out, quiet hours, quota** enforcement (`usage_counters`).
24. **Analytics-lite:** implement metric jobs + endpoints + dashboard (active, new, returning, visit gap, redemption rate) with definition tooltips.
25. **Billing & entitlements:** `plans`/`subscriptions`, feature/quota gating middleware, **Konnect/Flouci checkout link** + **manual bank-transfer** flow + trial/grace/dunning states + webhook handler.
26. **Security hardening pass:** cross-tenant isolation tests (RLS), rate limits, PIN lockout, CSP/headers, secret scanning, dependency audit; run `/security-review`.
27. **Test suites green:** unit (engine/pass/JWT), integration (RLS/idempotency), Wallet validity, offline-sync reconciliation, one **Playwright E2E** (signup→enroll→stamp→reward→redeem→campaign).
28. **Merchant onboarding kit:** auto-generated **enrollment QR + printable A5 poster (PDF)** + 5-minute staff guide (FR/AR).
29. **Deploy to staging → production** (Vercel + Railway + Supabase prod, separate Wallet certs per env), smoke tests, backups + PITR verified, uptime + Sentry alerts wired.
30. **Launch the pilot** with 5–10 merchants (§27): install, train staff, instrument metrics dashboard, start weekly feedback loop; gate scale-up on pilot retention/ARPU.
```
