# @gbgr/icons

This package provides a set of SVG icons as React components for the GBGR Design System.

## Installation

```bash
pnpm add @gbgr/icons
# or
npm install @gbgr/icons
# or
yarn add @gbgr/icons
```

## Usage

You can import and use any icon component directly:

```jsx
import { HomeIcon } from '@gbgr/icons';

function MyComponent() {
  return <HomeIcon width={24} height={24} />;
}
```

Each icon is a standard React component that accepts `SVGProps<SVGSVGElement>` props, allowing you to customize its size, color, and other SVG attributes.
