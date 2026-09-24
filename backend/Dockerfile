FROM node:20-alpine

WORKDIR /app

# Copy root package.json and lockfile if it exists
COPY package*.json ./

# Copy workspace packages
COPY backend/package.json ./backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY backend/ ./backend/
COPY packages/shared/ ./packages/shared/

# Build shared first, then backend
RUN cd packages/shared && npm run build
RUN cd backend && npm run build

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]
