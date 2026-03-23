# Skylive — Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the monorepo foundation for Skylive — a unified platform combining paid content and live streaming — reusing battle-tested patterns from skybot-inbox.

**Architecture:** NestJS API (apps/api) + Next.js client (apps/client) as a pnpm monorepo. Shared Prisma schema, Redis for chat pub/sub and caching, Stripe for monetisation, Nginx RTMP for stream ingestion, HLS for delivery.

**Tech Stack:** NestJS 11, Next.js 15, TypeScript 5.7, Prisma 6, PostgreSQL 15, Redis 7, Stripe, Socket.io, Nginx RTMP, S3/R2, shadcn/ui, TailwindCSS, React Query 5, Zod

**Source of truth for copy/adapt patterns:** `/Users/milliandvalentin/skybot-inbox/`

---

## PHASE 1 — Monorepo Bootstrap

### Task 1: pnpm workspace root

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.gitignore`
- Create: `tsconfig.base.json`

**Step 1: Create root package.json**
```json
{
  "name": "skylive",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel -r dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

**Step 2: Create pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Step 3: Create tsconfig.base.json**
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Step 4: Run pnpm install from root**
```bash
cd /Users/milliandvalentin/Skylive/skylive && pnpm install
```

**Step 5: Init git**
```bash
git init && git add . && git commit -m "chore: init skylive monorepo"
```

---

### Task 2: NestJS API bootstrap (apps/api)

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/nest-cli.json`
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`
- Copy+adapt: `apps/api/src/common/` from skybot-inbox common/

**Step 1: Copy deps from skybot-inbox, create apps/api/package.json**

Key deps (adapt from `/Users/milliandvalentin/skybot-inbox/package.json`):
```json
{
  "name": "api",
  "version": "0.1.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^11.0.0",
    "@nestjs/throttler": "^6.0.0",
    "@nestjs/websockets": "^11.0.0",
    "@nestjs/platform-socket.io": "^11.0.0",
    "@nestjs/swagger": "^8.0.0",
    "@prisma/client": "^6.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.1.0",
    "stripe": "^17.0.0",
    "ioredis": "^5.4.0",
    "socket.io": "^4.8.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "helmet": "^8.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0",
    "winston": "^3.17.0",
    "nest-winston": "^1.10.0",
    "@nestjs/bull": "^11.0.0",
    "bull": "^4.16.0",
    "uuid": "^11.0.0",
    "aws-sdk": "^2.1692.0",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "prisma": "^6.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "supertest": "^7.0.0"
  }
}
```

**Step 2: Copy common utilities from skybot-inbox**
```bash
# Copy these directories and adapt imports (skybot → skylive):
cp -r /Users/milliandvalentin/skybot-inbox/src/common/redis/ apps/api/src/common/redis/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/health/ apps/api/src/common/health/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/filters/ apps/api/src/common/filters/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/middleware/ apps/api/src/common/middleware/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/guards/ apps/api/src/common/guards/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/encryption/ apps/api/src/common/encryption/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/config/ apps/api/src/common/config/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/errors/ apps/api/src/common/errors/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/dto/ apps/api/src/common/dto/
cp -r /Users/milliandvalentin/skybot-inbox/src/common/logger/ apps/api/src/common/logger/
```

**Step 3: Create apps/api/src/main.ts** (adapt from skybot-inbox src/main.ts)
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Skylive API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Skylive API running on :${process.env.PORT ?? 3001}`);
}
bootstrap();
```

**Step 4: Commit**
```bash
git add apps/api/ && git commit -m "feat(api): bootstrap NestJS app with common utilities"
```

---

## PHASE 2 — Database Schema (Prisma)

### Task 3: Prisma schema — core models

**Files:**
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/migrations/`
- Create: `apps/api/.env.example`

**Step 1: Write schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS ────────────────────────────────────────────────────────────────────

enum UserRole {
  CREATOR
  SUBSCRIBER
  VIEWER
  ADMIN
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String?
  displayName  String?
  avatarUrl    String?
  role         UserRole @default(VIEWER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  refreshTokens  RefreshToken[]
  creatorProfile Creator?
  subscriptions  Subscription[]
  purchases      Purchase[]
  messages       Message[]
  tips           Tip[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// ─── CREATORS ─────────────────────────────────────────────────────────────────

model Creator {
  id                 String   @id @default(cuid())
  userId             String   @unique
  username           String   @unique
  bio                String?
  subscriptionPrice  Decimal  @default(0) @db.Decimal(10, 2)
  stripeAccountId    String?
  stripeProductId    String?
  stripePriceId      String?
  totalRevenue       Decimal  @default(0) @db.Decimal(10, 2)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  contents      Content[]
  liveSessions  LiveSession[]
  subscriptions Subscription[]
  tips          Tip[]

  @@index([username])
}

// ─── CONTENT ──────────────────────────────────────────────────────────────────

enum ContentType {
  IMAGE
  VIDEO
  POST
}

enum AccessRule {
  FREE
  SUBSCRIPTION
  PPV
}

model Content {
  id          String      @id @default(cuid())
  creatorId   String
  type        ContentType
  title       String?
  description String?
  mediaUrl    String?     // S3/R2 signed URL reference (key, not full URL)
  mediaKey    String?     // S3 key for signed URL generation
  isPaid      Boolean     @default(false)
  price       Decimal?    @db.Decimal(10, 2)
  accessRule  AccessRule  @default(FREE)
  isPublished Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  creator   Creator    @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  purchases Purchase[]

  @@index([creatorId, createdAt])
  @@index([creatorId, isPublished])
}

// ─── LIVE SESSIONS ────────────────────────────────────────────────────────────

enum LiveStatus {
  OFFLINE
  LIVE
  ENDED
}

model LiveSession {
  id          String     @id @default(cuid())
  creatorId   String
  title       String?
  description String?
  status      LiveStatus @default(OFFLINE)
  streamKey   String     @unique @default(cuid())
  hlsUrl      String?
  accessRule  AccessRule @default(FREE)
  price       Decimal?   @db.Decimal(10, 2)
  viewerCount Int        @default(0)
  peakViewers Int        @default(0)
  startedAt   DateTime?
  endedAt     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  creator   Creator   @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  chatRoom  ChatRoom?
  purchases Purchase[]
  tips      Tip[]

  @@index([creatorId, status])
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────

model ChatRoom {
  id            String      @id @default(cuid())
  liveSessionId String      @unique
  createdAt     DateTime    @default(now())

  liveSession LiveSession @relation(fields: [liveSessionId], references: [id], onDelete: Cascade)
  messages    Message[]
}

model Message {
  id         String   @id @default(cuid())
  chatRoomId String
  userId     String
  content    String   @db.Text
  createdAt  DateTime @default(now())

  chatRoom ChatRoom @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([chatRoomId, createdAt])
}

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  TRIALING
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String
  creatorId            String
  status               SubscriptionStatus @default(ACTIVE)
  stripeSubscriptionId String?            @unique
  currentPeriodEnd     DateTime?
  cancelAt             DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  creator Creator @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  @@unique([userId, creatorId])
  @@index([userId])
  @@index([creatorId])
}

model Purchase {
  id            String   @id @default(cuid())
  userId        String
  contentId     String?
  liveSessionId String?
  amount        Decimal  @db.Decimal(10, 2)
  stripePaymentIntentId String? @unique
  createdAt     DateTime @default(now())

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  content     Content?     @relation(fields: [contentId], references: [id])
  liveSession LiveSession? @relation(fields: [liveSessionId], references: [id])

  @@index([userId])
}

model Tip {
  id            String   @id @default(cuid())
  userId        String
  creatorId     String
  liveSessionId String?
  amount        Decimal  @db.Decimal(10, 2)
  message       String?
  stripePaymentIntentId String? @unique
  createdAt     DateTime @default(now())

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  creator     Creator      @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  liveSession LiveSession? @relation(fields: [liveSessionId], references: [id])

  @@index([creatorId])
}
```

**Step 2: Run first migration**
```bash
cd apps/api && npx prisma migrate dev --name init
```

**Step 3: Generate Prisma client**
```bash
npx prisma generate
```

**Step 4: Commit**
```bash
git add apps/api/prisma/ && git commit -m "feat(db): add core Prisma schema — users, creators, content, live, chat, payments"
```

---

## PHASE 3 — Auth Module

### Task 4: Auth — copy + adapt from skybot-inbox

**Source:** `/Users/milliandvalentin/skybot-inbox/src/auth/`

**Files:**
- Copy+adapt: `apps/api/src/auth/auth.module.ts`
- Copy+adapt: `apps/api/src/auth/auth.service.ts`
- Copy+adapt: `apps/api/src/auth/auth.controller.ts`
- Copy+adapt: `apps/api/src/auth/strategies/jwt.strategy.ts`
- Create: `apps/api/src/auth/dto/register.dto.ts`
- Create: `apps/api/src/auth/dto/login.dto.ts`

**Key adaptations from skybot-inbox auth:**
- Remove: account/tenant context (Skylive uses user-level auth only)
- Remove: magic links (optional for v1)
- Keep: JWT + refresh token pattern, bcrypt 12 rounds, login attempt lockout
- Keep: Google OAuth strategy (optional)
- Add: role-based access (`UserRole` enum from Prisma schema)

**Auth flow:**
```
POST /api/auth/register → create User → return { accessToken, refreshToken }
POST /api/auth/login    → verify password → return { accessToken, refreshToken }
POST /api/auth/refresh  → rotate refresh token → return { accessToken, refreshToken }
POST /api/auth/logout   → invalidate refresh token
GET  /api/auth/me       → return current user
```

**Step 1: Write failing test for register**
```typescript
// apps/api/src/auth/__tests__/auth.service.spec.ts
it('should register a new user and return tokens', async () => {
  const result = await authService.register({
    email: 'test@skylive.io',
    password: 'SecurePass123!',
    displayName: 'Test User',
  });
  expect(result.accessToken).toBeDefined();
  expect(result.refreshToken).toBeDefined();
});
```

**Step 2: Run test to verify it fails**
```bash
cd apps/api && pnpm test auth.service.spec
```

**Step 3: Implement AuthService**
Copy `/Users/milliandvalentin/skybot-inbox/src/auth/auth.service.ts`, strip tenant/account references, wire to Skylive Prisma models.

**Step 4: Run tests**
```bash
pnpm test auth.service.spec
```

**Step 5: Commit**
```bash
git add apps/api/src/auth/ && git commit -m "feat(auth): JWT + refresh token auth, register/login/logout"
```

---

## PHASE 4 — Core Domain Modules

### Task 5: Users module

**Files:**
- Create: `apps/api/src/users/users.module.ts`
- Create: `apps/api/src/users/users.service.ts`
- Create: `apps/api/src/users/users.controller.ts`
- Create: `apps/api/src/users/dto/update-user.dto.ts`

**Endpoints:**
```
GET  /api/users/me            → current user profile
PATCH /api/users/me           → update display name, avatar
GET  /api/users/:username     → public creator profile
```

**Step 1: Write tests, implement, commit**
```bash
git add apps/api/src/users/ && git commit -m "feat(users): user profile module"
```

---

### Task 6: Creators module

**Files:**
- Create: `apps/api/src/creators/creators.module.ts`
- Create: `apps/api/src/creators/creators.service.ts`
- Create: `apps/api/src/creators/creators.controller.ts`
- Create: `apps/api/src/creators/dto/`

**Endpoints:**
```
POST /api/creators/onboard        → create Creator profile for current user
GET  /api/creators/:username      → public creator page data
GET  /api/creators/me/stats       → revenue, subscriber count, view count
PATCH /api/creators/me            → update subscription price, bio
```

**Key logic:**
- `onboard()` → set `user.role = CREATOR`, create Creator record
- Stats aggregation: COUNT subscriptions, SUM tips + purchases

**Step 1: Write failing test for onboard**
```typescript
it('should create a creator profile', async () => {
  const creator = await creatorsService.onboard(userId, {
    username: 'testcreator',
    subscriptionPrice: 9.99,
  });
  expect(creator.username).toBe('testcreator');
  expect(creator.userId).toBe(userId);
});
```

**Step 5: Commit**
```bash
git add apps/api/src/creators/ && git commit -m "feat(creators): creator onboarding + stats"
```

---

## PHASE 5 — Content Module

### Task 7: Content CRUD + access control

**Files:**
- Create: `apps/api/src/content/content.module.ts`
- Create: `apps/api/src/content/content.service.ts`
- Create: `apps/api/src/content/content.controller.ts`
- Create: `apps/api/src/content/content.guard.ts`
- Create: `apps/api/src/content/dto/`

**Endpoints:**
```
POST   /api/content          → creator: create content (image/video/post)
GET    /api/content/:id      → get content (access-checked)
PATCH  /api/content/:id      → creator: update
DELETE /api/content/:id      → creator: delete
GET    /api/feed             → user feed: subscribed creators' content
GET    /api/creators/:username/content → public/paid listing
```

**Access control logic (`ContentGuard`):**
```typescript
// Check if user can access content:
// FREE → always
// SUBSCRIPTION → user has active Subscription to creator
// PPV → user has Purchase for this content
async canAccess(userId: string, content: Content): Promise<boolean> {
  if (content.accessRule === AccessRule.FREE) return true;
  if (content.accessRule === AccessRule.SUBSCRIPTION) {
    return prisma.subscription.count({ where: { userId, creatorId: content.creatorId, status: 'ACTIVE' }}) > 0;
  }
  if (content.accessRule === AccessRule.PPV) {
    return prisma.purchase.count({ where: { userId, contentId: content.id }}) > 0;
  }
  return false;
}
```

**Commit:**
```bash
git commit -m "feat(content): content CRUD + access control guard"
```

---

### Task 8: Media upload (S3/R2)

**Files:**
- Create: `apps/api/src/media/media.module.ts`
- Create: `apps/api/src/media/media.service.ts`
- Create: `apps/api/src/media/media.controller.ts`

**Pattern:** Copy from skybot-inbox `src/media/` if it exists, otherwise implement:
```typescript
// Multipart upload → S3/R2
// Return signed URL (15min expiry) for reading
// Store only S3 key in DB, generate signed URL on read
async getSignedUrl(key: string): Promise<string> {
  return s3.getSignedUrlPromise('getObject', { Bucket, Key: key, Expires: 900 });
}
```

**Endpoints:**
```
POST /api/media/upload → multipart/form-data → returns { key, signedUrl }
GET  /api/media/:key/url → returns fresh signed URL
```

**Commit:**
```bash
git commit -m "feat(media): S3/R2 upload + signed URL generation"
```

---

## PHASE 6 — Live Streaming

### Task 9: Live Session management

**Files:**
- Create: `apps/api/src/live/live.module.ts`
- Create: `apps/api/src/live/live.service.ts`
- Create: `apps/api/src/live/live.controller.ts`
- Create: `apps/api/src/live/live.gateway.ts` (WebSocket events)

**Endpoints:**
```
POST /api/live/sessions         → creator: create session (returns streamKey)
GET  /api/live/sessions         → list live + upcoming sessions
GET  /api/live/sessions/:id     → session details + HLS URL
PATCH /api/live/sessions/:id/start → set status=LIVE, set startedAt
PATCH /api/live/sessions/:id/end   → set status=ENDED
GET  /api/live/sessions/:id/access → check if user can watch (access guard)
```

**Stream key flow:**
1. Creator creates session → gets `streamKey` (UUID)
2. Creator uses OBS: `rtmp://your-server/live` with stream key
3. Nginx RTMP on_publish webhook → `POST /api/live/webhook/stream-start`
4. API sets session `status=LIVE`
5. HLS available at `http://server:8080/hls/{streamKey}.m3u8`

**Nginx RTMP webhook handler:**
```typescript
@Post('webhook/stream-start')
async onStreamStart(@Body() body: { name: string }) {
  // body.name = streamKey
  const session = await this.liveService.findByStreamKey(body.name);
  if (!session) throw new NotFoundException('Unknown stream key');
  await this.liveService.setLive(session.id);
  // Notify subscribers via WebSocket
  this.liveGateway.broadcastSessionUpdate(session.id, { status: 'LIVE' });
}

@Post('webhook/stream-end')
async onStreamEnd(@Body() body: { name: string }) {
  const session = await this.liveService.findByStreamKey(body.name);
  await this.liveService.setEnded(session.id);
}
```

**Commit:**
```bash
git commit -m "feat(live): live session management + RTMP webhook handlers"
```

---

### Task 10: Nginx RTMP configuration

**Files:**
- Create: `nginx/nginx.conf`

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

      # HLS
      hls on;
      hls_path /tmp/hls;
      hls_fragment 3;
      hls_playlist_length 60;

      # Notify API on publish/unpublish
      on_publish http://api:3001/api/live/webhook/stream-start;
      on_done    http://api:3001/api/live/webhook/stream-end;
    }
  }
}

