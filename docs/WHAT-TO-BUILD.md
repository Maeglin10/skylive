# Skylive — Ce qu'il reste à construire

> Document de référence pour reprendre le projet. Trois parties indépendantes : Backend, Frontend, Infrastructure.

**Date de création :** 2026-03-23
**Plan détaillé :** `docs/plans/2026-03-23-skylive-foundation.md`
**Référence à copier :** `/Users/milliandvalentin/skybot-inbox/`

---

## État actuel

| Fichier | Statut |
|---------|--------|
| `docker-compose.yml` | ✅ Existe (PostgreSQL, Redis, RTMP) |
| `README.md` | ✅ Créé |
| `docs/plans/` | ✅ Plan détaillé créé |
| `apps/api/` | ⏳ Vide (package-lock.json vide seulement) |
| `apps/client/` | ⏳ Vide |
| `nginx/nginx.conf` | ⏳ Manquant |
| `pnpm-workspace.yaml` | ⏳ Manquant |
| `package.json` (root) | ⏳ Manquant |

---

## PARTIE 1 — BACKEND (`apps/api/`)

Stack : **NestJS 11 + TypeScript + Prisma 6 + PostgreSQL + Redis + Stripe + Socket.io**

### 1.1 — Monorepo + Bootstrap

**Fichiers à créer à la racine `/skylive/` :**
- `package.json` — workspace root (scripts dev/build/test)
- `pnpm-workspace.yaml` — `packages: ['apps/*']`
- `tsconfig.base.json` — strict, esModuleInterop, decorators
- `.gitignore`

**Fichiers à créer dans `apps/api/` :**
- `package.json` — dépendances NestJS, Prisma, Stripe, Socket.io, bcrypt, etc.
- `tsconfig.json` — extends base, module commonjs, emitDecoratorMetadata
- `nest-cli.json`
- `Dockerfile`
- `.env.example`

---

### 1.2 — Common (copier depuis skybot-inbox)

Ces fichiers peuvent être copiés quasi verbatim depuis `/Users/milliandvalentin/skybot-inbox/src/common/` en adaptant les imports :

| Source skybot-inbox | Destination apps/api |
|---------------------|----------------------|
| `common/redis/` | `src/common/redis/` |
| `common/filters/all-exceptions.filter.ts` | `src/common/filters/` |
| `common/guards/throttle*.ts` | `src/common/guards/` |
| `common/middleware/request-id.middleware.ts` | `src/common/middleware/` |
| `common/middleware/request-timeout.middleware.ts` | `src/common/middleware/` |
| `common/errors/known-error.ts` | `src/common/errors/` |
| `common/dto/pagination.dto.ts` | `src/common/dto/` |
| `common/logger/winston.config.ts` | `src/common/logger/` |
| `common/health/health.module.ts` | `src/common/health/` |

---

### 1.3 — Prisma (schéma complet)

**Fichier :** `apps/api/prisma/schema.prisma`

Modèles à créer :

```
User          → email, passwordHash, displayName, avatarUrl, role (CREATOR/SUBSCRIBER/VIEWER/ADMIN)
RefreshToken  → token, userId, expiresAt
Creator       → userId, username, bio, subscriptionPrice, stripeAccountId
Content       → creatorId, type (IMAGE/VIDEO/POST), mediaKey, accessRule (FREE/SUBSCRIPTION/PPV), price
LiveSession   → creatorId, title, status (OFFLINE/LIVE/ENDED), streamKey, hlsUrl, accessRule
ChatRoom      → liveSessionId (1:1 avec LiveSession)
Message       → chatRoomId, userId, content
Subscription  → userId, creatorId, status, stripeSubscriptionId
Purchase      → userId, contentId?, liveSessionId?, amount, stripePaymentIntentId
Tip           → userId, creatorId, liveSessionId?, amount, message
```

Commandes à lancer après :
```bash
cd apps/api && npx prisma migrate dev --name init && npx prisma generate
```

---

### 1.4 — Modules à créer

#### Auth (`src/auth/`)
**Copier depuis :** `/Users/milliandvalentin/skybot-inbox/src/auth/`
**Adaptations :** supprimer tout ce qui concerne account/tenant/workspace

| Fichier | Contenu |
|---------|---------|
| `auth.service.ts` | register, login, refresh, logout, generateTokens |
| `auth.controller.ts` | POST /auth/register, /login, /refresh, /logout · GET /auth/me |
| `strategies/jwt.strategy.ts` | Passport JWT (copier + adapter) |
| `guards/jwt-auth.guard.ts` | UseGuards sur les routes protégées |
| `decorators/current-user.decorator.ts` | `@CurrentUser()` param decorator |
| `dto/register.dto.ts` | email, password, displayName? |
| `dto/login.dto.ts` | email, password |

