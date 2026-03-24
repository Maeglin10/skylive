# =============================================================================
# Stage 1 — deps
# Install all dependencies then isolate production-only node_modules.
# The build context is apps/api/ so only files from that directory are
# accessible here. The pnpm workspace root (pnpm-workspace.yaml, the root
# pnpm-lock.yaml) is NOT in scope — this stage therefore treats apps/api as
# a standalone package.
# =============================================================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy manifest and lockfile first to leverage layer caching.
COPY package.json package-lock.json* ./

# Install all deps (build tools are needed for native addons such as bcrypt).
RUN pnpm install --frozen-lockfile || npm ci

# Prune to production-only deps and place them in /app/prod_modules so the
# build stage can keep the full node_modules intact.
RUN cp -r node_modules prod_modules && \
    npx --yes node-prune || true
# Fallback: use npm prune when node-prune is unavailable.
RUN npm prune --production --prefix /app/prod_modules 2>/dev/null || true


# =============================================================================
# Stage 2 — build
# Compile TypeScript and generate Prisma client artefacts.
# =============================================================================
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Re-use the full node_modules from the deps stage (includes devDependencies
# needed by @nestjs/cli and ts-node).
COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Generate Prisma client before compiling (the client is emitted into
# node_modules/@prisma/client which is already present from the deps stage).
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compile the NestJS application (output goes to dist/ per nest-cli.json).
RUN npx nest build


# =============================================================================
# Stage 3 — production
# Minimal runtime image: no source, no devDependencies, no build tools.
# =============================================================================
FROM node:22-alpine AS production

# dumb-init reaps zombie processes and forwards signals correctly.
RUN apk add --no-cache dumb-init wget

# Run as a non-root user for security hardening.
RUN addgroup --system --gid 1001 nestjs && \
    adduser  --system --uid 1001 --ingroup nestjs --no-create-home nestjs

WORKDIR /app

# Production node_modules (no devDependencies).
COPY --from=deps  --chown=nestjs:nestjs /app/prod_modules ./node_modules

# Compiled application bundle.
COPY --from=build --chown=nestjs:nestjs /app/dist ./dist

# Prisma schema + migrations are required at runtime for `prisma migrate deploy`
# and for the Prisma client to locate the schema.
COPY --from=build --chown=nestjs:nestjs /app/prisma ./prisma

# The generated Prisma client (query engine binary) lives in node_modules; it
# has already been copied above via prod_modules.

USER nestjs

EXPOSE 3001

# Liveness probe — matches the /api/health/liveness route from @nestjs/terminus.
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health/liveness || exit 1

# Run pending migrations then start the compiled app.
# dumb-init is the PID-1 process and correctly forwards SIGTERM to Node.
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
