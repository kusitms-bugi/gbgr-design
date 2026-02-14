# Release Strategy

이 문서는 `@gbgr/*` 패키지 릴리즈 운영 전략을 정리합니다.
현재 레포의 Changesets + GitHub Actions 흐름을 기준으로 작성되었습니다.

## 목표

- 안정성: 배포 실패/회귀를 줄인다.
- 예측 가능성: 팀이 같은 리듬으로 릴리즈한다.
- 속도: 긴급 이슈는 빠르게 핫픽스로 처리한다.

## 기본 운영 모델

- 기본: 주 1회 정기 릴리즈 (권장: 목요일)
- cutoff: 릴리즈 전날 저녁 이후 머지된 PR은 다음 주로 이월
- 예외: 서비스 영향 이슈는 핫픽스 릴리즈로 즉시 처리

## 릴리즈 단위(배치) 규칙

- 기본은 누적된 changeset을 한 번에 릴리즈
- 아래 변경은 단독 배치 권장
  - `@gbgr/tokens` 변경
  - `@gbgr/react-headless` 변경
  - `package.json`의 public export 경로 변경
- 그 외 patch/minor는 묶어서 배포

## 버저닝 모델(현재 레포 기준)

- 모노레포 단일 버전이 아니라 **패키지별 버전**을 사용
  - 예: `@gbgr/react`, `@gbgr/ui`, `@gbgr/css`가 각각 독립 버전
- 기준은 SemVer(`major.minor.patch`)
- 실제 버전 계산은 changeset 누적 결과로 결정
  - 같은 패키지에 여러 changeset이 있으면, 릴리즈 시 1번만 올림
  - 여러 changeset이 섞인 경우 가장 높은 bump 타입이 적용됨
    - `patch + minor` -> `minor`
    - `minor + major` -> `major`

### bump 선택 기준

- `patch`: 내부 버그 수정, 외부 API 계약 변화 없음
- `minor`: 하위 호환되는 기능 추가/옵션 추가
- `major`: 하위 호환 깨짐(기존 import/props/export 경로/동작 계약 변경)

### changeset 작성 예시

```md
---
"@gbgr/react": minor
"@gbgr/ui": minor
---

Add Checkbox component and export checkbox stylesheet entrypoint.
```

## PR/Changeset 정책

- `packages/` 하위 코드 변경 시 changeset 필수
- 예외(`skip-changeset` 라벨 또는 `[skip changeset]`): docs/비배포 변경만 허용
- 예외를 사용할 때는 PR 본문에 사유 1줄 필수

## 릴리즈 전 체크리스트

- CI 필수 통과
  - `pnpm check`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
- 릴리즈 PR 머지 직전 운영 체크
  - docs 빌드 확인 (`pnpm --filter docs build`)
  - 핵심 import smoke 확인 (`@gbgr/ui`, `@gbgr/react`, `@gbgr/css`)

## 배포 흐름

1. 기능 PR 머지 (`main`)
2. Release workflow가 version PR 생성
3. version PR 리뷰/머지
4. `changesets/action`이 publish 실행
5. 각 패키지 changelog 반영 확인

## 배포 프로세스 예시

### 1) 정기 배포(권장 기본)

```text
[월~수]
- 기능 PR 머지 (changeset 포함)

[수 저녁]
- cutoff 적용
- 다음 배포에 넣을 PR 범위 확정

[목 오전]
- Release workflow가 만든 version PR 확인
- 버전/CHANGELOG diff 리뷰

[목 오후]
- version PR 머지
- npm publish 완료 확인
```

운영 체크 명령(권장):

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm build
pnpm --filter docs build
```

### 2) 핫픽스 배포(긴급)

```text
1. hotfix 브랜치 생성
2. 최소 수정 + patch changeset 추가
3. PR 생성 후 우선 리뷰/머지
4. 생성된 version PR 즉시 머지
5. publish 결과 확인
6. 필요 시 npm deprecate로 문제 버전 차단
```

핫픽스용 changeset 예시:

```md
---
"@gbgr/react": patch
---

