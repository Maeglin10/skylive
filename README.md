# Antigravity

**Plateforme unifiée — Contenu payant + Live streaming**

Antigravity est une plateforme tout-en-un permettant aux créateurs de publier du contenu payant (abonnements, pay-per-view, feed privé) et de diffuser des lives en temps réel — avec chat intégré et monétisation hybride.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Backend | NestJS 11, TypeScript 5.7 |
| Frontend | Next.js 15, React 19, TailwindCSS, shadcn/ui |
| Base de données | PostgreSQL 15, Prisma 6 |
| Cache / Pub-Sub | Redis 7 |
| Temps réel | Socket.io |
| Streaming | Nginx RTMP → HLS |
| Paiements | Stripe (abonnements, PPV, tips) |
| Stockage médias | S3 / Cloudflare R2 |
| Monorepo | pnpm workspaces |

---

## Architecture

```
skylive/
├── apps/
│   ├── api/          # NestJS — backend, auth, streaming, paiements
│   └── client/       # Next.js — feed, live, creator studio
├── nginx/            # Config RTMP + HLS
├── docker-compose.yml
├── pnpm-workspace.yaml
└── docs/plans/       # Plans d'implémentation
```

### Modules backend (apps/api)

```
src/
├── auth/         # JWT, refresh tokens, bcrypt
├── users/        # Profils utilisateurs
├── creators/     # Profils créateurs, stats
├── content/      # Contenu payant, access control
├── media/        # Upload S3/R2, signed URLs
├── live/         # Sessions live, stream keys, webhooks RTMP
├── chat/         # WebSocket gateway, Redis pub/sub
├── payments/     # Stripe — abonnements, PPV, tips
└── common/       # Guards, filtres, Redis, health, logger
```

### Flux de streaming

```
OBS → RTMP (port 1935) → Nginx RTMP
                              ↓
                    on_publish webhook → API → status=LIVE
                              ↓
                    HLS segments → /tmp/hls/{streamKey}.m3u8
                              ↓
                    Client Next.js → hls.js player
```

### Contrôle d'accès

| AccessRule | Condition d'accès |
|------------|-------------------|
| `FREE` | Toujours accessible |
| `SUBSCRIPTION` | Abonnement actif au créateur |
| `PPV` | Achat unitaire du contenu ou live |

---

## Modèles de données

```
User → Creator (1:1)
User → Subscription[] (abonnés à des créateurs)
User → Purchase[] (achats PPV)
Creator → Content[]
Creator → LiveSession[]
Creator → Subscription[]
LiveSession → ChatRoom → Message[]
LiveSession → Purchase[] (PPV live)
User → Tip[] → Creator
```

---

## Lancement en développement

### Prérequis
- Node.js 20+
- pnpm
- Docker + Docker Compose

### Installation

```bash
git clone <repo> antigravity && cd antigravity

# Infrastructure (DB, Redis, RTMP)
docker compose up -d postgres redis rtmp

# Backend
cd apps/api
cp .env.example .env   # remplir les variables
pnpm install
pnpm prisma migrate dev
pnpm dev               # http://localhost:3001

# Frontend (autre terminal)
cd apps/client
cp .env.example .env
pnpm install
pnpm dev               # http://localhost:3000
```

### Démarrage complet via Docker

```bash
cp .env.example .env   # remplir JWT_SECRET, STRIPE_*
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |
| HLS | http://localhost:8080/hls/{streamKey}.m3u8 |
| RTMP | rtmp://localhost:1935/live |

---

## Configuration OBS

1. Créer une session live dans le studio créateur
2. Copier le **stream key** affiché
3. OBS → Paramètres → Diffusion :
   - Service : Personnalisé
   - Serveur : `rtmp://votre-serveur:1935/live`
   - Clé de diffusion : `{streamKey}`
4. Démarrer la diffusion → le live passe en `LIVE` automatiquement

---

## Variables d'environnement

### apps/api/.env

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` / `REDIS_PORT` | Redis |
| `JWT_SECRET` | Secret JWT access token |
| `JWT_REFRESH_SECRET` | Secret JWT refresh token |
| `STRIPE_SECRET_KEY` | Clé Stripe (sk_live_... ou sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Accès S3/R2 |
| `S3_BUCKET` | Bucket médias |
| `FRONTEND_URL` | URL du client Next.js (CORS) |

### apps/client/.env

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL base de l'API |
| `NEXT_PUBLIC_WS_URL` | URL WebSocket |
| `NEXT_PUBLIC_HLS_BASE` | Base URL HLS pour le player |

---

## Monétisation

### Abonnements mensuels
- Créateur définit un prix mensuel
- Stripe Checkout → Subscription
- Accès illimité au contenu `SUBSCRIPTION` du créateur

### Pay-Per-View (PPV)
- Contenu ou live avec `accessRule: PPV` + prix unitaire
- Stripe Payment Intent (one-time)
- Accès permanent au contenu acheté

### Tips
- Tip depuis un live ou un profil créateur
- Stripe Payment Intent
- Message optionnel affiché dans le chat

---

## Roadmap

### Phase 3 — Frontend ✅ (Premium Implementation)
- [x] Next.js 15 bootstrap + Premium Dark UI (Midnight Violet)
- [x] Auth (login/register) with Toasts (Sonner)
- [x] Feed unifié (contenu + lives) with Shimmer Skeletons
- [x] Live page (HLS player + Chat real-time)
- [x] Creator Studio (Manager, Uploads, Analytics Charts)
- [x] Billing (abonnements, achats, Stripe Portal)
- [x] Responsive Design (Mobile Bottom Navigation)
- [x] Component Library (Modals, Skeletons, Glassmorphism)

### Phase 4 — Production
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry + Winston)
- [ ] CDN pour HLS (Cloudflare)
- [ ] Analytics créateur avancées
- [ ] Push notifications
- [ ] Marketplace d'extensions

---

## Patterns réutilisés depuis skybot-inbox

- Architecture NestJS modulaire (66 modules → adapté pour Skylive)
- Auth JWT + refresh tokens (copié et adapté)
- Redis module + rate limiting
- Filtres d'exception globaux
- Logger Winston structuré
- Validation des env vars au démarrage
- Patterns d'adapters API (frontend)
- Hooks React (useWebSocket, etc.)
- shadcn/ui components
- Docker compose dev setup

---

## Licence

Propriétaire — tous droits réservés.