http {
  server {
    listen 80;

    location /hls {
      types { application/vnd.apple.mpegurl m3u8; video/mp2t ts; }
      root /tmp;
      add_header Cache-Control no-cache;
      add_header Access-Control-Allow-Origin *;
    }

    location /health { return 200 'ok'; }
  }
}
```

**Commit:**
```bash
git add nginx/ && git commit -m "feat(nginx): RTMP server + HLS delivery config"
```

---

## PHASE 7 — Chat (Real-time)

### Task 11: Chat WebSocket gateway

**Files:**
- Create: `apps/api/src/chat/chat.module.ts`
- Create: `apps/api/src/chat/chat.gateway.ts`
- Create: `apps/api/src/chat/chat.service.ts`

**Pattern:** Copy Socket.io gateway pattern from skybot-inbox websockets module.

**Events:**
```typescript
// Client → Server
@SubscribeMessage('chat:join')    // { liveSessionId } → join room
@SubscribeMessage('chat:leave')   // { liveSessionId } → leave room
@SubscribeMessage('chat:message') // { liveSessionId, content } → send message

// Server → Client
server.to(liveSessionId).emit('chat:message', { userId, displayName, content, createdAt })
server.to(liveSessionId).emit('chat:viewer_count', { count })
```

**Redis pub/sub for horizontal scaling:**
```typescript
// On message received:
await redis.publish(`chat:${liveSessionId}`, JSON.stringify(message));
// Subscriber broadcasts to all WS clients in room
```

**Access control:** before join, check if user can access the live session (free/subscription/ppv).

**Persistence:** save messages to `Message` table via `ChatService`.

**Commit:**
```bash
git commit -m "feat(chat): real-time WebSocket chat with Redis pub/sub"
```

---

## PHASE 8 — Payments (Stripe)

### Task 12: Stripe subscriptions + PPV + tips

**Files:**
- Create: `apps/api/src/payments/payments.module.ts`
- Create: `apps/api/src/payments/payments.service.ts`
- Create: `apps/api/src/payments/payments.controller.ts`
- Create: `apps/api/src/payments/stripe.webhook.ts`

**Pattern:** Copy + adapt from `/Users/milliandvalentin/skybot-inbox/src/billing/`

**Key flows:**
```
POST /api/payments/subscribe/:creatorId
  → Stripe Checkout Session (subscription)
  → On success webhook → create Subscription record

