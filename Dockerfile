# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set production environment for the build process
ENV NODE_ENV production

# Build the Next.js application
RUN npm run build

# Optional: Prune development dependencies (if your start script doesn't need them)
# RUN npm prune --production

# Stage 2: Production environment
FROM node:18-alpine AS runner 

WORKDIR /app

# Set production environment
ENV NODE_ENV production

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
# If using standard output (not standalone), copy .next/static too for client assets
COPY --from=builder /app/.next/static ./.next/static 
# COPY --from=builder /app/.next/standalone ./.next/standalone # Standalone output not used
# Copy node_modules (potentially pruned) and package.json if needed by start script
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Command to run the optimized production server using npm start (next start)
CMD ["npm", "run", "start"] 