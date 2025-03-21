FROM node:22-alpine AS base

FROM base AS deps

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile


FROM base AS builder

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs && \
  mkdir .next && \
  chown nextjs:nodejs .next

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# USER nextjs
CMD ["yarn", "dev"]
