# Skylive — Ticket Breakdown (Agent‑Ready)

**Date:** 2026-03-23
**Rule:** 1 ticket = 1 owner/agent. Small, mergeable chunks.

---

## A) Backend Core

**A1 — Auth Core**
- Scope: register/login/refresh/logout + JWT strategy
- Done: endpoints respond; refresh tokens stored; rotation works
- Files: `apps/api/src/auth/*`

**A2 — Users**
- Scope: GET/PATCH `/users/me`
- Done: validation + auth guard
- Files: `apps/api/src/users/*`

**A3 — Creators**
- Scope: onboard + profile update + public page + stats
- Done: creator role set + stats aggregate
- Files: `apps/api/src/creators/*`

**A4 — Content CRUD**
- Scope: create/read/update/delete content
- Done: access rules enforced + feed returns content
- Files: `apps/api/src/content/*`

**A5 — Live Sessions**
- Scope: create/start/end session + webhook endpoints
- Done: streamKey + status transitions + hlsUrl
- Files: `apps/api/src/live/*`

**A6 — Access Enforcement**
- Scope: access rules across content + live
- Done: consistent access object in API
- Files: `apps/api/src/content/*`, `apps/api/src/live/*`

**A7 — Prisma Schema + Migrations**
- Scope: schema + migrate + seed
- Done: migration committed + seed script
- Files: `apps/api/prisma/*`

---

## B) Streaming Infrastructure

**B1 — Nginx RTMP Config**
- Scope: RTMP ingest + HLS + webhook hooks
- Done: HLS plays locally
- Files: `nginx/nginx.conf`

**B2 — OBS Encoder Doc**
- Scope: recommended settings + troubleshooting
- Done: doc added
- Files: `docs/ops/obs-settings.md`

**B3 — LL‑HLS (optional)**
- Scope: experimental LL‑HLS config
- Done: LL‑HLS proof of concept
- Files: `nginx/*`

---

## C) Payments

**C1 — Stripe Checkout (Sub)**
- Scope: subscription checkout + metadata
- Done: returns URL + webhook updates
- Files: `apps/api/src/payments/*`

**C2 — PPV Content**
- Scope: payment intent + purchase record
- Done: purchase recorded on webhook

**C3 — PPV Live**
- Scope: payment intent + live price
- Done: purchase recorded on webhook

**C4 — Tips**
- Scope: tips endpoint + webhook
- Done: tip stored on success

**C5 — Stripe Portal**
- Scope: customer portal session
- Done: URL returned

---

## D) Realtime Chat

**D1 — Socket.IO Gateway**
- Scope: join/leave/message
- Done: messages broadcast + persisted

**D2 — Redis Adapter**
- Scope: scale Socket.IO
- Done: multiple nodes sync

**D3 — Viewer Count**
- Scope: real‑time viewer count
- Done: updates per room

---

## E) Media & Security

**E1 — S3/R2 Upload**
- Scope: upload endpoint + key storage
- Done: uploads work, key stored

**E2 — Signed URLs**
- Scope: signed URL endpoint
- Done: temporary URL returns

**E3 — ACL Enforcement**
- Scope: premium access checks
- Done: only authorized users get URLs

---

## F) Observability & Ops

**F1 — Health**
- Scope: /health endpoints
- Done: returns OK

**F2 — Logging**
- Scope: structured logs + request ID
- Done: logs with IDs

**F3 — Docker Compose**
- Scope: infra + api + client services
- Done: local stack runs

---

## G) Frontend

**G1 — App Shell**
- Scope: layout + providers + routing
- Done: app renders w/ auth guards

**G2 — Auth UI**
- Scope: login/register forms
- Done: tokens stored + refresh works

**G3 — Feed UI**
- Scope: mixed content + live cards
- Done: access badges + CTA

**G4 — Live UI**
- Scope: HLS player + chat panel
- Done: viewer count, purchase gate

**G5 — Creator Studio**
- Scope: upload + live controls
- Done: streamKey + analytics

**G6 — Billing UI**
- Scope: subscriptions + history + portal
- Done: working flow

---

## H) UX/UI

**H1 — Design Tokens**
- Scope: colors/type/spacing tokens
- Done: applied to base components

**H2 — Empty/Error States**
- Scope: UX for edge cases
- Done: states in feed/live/studio

**H3 — Accessibility**
- Scope: keyboard nav + ARIA
- Done: a11y pass

---

## I) QA & Tests

**I1 — Unit Tests**
- Scope: auth + access logic
- Done: unit tests passing

**I2 — E2E Tests**
- Scope: auth + purchase + live flows
- Done: Playwright/Cypress tests

**I3 — Performance Smoke**
- Scope: basic load tests
- Done: thresholds documented
