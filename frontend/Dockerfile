FROM node:20-alpine

WORKDIR /app

# Copy root package.json and lockfile if it exists
COPY package*.json ./

# Copy workspace packages
COPY frontend/package.json ./frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY frontend/ ./frontend/
COPY packages/shared/ ./packages/shared/

# Build shared first
RUN cd packages/shared && npm run build

WORKDIR /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
