##### DEPENDENCIES

FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY prisma ./
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* bun.lock* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i; \
  elif [ -f bun.lock ]; then npm install -g bun && bun i; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### BUILDER
FROM node:20-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client for Alpine (keeps same binary target)
RUN \
  if [ -f yarn.lock ]; then yarn prisma generate; \
  elif [ -f package-lock.json ]; then npm run prisma generate || npx prisma generate; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpx prisma generate; \
  elif [ -f bun.lock ]; then npm install -g bun && bunx prisma generate; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN \
  if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
  elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
  elif [ -f bun.lock ]; then npm install -g bun && SKIP_ENV_VALIDATION=1 bun run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### RUNNER (Ultra-minimal Alpine)
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy only essential Prisma files
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]