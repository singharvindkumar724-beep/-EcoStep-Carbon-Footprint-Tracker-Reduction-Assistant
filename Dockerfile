# ──────────────────────────────────────────────
# Stage 1: Build the Next.js app
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install libc compat for Alpine + native modules
RUN apk add --no-cache libc6-compat

# Install ALL dependencies (needed for next build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ──────────────────────────────────────────────
# Stage 2: Production runner (minimal image)
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone build output (next.config output: 'standalone')
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run injects PORT env var; Next.js standalone listens on it
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
