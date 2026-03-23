# Skylive — Execution Board (Dependencies + Order)

**Date:** 2026-03-23
**Purpose:** Parallelize with minimal blocking.

---

## Phase 0 — Foundations (Already done)
- Monorepo + docker compose + basic API scaffolding

---

## Phase 1 — Backend Core (Blocker for frontend)

**Order**
1. A7 Prisma schema + migrations
2. A1 Auth core
3. A2 Users
4. A3 Creators
5. A4 Content CRUD
6. A5 Live sessions
7. A6 Access enforcement

**Parallel lanes**
- Lane 1: A1 + A2
- Lane 2: A3
- Lane 3: A4 + A6
- Lane 4: A5

---

## Phase 2 — Streaming Infra (Can run in parallel with Phase 1)

**Order**
1. B1 Nginx RTMP config
2. B2 OBS encoder doc

**Parallel lanes**
- Lane 1: B1
- Lane 2: B2

---

## Phase 3 — Payments (After auth + creators)

**Order**
1. C1 Stripe subscriptions
2. C2 PPV content
3. C3 PPV live
4. C4 Tips
5. C5 Portal

**Dependencies**
- Needs A1, A3, A4, A5

---

## Phase 4 — Realtime Chat (After live access)

**Order**
1. D1 Socket.IO gateway
2. D3 Viewer count
3. D2 Redis adapter

**Dependencies**
- Needs A5, A6

---

## Phase 5 — Media & Security (After content)

**Order**
1. E1 Upload
2. E2 Signed URLs
3. E3 ACL enforcement

**Dependencies**
- Needs A4, A6

---

## Phase 6 — Frontend (After Phase 1+2 basics)

**Order**
1. G1 App shell
2. G2 Auth UI
3. G3 Feed UI
4. G4 Live UI
5. G5 Creator studio
6. G6 Billing

**Dependencies**
- Needs A1–A6 + B1

---

## Phase 7 — UX/UI

**Order**
1. H1 Design tokens
2. H2 Empty/error states
3. H3 Accessibility

**Dependencies**
- Can start after G1

---

## Phase 8 — Ops, QA, CI/CD

**Order**
1. F1 Health
2. F2 Logging
3. F3 Docker compose checks
4. I1 Unit tests
5. I2 E2E tests
6. I3 Perf smoke

---

## Phase 9 — Advanced Streaming (Optional polish)

**Order**
1. B3 LL‑HLS
2. VOD pipeline
3. ABR ladder
4. WebRTC preview

---

## Done Criteria
- All tickets closed
- End‑to‑end demo recorded
- Docs complete
