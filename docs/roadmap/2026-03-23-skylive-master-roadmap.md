# Skylive — Master Roadmap (Portfolio, 100% Completion)

**Date:** 2026-03-23
**Goal:** A production‑grade, portfolio‑ready platform for paid content + live streaming + chat + monetization, with realistic architecture and hardening.

---

## 0) Research Summary — What similar platforms do technically

### Ingest & Delivery
- **RTMP ingest** remains the default for OBS and pro encoders. It’s widely supported and simple to operate.
- **SRT ingest** is increasingly used for better resilience; latency tuning is critical for stability.
- **HLS playback** is the most compatible delivery format across browsers and mobile.
- **LL‑HLS** is the next step for lower latency via playlist parts and server control.

### Real‑time chat & scale
- **Socket.IO + Redis adapter** is the standard for horizontal scaling across nodes.

### Payments & subscriptions
- **Stripe webhooks** are essential for subscription state and payment confirmation.

### Media security
- **Presigned URLs** are the usual method to grant temporary access to private media objects.

### Encoder settings (common pitfalls)
- Many platforms recommend **keyframe interval ≈ 2 seconds** for RTMP ingest to keep HLS playlists and players stable.

---

## 1) Common issues & failure modes (so we design around them)

### Streaming
- **Too‑low SRT latency** causes instability; you must tune latency for the network and maintain a predictable buffer.
- **Player HLS issues** often stem from missing CORS headers or incorrect MIME types on HLS paths.
- **Incorrect keyframe interval** causes ingest or playback errors; using ~2s is the safe baseline.

### Payments
- **Relying only on client success** is unsafe; webhooks must be the source of truth for payment outcomes and subscription status.

### Security & access
- **Presigned URL TTL** can be shorter than expected depending on how URLs are generated; design refresh flows accordingly.

### Scale
- **Socket.IO requires a pub/sub adapter** to scale beyond one node.

---

## 2) Target Architecture (portfolio‑grade)

### Core services
- **API**: NestJS monolith with modules (auth, users, creators, content, live, chat, payments).
- **DB**: PostgreSQL + Prisma.
- **Cache / pubsub**: Redis.
- **Streaming**: Nginx RTMP ingest + HLS; LL‑HLS later.
- **Storage**: S3/R2 with presigned URLs.
- **Payments**: Stripe.

### Data flow (live)
1. Creator creates a live session → receives `streamKey`.
2. OBS publishes RTMP to `rtmp://.../live` with key.
3. Nginx RTMP produces HLS segments.
4. API updates session status on `on_publish` / `on_done` webhooks.
5. Players request HLS playlist `m3u8`.
6. Chat uses WebSocket rooms bound to `liveSessionId`.

### Data flow (paid content)
1. Creator uploads media → S3 key stored in DB.
2. Access check: FREE / SUBSCRIPTION / PPV.
3. Client requests signed URL if allowed.

---

## 3) Master Roadmap (Workstreams + Milestones)

### Workstream A — Backend Core (MVP)
**Goal:** functional API with auth, content, live, chat, payments, and access control.

1. **Auth & user identity**
   - JWT + refresh token rotation
   - Password hashing (bcrypt)
   - Current user endpoint
   - Security: rate limit, request IDs, timeouts

2. **Creator & user profiles**
   - Creator onboarding
   - Profile updates
   - Public creator page

3. **Content system**
   - CRUD content
   - Access rules & checks
   - Feed aggregation

4. **Live system**
   - Create session / start / end
   - Stream webhooks (on_publish/on_done)
   - HLS URLs

5. **Chat system**
   - Socket.IO namespace `/chat`
   - Room join/leave
   - Message persistence

6. **Payments**
   - Subscription checkout
   - PPV purchase (content + live)
   - Tips
   - Webhook verification + state sync

**Exit criteria:**
- All API endpoints reachable and demoable
- Access rules enforced in API responses
- Live session can go from OFFLINE → LIVE → ENDED

### Workstream B — Streaming Infrastructure
**Goal:** stable ingest + playback with minimal latency and correct headers.

1. **RTMP ingest**
   - Nginx RTMP with `on_publish`, `on_done`
   - CORS headers for HLS playback

2. **HLS output**
   - Correct MIME types for `.m3u8` and `.ts`
   - HLS segment path & cleanup

3. **Quality constraints**
   - Recommend keyframe interval 2s for creators

4. **Future improvements**
   - LL‑HLS support
   - SRT ingest

**Exit criteria:**
- OBS → RTMP → HLS works locally
- Player playback stable

### Workstream C — Media Storage & Security
**Goal:** safe storage and delivery of premium assets.

1. **S3/R2 integration**
   - Upload endpoint
   - Signed URL generation

2. **Security**
   - Limited TTL signed URLs
   - Access checks for premium content

**Exit criteria:**
- Upload + download via signed URL validated

### Workstream D — Observability & Ops
**Goal:** stability and production realism.

1. **Health endpoints**
2. **Structured logging**
3. **Metrics (minimal)**
4. **Docker compose dev stack**

**Exit criteria:**
- Health endpoint returns OK
- Logs include request IDs

### Workstream E — Performance & Scalability
**Goal:** architecture looks realistic and scale‑ready.

1. **Socket.IO Redis adapter**
2. **Caching strategy** (feed + access checks)
3. **Queue system** for background jobs (Bull)

**Exit criteria:**
- Chat works with Redis adapter

### Workstream F — Advanced Streaming (Portfolio Boost)
**Goal:** advanced streaming features to stand out.

1. **LL‑HLS** support
2. **Live → VOD** pipeline
3. **ABR ladder**
4. **Optional WebRTC preview**

