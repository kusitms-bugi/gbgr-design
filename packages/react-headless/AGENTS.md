# AGENTS.md - packages/react-headless

## Scope
- This file applies to everything under `packages/react-headless`.

## Goal
- Provide stable headless primitives and interaction logic for React consumers.

## Preferred Workflow
1. Keep behavior-focused logic in headless primitives.
2. Run `pnpm --filter @gbgr/react-headless build` after source edits.
3. Run `pnpm --filter @gbgr/react-headless typecheck` before finalizing.
4. Check downstream compatibility with `@gbgr/react` when changing hook/component contracts.

## Guardrails
- Do not introduce visual styling assumptions into headless primitives.
- Keep public APIs stable and explicit.
- Treat `dist/` as generated output only.

## Deploy
1. Public hook/component contract changes require a changeset: `pnpm changeset`.
2. Keep downstream compatibility with `@gbgr/react` and validate during the same PR.
3. Build and typecheck must pass before merge.

## Testing
1. Run `pnpm --filter @gbgr/react-headless typecheck` and `pnpm --filter @gbgr/react-headless build` after logic changes.
2. For interaction/state behavior updates, add or update automated tests when infrastructure exists.
3. If no automated tests are present for changed behavior, include deterministic manual reproduction steps in PR.
4. Write `describe` and `it` test descriptions in Korean.

## Quick Commands
- Build: `pnpm --filter @gbgr/react-headless build`
- Typecheck: `pnpm --filter @gbgr/react-headless typecheck`
