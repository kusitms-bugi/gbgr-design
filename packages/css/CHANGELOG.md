# @gbgr/css

## 1.0.0

### Major Changes

- Remove automatic CSS reset import from `@gbgr/css` and ship test/tooling updates across packages.

  - `@gbgr/css`: stop applying reset styles by default and remove `reset.css`.
  - `@gbgr/react`, `@gbgr/react-headless`, `@gbgr/ui`: add Vitest-based test scripts and source-colocated tests.
  - `@gbgr/react-headless`, `@gbgr/icons`: clean up `exports` conditions to remove unused `default` mapping warnings.

### Patch Changes

- Updated dependencies [bb5e86e]
  - @gbgr/tokens@0.0.2

## Unreleased
