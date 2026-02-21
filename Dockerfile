# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Final Environment
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package*.json ./backend/

# Copy frontend build (to be served by backend or Nginx)
COPY --from=frontend-build /app/dist ./frontend/dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

# Start command
CMD ["node", "backend/dist/index.js"]
