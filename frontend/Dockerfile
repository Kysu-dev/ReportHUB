# Terima argumen dari docker build --build-arg
ARG NEXT_PUBLIC_API_URL

FROM node:20-alpine AS builder
WORKDIR /app

# Set environment variable dari argumen
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==============================

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# hanya ambil hasil build yang dibutuhkan saja
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]