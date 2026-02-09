# @gbgr/ui

GBGR Design System을 앱에서 “한 번에” 쓰기 위한 통합 패키지입니다.

## 설치

```bash
pnpm add @gbgr/ui
```

## 사용법

### 1) 전역 스타일(Reset + Tokens + 컴포넌트 스타일) 한 번에 로드

앱 진입점에서 아래 한 줄만 import 하세요:

```ts
import "@gbgr/ui/styles.css";
```

### 2) 컴포넌트/아이콘 사용

```tsx
import { Button } from "@gbgr/ui";
import { HomeIcon } from "@gbgr/ui";

export function Example() {
	return (
		<>
			<Button tone="primary">Save</Button>
			<HomeIcon width={24} height={24} />
		</>
	);
}
```