POST /api/payments/purchase/content/:contentId
  → Stripe Payment Intent (one-time)
  → On success webhook → create Purchase record

POST /api/payments/purchase/live/:liveSessionId
  → Stripe Payment Intent (PPV)
  → On success webhook → create Purchase record

POST /api/payments/tip/:creatorId
  → Stripe Payment Intent
  → On success webhook → create Tip record

POST /api/payments/webhook (Stripe)
  → Verify signature
  → Handle: payment_intent.succeeded, customer.subscription.updated/deleted

GET /api/payments/portal → Stripe billing portal URL
```

**Commit:**
```bash
git commit -m "feat(payments): Stripe subscriptions, PPV, tips + webhook handlers"
```

---

## PHASE 9 — Next.js Frontend (apps/client)

### Task 13: Next.js bootstrap

**Files:**
- Create: `apps/client/` — Next.js 15 app with App Router
- Copy patterns from: `/Users/milliandvalentin/skybot-inbox/skybot-inbox-ui/`

**Setup:**
```bash
cd apps && npx create-next-app@latest client \
  --typescript --tailwind --app --src-dir --import-alias "@/*"
cd client && pnpm add @tanstack/react-query axios zod react-hook-form socket.io-client hls.js
pnpm add -D @types/node
pnpm dlx shadcn@latest init
```

**Key pages (App Router):**
```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (app)/
│   ├── layout.tsx         ← auth guard + providers
│   ├── feed/page.tsx      ← unified feed (content + live)
│   ├── live/[id]/page.tsx ← HLS player + chat
│   ├── creator/
│   │   ├── [username]/page.tsx  ← public creator page
│   │   └── studio/page.tsx      ← creator dashboard
│   ├── settings/page.tsx
│   └── billing/page.tsx
├── layout.tsx
└── globals.css
```

**Commit:**
```bash
git add apps/client/ && git commit -m "feat(client): Next.js 15 app bootstrap + shadcn/ui"
```

---

### Task 14: HLS Player component

**Files:**
- Create: `apps/client/src/components/player/HLSPlayer.tsx`

```typescript
'use client';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface Props { src: string; poster?: string; }

