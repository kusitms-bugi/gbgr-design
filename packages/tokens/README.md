# @gbgr/tokens

GBGR Design System의 디자인 토큰을 제공하는 패키지입니다. JSON, CSS 변수, TypeScript 타입 형식으로 사용할 수 있습니다.

## 설치

```bash
pnpm add @gbgr/tokens
# 또는
npm install @gbgr/tokens
# 또는
yarn add @gbgr/tokens
```

## 사용법

### CSS 변수

생성된 `theme.css`를 import하여 디자인 토큰을 CSS 변수로 사용할 수 있습니다:

```javascript
// 애플리케이션의 진입점 파일 또는 전역 CSS 파일에서
import '@gbgr/tokens/theme.css';
```

그리고 CSS에서 다음과 같이 사용할 수 있습니다:

```css
.my-component {
  color: var(--color-semantic-brand-primary);
  margin-top: var(--spacing-4);
}
```

### JSON

원시 디자인 토큰은 JSON 파일로 제공됩니다:

```javascript
import tokens from '@gbgr/tokens/tokens.json';
// tokens는 모든 디자인 토큰을 포함하는 객체입니다
console.log(tokens.color.semantic.brand.primary);
```

### TypeScript 타입

타입 안전성을 위해 TypeScript 선언 파일을 import할 수 있습니다:

```typescript
import type { Tokens } from '@gbgr/tokens';
// Tokens 타입을 사용하여 디자인 토큰 사용에 대한 타입 체크를 수행합니다
const myColor: Tokens['color']['semantic']['brand']['primary']['value'] = '#ffbf00';
```

## 언제 사용하나요?

- **JSON/TypeScript 타입이 필요한 경우**: 런타임에 토큰 값을 사용하거나 타입 체크가 필요할 때
- **CSS 변수만 필요한 경우**: 기존 프로젝트에 토큰만 추가하거나 자체 전역 스타일 체계를 사용하는 경우
- **특정 테마 파일만 필요한 경우**: `theme.css`, `theme.light.css`, `theme.dark.css` 등 특정 파일만 import할 때
- **다른 패키지에서 내부적으로 사용**: 컴포넌트 라이브러리 개발 시 내부적으로 토큰 값을 참조해야 할 때
