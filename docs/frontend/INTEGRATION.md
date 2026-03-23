# Skylive — Frontend Integration Guide

This document explains the frontend architecture patterns used in Skylive and how they connect to the backend (NestJS) and infrastructure (Nginx RTMP, Redis, Stripe).

## 1. API Architecture (Adapters Pattern)

All API communication is centralized in `src/lib/api/` using an **Adapter Pattern**. 

- **Client Instance (`src/lib/api/client.ts`)**: Base Axios instance with interceptors for:
    - Injecting `Authorization: Bearer <token>`
    - Handling `401` errors by attempting a token refresh via `/auth/refresh`.
    - Base URL configuration via `NEXT_PUBLIC_API_URL`.

- **Domain Adapters (`*.adapter.ts`)**: Pure functions that wrap specific domain endpoints. 
    - `auth.adapter.ts`: Register, Login, Me, Refresh.
    - `live.adapter.ts`: Sessions CRUD, RTMP keys.
    - `feed.adapter.ts`: Content discovery.
    - `payments.adapter.ts`: Stripe Checkout & Portal.

**Pattern for developers:**
```typescript
// Don't use axios directly in components. Use the adapter.
import { authAdapter } from "@/lib/api/auth.adapter";

const profile = await authAdapter.me();
```

## 2. Real-time Communication (WebSockets)

Skylive uses **Socket.io** for real-time chat and live viewer counts.

- **Hook: `useChat(liveSessionId)`**: Managed hook in `src/hooks/useChat.ts`.
    - Connects to `NEXT_PUBLIC_WS_URL`.
    - Handles `chat:join` and `chat:leave` events.
    - Listens for `chat:message` to update the local state.
    - Listens for `chat:viewer_count` for real-time stats.

**Important for Infra Agents:**
The backend uses a **Redis Adapter** for Socket.io. The frontend remains agnostic to this and interacts with the load balancer (or direct API node) via standard Socket.io protocol.

## 3. Live Streaming (RTMP/HLS)

The video delivery pipeline is decoupled from the main API.

- **Ingest**: OBS publishes to `rtmp://<host>/live/<stream_key>`.
- **Egress**: Nginx RTMP generates HLS segments.
- **Player (`src/components/player/HLSPlayer.tsx`)**: Uses `hls.js` for playback.
    - Expected URL format: `${NEXT_PUBLIC_HLS_BASE}/${streamKey}.m3u8`.
    - Low-latency mode is enabled by default for interactive chat.

**Important for Infra Agents:**
Ensure `CORS` headers are enabled in Nginx for the `.m3u8` and `.ts` files, otherwise the player will fail in the browser.

## 4. Monetization (Stripe)

We follow a **Server-Side redirect** pattern for security.

1.  **Checkout**: Frontend calls `paymentsAdapter.createCheckoutSession(priceId)`.
2.  **Redirect**: Backend returns a `url` pointing to Stripe Checkout.
3.  **Webhook**: Backend listens for `checkout.session.completed` to unlock content/subscription.
4.  **Sync**: Frontend uses React Query to invalidate user data after returning from Stripe.

## 5. UI/UX Standards

- **Theming**: Midnight Violet (#9E398D) + Dark Mode.
- **Animations**: `framer-motion` for transitions.
- **Feedback**: `sonner` for toasts.
- **Loading**: Custom `Skeleton` components for shell and lists.
- **A11y**: Always use semantic HTML (`<main>`, `<header>`, `<aside>`, `<nav>`).

---

**Last implementation pass by UI/UX Agent on 2026-03-23.**
- [X] Premium Feed with Skeletons
- [X] Advanced Creator Studio with Analytics (Recharts)
- [X] Responsive Layout (Mobile Bottom Bar)
- [X] Paywall & Modal System
- [X] Unified Search & Discovery
- [X] Detailed Creator Profiles
- [X] Integration Documentation
