# Skylive Frontend

Built with Next.js 15, React 19, TailwindCSS, and Socket.io.

## Features
- **Premium Dark UI**: Inspired by skybot-inbox with violet accents (#9E398D).
- **HLS Player**: Live streaming playback with low-latency support.
- **Live Chat**: Real-time interaction via WebSockets.
- **Feed**: Unified content and live session discovery.
- **Creator Studio**: Dashboard for managing streams and uploads.
- **Auth System**: Complete JWT-based registration and login flows.

## Environment Variables
Ensure `.env.local` is present (already created):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_HLS_BASE=http://localhost:8080/hls
```

## Getting Started
Run from the monorepo root:
```bash
pnpm install
pnpm --filter client dev
```
Or from `apps/client`:
```bash
npm run dev
```

## Styling
Global styles are defined in `src/app/globals.css`. 
Custom utilities:
- `.gradient-primary`: The brand's signature violet gradient.
- `.glass`: Transparent blurred background effect.
- `.animate-fade-in`: Smooth entrance animation.
