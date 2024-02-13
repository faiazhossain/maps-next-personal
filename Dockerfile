# Stage 1: Install dependencies
FROM node:16-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
ENV SKIP_HUSKY=1
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the project
FROM node:16-alpine AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_PUBLIC_BASE_URL=NEXT_PUBLIC_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Serve the project
FROM node:16-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/entrypoint.sh .

RUN chmod +x /app/entrypoint.sh

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next

USER nextjs


EXPOSE 3000


ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["node", "server.js"]