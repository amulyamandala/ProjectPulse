# ProjectPulse

## Adaptive Delivery Engine & SDLC Collaboration Platform

ProjectPulse is a multi-tenant Agile Project and Team Collaboration Suite designed around the complete software development lifecycle.

### Phase 1: Foundation

- **Monorepo setup**: Using npm workspaces
- **Backend**: Express.js + TypeScript
- **Frontend**: React + TypeScript + Vite
- **Shared package**: `@projectpulse/shared` for cross-platform types and utilities
- **Docker environment**: Configured with `docker-compose.yml`, local MongoDB, and Dockerfiles for frontend/backend

### Getting Started

```bash
# Install dependencies
npm install

# Start development servers
npm run dev
```

### Docker Development

```bash
docker-compose up
```
