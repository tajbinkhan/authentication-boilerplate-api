---
description:
  'Use when implementing or reviewing NestJS backend code in this project. Enforces
  controller/service/policy/repository boundaries, project DomainError and NestJS HttpException
  usage, validation boundaries, transaction usage, DTO stability, and test/quality-gate
  expectations.'
name: 'Backend Implementation Standards'
applyTo:
  - 'src/**/*.ts'
  - 'test/**/*.ts'
---

# Backend Implementation Standards

Apply these rules when creating or modifying backend code.

## Architecture Boundaries

- Keep controllers thin: routes, guards, validation boundary, request extraction, service
  delegation.
- Put business/lifecycle rules in services and policy files.
- Keep repositories/query helpers focused on data access only.
- Do not place role/ownership business policy inside repositories.

## Structure and Naming

- Prefer feature layout under src/app/<feature>/.
- For domain-heavy modules, use controller, service, repository, schema, mapper, policy, and
  algorithm separation.
- Follow strict TypeScript and avoid any.
- Keep exported/public function return types explicit.

## Validation and API Contract

- Validate body, params, and query at API boundaries.
- Place feature validation in <feature>.schema.ts under the feature folder.
- Keep DTO contracts stable; prefer additive changes over renames/breaking changes.
- For list APIs, prefer rows + total shape, with optional metadata when needed.

## API Documentation Sync

- For every new API endpoint, add or update the corresponding module API documentation under
  docs/api/<module>.md in the same work session.
- If an existing API endpoint changes, update its module docs file under docs/api immediately in the
  same work session.
- Implementation and API documentation must never be out of sync.
- Each API docs file must include:
  - what the API does
  - how the API works
  - required request parameters
  - optional request parameters
  - authentication or authorization requirements, if applicable
  - CSRF requirements, if applicable
  - validation rules
  - error responses
  - example request body
  - example successful response
  - example error response

## Error Handling

- Use the project error helpers in src/core/errors/domain-error.ts for domain and boundary failures
  that need stable error codes or metadata.
- Standard NestJS HttpException subclasses are acceptable when a simple framework-level exception is
  clearer.
- Keep error payloads/message consistency and let the global HttpExceptionFilter format the final
  response as statusCode, code, error, message, meta, timestamp, path, and requestId.
- Do not introduce a `domainError` field in API error responses.
- Do not manually build custom `{ code, error, message, meta }` throw payloads outside the project
  error helper pattern.

## Database and Transactions

- Use src/database and src/models/drizzle conventions.
- Never manually edit generated schema artifacts.
- Use transactions for critical state transitions and multi-step consistency flows.

## Authorization

- Apply auth guards for protected routes.
- Apply role guards for admin routes.
- Keep ownership checks in service/policy logic even when role guards exist.

## Tests and Verification

- Add/update unit tests for pure logic and policy checks.
- Add/update integration or e2e tests for lifecycle and conflict behavior.
- For implementation tasks, run lint, tests, and build when feasible, and report anything skipped.
- For code changes, always run TypeScript type checking (`tsc --noEmit` or the workspace
  equivalent) after completing the task and report the result. For docs-only changes, type checking
  is optional; if skipped or if pre-existing failures block it, report that clearly.

## Customization And Documentation Sync

- If a new feature introduces reusable workflow, conventions, contracts, or cross-cutting decisions,
  update:
  - .github/agents
  - .github/instructions
  - .github/skills
  - relevant docs
- If the feature does not change reusable guidance, do not force customization updates.
