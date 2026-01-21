# @gbgr/css

This package provides global CSS styles, including a reset and design tokens in CSS variables, for the GBGR Design System.

## Installation

```bash
pnpm add @gbgr/css
# or
npm install @gbgr/css
# or
yarn add @gbgr/css
```

## Usage

Import the main CSS file into your application's entry point (e.g., `_app.tsx` in Next.js, or `main.ts` in Vite):

```javascript
// In your application's entry file
import '@gbgr/css';
```

This will apply the CSS reset and make all design tokens available as CSS variables (e.g., `var(--gbgr-color-primary)`) throughout your application.
