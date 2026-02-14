## Docs (Design System)

디자인 시스템 문서 사이트는 `apps/docs`(Docusaurus) 입니다.

```bash
pnpm --filter docs dev
```

기본 포트: `http://localhost:3100`

## Release (npm)

이 레포는 Changesets 기반으로 `@gbgr/*` 패키지를 배포합니다.

- 운영 전략 문서: [`RELEASE_STRATEGY.md`](./RELEASE_STRATEGY.md)

### PR 규칙

- `packages/` 하위에 코드 변경이 있으면 Changeset을 추가하세요: `pnpm changeset`
- 예외가 필요하면 PR label `skip-changeset` 또는 제목에 `[skip changeset]`

### 수동 배포

```bash
pnpm install
pnpm changeset
pnpm changeset:version
pnpm build
pnpm changeset:publish
```

### 자동 배포 (GitHub Actions)

- `main`에 머지되면 Release workflow가 버전 PR 생성/퍼블리시를 처리합니다.
- 버전 PR 생성 시 각 패키지 `CHANGELOG.md`가 자동 갱신됩니다.
- `NPM_TOKEN` secret이 필요합니다.
