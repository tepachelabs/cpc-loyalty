FROM node:20.11.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json panda.config.ts postcss.config.cjs ./
RUN  npm install

FROM node:20.11.0-alpine AS builder
# Add Doppler's RSA key
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub
# Add Doppler's apk repo
RUN echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories
RUN apk update && apk add --no-cache apt-transport-https ca-certificates curl gnupg doppler

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/styled-system ./styled-system
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN
ARG DOPPLER_PROJECT
ENV DOPPLER_PROJECT=$DOPPLER_PROJECT
ARG DOPPLER_ENVIRONMENT
ENV DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

#RUN npx prisma generate
RUN npm run build

FROM node:20.11.0-alpine AS runner
# Add Doppler's RSA key
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub
# Add Doppler's apk repo
RUN echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories
RUN apk update && apk add --no-cache apt-transport-https ca-certificates curl gnupg doppler

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN
ARG DOPPLER_PROJECT
ENV DOPPLER_PROJECT=$DOPPLER_PROJECT
ARG DOPPLER_ENVIRONMENT
ENV DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs

EXPOSE 80

ENV PORT 80

CMD ["doppler", "run", "--", "npm", "start"]
