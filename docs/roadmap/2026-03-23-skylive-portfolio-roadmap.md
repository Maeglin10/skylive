# Skylive — Portfolio Roadmap (100% Done)

**Date:** 2026-03-23

## 1) Ce que font les plateformes live & contenu payant (patterns techniques)

### Ingestion vidéo
- **RTMP/RTMPS** reste la norme d’ingestion depuis OBS et outils pro (compatible quasi partout).
- **SRT** est de plus en plus utilisé pour la robustesse réseau sur l’ingestion.

### Livraison vidéo
- **HLS** est le standard de diffusion (CDN-friendly, compatible iOS/web, adaptatif).
- **Low‑Latency HLS (LL‑HLS)** est l’évolution naturelle pour rapprocher la latence du temps réel.
- **WebRTC** est réservé aux cas ultra faible latence (watch parties, features interactives).

### Chat & temps réel
- **WebSocket** + **pub/sub** (Redis/NATS/Kafka) pour le chat scalable.
- **Rooms** par session live, persistance DB + cache en mémoire.

### Monétisation
- **Abonnements + PPV + tips** (Stripe ou équivalent).
- Webhooks pour synchroniser l’état des paiements et droits d’accès.

### Sécurité & contrôle d’accès
- URL **signées** pour les assets premium.
- **Tokens d’accès** côté player et restrictions par achat/abonnement.
- Modération & anti‑fraude (rate limit, device tracking, abuse reports).

### Stack “de référence” typique
- Ingestion RTMP/SRT → **transcodage** → **HLS/LL‑HLS** → **CDN**
- Backend monolithique ou services dédiés (auth, billing, content, live)
- DB relationnelle + cache Redis

## 2) Décisions techniques pour Skylive (portfolio)

- **Ingestion:** RTMP (Nginx RTMP) dès maintenant; ouverture à SRT plus tard.
- **Diffusion:** HLS classique + option LL‑HLS pour la v2.
- **Chat:** Socket.io + Redis pub/sub + persistance DB.
- **Paiements:** Stripe (subscriptions + tips + PPV).
- **Storage:** S3/R2 + URLs signées.
- **Sécurité:** JWT, RBAC, guards, rate‑limit, vérif accès côté API.

## 3) Roadmap détaillée vers un produit “100% portfolio”

### Phase 0 — Foundation (DONE)
- Monorepo pnpm
- PostgreSQL + Redis + RTMP + HLS
- API NestJS avec modules core

### Phase 1 — Core Backend (MVP)
- Auth + refresh token + RBAC
- Prisma + migrations + seed
- Users + Creators
- Content + Media upload
- Live sessions + webhooks RTMP
- Feed unifié (content + live)
- Chat WebSocket + persistance

### Phase 2 — Monétisation
- Stripe subscriptions + webhook sync
- PPV content + PPV live
- Tips
- Portail client (Stripe portal)

### Phase 3 — UX & Sécurité
- URLs signées / protection assets
- ACL cohérente pour feed / live / content
- Rate limit, abuse & moderation (report/ban)
- Analytics minimales (views, revenue, engagement)

### Phase 4 — Performance & Scalabilité (portfolio avancé)
- Redis adapter Socket.io
- Cache feed + denormalisation légère
- Async jobs (Bull)
- Observability (logs structurés + health)

### Phase 5 — Streaming avancé
- LL‑HLS (playlist parts, reduced latency)
- Optional WebRTC room (1:1 / ultra low latency)
- Enregistrement live → VOD automatique
- Multi‑bitrate ladder (ABR)

### Phase 6 — “Polish” pour portfolio
- Tests e2e (auth + feed + live + achat)
- CI/CD basique
- Documentation technique & diagrammes
- Démo scriptée (creator onboarding → live → chat → achat)

## 4) Définition du “100% fini”

- **Flows complets**: creator onboarding → upload → live → access control → payment
- **Démo stable**: seed + script qui montre le produit en 5 min
- **Docs**: architecture, endpoints clés, décisions techniques
- **Tests**: e2e sur auth + paiement + live
- **Observabilité**: logs et healthcheck

## 5) Checklist finale (portfolio)

- [ ] Démarrage local en 1 commande (docker compose + migrations)
- [ ] Deux scénarios démo (free + paywall)
- [ ] Dashboard créateur minimal
- [ ] Player live + chat + purchase
- [ ] Feed unifié stylé
- [ ] README “portfolio‑ready”
