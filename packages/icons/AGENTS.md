# AGENTS.md - packages/icons

## Scope
- This file applies to everything under `packages/icons`.

## Goal
- Keep generated icon components deterministic and export-safe.

## Preferred Workflow
1. If source SVG or build scripts change, run `pnpm --filter @gbgr/icons build`.
2. Run `pnpm --filter @gbgr/icons typecheck` after API-affecting edits.
3. Validate generated exports match `package.json` export expectations.

## Guardrails
- Avoid manual edits in generated `dist/` output.
- Prefer updating generation logic in `build/` over hand-patching generated files.
- Keep icon component naming consistent and stable.

## Deploy
1. Icon set or export changes require a changeset: `pnpm changeset`.
2. Always regenerate and verify build output before merge.
3. Avoid direct edits to generated publish artifacts.

## Testing
1. Run `pnpm --filter @gbgr/icons build` and `pnpm --filter @gbgr/icons typecheck` after icon pipeline changes.
2. If generation logic changes, verify representative icon outputs are still valid components.
3. Include manual verification notes for any export-name or mapping changes.

## Quick Commands
- Build: `pnpm --filter @gbgr/icons build`
- Typecheck: `pnpm --filter @gbgr/icons typecheck`
