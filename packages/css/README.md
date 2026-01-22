# @gbgr/css

GBGR Design System을 위한 전역 CSS 스타일을 제공하는 패키지입니다. CSS Reset과 디자인 토큰(CSS 변수)을 포함합니다.

## 설치

```bash
pnpm add @gbgr/css
# 또는
npm install @gbgr/css
# 또는
yarn add @gbgr/css
```

## 사용법

애플리케이션의 진입점 파일에서 메인 CSS 파일을 import하세요 (예: Next.js의 `_app.tsx` 또는 Vite의 `main.ts`):

```javascript
// 애플리케이션의 진입점 파일에서
import '@gbgr/css';
```

이렇게 하면 CSS Reset이 적용되고, 모든 디자인 토큰이 CSS 변수로 사용 가능해집니다 (예: `var(--color-semantic-brand-primary)`).

## 언제 사용하나요?

- **새 프로젝트를 시작할 때**: Reset과 Tokens를 한 번에 적용하고 싶을 때
- **CSS Reset이 필요한 경우**: 브라우저 기본 스타일을 리셋하고 싶을 때
- **간단하게 시작하고 싶을 때**: 최소한의 설정으로 디자인 시스템을 적용하고 싶을 때

대부분의 애플리케이션에서는 이 패키지를 사용하는 것을 권장합니다. 특수한 요구사항이 있는 경우에만 `@gbgr/tokens`를 직접 사용하세요.
