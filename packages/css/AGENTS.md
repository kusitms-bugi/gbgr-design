# AGENTS.md - packages/css

## Scope
- This file applies to everything under `packages/css`.

## Goal
- Provide stable, token-driven CSS entrypoints for consumers.

## Preferred Workflow
1. Keep `src/index.css` token-backed and predictable.
2. Verify imports from `@gbgr/tokens` remain valid.
3. Validate consumer impact by checking docs or package builds when selectors change.

## Guardrails
- Do not introduce package-local color values that bypass token usage without clear reason.
- Preserve export paths declared in `package.json` unless a coordinated breaking release is planned.
- Keep side-effect CSS behavior intact.

## Deploy
1. For exported CSS changes, add a changeset: `pnpm changeset`.
2. Verify consumer build compatibility (`@gbgr/ui`, docs) before merge.
3. Keep export keys stable unless intentionally releasing a breaking version.

## Testing
1. Validate CSS changes via consumer build checks (`pnpm build` at workspace level or impacted packages).
2. For selector or variable contract changes, verify docs rendering path.
3. When behavior can regress visually, include screenshot or manual verification notes in PR.

## Quick Commands
- Workspace typecheck: `pnpm -r typecheck`