export function HLSPlayer({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src; // Safari native HLS
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      autoPlay
      playsInline
      className="w-full aspect-video bg-black rounded-lg"
    />
  );
}
```

**Commit:**
```bash
git commit -m "feat(client): HLS player with hls.js + Safari fallback"
```

---

### Task 15: Live page (player + chat)

**Files:**
- Create: `apps/client/src/app/(app)/live/[id]/page.tsx`
- Create: `apps/client/src/components/chat/ChatPanel.tsx`
- Create: `apps/client/src/hooks/useChat.ts`
- Create: `apps/client/src/hooks/useLiveSession.ts`

**useChat hook:**
```typescript
// Connect to Socket.io
// Join room: socket.emit('chat:join', { liveSessionId })
// Listen: socket.on('chat:message', handler)
// Send: socket.emit('chat:message', { liveSessionId, content })
// Return: { messages, sendMessage, isConnected }
```

**useLiveSession hook:**
```typescript
// Poll or subscribe to live session status
// Returns: { session, isLive, hlsUrl, viewerCount }
```

**Commit:**
```bash
git commit -m "feat(client): live page with HLS player + real-time chat"
```

---

### Task 16: Creator Studio dashboard

**Files:**
- Create: `apps/client/src/app/(app)/creator/studio/page.tsx`
- Create: `apps/client/src/components/studio/ContentUpload.tsx`
- Create: `apps/client/src/components/studio/LiveManager.tsx`
- Create: `apps/client/src/components/studio/StatsOverview.tsx`

**StatsOverview:** revenue total, subscriber count, tip total, view count — from `GET /api/creators/me/stats`

**LiveManager:**
- Show current stream key (masked, reveal on click)
- Start/end session buttons
- Current viewer count (WebSocket)
- Copy OBS stream URL

**ContentUpload:**
- Drag + drop / file picker
- Type selector (image/video/post)
- Access rule (free/subscription/ppv) + price field
- Upload to `/api/media/upload` → create content via `/api/content`

**Commit:**
```bash
git commit -m "feat(client): creator studio — stats, live manager, content upload"
```

---

### Task 17: Feed page + API adapters

**Files:**
- Create: `apps/client/src/lib/api/client.ts`
- Create: `apps/client/src/lib/api/feed.adapter.ts`
- Create: `apps/client/src/lib/api/live.adapter.ts`
- Create: `apps/client/src/lib/api/payments.adapter.ts`
- Create: `apps/client/src/app/(app)/feed/page.tsx`
- Create: `apps/client/src/components/feed/ContentCard.tsx`
- Create: `apps/client/src/components/feed/LiveCard.tsx`

**Feed combines:**
- Content from subscribed creators (`GET /api/feed`)
- Active live sessions (`GET /api/live/sessions?status=LIVE`)
- Live sessions appear at top with "LIVE" badge

**Commit:**
```bash
git commit -m "feat(client): unified feed with content + live sessions"
```

---

## PHASE 10 — Docker + Environment

### Task 18: Complete docker-compose + env

**Files:**
- Modify: `docker-compose.yml` — add api + client services
- Create: `apps/api/.env.example`
- Create: `apps/client/.env.example`

**Full docker-compose.yml:**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: skylive_db
    environment:
      POSTGRES_USER: skylive
      POSTGRES_PASSWORD: skylive_password
      POSTGRES_DB: skylive_db
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U skylive"]
      interval: 10s

  redis:
    image: redis:7-alpine
    container_name: skylive_redis
    ports: ["6379:6379"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s

  rtmp:
    image: tiangolo/nginx-rtmp
    container_name: skylive_rtmp
    ports: ["1935:1935", "8080:80"]
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - hls_data:/tmp/hls

  api:
    build: ./apps/api
    container_name: skylive_api
    ports: ["3001:3001"]
    environment:
      DATABASE_URL: postgresql://skylive:skylive_password@postgres:5432/skylive_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      FRONTEND_URL: http://localhost:3000
    depends_on: [postgres, redis]
    volumes: [./apps/api:/app, /app/node_modules]

  client:
    build: ./apps/client
    container_name: skylive_client
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
      NEXT_PUBLIC_WS_URL: http://localhost:3001
      NEXT_PUBLIC_HLS_BASE: http://localhost:8080/hls
    depends_on: [api]

volumes:
  postgres_data:
  hls_data:
```

