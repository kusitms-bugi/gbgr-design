# AGENTS.md - packages/tokens

## Scope
- This file applies to everything under `packages/tokens`.

## Goal
- Keep design tokens as the single source of truth and produce deterministic build outputs.

## Preferred Workflow
1. Update token sources and build scripts under `build/` intentionally.
2. Run `pnpm --filter @gbgr/tokens build`.
3. Run `pnpm --filter @gbgr/tokens validate`.
4. If type files are touched, run `pnpm --filter @gbgr/tokens typecheck`.

## Guardrails
- Avoid manual edits inside `dist/`; regenerate via build.
- Keep output schema backward compatible unless a versioned breaking change is planned.
- When changing token naming, verify downstream consumers in `@gbgr/css` and docs.

## Deploy
1. For token changes, add a changeset: `pnpm changeset`.
2. Validate before publish path: `build` then `validate`.
3. Do not publish by editing generated artifacts manually.

## Testing
1. Treat `build + validate + typecheck` as mandatory verification for token changes.
2. If token schema behavior changes, add or update validation logic under `build/validate.mjs`.
3. Verify at least one downstream consumer (`@gbgr/css` or docs) after structural token updates.

## Quick Commands
- Build: `pnpm --filter @gbgr/tokens build`
- Validate: `pnpm --filter @gbgr/tokens validate`
- Typecheck: `pnpm --filter @gbgr/tokens typecheck`
