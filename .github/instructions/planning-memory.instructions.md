---
description:
  'Use when implementing non-trivial backend features in this project. Enforces planning docs in
  docs/planning and decision records in docs/memory, and keeps documentation aligned with behavior
  changes.'
name: 'Planning And Memory Discipline'
applyTo:
  - 'src/**/*.ts'
  - 'docs/**/*.md'
---

# Planning And Memory Discipline

Apply these rules before and during non-trivial backend work.

## Scope Threshold

- Treat non-trivial work as medium/large changes such as new modules, schema changes, or
  multi-endpoint behavior changes.
- Do not require planning files for tiny refactors or no-behavior edits.

## Planning First

- Check whether a relevant planning file exists under docs/planning before implementation.
- If missing for non-trivial work, propose creating one and align implementation to it.
- Update the plan when implementation deviates from the original design.

## Record Decisions

- Store major architectural or policy decisions in docs/memory.
- Include decision, reasoning, alternatives considered, and impact.
- Avoid relying on implicit team memory for durable backend decisions.
- Require docs/memory updates for architectural and business-rule changes.
- For small refactors with no behavior change, docs/memory updates are best-effort.

## Keep Docs In Sync

- Update documentation when API contracts, behavior, folder structure, error semantics, or workflows
  change.
- When error semantics change, document the project error helper or standard exception pattern used
  and confirm no `domainError` field or ad hoc throw payload pattern is introduced.
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
- Keep Pull Request checklist expectations visible in review summaries.

## Customization Sync (Only When Needed)

- For new feature introduction, review whether reusable guidance changed.
- Update .github/agents, .github/instructions, and .github/skills only when the feature introduces
  or changes reusable conventions, workflows, or decision logic.
- If reusable guidance did not change, skip customization file updates.

## Suggested Minimum Plan Content

- Problem statement
- API design
- Data model impact
- Business rules
- Edge cases