**apps/api/.env.example:**
```env
DATABASE_URL=postgresql://skylive:skylive_password@localhost:5432/skylive_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=change-me-in-production
JWT_EXPIRATION=12h
JWT_REFRESH_SECRET=change-me-refresh
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

**Commit:**
```bash
git add . && git commit -m "chore: complete docker-compose + env examples"
```

---

## PHASE 11 — First Commits + Git Setup

### Task 19: Git init + initial commit

```bash
cd /Users/milliandvalentin/Skylive/skylive
git init
git add .
git commit -m "feat: skylive initial commit — monorepo foundation"
```

---

## Implementation Order (for agents)

| Priority | Task | Agent |
|----------|------|-------|
| 1 | Monorepo + pnpm workspace | backend-architect |
| 2 | Prisma schema | database-architect |
| 3 | Auth module | backend-architect |
| 4 | Nginx RTMP | backend-architect |
| 5 | Users + Creators | backend-architect |
| 6 | Content + Media | backend-architect |
| 7 | Live sessions | backend-architect |
| 8 | Chat (WebSocket) | backend-architect |
| 9 | Payments (Stripe) | backend-architect |
| 10 | Next.js bootstrap + HLS player | frontend-developer |
| 11 | Live page + chat UI | frontend-developer |
| 12 | Creator studio | ui-designer |
| 13 | Feed page | frontend-developer |
| 14 | Docker complete | backend-architect |

---

## Files to copy from skybot-inbox (direct reuse)

```bash
# Common utilities — copy verbatim, update import paths
src/common/redis/          → apps/api/src/common/redis/
src/common/filters/        → apps/api/src/common/filters/
src/common/guards/         → apps/api/src/common/guards/
src/common/middleware/     → apps/api/src/common/middleware/
src/common/encryption/     → apps/api/src/common/encryption/
src/common/errors/         → apps/api/src/common/errors/
src/common/dto/            → apps/api/src/common/dto/
src/common/logger/         → apps/api/src/common/logger/
src/common/health/         → apps/api/src/common/health/

# Auth — copy and strip tenant/account references
src/auth/                  → apps/api/src/auth/  (adapt)

# Billing — copy and adapt subscription model
src/billing/               → apps/api/src/payments/ (adapt)

# Frontend patterns
skybot-inbox-ui/src/lib/api.client.ts → apps/client/src/lib/api/client.ts
skybot-inbox-ui/src/hooks/useWebSocket.ts → apps/client/src/hooks/useWebSocket.ts
skybot-inbox-ui/src/components/ui/ → apps/client/src/components/ui/ (shadcn)
```
