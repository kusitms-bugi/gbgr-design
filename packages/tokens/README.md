# @gbgr/tokens

This package provides design tokens for the GBGR Design System, available as JSON, CSS variables, and TypeScript types.

## Installation

```bash
pnpm add @gbgr/tokens
# or
npm install @gbgr/tokens
# or
yarn add @gbgr/tokens
```

## Usage

### CSS Variables

You can import the generated `theme.css` to use design tokens as CSS variables in your project:

```javascript
// In your application's entry file or a global CSS file
import '@gbgr/tokens/theme.css';
```

Then you can use them in your CSS:

```css
.my-component {
  color: var(--gbgr-color-primary);
  margin-top: var(--gbgr-space-medium);
}
```

### JSON

The raw design tokens are available as a JSON file:

```javascript
import tokens from '@gbgr/tokens/tokens.json';
// tokens will be an object containing all design tokens
console.log(tokens.color.primary.value);
```

### TypeScript Types

TypeScript declaration file for tokens can be imported for type safety:

```typescript
import type { Tokens } from '@gbgr/tokens/tokens.d.ts';
// Use the Tokens type for type checking your design token usage
const myColor: Tokens['color']['primary']['value'] = '#007bff';
```
