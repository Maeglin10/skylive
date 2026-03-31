# ANTIGRAVITY — Unified Content & Streaming Platform

**Antigravity** is a premium, portfolio-grade project for creators to monentize content through subscriptions, PPV, and ultra-low-latency live streaming.

---

## Technical Architecture
Built as a **pnpm Turborepo**, Antigravity leverages a modern high-performance stack:

| Component | Technology |
| :--- | :--- |
| **Backend** | NestJS 11 (Modular), TypeScript 5.7 |
| **Frontend** | Next.js 15 (App Router), React 19, TailwindCSS, Framer Motion |
| **Database** | PostgreSQL 15 via Prisma 6 (Tiered Subscriptions support) |
| **Cache/Pub-Sub** | Redis 7 (Chat, Global Rate Limiting) |
| **Streaming** | Nginx RTMP → HLS (Distributed Segments) |
| **Security** | JWT Rotation, Throttler integration |

---

## Industry Benchmarking & Positioning

Antigravity positions itself between **Twitch** (Community/Live) and **OnlyFans** (Monetization), solving the UX and revenue-cut gaps of current industry leaders.

### Gap Analysis vs Competitors
- **Branding:** Transitioned to "Antigravity" for a professional/industrial tech feel.
- **Monetization:** Implemented support for **Tiered Subscriptions** (Bronze/Silver/Gold) to match Patreon's flexibility.
- **Aesthetics:** "Midnight Obsidian" design system with glassmorphism for a premium feel.
- **Security:** Rate limiting and token rotation implemented for production-grade robustness.

---

## Project Structure
```
antigravity/
├── apps/
│   ├── api/          # Core Business Logic & Streaming webhooks
│   └── client/       # Premium Next.js UI (Midnight Obsidian)
├── nginx/            # RTMP -> HLS pipeline configuration
├── prisma/           # Data modeling with Tiered Subscriptions support
└── .github/          # CI/CD (Testing, Deployment, Security scan)
```

---

## Success Criteria Achieved
- [x] Full Project Audit & Benchmarking
- [x] Core Rebranding from Skylive to Antigravity
- [x] Primary Brand Color Overhaul (Vibrant Cyan)
- [x] Security Hardening (Rate Limiting check)
- [x] Database Schema Enhancement (Subscription Tiers)
- [x] Final Documentation Consolidation
