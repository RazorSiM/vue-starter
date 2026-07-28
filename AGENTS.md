# AGENTS.md

A Vite + Vue 3 starter template, deployed to Cloudflare Workers at
[vue-starter.raz.wtf](https://vue-starter.raz.wtf). It is a template, so the code is meant to be read
as an example: prefer clarity and an explanatory comment over cleverness.

`README.md` and `docs/reference.md` are the human-facing docs — and both are also **rendered as pages
of the app**, so editing them changes the deployed site. Keep them in sync when you change behaviour
they describe.

`CLAUDE.md` is a symlink to this file. Edit `AGENTS.md`; never replace the symlink with a copy.

## Setup commands

Requires **Node 26** (see `.nvmrc`) and **pnpm 11**. `engines.node` is `>=26.0.0`, which pnpm enforces
as a hard install failure.

```sh
pnpm install       # deps + git hooks (prepare -> lefthook install)
pnpm dev           # dev server on :5173
pnpm build         # vue-tsc --build && vite build
pnpm build-only    # vite build, no type-check
pnpm preview       # production build on :4173
```

## Verify your work

Run these before you consider a task finished. `pnpm check` is the single gate that CI and the
`pre-push` hook both use:

```sh
pnpm check         # lint + format:check + type-check  <- the one to run
pnpm test          # unit tests (vitest run)
pnpm test:e2e      # playwright; run `pnpm exec playwright install` once first
```

Individually: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check`, `pnpm type-check`,
`pnpm test:watch`.

If you touched routes, components or composables, also confirm the generated declarations are current
— CI fails on a diff here:

```sh
git diff --exit-code -- auto-imports.d.ts components.d.ts src/typed-router.d.ts
```

E2E runs against the dev server locally and against `vite preview` under CI. To reproduce the CI
path, build first:

```sh
pnpm build && CI=1 pnpm test:e2e
```

## Architecture

```
src/
  main.ts            entry: Pinia, Vue Query, Unhead, and `await startMockApi()` before mount
  App.vue            resolves the layout via import.meta.glob on route.meta.layout
  pages/             file-based routes (.vue only)
  layouts/           DefaultLayout (app chrome), EmptyLayout (bare)
  components/        auto-imported; Demo/ and Ui/ are namespaced by directory
  composables/       auto-imported by name, no import line needed
  schemas/           zod schemas — the single source of truth per resource
  api/               fetch + zod parse; the only place that knows about the network
  mocks/             MSW: handlers.ts, db.ts, browser.ts (worker), node.ts (setupServer)
  stores/            Pinia
  test/setup.ts      starts the MSW node server for every unit suite
docs/reference.md    the /docs page
```

The `/demo` page is one resource — a members list — deliberately wired through the whole stack:

```
schemas/member.ts -> mocks/handlers.ts -> api/members.ts -> composables/useMembers.ts -> components/Demo/
   contract              the API            the boundary          the state                  the UI
```

Preserve that direction when you extend it. Specifically:

- **Parse at the boundary, never cast.** `api/members.ts` runs `memberListSchema.parse()` on every
  response so a renamed backend field fails loudly in one file.
- **Mutations invalidate, they do not patch the cache.** `useMembers()` invalidates the `['members']`
  key and refetches, because the server owns `id`, `commits` and `joinedAt`.
- **Components never see a query key or a `fetch`.** `MemberForm` emits a validated value; that is why
  it unit-tests without a server.
- **One zod schema does three jobs** — validates the form, parses the response, infers the types. Add
  a field in `src/schemas/` and nowhere else.

## Code style

Formatting is **oxfmt**, not Prettier, configured in `.oxfmtrc.json`. Do not hand-format; run
`pnpm format`. The settings that matter: no semicolons, single quotes, trailing commas, 100-column
print width, 2-space indent, LF endings. Imports are sorted by oxfmt (`sortImports`) — leave the
order alone.

Linting is **oxlint** (`.oxlintrc.json`), with Vue `<template>` rules from `oxlint-plugin-vize`. There
is no ESLint and no Prettier in this repo; do not add them, and do not add config for them.

Vue conventions:

- **Composition API with `<script setup lang="ts">`**, always. No Options API, no plain `<script>`.
- **`definePage({ meta: { layout, title, description } })`** in every page component — `App.vue` reads
  `meta.layout` and `useSeoMeta` reads the other two.
- **Typed refs are enforced** (`vue/require-typed-ref`), as is `vue/prefer-import-from-vue`.
- **No `v-html`** (`vize/vue/no-v-html` is an error).
- **Do not add import lines for auto-imported things**: Vue, Vue Router, Pinia and VueUse APIs,
  everything in `src/composables/`, every component under `src/components/`, and every Reka UI
  primitive all resolve by name. `vue/no-import-compiler-macros` will flag importing the macros.
- **Style Reka UI primitives with `data-[state=…]` variants**, not a ternary over your own state — the
  primitive already tracks checked/open/closed and exposes it as an attribute.
- **Do not reach for a primitive where the platform is already correct.** Plain `<input>` with
  `<label for>` and a real checkbox are the right answer in `MemberForm`; Reka UI is there for roving
  focus, focus trapping, ARIA wiring and Escape handling.
- **UnoCSS utility classes**, with `transformerVariantGroup` available: write
  `dark:(bg-gray-900 text-gray-50)`. Icons are classes: `<div class="i-lucide-house" />`, Lucide only.
  There is no class-order lint, so match the surrounding files by hand.

## Testing

- Unit tests live at `src/**/*.spec.ts` and run under Vitest in jsdom. `src/test/setup.ts` starts the
  MSW node server with `onUnhandledRequest: 'error'` and resets the in-memory db between tests — the
  db is module state that would otherwise leak one test's POST into the next test's GET.
- E2E tests live at `e2e/*.spec.ts` and drive the real service worker in a real browser via Playwright.
- **Both layers share `src/mocks/handlers.ts`.** Add a handler there and both see it.
- Add or update tests for what you change. Assert accessible semantics (roles, accessible
  descriptions, focus) rather than CSS classes — that is what the existing e2e specs do, and it is the
  point of the Reka UI conversions.

## Traps

These have each cost real time. Do not undo them.

1. **`node_modules` must NOT be added to `ignorePatterns` in `.oxlintrc.json`.** The `oxlint-vize`
   wrapper stages temporary copies of scriptless SFCs under `node_modules/.vize/`; ignoring that path
   silently disables every template rule while still exiting 0.
2. **`pnpm lint` runs `oxlint-vize`, not `oxlint`.** Plain `oxlint` silently skips `.vue` files with
   no `<script>` block, and two components here are scriptless. `pnpm lint:fix` stays on plain
   `oxlint` because the wrapper cannot write fixes back yet.
3. **MSW handler paths are written `*/api/members`, not `/api/members`.** A bare relative path
   resolves against `document.baseURI`, which does not exist under Node, and the same handlers must
   match in the browser, in Vitest and in Playwright.
4. **MSW runs in production too.** `/demo` has no backend, so a dev-only mock would leave the deployed
   page permanently erroring. `src/main.ts` must keep `await`ing `worker.start()` before mounting, or
   the first query races the worker and gets a real 404.
5. **`public/mockServiceWorker.js` is generated and committed.** Regenerate with
   `pnpm exec msw init public --save` after an msw upgrade; never hand-edit it.
6. **A new tsconfig must be added to `references` in `tsconfig.json`.** `vue-tsc --build` silently
   skips projects that are not listed — that is how the e2e suite went unchecked for a while.
7. **`auto-imports.d.ts`, `components.d.ts` and `src/typed-router.d.ts` are committed.** A fresh clone
   must type-check before anything has been run. Commit the regenerated files with your change.
8. **Deploy scripts are `cf:`-prefixed, and invoked as `pnpm run cf:deploy`.** Never rename them to a
   bare `deploy`: `pnpm deploy` is a built-in pnpm command for workspace pruning and would shadow the
   script silently.
9. **`@playwright/test` is pinned exactly, no caret.** The NixOS dev shell points
   `PLAYWRIGHT_BROWSERS_PATH` at the nixpkgs browser bundle, whose revisions are matched per
   Playwright release. Bump it only together with `pkgs.playwright-driver` in `devenv.nix`.
10. **`vueDevTools` and `TurboConsole` are skipped under Vitest** in `vite.config.ts`. They hold
    handles open that add a 10s "close timed out" stall to every `vitest run`.
11. **Markdown headings have no `id`s.** No anchor plugin is configured, so `#section` deep links into
    `/docs` will not scroll. Link to the page and name the section in the link text.

## Commits and pull requests

Commits are **[conventional commits](https://www.conventionalcommits.org)** — the changelog is
generated from them by changelogen, and a non-conventional message is **skipped entirely**, so the
change will not appear in any release.

- `feat:` bumps the minor, `fix:`/`perf:`/`refactor:`/`docs:`/`build:` the patch, `!` or
  `BREAKING CHANGE:` the major.
- `chore(deps): …` is dropped from the changelog unless breaking.
- Run `pnpm check` and `pnpm test` before committing. `pre-commit` fixes and formats staged files;
  `pre-push` runs the full lint + format + type-check.
- `main` is protected — land changes through a pull request.

Do not bump the version or edit `CHANGELOG.md` by hand; releases are cut by changelogen (`pnpm release`
locally, or the **Release** workflow, which opens a `release/vX.Y.Z` PR to be merged). Nothing is ever
published to npm — `package.json` is `private: true`.

## Deployment

`wrangler.jsonc` is an assets-only Cloudflare Worker: no `main`, so no Worker code runs and Cloudflare
serves `dist/` from its edge. `not_found_handling: "single-page-application"` is load-bearing —
vue-router is in history mode, so without it a hard refresh on `/demo` returns a 404. Real files still
win, which is what keeps `/mockServiceWorker.js` working.

CI deploys every push to `main` from the `deploy` job in `.github/workflows/ci.yml`, gated behind
`needs: ci`. A fork without `CLOUDFLARE_API_TOKEN` logs a notice and exits green rather than turning
`main` red — keep that behaviour if you touch the workflow.

Adding a `"main"` entry to `wrangler.jsonc` turns this into a full Worker with the same assets in front
of it, so a server-side API route later is a config change rather than a migration.

## Further reading

`docs/reference.md` (the [/docs](https://vue-starter.raz.wtf/docs) page) explains the reasoning behind
all of the above, plus the bundle costs of Reka UI and MSW, the full lint coverage ledger, and the
release and Cloudflare setup in detail.
