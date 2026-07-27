# Vue 3 Starter

A comprehensive Vite + Vue 3 template, [deployed here](https://vue-starter-razorsim.vercel.app/).
Requires **Node 26** and **pnpm 11**.

```sh
npx degit RazorSiM/vue-starter
pnpm install
```

## What's Included

A modern Vue 3 stack wired together and verified end to end: Vite 8, file-based routing,
UnoCSS with the Tailwind-v4-aligned engine, and the Rust-based oxc toolchain for linting and
formatting.

### Features

- **[Vue 3](https://vuejs.org)** (3.5) — the progressive JavaScript framework.
- **[Vite 8](https://vite.dev)** — Rolldown bundler with Oxc-powered transforms.
- **[Vue Router 5](https://router.vuejs.org)** with **file-based routing**. Pages live in
  `src/pages/`, per-route metadata is declared with the `definePage()` macro, and fully typed
  routes are generated into `src/typed-router.d.ts`. The file conventions:

  | file               | route                                              |
  | ------------------ | -------------------------------------------------- |
  | `index.vue`        | `/`                                                |
  | `about.vue`        | `/about`                                           |
  | `[id].vue`         | `/:id`                                             |
  | `[[id]].vue`       | `/:id?` (optional param)                           |
  | `[...path].vue`    | `/:path(.*)` (404 catch-all)                       |
  | `(group)/foo.vue`  | `/foo` (folder stripped from the URL)              |
  | `users.create.vue` | `/users/create` (dot nesting, no nested component) |

  The route-building plugin now ships inside `vue-router` itself — `unplugin-vue-router` is no
  longer a separate dependency.

- **[Pinia 4](https://pinia.vuejs.org)** — state management.
- **[VueUse 14](https://vueuse.org)** — essential composition utilities.
- **[Unhead 3](https://unhead.unjs.io)** — SEO and page metadata.
- **[UnoCSS 66](https://unocss.dev)** — instant atomic CSS.
  - **[@unocss/preset-wind4](https://unocss.dev/presets/wind4)**: the Tailwind-v4-aligned engine
    (oklch colours, CSS-variable theme). Its reset is built in via `preflights.reset`, so no
    separate `@unocss/reset` package is needed.
  - **[@unocss/preset-icons](https://unocss.dev/presets/icons)**: pure-CSS icons.
  - **[@unocss/preset-web-fonts](https://unocss.dev/presets/web-fonts)**: Inter + Fira Code.
  - **[@unocss/transformer-variant-group](https://unocss.dev/transformers/variant-group)**: write
    `dark:(bg-gray-900 text-gray-50)` instead of repeating the variant.
- **Icons: [Lucide](https://lucide.dev)** via `@iconify-json/lucide` — use them as plain classes,
  e.g. `<div class="i-lucide-house" />`. Only the Lucide collection is installed (574 KB) rather
  than the full `@iconify/json` (439 MB). Browse the set at [icones.js.org](https://icones.js.org).
- **Multi-layout support** — `src/App.vue` resolves layouts with an `import.meta.glob` lookup keyed
  by `route.meta.layout`, so adding `src/layouts/Foo.vue` is all it takes. No extra dependency.
  `DefaultLayout` supplies the app chrome; `EmptyLayout` is deliberately bare. The
  [/about](https://vue-starter-razorsim.vercel.app/about) page is a live demo — switch layouts and
  watch the header appear and disappear, backed by the `useLayout()` composable.
- **Markdown Vue components** via
  [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown) — this README is
  itself rendered as the homepage.
- **[Shiki](https://shiki.style)** — dual-theme Markdown syntax highlighting.

### Development Experience

- **TypeScript 6** with full `.vue` support through `vue-tsc`. `tsconfig.json` is a solution file
  referencing three projects, and `pnpm type-check` builds all of them: `tsconfig.app.json`
  (`src/`, including unit specs), `tsconfig.node.json` (the root `*.config.ts` files) and
  `e2e/tsconfig.json` (the Playwright suite). A project missing from `references` is silently
  skipped by `vue-tsc --build`, which is exactly how the e2e suite went unchecked for a while.
- **[oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter)**
  — the Rust-based oxc toolchain, configured in `.oxlintrc.json` and `.oxfmtrc.json`. No ESLint,
  no Prettier. Vue `<template>` rules come from
  [Vize](https://github.com/ubugeeei-prod/vize) via `oxlint-plugin-vize` — see
  [Linting & formatting](#linting--formatting).
- **[Lefthook 2](https://github.com/evilmartians/lefthook)** — git hooks. `pre-commit` lints and
  formats staged files; `pre-push` runs the full lint + format + type-check.
- **[changelogen](https://github.com/unjs/changelogen)** — version bump, `CHANGELOG.md` and the
  GitHub release, all derived from conventional commits. See [Releases](#releases).
- **[devenv](https://devenv.sh)** — a reproducible Nix dev shell pinning Node, pnpm and the
  Playwright browsers. Entirely optional; see [Requirements](#requirements).
- **Auto-imports** — [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) for
  composables and [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)
  for components.
- **[unplugin-turbo-console](https://github.com/unplugin/unplugin-turbo-console)** and
  **[vite-plugin-vue-devtools](https://github.com/vuejs/devtools-next)** for debugging.
- **VS Code integration** — format-on-save and `source.fixAll.oxc` via the `oxc.oxc-vscode`
  extension. The ESLint and Prettier extensions are listed under `unwantedRecommendations`.

## Linting & formatting

The honest ledger of what is and isn't covered:

| Target                                       | Linted                                                                               | Formatted |
| -------------------------------------------- | ------------------------------------------------------------------------------------ | --------- |
| `.ts` / `.js`                                | eslint core, typescript, unicorn, oxc, import, promise, node — plus type-aware rules | yes       |
| `.vue` `<script setup>`                      | full JS/TS rules + oxlint's native `vue` plugin                                      | yes       |
| `.vue` `<template>`                          | `vize/*` rules via `oxlint-plugin-vize`                                              | yes       |
| `*.spec.ts`                                  | oxlint's native `vitest` plugin                                                      | yes       |
| `e2e/*.spec.ts`                              | oxlint core rules                                                                    | yes       |
| `.md` / `.json` / `.yaml` / `.css` / `.html` | no                                                                                   | yes       |

Vue template linting comes from [Vize](https://github.com/ubugeeei-prod/vize), a Rust Vue toolchain,
bridged into oxlint as `vize/*` rules. `eslint-plugin-vue` cannot be ported to oxlint — it depends on
`vue-eslint-parser` and its own AST — so this is the route to `v-for` key checks, `v-html` warnings,
unused-component detection and a11y rules without bringing ESLint back.

Five things worth knowing about the setup:

1. **`pnpm lint` runs `oxlint-vize`, not `oxlint`.** Plain `oxlint` silently skips `.vue` files that
   have no `<script>` block — two of this template's components are scriptless, so 25% of the
   components would appear linted while not being linted at all. The wrapper works around it.
2. **`pnpm lint:fix` stays on plain `oxlint`.** The wrapper cannot write fixes back yet
   ("fixes are not applied back to original files yet"), so autofix uses oxlint directly.
3. **`node_modules` must NOT be added to `ignorePatterns` in `.oxlintrc.json`.** The wrapper stages
   temporary copies of scriptless SFCs under `node_modules/.vize/`, and ignoring that path silently
   disables every template rule while still exiting 0. oxlint already skips `node_modules` by
   default and respects `.gitignore`, so the entry is unnecessary as well as harmful.
4. **`settings.vize.preset` is `"incremental"`.** Every other preset gates rules by bundle
   membership and will keep explicitly-listed rules quiet. `incremental` runs exactly the
   `vize/*` rules enumerated in `.oxlintrc.json` and nothing else.
5. **`pnpm lint` passes `--type-aware`**, which turns on rules needing type information —
   `no-floating-promises`, `await-thenable`, `no-misused-promises` and ~20 more. This requires the
   `oxlint-tsgolint` package (a native binary, exact-pinned) and costs about 0.2s here. Note it
   covers `.ts`/`.js` only, not `.vue` SFCs. The pre-commit hook deliberately runs plain `oxlint`
   for speed; type-aware runs on pre-push and in CI.

Two gaps remain:

- **`no-unused-vars` is still inert inside `<script setup>`** — oxlint cannot see template usage, so
  it cannot distinguish a template-consumed ref from a dead one (tracked upstream in
  [oxc#15761](https://github.com/oxc-project/oxc/issues/15761)). `noUnusedLocals` and
  `noUnusedParameters` in `tsconfig.app.json` mean `pnpm type-check` catches it instead.
- **No UnoCSS class ordering or validation.** `@unocss/eslint-plugin` needs a Vue template AST.
  `presetIcons({ warn: true })` at least surfaces typo'd icon names at build time.

`oxlint-plugin-vize` is pre-1.0 and ships a native binary requiring **glibc 2.39+** (Ubuntu 24.04+,
Debian 13+). To remove it: delete the `jsPlugins`, `settings` and `vize/*` rule entries from
`.oxlintrc.json`, drop the `oxlint-vize` job from `lefthook.yaml`, and set `"lint": "oxlint ."`.
Everything else keeps working.

## Requirements

- **Node 26** (see `.nvmrc`) and **pnpm 11**.
- Note that **Node 26 is the Current channel, not LTS** — it enters LTS in October 2026, and Node 24
  "Krypton" is today's Active LTS. `engines.node` is set to `>=26.0.0`, which pnpm enforces as a
  hard install failure. If you fork this for production on an LTS line, relax that field.

### Optional: reproducible shell with Nix

If you have [devenv](https://devenv.sh) and [direnv](https://direnv.net):

```sh
direnv allow    # or: devenv shell
```

This pins Node 26.5.0, pnpm 11.15.0 and the Playwright browsers from nixpkgs. `devenv.nix`,
`devenv.yaml` and `.envrc` are inert for everyone else — without Nix installed, `pnpm install`
works exactly as normal.

Two Nix-specific notes:

- Playwright's own downloaded browsers are linked against FHS paths that don't exist on NixOS, so
  the shell points `PLAYWRIGHT_BROWSERS_PATH` at the nixpkgs bundle instead. Browser revisions are
  matched per Playwright release, which is why **`@playwright/test` is pinned exactly** (no caret)
  to whatever `pkgs.playwright-driver` provides. `enterShell` warns if the two drift apart. On CI
  neither variable is set and `playwright install --with-deps` behaves normally.
- Node 26 no longer bundles corepack, so pnpm comes from nixpkgs. Keep `packageManager` in
  `package.json` aligned with it, or pnpm's own version self-check will download a different pnpm
  inside the shell.

## Recommended IDE Setup

- **[VS Code](https://code.visualstudio.com)**
- **[Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)**
- **[oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)**

**Disable the ESLint and Prettier extensions for this workspace** — they will double-format.

## Project Setup

```sh
pnpm install       # installs deps and git hooks (prepare -> lefthook install)
pnpm dev           # dev server on :5173
pnpm build         # vue-tsc --build && vite build
pnpm preview       # preview the production build on :4173
pnpm test          # unit tests (vitest run)
pnpm test:watch    # unit tests in watch mode
pnpm test:e2e      # playwright (run `pnpm exec playwright install` once first)
pnpm lint          # oxlint
pnpm lint:fix      # oxlint --fix
pnpm format        # oxfmt
pnpm check         # lint + format:check + type-check
pnpm changelog     # preview the unreleased changelog (writes nothing)
pnpm release       # bump + changelog + commit + tag + push + GitHub release
```

End-to-end tests run against the Vite dev server locally for a fast feedback loop. CI builds first
and tests the preview server:

```sh
pnpm build
CI=1 pnpm test:e2e
```

## Releases

Releases are cut with [changelogen](https://github.com/unjs/changelogen) from
[conventional commits](https://www.conventionalcommits.org). Configuration lives in
`changelog.config.ts`, and it is deliberately almost empty — changelogen's defaults already
produce the format this `CHANGELOG.md` has used since v3.0.0.

```sh
pnpm changelog     # what would the next entry look like? Prints to stdout, writes nothing.
pnpm release       # cut it
```

`pnpm release` runs `changelogen --release --clean --push`, which:

1. refuses to start if the working tree is dirty (`--clean`);
2. derives the next version from the commits since the last tag — `feat:` bumps the minor,
   `fix:`/`perf:`/`refactor:`/`docs:`/`build:` the patch, a `!` or `BREAKING CHANGE:` the major —
   and writes it to `package.json`;
3. prepends the new section to `CHANGELOG.md`, which the
   [/changelog](https://vue-starter-razorsim.vercel.app/changelog) page renders as-is;
4. commits `chore(release): vX.Y.Z`, creates an annotated `vX.Y.Z` tag, and pushes both
   (`git push --follow-tags`);
5. creates the matching GitHub release.

Override the computed bump by appending the level: `pnpm release --major`.

Step 5 needs a GitHub token, looked up in this order: `CHANGELOGEN_TOKENS_GITHUB`, `GITHUB_TOKEN`,
`GH_TOKEN`, then the [`gh` CLI](https://cli.github.com) config. With none of them, the first four
steps still happen and changelogen prints a pre-filled "create release" URL to open by hand.

The push in step 4 goes through lefthook's `pre-push` hook, so lint, format and type-check run
before anything reaches the remote. Nothing is ever published to npm — `package.json` is
`private: true`.

### Releasing from GitHub

`.github/workflows/release.yml` does the same thing on a runner: **Actions → Release → Run
workflow**, with a `bump` input of `auto` (default), `patch`, `minor` or `major`. It runs
`pnpm check` and the unit tests first, then releases using the built-in `GITHUB_TOKEN` — so no
token is needed locally. The workflow needs permission to push to `main`; if `main` is protected,
either allow the `github-actions[bot]` actor or stick to the local `pnpm release`.

Two conventions worth keeping, since the changelog is only as good as the commits:

- **`chore(deps): …` commits are dropped** from the changelog by changelogen unless they are
  breaking. Dependabot/Renovate noise stays out on its own.
- **Non-conventional commit messages are skipped entirely.** A change committed as
  `fixed the thing` will not appear in any release.

## Customize Configuration

See the [Vite Configuration Reference](https://vite.dev/config/).
