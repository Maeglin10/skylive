# Antigravity — Unified Content & Streaming Platform

**Plateforme unifiée — Contenu payant + Live streaming (Portfolio-Grade Architecture)**

**Antigravity** est une plateforme tout-en-un permettant aux créateurs de publier du contenu payant (abonnements, pay-per-view, feed privé) et de diffuser des lives en temps réel — avec chat intégré et monétisation hybride. 

Projet certifié **Pro-Industrial Stack** (NestJS, Next.js, Prisma, Redis, HLS).

---

## ⚡ Stack Technique

| Couche | Technologie |
| :--- | :--- |
| **Backend** | NestJS 11 (Architecture modulaire), TypeScript 5.8 |
| **Frontend** | Next.js 15 (App Router), React 19, TailwindCSS, shadcn/ui |
| **Animation** | Framer Motion (Transitions et Micro-interactions) |
| **Thème** | "Midnight Obsidian" (Cyan Electrique `#06B6D4`) |
| **Base de données** | PostgreSQL via Prisma 6 (Support tiers d'abonnement) |
| **Streaming** | Pipeline Nginx RTMP → HLS Segments |
| **Sécurité** | Rate Limiting (Redis-backed), Refresh Token Rotation |

---

## 🏗️ Architecture

```
antigravity/
├── apps/
│   ├── api/          # NestJS — backend, auth, tiers, streaming, tips
│   └── client/       # Next.js — feed glassmorphic, live studio, studio pro
├── nginx/            # Config RTMP + HLS
├── docker-compose.yml
├── pnpm-workspace.yaml
└── docs/             # Documentation technique & blueprints
```

### Améliorations de la Transformation "Antigravity"
- **Audit & Benchmark :** Comparaison active avec OnlyFans (UX), Twitch (Chat), Patreon (Tiers) et Kick (Payouts).
- **Hardening Sécurité :** Vérification globale du `ThrottlerGuard` et du cycle de vie des tokens.
- **Support Multi-Niveaux :** Évolution du schéma Prisma pour supporter les paliers "Bronze", "Silver", "Gold".
- **Refonte Visuelle :** Migration du violet générique vers un Cyan Industriel/Matrix avec des effets de flou directionnel.

---

## 🚀 Installation & Développement

1. Clonez le repository
   ```bash
   git clone <repo> antigravity && cd antigravity
   ```
2. Lancez l'infrastructure (Postgres, Redis, RTMP)
   ```bash
   docker compose up -d
   ```
3. Installez les dépendances
   ```bash
   pnpm install
   ```
4. Configurez les `.env` (API & Client)
5. Lancez tout en parallèle
   ```bash
   pnpm dev
   ```

---

## 📈 Roadmap

- [x] **Phase 1 :** Rébranding "Antigravity" (UI/Core)
- [x] **Phase 2 :** Migration database vers support Tiers
- [ ] **Phase 3 :** Intégration FFmpeg Worker (VOD processing)
- [ ] **Phase 4 :** Mobile PWA Deployment (Expo)

---

## 📄 Licence
Propriétaire — Tous droits réservés. Brand Assets par Antigravity Team.
