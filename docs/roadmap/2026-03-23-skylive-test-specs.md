# Skylive — Test Specs (Unit, E2E, Perf)

**Date:** 2026-03-23

---

## 1) Unit Tests (API)

**Auth**
- Register: valid payload creates user + refresh token
- Register: duplicate email returns 409
- Login: valid credentials returns tokens
- Login: invalid credentials returns 401
- Refresh: valid token rotates
- Refresh: expired token returns 401

**Access rules**
- Content FREE always accessible
- Content SUBSCRIPTION only for active sub
- Content PPV only after purchase
- Live SUBSCRIPTION only for active sub
- Live PPV only after purchase

**Payments**
- Stripe webhook signature verify (mock)
- payment_intent.succeeded creates purchase
- customer.subscription.updated updates status

---

## 2) Integration Tests (API)

**Live flow**
1. Create creator
2. Create live session → streamKey exists
3. Call webhook stream-start → status LIVE
4. Call webhook stream-end → status ENDED

**Content flow**
1. Upload media key
2. Create content with accessRule
3. Access check for user

---

## 3) E2E Tests (Frontend + API)

**Scenario A — Free content**
1. Register
2. Browse feed
3. Open FREE content
4. Play content without purchase

**Scenario B — Subscription**
1. Register user + onboard creator
2. Creator sets subscription price
3. User subscribes
4. User accesses SUB content

**Scenario C — PPV**
1. Create PPV content
2. User purchases
3. Access unlocked

**Scenario D — Live + Chat**
1. Creator creates live session
2. Stream start webhook
3. User joins live + chat
4. Viewer count increments

---

## 4) Load / Perf Smoke

**Targets**
- Auth endpoints < 300ms
- Feed response < 500ms for 50 items
- Chat message RTT < 1s

**Smoke tests**
1. 100 concurrent GET /feed
2. 50 concurrent POST /auth/login
3. 50 concurrent WS chat messages

---

## 5) Manual QA Checklist

**Live**
- OBS stream → HLS playable
- HLS playlist loads on Safari + Chrome
- Live status changes when stream starts/ends

**Payments**
- Webhooks update subscription state
- PPV purchase unlocks content

**Security**
- Unauthorized user blocked for premium content
- Signed URLs expire and refresh
