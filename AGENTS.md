# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## What this is

`humanize-key` is a tiny (single-file) published TypeScript utility: `src/humanizeKey.ts` exports `humanizeKey` (default + named) and the `makeHumanizeKey` factory for custom acronyms/uniques. The public API and its behavior are contract — treat any behavior change as breaking.

## Toolchain (aligned with the `structuralists/scaffolding` standard)

- **Runtime / package manager: bun.** Single lockfile `bun.lock`; install with `bun install --frozen-lockfile`. No pnpm/npm lockfiles.
- **Tests: `bun test`** (`bun:test` API). Specs live in `test/`. Coverage is enforced via `bunfig.toml` (`coverageThreshold = 0.95`, currently 100% funcs/lines).
- **TypeScript 6** (`tsc --noEmit` for typecheck only). `tsconfig.json` sets `ignoreDeprecations: "6.0"` — required because tsup's dts generator emits a deprecated `baseUrl` under TS 6.
- **Lint: eslint 10 flat config** (`eslint.config.mjs`), scoped to `src/**/*.ts`. Only `@typescript-eslint/parser` is installed (no plugin rulesets), matching scaffolding. It enables a few core rules (`no-var`, `prefer-const`, `eqeqeq` smart) and turns `no-undef` off: it false-positives on TS type syntax (e.g. named params in a function-type alias) — unused/undefined checks are deferred to `tsc`.

## Build & publish

- **Build: tsup** (`tsup.config.ts`, `bun run build`) emits exactly the three files the exports map points at: `dist/humanizeKey.js` (CJS `main`), `dist/humanizeKey.mjs` (ESM `module`), `dist/humanizeKey.d.ts` (`types`). `dist/` is gitignored; `package.json` `files` ships only `dist`. Do not change `main`/`module`/`types` — downstream consumers import them.
- **Publish: `.github/workflows/publish.yml`** mirrors scaffolding's release job: conventional-commit version bump on merge, `npm version` + atomic push + `npm publish`, guard/recover machinery, GitHub release. Adapted here to trigger on **`master`** (this repo's default branch) and to run `bun run build` before publish on both the normal and recovery paths (recovery must rebuild `dist` from the tagged source).
- CI (`.github/workflows/ci.yml`) runs `typecheck` + `lint` + `test` + `build` on every PR.

## Sharp edges in `humanizeKey` behavior (characterized in `test/`)

- **Delimiter precedence:** if a key contains `-`, only the kebab path runs; underscores are left intact (and `_` is a word char, so no capitalization boundary). `-` before `_` wins.
- **Negative numbers** stringify then hit the kebab path, so the leading `-` is dropped: `humanizeKey(-5) === '5'`.
- **Non-finite numbers** (`Infinity`, `NaN`) and non-string/non-number inputs coerce to `''`.
- **Only spaces are compacted** — tabs/newlines are trimmed at the ends but preserved interior.
- **Non-ASCII letters** create spurious word breaks (`\b\w` treats them as non-word), e.g. `münchen` -> `MüNchen`. Known limitation, locked by tests.
- Results are memoized per formatter instance; each `makeHumanizeKey()` gets its own cache and acronym/unique set.
