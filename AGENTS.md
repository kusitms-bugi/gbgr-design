# AGENTS.md - repository

## Scope
- This file applies to the whole repository unless a deeper `AGENTS.md` overrides it.

## Release And Deploy
1. Use Changesets for any code change under `packages/`: run `pnpm changeset`.
2. Keep changelog generation enabled via `.changeset/config.json` (`@changesets/changelog-git`).
3. CI enforces checks on PRs: `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
4. Merge to `main` triggers `.github/workflows/release.yml`.
5. Release workflow creates version PRs and publishes `@gbgr/*` through `changesets/action`.
6. Required secrets for publish: `NPM_TOKEN` and a valid GitHub token (`CHANGESETS_GITHUB_TOKEN` or `GITHUB_TOKEN`).
7. Changeset check bypass is allowed only when intentional: add PR label `skip-changeset` or include `[skip changeset]` in the PR title.

## Testing
1. Treat `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm build` as the required baseline verification for every PR.
2. If behavior changes, add or update automated tests in the affected package when test infrastructure exists.
3. If no test runner exists in the package, include at least one reproducible verification path in the PR description.
4. Keep test changes in the same PR as code changes; avoid follow-up test-only fixes for the same behavior.

## Manual Release
1. `pnpm install`
2. `pnpm changeset`
3. `pnpm changeset:version`
4. `pnpm build`
5. `pnpm changeset:publish`