Logique clé :
- bcrypt 12 rounds
- Access token 12h, refresh token 7j
- Refresh token stocké en DB (table RefreshToken), rotation à chaque usage

---

#### Prisma service (`src/prisma/`)
- `prisma.service.ts` — extend PrismaClient, onModuleInit/$connect
- `prisma.module.ts` — `@Global()`, export PrismaService

---

#### Users (`src/users/`)
| Endpoint | Description |
|----------|-------------|
| `GET /users/me` | Profil courant |
| `PATCH /users/me` | Mettre à jour displayName, avatarUrl |

---

#### Creators (`src/creators/`)
| Endpoint | Description |
|----------|-------------|
| `POST /creators/onboard` | Créer un profil créateur (set role=CREATOR) |
| `GET /creators/me/stats` | Revenus, abonnés, vues |
| `GET /creators/:username` | Page publique créateur |
| `PATCH /creators/me` | Mettre à jour bio, prix abonnement |

---

#### Content (`src/content/`)
| Endpoint | Description |
|----------|-------------|
| `POST /content` | Créer contenu (créateur) |
| `GET /content/:id` | Voir contenu (avec vérification d'accès) |
| `PATCH /content/:id` | Modifier (créateur) |
| `DELETE /content/:id` | Supprimer (créateur) |
| `GET /feed` | Feed unifié — contenu des créateurs suivis |
| `GET /creators/:username/content` | Liste du contenu d'un créateur |

**Logique d'accès :**
```typescript
FREE        → toujours accessible
SUBSCRIPTION → Subscription active au créateur
PPV         → Purchase existant pour ce contenu
```

---

#### Media (`src/media/`)
| Endpoint | Description |
|----------|-------------|
| `POST /media/upload` | Upload multipart → S3/R2 → retourne { key } |
| `GET /media/signed-url?key=` | URL signée fraîche (15min) |

Utilise `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`.
Stocker uniquement la **clé S3** en base, générer l'URL signée à la lecture.

---

#### Live (`src/live/`)
| Endpoint | Description |
|----------|-------------|
| `POST /live/sessions` | Créer une session live (génère streamKey) |
| `GET /live/sessions` | Lister (filtre par status) |
| `GET /live/sessions/:id` | Détails + hlsUrl |
| `PATCH /live/sessions/:id/start` | Passer en LIVE |
| `PATCH /live/sessions/:id/end` | Terminer |
| `POST /live/webhook/stream-start` | ⚠️ Pas de JWT — appelé par Nginx RTMP |
| `POST /live/webhook/stream-end` | ⚠️ Pas de JWT — appelé par Nginx RTMP |

**Flux stream key :**
1. Créateur crée une session → reçoit un `streamKey` (UUID)
2. Configure OBS : `rtmp://serveur:1935/live` + streamKey
3. Nginx on_publish → `POST /api/live/webhook/stream-start` avec `{ name: streamKey }`
4. API set `status=LIVE`, `startedAt=now()`
5. HLS dispo sur `http://serveur:8080/hls/{streamKey}.m3u8`

---

#### Chat (`src/chat/`)
**WebSocket Gateway** (Socket.io namespace `/chat`)

| Event client → serveur | Description |
|------------------------|-------------|
| `chat:join` | Rejoindre la room `liveSessionId` |
| `chat:leave` | Quitter la room |
| `chat:message` | Envoyer un message `{ liveSessionId, content }` |

| Event serveur → client | Description |
|------------------------|-------------|
| `chat:message` | Nouveau message broadcasté dans la room |
| `chat:viewer_count` | Mise à jour du compteur de viewers |

- Messages persistés en base (table `Message`)
- Redis pub/sub pour scalabilité horizontale (adapter Socket.io)
- Vérification d'accès avant `chat:join`

---

#### Payments (`src/payments/`)
**Copier depuis :** `/Users/milliandvalentin/skybot-inbox/src/billing/`

| Endpoint | Description |
|----------|-------------|
| `POST /payments/subscribe/:creatorId` | Stripe Checkout → abonnement mensuel |
| `POST /payments/purchase/content/:contentId` | Stripe Payment Intent → PPV contenu |
| `POST /payments/purchase/live/:liveSessionId` | Stripe Payment Intent → PPV live |
| `POST /payments/tip/:creatorId` | Stripe Payment Intent → tip |
| `POST /payments/webhook` | ⚠️ Raw body — signature Stripe |
| `GET /payments/portal` | URL portal Stripe |

**Webhooks Stripe à gérer :**
- `payment_intent.succeeded` → créer Purchase ou Tip en DB
- `customer.subscription.updated` → mettre à jour Subscription
- `customer.subscription.deleted` → set status=CANCELLED

---

### 1.5 — Variables d'environnement

```env
DATABASE_URL=postgresql://skylive:skylive_password@localhost:5432/skylive_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=                    # min 32 chars
JWT_EXPIRATION=12h
JWT_REFRESH_SECRET=            # min 32 chars
JWT_REFRESH_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=eu-west-3
S3_BUCKET=skylive-media
FRONTEND_URL=http://localhost:3000
PORT=3001
```

---

## PARTIE 2 — FRONTEND (`apps/client/`)

Stack : **Next.js 15 + React 19 + TailwindCSS + shadcn/ui + React Query 5 + Socket.io client + hls.js**

### 2.1 — Bootstrap

```bash
cd apps && npx create-next-app@latest client \
  --typescript --tailwind --app --src-dir --import-alias "@/*"
cd client
pnpm add @tanstack/react-query axios zod react-hook-form socket.io-client hls.js
pnpm dlx shadcn@latest init
```

### 2.2 — Structure des pages (App Router)

```
app/
├── (auth)/
│   ├── login/page.tsx           # Formulaire connexion
│   └── register/page.tsx        # Formulaire inscription
├── (app)/
│   ├── layout.tsx               # Auth guard + Providers (QueryClient, Socket)
│   ├── feed/page.tsx            # Feed unifié : contenu + lives en cours
│   ├── live/
│   │   └── [id]/page.tsx        # Player HLS + Chat + infos session
│   ├── creator/
│   │   ├── [username]/page.tsx  # Page publique créateur
│   │   └── studio/page.tsx      # Dashboard créateur
│   ├── settings/page.tsx        # Profil utilisateur
│   └── billing/page.tsx         # Abonnements + achats
├── layout.tsx
└── globals.css
```

---

### 2.3 — Composants clés

#### Player HLS (`components/player/HLSPlayer.tsx`)
```tsx
'use client';
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

export function HLSPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src; // Safari natif
    }
  }, [src]);
  return <video ref={videoRef} poster={poster} controls autoPlay playsInline className="w-full aspect-video bg-black rounded-lg" />;
}
```

#### Chat Panel (`components/chat/ChatPanel.tsx`)
- Liste des messages scrollable
- Input + bouton envoyer
- Badge "LIVE" + compteur viewers
- Utilise le hook `useChat`

#### Content Card (`components/feed/ContentCard.tsx`)
- Aperçu image/vidéo/post
- Badge FREE / ABONNÉ / PPV + prix
- Bouton "Débloquer" si pas accès

#### Live Card (`components/feed/LiveCard.tsx`)
- Thumbnail + badge "EN DIRECT" animé
- Titre + nom créateur + compteur viewers
- Lien vers la page live

#### Creator Stats (`components/studio/StatsOverview.tsx`)
- Cartes : Revenus totaux, Abonnés actifs, Vues, Tips reçus
- Données depuis `GET /api/creators/me/stats`

#### Live Manager (`components/studio/LiveManager.tsx`)
- Afficher/masquer le stream key
- Boutons Démarrer / Terminer le live
- Compteur viewers temps réel (WebSocket)
- Copier l'URL RTMP pour OBS

#### Content Upload (`components/studio/ContentUpload.tsx`)
- Drag & drop + sélecteur fichier
- Sélecteur type (Image / Vidéo / Post)
- Règle d'accès (Gratuit / Abonnement / PPV) + champ prix
- Upload via `POST /api/media/upload` → create via `POST /api/content`

---

### 2.4 — Hooks React

| Hook | Description |
|------|-------------|
| `useAuth()` | currentUser, login, logout, register |
| `useChat(liveSessionId)` | messages, sendMessage, isConnected |
| `useLiveSession(id)` | session, isLive, hlsUrl, viewerCount |
| `useFeed()` | Liste paginée contenu + lives (React Query) |
| `useCreatorStats()` | Stats du créateur connecté |

**Pattern copier depuis skybot-inbox :**
- `skybot-inbox-ui/src/hooks/useWebSocket.ts` → adapter pour `useChat`
- `skybot-inbox-ui/src/lib/api.client.ts` → `apps/client/src/lib/api/client.ts`

---

### 2.5 — API Adapters (`src/lib/api/`)

Un fichier par domaine, fonctions typées :

```
client.ts          # Axios instance + auth headers + refresh automatique
auth.adapter.ts    # register, login, logout, me
feed.adapter.ts    # getFeed, getCreatorContent
live.adapter.ts    # getSessions, getSession, createSession, startLive, endLive
content.adapter.ts # createContent, getContent, updateContent, deleteContent
media.adapter.ts   # uploadFile, getSignedUrl
payments.adapter.ts # subscribe, purchaseContent, purchaseLive, tip, portal
creators.adapter.ts # onboard, getStats, getByUsername, updateProfile
```

---

### 2.6 — Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_HLS_BASE=http://localhost:8080/hls
```

---

## PARTIE 3 — INFRASTRUCTURE

### 3.1 — Nginx RTMP (`nginx/nginx.conf`)

```nginx
worker_processes auto;
events { worker_connections 1024; }

rtmp {
  server {
    listen 1935;
    chunk_size 4096;

    application live {
      live on;
      record off;

      # Génération HLS
      hls on;
      hls_path /tmp/hls;
      hls_fragment 3;
      hls_playlist_length 60;

      # Notifier l'API au démarrage/fin de stream
      on_publish http://api:3001/api/live/webhook/stream-start;
      on_done    http://api:3001/api/live/webhook/stream-end;
    }
  }
}

http {
  server {
    listen 80;

    # Servir les segments HLS
    location /hls {
      types {
        application/vnd.apple.mpegurl m3u8;
        video/mp2t ts;
      }
      root /tmp;
      add_header Cache-Control no-cache;
      add_header Access-Control-Allow-Origin *;
    }

    location /health { return 200 'ok'; }
  }
}
```

---

### 3.2 — docker-compose.yml (mise à jour)

Ajouter les services `api` et `client` au docker-compose.yml existant :

```yaml
  api:
    build: ./apps/api
    container_name: skylive_api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://skylive:skylive_password@postgres:5432/skylive_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      FRONTEND_URL: http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  client:
    build: ./apps/client
    container_name: skylive_client
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
      NEXT_PUBLIC_WS_URL: http://localhost:3001
      NEXT_PUBLIC_HLS_BASE: http://localhost:8080/hls
    depends_on:
      - api
```

Ajouter aussi health checks aux services existants et le volume `hls_data` pour partager `/tmp/hls` entre `rtmp` et `api`.

---

### 3.3 — Dockerfiles

**`apps/api/Dockerfile` :**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main"]
```

**`apps/client/Dockerfile` :**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

### 3.4 — CI/CD (à faire après la base)

Pipeline GitHub Actions à créer dans `.github/workflows/` :
- `test.yml` — lint + jest sur chaque PR
- `deploy-staging.yml` — déploiement sur merge vers `develop`

---

## Ordre de priorité pour reprendre

```
1. [INFRA]    nginx/nginx.conf                 ← 10 min, indépendant
2. [INFRA]    docker-compose.yml (update)      ← 10 min, indépendant
3. [BACKEND]  Monorepo root (package.json, pnpm-workspace, tsconfig)
4. [BACKEND]  apps/api package.json + tsconfig + nest-cli.json
5. [BACKEND]  Common utilities (copier skybot-inbox)
6. [BACKEND]  Prisma schema + PrismaService
7. [BACKEND]  Auth module (copier + adapter skybot-inbox)
8. [BACKEND]  Users + Creators modules
9. [BACKEND]  Content + Media modules
10. [BACKEND] Live sessions module + webhooks RTMP
11. [BACKEND] Chat WebSocket gateway
12. [BACKEND] Payments (Stripe)
13. [BACKEND] AppModule + main.ts
14. [FRONTEND] Next.js bootstrap + shadcn/ui
15. [FRONTEND] Auth pages (login/register)
16. [FRONTEND] HLS Player + Live page + Chat
17. [FRONTEND] Feed page
18. [FRONTEND] Creator Studio dashboard
19. [FRONTEND] Billing pages
```

---

## Ports et URLs locales

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |
| HLS | http://localhost:8080/hls/{streamKey}.m3u8 |
| RTMP ingestion | rtmp://localhost:1935/live |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## Fichiers à copier/adapter depuis skybot-inbox

| Source | Destination | Adaptation nécessaire |
|--------|------------|----------------------|
| `src/common/redis/` | `apps/api/src/common/redis/` | Mettre à jour imports |
| `src/common/filters/` | `apps/api/src/common/filters/` | Minimal |
| `src/common/guards/throttle*.ts` | `apps/api/src/common/guards/` | Minimal |
| `src/common/middleware/` | `apps/api/src/common/middleware/` | Minimal |
| `src/common/errors/` | `apps/api/src/common/errors/` | Minimal |
| `src/common/logger/` | `apps/api/src/common/logger/` | Minimal |
| `src/common/health/` | `apps/api/src/common/health/` | Minimal |
| `src/auth/` | `apps/api/src/auth/` | **Supprimer account/tenant** |
| `src/billing/` | `apps/api/src/payments/` | **Adapter au modèle Skylive** |
| `skybot-inbox-ui/src/lib/api.client.ts` | `apps/client/src/lib/api/client.ts` | Changer base URL |
| `skybot-inbox-ui/src/hooks/useWebSocket.ts` | `apps/client/src/hooks/useWebSocket.ts` | Adapter namespace /chat |
| `skybot-inbox-ui/src/components/ui/` | `apps/client/src/components/ui/` | Direct (shadcn) |
