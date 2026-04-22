# AGENTS.md - apps/docs

## Scope
- This file applies to everything under `apps/docs`.

## Goal
- Maintain and improve the documentation site powered by Docusaurus.
- Keep docs examples aligned with published package APIs.

## Preferred Workflow
1. If component examples are changed, ensure dependent packages build first.
2. Run `pnpm --filter docs typecheck` after edits.
3. For local preview, use `pnpm --filter docs dev`.
4. Before finalizing major doc changes, run `pnpm --filter docs build`.

## Guardrails
- Do not hardcode generated token values in docs when they can be imported from package outputs.
- Keep code snippets consistent with current exports from `@gbgr/react`, `@gbgr/icons`, and `@gbgr/css`.
- Prefer editing `apps/docs/src` and `apps/docs/docs` content; avoid changing build scripts unless required.

## Deploy
1. Treat docs deploy as build-output based; always pass `pnpm --filter docs build` before release.
2. Keep `prebuild` behavior intact because docs build depends on generated token/component artifacts.
3. If docs break due to package API changes, fix package examples in the same PR.

## Testing
1. For docs content or UI changes, run `pnpm --filter docs typecheck` and `pnpm --filter docs build`.
2. For example code updates, verify referenced packages still build.
3. Include manual verification notes for changed pages when no page-level automated tests exist.

## Quick Commands
- Dev: `pnpm --filter docs dev`
- Typecheck: `pnpm --filter docs typecheck`
- Build: `pnpm --filter docs build`
