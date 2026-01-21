# @gbgr/react

This package contains React components and hooks for the GBGR Design System.

## Development Guidelines

### Do not import Token JSON directly

Components and hooks in this package should not directly import `tokens.json` or any derived JSON token files. Instead, consume design tokens through CSS variables (e.g., `var(--gbgr-color-primary)`) to maintain consistency and leverage the theming capabilities provided by the `@gbgr/tokens` package.
