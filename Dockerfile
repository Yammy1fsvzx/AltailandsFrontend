# Use an official Node runtime
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
# Copy package.json and lock file first to leverage Docker cache
COPY package.json package-lock.json* ./
# Install only production dependencies for the final image base
RUN npm install --only=production 

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app
# Copy prod dependencies from base stage
COPY --from=base /app/node_modules ./node_modules 
# Copy source code
COPY . .
# Install ALL dependencies (including dev) needed for the build
RUN npm install 
RUN npm run build # Build the application

# --- Final Stage ---
FROM base AS runner
WORKDIR /app

# Copy only necessary production dependencies from the base stage
COPY --from=base /app/node_modules ./node_modules 
# Copy built artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public 
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Command to run the production server
CMD ["npm", "run", "start"] 