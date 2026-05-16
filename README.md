# Operon API

Operon API is the primary NestJS backend for Operon services. It provides authentication, media
management, CSRF-protected mutating endpoints, and a consistent API surface used by Operon frontends
and integrations.

## Overview

- Auth: magic-link sign-in, Google login, session management, and profile endpoints (`/auth`).
- Media: upload, list, update, and delete media assets (`/media`).
- CSRF: token issuing and unsafe-method protection (`/csrf`).
- Security: JWT guards, CSRF guard, and standardized error responses.

## Tech Stack

- NestJS 11
- TypeScript
- Drizzle ORM + PostgreSQL
- Zod for environment and request validation
- Jest for unit and e2e testing

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables (see `src/core/validators/env.ts`).

3. Start the API in development mode:

```bash
pnpm run dev
```

## Useful Scripts

```bash
# Build
pnpm run build

# Start modes
pnpm run start
pnpm run dev
pnpm run debug
pnpm run prod

# Database
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
pnpm run db:studio

# Tests
pnpm run test
pnpm run test:cov
pnpm run test:e2e

# Lint
pnpm run lint
```

## Routes and Documentation

- Public status page: `/` (simple HTML status and quick links).
- CSRF token: `/csrf` (issues CSRF cookie + response token).
- Current user: `/auth/me` (requires JWT).
- Media endpoints: `/media` (JWT + CSRF for mutating requests).

Use controllers and `docs/api/` as the source of truth for API contracts. `routes.json` is a
generated route inventory when the app is able to regenerate it.

Canonical module-wise API documentation is stored under `docs/api/`; update the matching module doc
when you add or modify endpoints.

## Contributing

- Follow existing module boundaries in `src/app/*`.
- Add or update docs in `docs/api/` when changing public API contracts.
- Tests: prefer focused unit tests and keep e2e tests in `test/`.

## Notes

- Global response formatting and exception handling are configured in `src/main.ts`.
- The index route at `/` serves an HTML status page implemented in `src/app.controller.ts`.
