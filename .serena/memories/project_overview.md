# GBGR Design System

## Purpose
Korean design system (거북이 온앤온 🐢) providing reusable UI components with Figma-based workflow.

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom CSS with CSS variables
- **Components**: React (headless + styled pattern)
- **Docs**: Docusaurus
- **Tokens**: Style Dictionary + tokens-studio.json (Figma Tokens format)
- **Linting**: Biome
- **Testing**: Vitest
- **Versioning**: Changesets

## Monorepo Structure
```
apps/docs/           - Docusaurus documentation
packages/css/        - CSS utilities and base styles
packages/icons/      - SVGR icon components
packages/react/      - React component implementations
packages/react-headless/ - Headless UI hooks
packages/tokens/     - Design tokens
packages/ui/         - Main UI wrapper package
```

## Component Pattern
- `@gbgr/react-headless`: hooks (useButton, useCheckbox, etc.)
- `@gbgr/react`: full components using headless hooks + CSS
- `@gbgr/ui`: re-exports from react + icons
- Each component: Component.tsx + Component.css

## Key Commands
- `pnpm build` - Build all
- `pnpm dev` - Start dev servers
- `pnpm test` - Run tests
- `pnpm lint` / `pnpm check` - Biome lint/format
- `pnpm typecheck` - TypeScript checking

## CSS Conventions
- BEM-like: `.gbgr-button`, `.gbgr-button--tone-primary`
- CSS variables from tokens: `--color-component-button-*`
- State modifiers: `:hover`, `:active`, `[data-state]`
