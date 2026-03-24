# =============================================================================
# PREREQUISITE — next.config.ts must include `output: 'standalone'`
#
# The production stage relies on the standalone output produced by Next.js.
# Without that option the .next/standalone directory is not generated and the
# final CMD will fail.
#
# Add the following to apps/client/next.config.ts:
#
#   const nextConfig: NextConfig = {
#     output: 'standalone',
#     // ...other options
#   };
#
# Do NOT modify this Dockerfile to work around the missing option — fix the
# config instead.
# =============================================================================


# =============================================================================
# Stage 1 — deps
# Install all dependencies (including devDependencies needed by the Next.js
# compiler). libc6-compat is required by some native Node addons on Alpine.
# =============================================================================
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi


# =============================================================================
# Stage 2 — build
# Compile the Next.js application.
# Public environment variables (NEXT_PUBLIC_*) must be baked in at build time
# because Next.js inlines them into the client bundle.
# =============================================================================
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Runtime-public environment variables injected via --build-arg at docker build.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_HLS_BASE

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL \
    NEXT_PUBLIC_HLS_BASE=$NEXT_PUBLIC_HLS_BASE \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm build; \
  else npm run build; \
  fi


# =============================================================================
# Stage 3 — production
# Minimal runtime image using the Next.js standalone output.
# The standalone bundle contains its own trimmed node_modules — no full
# node_modules copy is needed.
# =============================================================================
FROM node:22-alpine AS production

RUN apk add --no-cache wget dumb-init

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 --ingroup nodejs --no-create-home nextjs

WORKDIR /app

# Standalone bundle (self-contained server + trimmed node_modules).
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./

# Static assets must be copied separately — the standalone bundle does not
# include them and Next.js serves them from the filesystem.
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Public directory (favicon, images, etc.).
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Liveness probe on the root path.
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
