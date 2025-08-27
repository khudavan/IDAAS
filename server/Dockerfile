# Use Debian-based Node (Prisma + OpenSSL friendly)
FROM node:20-bookworm-slim

# Install minimal system deps needed by Prisma/OpenSSL
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# Copy package metadata and install dependencies (cache layer)
COPY package*.json ./
RUN npm ci --production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the source
COPY . .

# Expose the port your app listens on (your .env uses 5000)
ENV PORT=5000
EXPOSE 5000

# Run DB migrations (if any) then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
