# Suggested Commands

## Development
- `pnpm dev` - Start all dev servers
- `pnpm --filter docs dev` - Start docs site only

## Build
- `pnpm build` - Build all packages and docs
- `pnpm --filter @gbgr/tokens build` - Build tokens only
- `pnpm --filter @gbgr/react build` - Build react only

## Test
- `pnpm test` - Run all tests
- `pnpm --filter @gbgr/react test` - Run package-specific tests

## Code Quality
- `pnpm lint` - Run Biome linting
- `pnpm check` - Biome check + React rules validation
- `pnpm check:write` - Auto-format with Biome
- `pnpm typecheck` - TypeScript type checking

## Tokens
- `pnpm --filter @gbgr/tokens build` - Rebuild tokens from tokens-studio.json

## System Utilities (Darwin)
- `git status`, `git log`, `git diff`
- `ls`, `cat`, `grep`, `find`
- `pnpm <command>` for all package management
