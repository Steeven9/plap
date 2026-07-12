# https://hub.docker.com/hardened-images/catalog/dhi/node

FROM dhi.io/node:26-alpine-sfw-dev AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

RUN mkdir -p .next/standalone/.next/cache \
    && chown -R node:node .next/standalone/.next/cache


FROM dhi.io/node:26-alpine-sfw-dev AS runner

LABEL author="Soulsbros <https://soulsbros.ch>"

WORKDIR /app
EXPOSE 3000
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/node_modules ./node_modules
COPY . .

CMD ["yarn", "dev"]
