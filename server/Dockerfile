FROM node:22

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install deps
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Nest.js app
RUN npm run build

EXPOSE 4000

# Start the app
CMD ["npm", "run", "start:prod"]
