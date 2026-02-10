# AGENTS.md - packages/ui

## Scope
- This file applies to everything under `packages/ui`.

## Goal
- Ship framework-level UI exports that compose `@gbgr/css`, `@gbgr/icons`, and `@gbgr/react`.

## Preferred Workflow
1. Keep exports aligned with files under `src/`.
2. Run `pnpm --filter @gbgr/ui build` after changes to source or package exports.
3. Run `pnpm --filter @gbgr/ui typecheck` before handoff.

## Guardrails
- Preserve public export paths unless intentionally coordinating a breaking change.
- Keep CSS side-effect behavior unchanged unless necessary.
- Avoid duplicating logic that already exists in `@gbgr/react`.

## Deploy
1. Any public API/export change requires a changeset: `pnpm changeset`.
2. Verify package build and typecheck before merge.
3. Keep export compatibility with docs imports to prevent deploy regressions.

## Testing
1. Run `pnpm --filter @gbgr/ui typecheck` and `pnpm --filter @gbgr/ui build` after changes.
2. For export contract changes, verify importing usage in docs or example consumers.
3. If regression risk is visual or integration-based, include manual verification notes in PR.
4. Write `describe` and `it` test descriptions in Korean.

## Quick Commands
- Build: `pnpm --filter @gbgr/ui build`
- Typecheck: `pnpm --filter @gbgr/ui typecheck`
