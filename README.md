# Fidel — Tunisian Customer-Loyalty SaaS

> **Fidel** — digital loyalty for Tunisian small businesses. From *fidélité* (French) / a nod to "loyal customer."

A multi-tenant SaaS that replaces the paper punch card for Tunisian small businesses
(cafés, restaurants, fast-food, bakeries, salons, barbershops, hotels, retail).

- Customer scans a QR at the counter → fills a quick form (name, phone, email + consent)
  → gets a **digital stamp card that works on any phone** (web card; Apple/Google Wallet optional).
- Staff stamp customers with a phone/tablet **scanner**; the balance lives on the server.
- The business builds a **customer contact list it owns** and sends **WhatsApp / SMS / push**
  "come back" messages — positioned as a **WhatsApp-first retention engine**, not just a loyalty card.
- **No customer payment** — the customer pays at the counter as always. The only money flow
  is the business's monthly subscription (manual / bank-transfer friendly; Konnect/Flouci optional).

## Status

Early planning, market-validated. Key docs in [`docs/fidel/`](docs/fidel/):

- [`BLUEPRINT.md`](docs/fidel/BLUEPRINT.md) — 34-part product/technical/business blueprint: market
  analysis, MVP scope, architecture, database, APIs, security, pricing, roadmap, first 30 dev tasks.
  **§0.1** captures the Tunisia-adapted, phone-first model that governs the design.
- [`MARKET_STUDY.md`](docs/fidel/MARKET_STUDY.md) — market study (TAM/SAM, direct/indirect
  competitors in Tunisia and worldwide, pricing benchmarks, regulatory environment). Its final
  section notes what should be synced back into the blueprint (revised pricing, revised TAM,
  sharper positioning).
- [`GEMINI_MARKET_STUDY_PROMPT.md`](docs/fidel/GEMINI_MARKET_STUDY_PROMPT.md) — the research
  prompt used to produce the market study, kept for re-running/deepening specific sections.

## Recommended stack (see blueprint §12/§23)

Next.js (Vercel) · FastAPI modular monolith (Railway) · PostgreSQL via Supabase (Auth, Storage, RLS)
· Redis · WhatsApp/SMS + Web/Wallet push · Konnect/Flouci or manual billing.

## Repo layout (planned)

```
docs/fidel/      # blueprint, market study, decisions, runbooks
apps/web/        # Next.js: marketing + dashboard + customer card + scanner (to be added)
apps/api/        # FastAPI backend + workers (to be added)
packages/db/     # migrations + RLS policies (to be added)
```

## Working on this project

This repo lives on GitHub at `amen-allah-fraj22/voice-anonymizer`, on branch
`claude/tunisian-loyalty-saas-design-tpvptm`. To work locally:

```bash
git clone https://github.com/amen-allah-fraj22/voice-anonymizer.git fidel
cd fidel
git checkout claude/tunisian-loyalty-saas-design-tpvptm
```

Cloud sessions (this one included) and your local machine share the same history through
that branch — push from either side and pull on the other to stay in sync.
