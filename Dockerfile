FROM node:20.11.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json panda.config.ts postcss.config.cjs ./
RUN  npm install

FROM node:20.11.0-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED 1
ARG DOPPLER_TOKEN=$DOPPLER_TOKEN
ARG DOPPLER_PROJECT=$DOPPLER_PROJECT
ARG DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/styled-system ./styled-system
COPY . .

#RUN npx prisma generate
RUN doppler run -- npm run build

FROM node:20.11.0-alpine AS runner

ARG DOPPLER_TOKEN=$DOPPLER_TOKEN
ARG DOPPLER_PROJECT=$DOPPLER_PROJECT
ARG DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

USER nextjs

EXPOSE 80

ENV PORT 80

CMD ["doppler", "run", "--", "npm", "start"]
