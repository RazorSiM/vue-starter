# Vue 3 Starter

[![CI](https://github.com/RazorSiM/vue-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/RazorSiM/vue-starter/actions/workflows/ci.yml)
[![Deployed on Cloudflare Workers](https://img.shields.io/badge/deployed-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://vue-starter.raz.wtf)
[![Docs](https://img.shields.io/badge/docs-%2Fdocs-4FC08D?logo=vuedotjs&logoColor=white)](https://vue-starter.raz.wtf/docs)

A comprehensive Vite + Vue 3 template, [deployed here](https://vue-starter.raz.wtf/).
Requires **Node 26** and **pnpm 11**.

```sh
npx degit RazorSiM/vue-starter
pnpm install
pnpm dev
```

A modern Vue 3 stack wired together and verified end to end: Vite 8, file-based routing, UnoCSS with
the Tailwind-v4-aligned engine, accessible interaction primitives from Reka UI, and the Rust-based
oxc toolchain for linting and formatting.

This page is `README.md` itself, rendered as the homepage by
[unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown). Four other pages ship
with the template:

| page                                                | what it shows                                                        |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| [/demo](https://vue-starter.raz.wtf/demo)           | one resource wired through every data library in the stack           |
| [/layout](https://vue-starter.raz.wtf/layout)       | switching layouts at runtime, backed by the `useLayout()` composable |
| [/changelog](https://vue-starter.raz.wtf/changelog) | `CHANGELOG.md`, rendered the same way as this page                   |
| [/docs](https://vue-starter.raz.wtf/docs)           | the long-form reference: rationale, bundle costs, and the gotchas    |

Working on this repo with a coding agent? [`AGENTS.md`](AGENTS.md) is the runbook — commands,
conventions, and the traps that are not obvious from reading the code.

## What's Included

### Framework and build

| package                                        | what it does                                                                      |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| **[Vue 3.5](https://vuejs.org)**               | the progressive JavaScript framework                                              |
| **[Vite 8](https://vite.dev)**                 | Rolldown bundler with Oxc-powered transforms                                      |
| **[Vue Router 5](https://router.vuejs.org)**   | file-based routing, fully typed — the plugin now ships inside `vue-router` itself |
| **[TypeScript 6](https://typescriptlang.org)** | full `.vue` support through `vue-tsc`                                             |
| **[Unhead 3](https://unhead.unjs.io)**         | SEO and page metadata                                                             |

Pages live in `src/pages/`, per-route metadata is declared with the `definePage()` macro, and typed
routes are generated into `src/typed-router.d.ts`. The full filename → URL table is under _Routing_
in [the docs](https://vue-starter.raz.wtf/docs).

### Data and state

| package                                                                                | what it does                                                     |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **[TanStack Query 5](https://tanstack.com/query/latest/docs/framework/vue/overview)**  | server state: caching, background refetching, invalidation       |
| **[TanStack Form 1](https://tanstack.com/form/latest/docs/framework/vue/quick-start)** | form state and validation, fed directly by a zod schema          |
| **[TanStack Table 8](https://tanstack.com/table/latest/docs/framework/vue/vue-table)** | headless sorting and filtering — you write the markup            |
| **[zod 4](https://zod.dev)**                                                           | one schema per resource: validates, parses, and infers the types |
| **[Pinia 4](https://pinia.vuejs.org)**                                                 | client state, for what Query deliberately does not own           |
| **[MSW 2](https://mswjs.io)**                                                          | the API the demo talks to, in every environment                  |
| **[VueUse 14](https://vueuse.org)**                                                    | essential composition utilities                                  |

### UI and styling

| package                                | what it does                                                             |
| -------------------------------------- | ------------------------------------------------------------------------ |
| **[UnoCSS 66](https://unocss.dev)**    | instant atomic CSS, on the Tailwind-v4-aligned `preset-wind4`            |
| **[Reka UI 2](https://reka-ui.com)**   | unstyled, accessible primitives — behaviour without a single line of CSS |
| **[Lucide](https://lucide.dev)** icons | pure-CSS icons as plain classes: `<div class="i-lucide-house" />`        |
| **[Shiki](https://shiki.style)**       | dual-theme Markdown syntax highlighting                                  |

Reka UI supplies the parts that are tedious to write and easy to get subtly wrong — roving focus,
focus trapping, ARIA wiring, Escape handling. It is used in exactly four places, each replacing
markup that was actively misleading to a screen reader; the _Reka UI_ section of
[the docs](https://vue-starter.raz.wtf/docs) has the inventory and the bundle cost.

**Multi-layout support** needs no extra dependency: `src/App.vue` resolves layouts with an
`import.meta.glob` lookup keyed by `route.meta.layout`, so adding `src/layouts/Foo.vue` is all it
takes.

### Tooling

| tool                                                                                                      | what it does                                                               |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **[oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter)** | the Rust-based oxc toolchain. No ESLint, no Prettier                       |
| **[Vize](https://github.com/ubugeeei-prod/vize)**                                                         | Vue `<template>` rules, bridged into oxlint as `vize/*`                    |
| **[Vitest 4](https://vitest.dev) + [Playwright](https://playwright.dev)**                                 | unit and e2e tests, both backed by the same MSW handlers                   |
| **[Lefthook 2](https://github.com/evilmartians/lefthook)**                                                | git hooks: `pre-commit` fixes staged files, `pre-push` runs the full check |
| **[changelogen](https://github.com/unjs/changelogen)**                                                    | version bump, changelog and GitHub release from conventional commits       |
| **[devenv](https://devenv.sh)**                                                                           | an optional reproducible Nix shell pinning Node, pnpm and the browsers     |
| **auto-imports**                                                                                          | composables and components resolve by name; declarations are committed     |

## The data layer

[/demo](https://vue-starter.raz.wtf/demo) is one resource — a members list — wired through every
data library in the stack, rather than three disconnected toys:

```
src/schemas/member.ts     zod schemas + inferred types      (the contract)
src/mocks/handlers.ts     MSW handlers                      (the API)
src/mocks/db.ts           seeded in-memory data
src/api/members.ts        fetch + zod parse                 (the boundary)
src/composables/          useMembers(): query + mutations   (the state)
src/components/Demo/      form, table, panel                (the UI)
```

The four rules that hold it together — zod parses at the boundary rather than casting, mutations
invalidate rather than patch the cache, the error toggle is part of the query key, and components
never see a query key or a `fetch` — are explained under _The data layer_ in
[the docs](https://vue-starter.raz.wtf/docs).

## Requirements

**Node 26** (see `.nvmrc`) and **pnpm 11**. Note that Node 26 is the Current channel, not LTS — it
enters LTS in October 2026. `engines.node` is `>=26.0.0`, which pnpm enforces as a hard install
failure, so relax that field if you fork this for production on an LTS line.

With [devenv](https://devenv.sh) and [direnv](https://direnv.net) installed, `direnv allow` gets you
a shell with Node, pnpm and the Playwright browsers pinned. It is entirely optional: `devenv.nix`,
`devenv.yaml` and `.envrc` are inert without Nix, and `pnpm install` works exactly as normal. See
_Requirements_ in [the docs](https://vue-starter.raz.wtf/docs) for the two NixOS-specific caveats.

## Scripts

```sh
pnpm install       # installs deps and git hooks (prepare -> lefthook install)
pnpm dev           # dev server on :5173
pnpm build         # vue-tsc --build && vite build
pnpm preview       # preview the production build on :4173
pnpm test          # unit tests (vitest run)
pnpm test:watch    # unit tests in watch mode
pnpm test:e2e      # playwright (run `pnpm exec playwright install` once first)
pnpm lint          # oxlint + vue template rules, type-aware
pnpm lint:fix      # oxlint --fix
pnpm format        # oxfmt
pnpm check         # lint + format:check + type-check
pnpm changelog     # preview the unreleased changelog (writes nothing)
pnpm release       # bump + changelog + commit + tag + push + GitHub release
```

## Deployment

Deployed to **Cloudflare Workers** as static assets, at
[vue-starter.raz.wtf](https://vue-starter.raz.wtf). `wrangler.jsonc` is an assets-only Worker — no
`main`, so no Worker code runs and Cloudflare serves `dist/` from its edge, which is
[free and unlimited](https://developers.cloudflare.com/workers/platform/pricing/) on both plans.

CI deploys on every push to `main`, gated behind the `ci` job, so only a commit that passed lint,
types, unit tests and e2e ever ships. A fork without Cloudflare secrets logs a notice and exits
green rather than turning `main` red.

```sh
pnpm run cf:deploy    # build + wrangler deploy
pnpm run cf:preview   # build + wrangler versions upload — a preview URL, production untouched
```

Note the `pnpm run`: `pnpm deploy` is a built-in pnpm command for workspace pruning and will _not_
run this script. [The docs](https://vue-starter.raz.wtf/docs) cover the SPA fallback, the custom
domain, and the two required repository secrets.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com) with
[Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) and
[oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode). Both are in
`.vscode/extensions.json`, along with format-on-save and `source.fixAll.oxc`.

**Disable the ESLint and Prettier extensions for this workspace** — they will double-format. They
are listed under `unwantedRecommendations` for that reason.

## Further reading

- **[/docs](https://vue-starter.raz.wtf/docs)** — the long-form reference. Why each choice was made,
  what it costs in kilobytes, and the sharp edges in the lint, mock and release setup.
- **[`AGENTS.md`](AGENTS.md)** — the same ground as instructions for a coding agent.
- **[`CHANGELOG.md`](https://vue-starter.raz.wtf/changelog)** — what changed, and when.