**Exit criteria:**
- Low‑latency option exists
- Live recorded to VOD

### Workstream G — Security & Abuse Prevention
**Goal:** professional hardening.

1. **Rate limiting**
2. **Abuse reporting**
3. **Blocklists / bans**
4. **Audit trail**

**Exit criteria:**
- Abuse flow documented + partially implemented

### Workstream H — CI/CD & QA
**Goal:** portfolio shows engineering maturity.

1. **CI pipeline** (lint/test)
2. **E2E tests** (auth, live, purchase)
3. **Deployment doc**

**Exit criteria:**
- CI green; tests run in PR

### Workstream I — Frontend (Product UX)
**Goal:** full product UI with auth, feed, live, chat, creator studio, billing.

1. **App shell**
   - Providers (QueryClient, auth)
   - Routing structure (auth/app groups)
   - Error boundaries + loading states

2. **Auth**
   - Login/register forms
   - Token storage + refresh flow

3. **Feed**
   - Mixed content + live
   - Access badges (FREE / SUB / PPV)
   - CTA for purchase / subscribe

4. **Live page**
   - HLS player
   - Chat panel + viewer count
   - Purchase gate if no access

5. **Creator studio**
   - Content upload + pricing
   - Live session creation + stream key view
   - Creator analytics cards

6. **Billing**
   - Subscriptions + purchase history
   - Stripe portal integration

**Exit criteria:**
- End‑to‑end flows are fully usable

### Workstream J — UX/UI & Design System
**Goal:** consistent, professional product experience.

1. **Design system**
   - Tokens (colors/spacing/typography)
   - Reusable components (buttons, cards, badges)

2. **UX flows**
   - Onboarding to creator
   - Purchase + paywall states
   - Empty states + loading + errors

3. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Contrast checks

**Exit criteria:**
- UI consistent and accessible

---

## 4) Detailed Task Breakdown (Agent‑friendly)

### Agent A — API Core
- Implement auth (register/login/refresh/logout)
- Implement users + creators
- Implement content CRUD
- Implement live sessions + webhooks

### Agent B — Payments
- Stripe checkout + webhooks
- Subscription state mapping
- Tips + PPV

### Agent C — Streaming Infra
- Nginx RTMP configs
- HLS playback config
- OBS settings doc

### Agent D — Chat
- Socket.IO gateway
- Redis adapter
- Chat persistence

### Agent E — Media
- Upload endpoint
- Signed URL endpoint
- Access rules

### Agent F — Ops
- Health & logs
- Docker compose + env
- Basic metrics

### Agent G — Frontend
- App shell + auth flow
- Feed + live pages
- Creator studio + billing

### Agent H — UX/UI
- Design system + component library
- UX states + accessibility

### Agent I — QA
- E2E tests for auth, feed, live, purchase
- Load test scripts (basic)

---

## 5) Performance Targets (Portfolio‑level)

- **First player start:** < 5s from session start
- **Live latency:** 10–20s (HLS), 3–7s (LL‑HLS)
- **Chat RTT:** < 1s
- **DB query P95:** < 50ms (local)
- **Auth endpoints:** < 300ms

## 6) Team Structure (CTO view)

### Core Roles
- **Tech Lead / CTO (you)**: architecture, sequencing, quality bar, code reviews
- **Backend Lead**: auth, content, live, payments, Prisma
- **Streaming Infra Lead**: RTMP/HLS/LL‑HLS, encoder guidance
- **Realtime Lead**: chat gateway, Redis adapter, scale
- **Frontend Lead**: app shell, live player, feed, studio
- **Design/UX Lead**: design system, flows, accessibility
- **QA Lead**: test plan, e2e coverage, perf checks
- **DevOps/Platform Lead**: docker, envs, CI/CD, observability

### Responsibilities by role
- **Backend Lead**
  - Owns API schema and access rules
  - Implements auth, content, live, payments
  - Produces API docs + swagger
- **Streaming Infra Lead**
  - Owns ingest pipeline + HLS delivery
  - Defines OBS guidelines & bitrate presets
  - Optimizes latency and stability
- **Realtime Lead**
  - Owns chat service and pub/sub scaling
  - Ensures delivery guarantees and persistence
- **Frontend Lead**
  - Owns end‑to‑end product flows
  - Integrates live + chat + paywalls
- **Design/UX Lead**
  - Owns UI system and UX clarity
  - Defines empty/error/loading states
- **QA Lead**
  - Defines test matrix, e2e scenarios
  - Owns regression suite
- **DevOps/Platform Lead**
  - Owns env config, docker compose
  - CI/CD + deploy checklist

---

## 7) Deliverables Checklist (100% done)

- [ ] Full backend API with docs
- [ ] Working RTMP→HLS pipeline
- [ ] Signed media delivery
- [ ] Stripe payments (sub + PPV + tips)
- [ ] Chat system (Redis‑scaled)
- [ ] Seed/demo scripts
- [ ] CI/CD
- [ ] Architecture doc + diagrams
- [ ] Frontend app complete (auth/feed/live/studio/billing)
- [ ] Design system + UX polish
- [ ] Test suite (unit + e2e + smoke)

## 8) Execution Plan (Agent‑ready)

1. Split workstreams into tickets per agent.\n2. Assign owners + define “done” for each ticket.\n3. Run work in parallel and merge in small batches.\n4. Weekly integration check (streaming + chat + payments).\n

---

## 7) Next steps for execution with specialized agents

1. Finalize this roadmap into tasks per agent.
2. Spawn agents per workstream.
3. Track progress per deliverable.
