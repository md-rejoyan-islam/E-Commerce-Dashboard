# Server Dockerfile
FROM node:lts-alpine3.23 AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production stage
FROM node:lts-alpine3.23 AS runner
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

ENV NODE_ENV=production

# Copy built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy docs folder for swagger
COPY --from=builder /app/src/docs ./src/docs

EXPOSE 5505

CMD ["node", "dist/server.js"]
