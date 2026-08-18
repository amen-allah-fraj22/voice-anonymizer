# Wala — Tunisian Customer-Loyalty SaaS

> Working brand name (placeholder — verify trademark/domain): **Wala** (from Arabic *walaʾ / ولاء* = "loyalty").

A multi-tenant SaaS that replaces the paper punch card for Tunisian small businesses
(cafés, restaurants, fast-food, bakeries, salons, barbershops, hotels, retail).

- Customer scans a QR at the counter → fills a quick form (name, phone, email + consent)
  → gets a **digital stamp card that works on any phone** (web card; Apple/Google Wallet optional).
- Staff stamp customers with a phone/tablet **scanner**; the balance lives on the server.
- The business builds a **customer contact list it owns** and sends **WhatsApp / SMS / push**
  "come back" messages.
- **No customer payment** — the customer pays at the counter as always. The only money flow
  is the business's monthly subscription (manual / bank-transfer friendly; Konnect/Flouci optional).

## Status

Early planning. The full product/technical/business blueprint lives in
[`docs/wala/BLUEPRINT.md`](docs/wala/BLUEPRINT.md) — 34 parts covering market analysis,
MVP scope, architecture, database, APIs, security, pricing, roadmap, and the first 30 dev tasks.
**§0.1** captures the Tunisia-adapted, phone-first model that governs the design.

## Recommended stack (see blueprint §12/§23)

Next.js (Vercel) · FastAPI modular monolith (Railway) · PostgreSQL via Supabase (Auth, Storage, RLS)
· Redis · WhatsApp/SMS + Web/Wallet push · Konnect/Flouci or manual billing.

## Repo layout (planned)

```
docs/wala/       # blueprint, decisions, runbooks
apps/web/        # Next.js: marketing + dashboard + customer card + scanner (to be added)
apps/api/        # FastAPI backend + workers (to be added)
packages/db/     # migrations + RLS policies (to be added)
```