Fix checkbox hover state regression on Safari.
```

### 3) 수동 배포(자동 배포 실패 시)

```bash
pnpm install
pnpm changeset:version
pnpm build
pnpm changeset:publish
```

수동 배포 시 필수 확인:

- publish 대상 패키지/버전이 기대와 일치하는지
- npm에 실제로 새 버전이 올라갔는지
- 관련 태그(`@gbgr/<pkg>@<version>`)가 생성됐는지

### 4) 여러 기능이 동시에 진행될 때

- 기능 PR은 계속 `main`으로 머지
- changeset은 누적됨
- version PR 머지 시점에 누적분이 한 번에 계산되어 배포됨
- 패키지별 버전은 릴리즈당 1번만 증가(최고 bump 우선)

## 단계별 체크리스트

### A. 기능 PR 단계

- [ ] `packages/` 변경이 있으면 `pnpm changeset` 실행
- [ ] `.changeset/*.md`가 PR에 포함되었는지 확인
- [ ] 변경 패키지 기준 테스트/타입체크를 실행
- [ ] PR 설명에 사용자 영향(기능 추가/버그 수정/브레이킹 여부) 명시

### B. PR 머지 직전 단계

- [ ] CI(`pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build`) 통과 확인
- [ ] `skip-changeset` 예외 사용 시 사유가 명확한지 확인
- [ ] 릴리즈 배치 기준(cutoff 이전/이후)으로 포함 여부 확정

### C. version PR 확인 단계

- [ ] version PR이 생성/갱신되었는지 확인
- [ ] 대상 패키지 버전 bump가 기대와 일치하는지 확인
- [ ] `CHANGELOG.md` 항목이 변경 의도와 맞는지 확인
- [ ] 불필요한 파일 변경이 섞이지 않았는지 확인

### D. version PR 머지 단계

- [ ] 머지 시점에 추가 고위험 변경이 없는지 마지막 확인
- [ ] 머지 후 release workflow 실행 여부 확인
- [ ] Actions 로그에서 publish 단계 시작 확인

### E. 배포 완료 검증 단계

- [ ] npm에 대상 패키지 새 버전이 게시되었는지 확인
- [ ] 패키지 태그(`@gbgr/<pkg>@<version>`) 생성 여부 확인
- [ ] 문서/샘플 import smoke 확인 (`@gbgr/ui`, `@gbgr/react`, `@gbgr/css`)
- [ ] 배포 결과를 팀 채널/노트에 기록(버전, 시간, 포함 기능)

### F. 장애 대응 단계

- [ ] 배포 전 이슈면 version PR 닫고 수정 PR 반영
- [ ] 배포 후 이슈면 patch changeset으로 핫픽스 PR 생성
- [ ] 필요 시 `npm deprecate`로 문제 버전 차단
- [ ] 원인/재발방지 항목을 다음 릴리즈 전에 문서화

## 태그 관리 정책

- 기본 원칙: **패키지 태그를 단일 진실원(Source of Truth)으로 사용**
  - 태그 예시: `@gbgr/react@0.1.1`, `@gbgr/ui@0.0.3`
- 한 번의 릴리즈에서 여러 패키지가 함께 올라가면, 같은 릴리즈 커밋에 여러 패키지 태그가 붙을 수 있음
- `v1.2.3` 같은 레포 공통 태그는 기본 운영에서 사용하지 않음
  - 이유: 패키지별 배포 추적/롤백/변경 범위 확인이 더 정확함

### 태그 조회 명령

```bash
# 최신 태그 확인
git tag --sort=-creatordate

# 특정 커밋에 붙은 태그 확인
git log --oneline --decorate -20
```

### 배포 추적 규칙

- 배포 이슈 분석 시 우선순위
  1. 패키지 태그
  2. 해당 패키지 CHANGELOG
  3. 릴리즈 커밋(버전 PR 머지 커밋)

## 장애 대응(롤백/복구)

- 배포 전 이슈: version PR 닫고 수정 PR 반영 후 재생성
- 배포 후 이슈: 즉시 patch changeset 생성 후 재배포
- 문제 버전 차단

```bash
npm deprecate @gbgr/<package>@<version> "broken release"
```

- 자동 publish 실패 시 수동 복구

```bash
pnpm run release
```

## 월간 운영 지표(KPI)

- merge -> publish 리드타임
  - 정기: 24시간 이내
  - 핫픽스: 4시간 이내
- 릴리즈 성공률: 95% 이상
- 핫픽스 비율: 20% 미만
- skip-changeset 비율: 5% 미만
- 배포 후 48시간 내 추가 patch/deprecate 건수: 0~1건

## 운영 조정 기준

- 최근 4주 핫픽스가 3건 초과 시: 주 2회 릴리즈(예: 화/금) 검토
- 릴리즈당 변경 패키지가 4개 이상인 상태가 반복되면: 고위험/저위험 배치 분리
