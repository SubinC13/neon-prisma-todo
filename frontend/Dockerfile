FROM node:22 AS builder

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of source
COPY . .

# Build Next.js app
RUN npm run build

# ------------------------------
# Runner (smaller image)
FROM node:22 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only what’s needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
