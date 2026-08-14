FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node modules and files
COPY --from=builder /app /app

EXPOSE 3000

CMD ["npx", "tsx", "src/server.ts"]
