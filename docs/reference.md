# Reference

The long-form half of the [README](https://vue-starter.raz.wtf/): why each piece is here, what it
costs, and the sharp edges worth knowing before you change something. If you are a coding agent, read
[`AGENTS.md`](https://github.com/RazorSiM/vue-starter/blob/main/AGENTS.md) instead — it is the same
ground as instructions rather than prose.

## Routing

Pages live in `src/pages/`, per-route metadata is declared with the `definePage()` macro, and fully
typed routes are generated into `src/typed-router.d.ts`. The file conventions:

| file               | route                                              |
| ------------------ | -------------------------------------------------- |
| `index.vue`        | `/`                                                |
| `layout.vue`       | `/layout`                                          |
| `[id].vue`         | `/:id`                                             |
| `[[id]].vue`       | `/:id?` (optional param)                           |
| `[...path].vue`    | `/:path(.*)` (404 catch-all)                       |
| `(group)/foo.vue`  | `/foo` (folder stripped from the URL)              |
| `users.create.vue` | `/users/create` (dot nesting, no nested component) |

The route-building plugin now ships inside `vue-router` itself — `unplugin-vue-router` is no longer a
separate dependency. It is registered with `extensions: ['.vue']`, so a stray Markdown file under
`src/pages/` does not silently become a route.

### Multi-layout support

`src/App.vue` resolves layouts with an `import.meta.glob` lookup keyed by `route.meta.layout`, so
adding `src/layouts/Foo.vue` is all it takes. No extra dependency. `DefaultLayout` supplies the app
chrome; `EmptyLayout` is deliberately bare. The [/layout](https://vue-starter.raz.wtf/layout) page is
a live demo — switch layouts and watch the header appear and disappear, backed by the `useLayout()`
composable.

### Markdown pages

[unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown) compiles Markdown to Vue
components, which is how three pages in this template work: the homepage renders `README.md`,
[/changelog](https://vue-starter.raz.wtf/changelog) renders `CHANGELOG.md`, and this page renders
`docs/reference.md`. [Shiki](https://shiki.style) provides dual-theme syntax highlighting inside
them.

No anchor plugin is configured, so headings do not get `id` attributes and `#section` deep links will
not scroll. Adding [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) in
`markdownSetup` is the fix if you want them.

## The data layer

[/demo](https://vue-starter.raz.wtf/demo) is one resource — a members list — wired through every data
library in the stack, rather than three disconnected toys:

```
src/schemas/member.ts     zod schemas + inferred types      (the contract)
src/mocks/handlers.ts     MSW handlers                      (the API)
src/mocks/db.ts           seeded in-memory data
src/api/members.ts        fetch + zod parse                 (the boundary)
src/composables/          useMembers(): query + mutations   (the state)
src/components/Demo/      form, table, panel                (the UI)
```

Four things worth knowing:

1. **zod parses at the boundary, it does not cast.** `src/api/members.ts` runs
   `memberListSchema.parse()` on every response. A backend that renames a field fails loudly in one
   file, instead of surfacing as `undefined` three components away.
2. **Mutations invalidate, they do not patch the cache.** `id`, `commits` and `joinedAt` are the
   server's to assign, so `useMembers()` invalidates the `['members']` key and refetches rather than
   guessing what the server did.
3. **The "simulate a 500" toggle is part of the query key**, not just the fetcher. Flipping it is a
   different resource as far as the cache is concerned, so both results stay cached and toggling back
   is instant. `retry` is off so the error state is visible immediately — delete that line for the
   sensible production default.
4. **Components never see a query key or a `fetch`.** `MemberForm` emits a validated value and knows
   nothing about the API, which is why it can be unit-tested without a server at all.

### zod, once, three ways

One schema per resource lives in `src/schemas/`, and it validates the form, parses the API response
at the network boundary, and infers the TypeScript types. A field cannot drift between the three.
zod 4 implements [Standard Schema](https://standardschema.dev), so TanStack Form consumes the schema
directly and there is no resolver package in between.

### Pinia, and where it stops

[Pinia](https://pinia.vuejs.org) owns client state — the things Query deliberately does not: no
server, no cache, nothing to invalidate. The [/demo](https://vue-starter.raz.wtf/demo) page puts the
two side by side so the boundary is visible rather than asserted.

## MSW

The mock runs in **every** environment, including the production build — `/demo` has no backend, so a
dev-only mock would leave the deployed page showing a permanent error. `src/main.ts` awaits
`worker.start()` before mounting, or the first query would race the worker and get a real 404.

- `public/mockServiceWorker.js` is generated (`pnpm exec msw init public --save`) and **committed**.
  The `msw.workerDirectory` field in `package.json` plus the `allowBuilds: msw` entry in
  `pnpm-workspace.yaml` let msw's postinstall refresh it on upgrade; without that it silently drifts
  out of sync with the installed version.
- Handler paths are written `*/api/members`, not `/api/members`. A bare relative path resolves
  against `document.baseURI`, which does not exist under Node — the same handlers have to match in
  the browser, in vitest and in Playwright.
- **It costs ~158 KB gzipped**, loaded on first paint because the mount awaits it. That is the price
  of a demo that works offline and on a static host. To pay it only in development, guard the call in
  `src/main.ts` with `import.meta.env.DEV`; to remove mocking entirely, delete `startMockApi()` and
  `src/mocks/`, and point `src/api/members.ts` at a real origin.

## Reka UI

[Reka UI](https://reka-ui.com) ships unstyled, accessible component primitives: the behaviour that is
tedious to write and easy to get subtly wrong — roving focus, focus trapping and restoration, ARIA
wiring, Escape handling — and no CSS at all, so UnoCSS still owns every pixel. It is used in four
places, each one replacing markup that was actively misleading to a screen reader:

| primitive     | where                                                                            | what it replaced                                                                      |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `RadioGroup`  | the role field in `Demo/MemberForm.vue`, the layout picker in `pages/layout.vue` | `aria-pressed` toggle buttons — a one-of-N choice announced as N independent switches |
| `AlertDialog` | the row remove confirmation in `Demo/MemberTable.vue`                            | an immediate, unconfirmed delete                                                      |
| `Tooltip`     | the `src/pages/…` hint in `TopNav.vue`                                           | a `title` attribute, which never opens on keyboard focus                              |
| `Primitive`   | `Ui/Button`                                                                      | a `tag` prop that was declared and then ignored                                       |

Three things follow from using it:

- **Parts auto-import** via `RekaResolver()` in `vite.config.ts`, so an alert dialog costs eight tags
  and zero import lines. Unused primitives are still tree-shaken.
- **Style with `data-[state=…]`**, not with a bound class expression. The primitive already tracks
  checked/open/closed and exposes it as an attribute, so `data-[state=checked]:border-indigo-500`
  replaces a ternary over your own state.
- **It does not replace native elements that were already correct.** The name and email fields are
  still `<input>` with `<label for>`, and "simulate a 500" is still a real checkbox. Reaching for a
  primitive where the platform already gives you the semantics buys nothing but JavaScript.

**It costs ~47 KB gzipped across all chunks, ~37 KB of it on first paint.** The tooltip is the
expensive part: it lives in the header, so every page pulls in the popper and focus-management code
that `AlertDialog` also shares. If that trade is wrong for your app, deleting the `TooltipRoot`
wrapper in `src/components/TopNav.vue` is the single biggest saving, and an `aria-describedby`
pointing at a `sr-only` span keeps the screen-reader behaviour for no JavaScript — you just lose the
hint for sighted mouse users. The `RadioGroup` and `AlertDialog` conversions are close to free by
comparison (~5 KB of route chunk each).

Reka UI is deliberately unstyled. If you want a styled layer on top of exactly these primitives,
[shadcn-vue](https://www.shadcn-vue.com) is Reka UI plus a component library.

## Styling

[UnoCSS](https://unocss.dev) provides instant atomic CSS, configured in `uno.config.ts`:

- **[@unocss/preset-wind4](https://unocss.dev/presets/wind4)**: the Tailwind-v4-aligned engine (oklch
  colours, CSS-variable theme). Its reset is built in via `preflights.reset`, so no separate
  `@unocss/reset` package is needed.
- **[@unocss/preset-icons](https://unocss.dev/presets/icons)**: pure-CSS icons.
- **[@unocss/preset-typography](https://unocss.dev/presets/typography)**: the `prose` classes the
  Markdown pages render into. Its inline-`<code>` backticks are switched off via `cssExtend`, since
  the Markdown already reads as code without them.
- **[@unocss/preset-web-fonts](https://unocss.dev/presets/web-fonts)**: Inter + Fira Code.
- **[@unocss/transformer-variant-group](https://unocss.dev/transformers/variant-group)**: write
  `dark:(bg-gray-900 text-gray-50)` instead of repeating the variant.

Icons come from [Lucide](https://lucide.dev) via `@iconify-json/lucide` — use them as plain classes,
e.g. `<div class="i-lucide-house" />`. Only the Lucide collection is installed (574 KB) rather than
the full `@iconify/json` (439 MB). Browse the set at [icones.js.org](https://icones.js.org).

## TypeScript

**TypeScript 6** with full `.vue` support through `vue-tsc`. `tsconfig.json` is a solution file
referencing three projects, and `pnpm type-check` builds all of them:

| project              | covers                       |
| -------------------- | ---------------------------- |
| `tsconfig.app.json`  | `src/`, including unit specs |
| `tsconfig.node.json` | the root `*.config.ts` files |
| `e2e/tsconfig.json`  | the Playwright suite         |

A project missing from `references` is silently skipped by `vue-tsc --build`, which is exactly how
the e2e suite went unchecked for a while. If you add a fourth tsconfig, add it to `references` or it
will not be type-checked and nothing will tell you.

### Auto-imports

[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) handles composables and
[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) handles components,
the latter with Reka UI's resolver registered so its primitives resolve by name too. Both write their
declarations to the repo root (`auto-imports.d.ts`, `components.d.ts`) and **both files are
committed**, so a fresh clone type-checks before anything has been run. CI asserts they are current
with `git diff --exit-code`, alongside `src/typed-router.d.ts`.

## Linting and formatting

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
2. **`pnpm lint:fix` stays on plain `oxlint`.** The wrapper cannot write fixes back yet ("fixes are
   not applied back to original files yet"), so autofix uses oxlint directly.
3. **`node_modules` must NOT be added to `ignorePatterns` in `.oxlintrc.json`.** The wrapper stages
   temporary copies of scriptless SFCs under `node_modules/.vize/`, and ignoring that path silently
   disables every template rule while still exiting 0. oxlint already skips `node_modules` by default
   and respects `.gitignore`, so the entry is unnecessary as well as harmful.
4. **`settings.vize.preset` is `"incremental"`.** Every other preset gates rules by bundle membership
   and will keep explicitly-listed rules quiet. `incremental` runs exactly the `vize/*` rules
   enumerated in `.oxlintrc.json` and nothing else.
5. **`pnpm lint` passes `--type-aware`**, which turns on rules needing type information —
   `no-floating-promises`, `await-thenable`, `no-misused-promises` and ~20 more. This requires the
   `oxlint-tsgolint` package (a native binary, exact-pinned) and costs about 0.2s here. Note it
   covers `.ts`/`.js` only, not `.vue` SFCs. The pre-commit hook deliberately runs plain `oxlint` for
   speed; type-aware runs on pre-push and in CI.

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

### Git hooks

[Lefthook 2](https://github.com/evilmartians/lefthook) installs on `pnpm install` via the `prepare`
script. `pre-commit` is piped rather than parallel — `oxlint --fix` writes first, then `oxfmt`
formats its output, then `oxlint-vize` checks templates — because running the fixers in parallel
would race on the same files. `pre-push` runs the full lint + format + type-check in parallel.

## Testing

End-to-end tests run against the Vite dev server locally for a fast feedback loop. CI builds first
and tests the preview server:

```sh
pnpm build
CI=1 pnpm test:e2e
```

Both layers are backed by the same MSW handlers, from opposite sides. The unit tests start
`setupServer` in `src/test/setup.ts` with `onUnhandledRequest: 'error'` — a request nobody mocked is a
bug in the test, not something to quietly let through — and reset the in-memory db between tests,
since it is module state that would otherwise leak from one test's POST into the next test's GET. The
Playwright suite drives the real service worker in a real browser, which is what notices when
`public/mockServiceWorker.js` goes missing or stale.

`vueDevTools` and `TurboConsole` are skipped under Vitest: both keep handles open that stop Vitest's
Vite server from closing, adding a 10s "close timed out" stall to every `vitest run`.

## Requirements

- **Node 26** (see `.nvmrc`) and **pnpm 11**.
- Note that **Node 26 is the Current channel, not LTS** — it enters LTS in October 2026, and Node 24
  "Krypton" is today's Active LTS. `engines.node` is set to `>=26.0.0`, which pnpm enforces as a hard
  install failure. If you fork this for production on an LTS line, relax that field.

### Optional: reproducible shell with Nix

If you have [devenv](https://devenv.sh) and [direnv](https://direnv.net):

```sh
direnv allow    # or: devenv shell
```

This pins Node 26.5.0, pnpm 11.15.0 and the Playwright browsers from nixpkgs. `devenv.nix`,
`devenv.yaml` and `.envrc` are inert for everyone else — without Nix installed, `pnpm install` works
exactly as normal.

Two Nix-specific notes:

- Playwright's own downloaded browsers are linked against FHS paths that don't exist on NixOS, so the
  shell points `PLAYWRIGHT_BROWSERS_PATH` at the nixpkgs bundle instead. Browser revisions are
  matched per Playwright release, which is why **`@playwright/test` is pinned exactly** (no caret) to
  whatever `pkgs.playwright-driver` provides. `enterShell` warns if the two drift apart. On CI
  neither variable is set and `playwright install --with-deps` behaves normally.
- Node 26 no longer bundles corepack, so pnpm comes from nixpkgs. Keep `packageManager` in
  `package.json` aligned with it, or pnpm's own version self-check will download a different pnpm
  inside the shell.

## Releases

Releases are cut with [changelogen](https://github.com/unjs/changelogen) from
[conventional commits](https://www.conventionalcommits.org). Configuration lives in
`changelog.config.ts`, and it is deliberately almost empty — changelogen's defaults already produce
the format this `CHANGELOG.md` has used since v3.0.0.

```sh
pnpm changelog     # what would the next entry look like? Prints to stdout, writes nothing.
pnpm release       # cut it
```

`pnpm release` runs `changelogen --release --clean --push`, which:

1. refuses to start if the working tree is dirty (`--clean`);
2. derives the next version from the commits since the last tag — `feat:` bumps the minor,
   `fix:`/`perf:`/`refactor:`/`docs:`/`build:` the patch, a `!` or `BREAKING CHANGE:` the major — and
   writes it to `package.json`;
3. prepends the new section to `CHANGELOG.md`, which the
   [/changelog](https://vue-starter.raz.wtf/changelog) page renders as-is;
4. commits `chore(release): vX.Y.Z`, creates an annotated `vX.Y.Z` tag, and pushes both
   (`git push --follow-tags`);
5. creates the matching GitHub release.

Override the computed bump by appending the level: `pnpm release --major`.

Step 5 needs a GitHub token, looked up in this order: `CHANGELOGEN_TOKENS_GITHUB`, `GITHUB_TOKEN`,
`GH_TOKEN`, then the [`gh` CLI](https://cli.github.com) config. With none of them, the first four
steps still happen and changelogen prints a pre-filled "create release" URL to open by hand.

The push in step 4 goes through lefthook's `pre-push` hook, so lint, format and type-check run before
anything reaches the remote. Nothing is ever published to npm — `package.json` is `private: true`.

### Releasing from GitHub

`.github/workflows/release.yml` reaches the same end state on a runner, with no token needed locally.
It takes two steps rather than one, because a protected `main` accepts changes only through a pull
request and the built-in `GITHUB_TOKEN` cannot bypass that:

1. **Actions → Release → Run workflow**, with a `bump` input of `auto` (default), `patch`, `minor` or
   `major`. This runs `pnpm check` and the unit tests, does steps 1–3 above, and opens a
   `release/vX.Y.Z` pull request containing just the `CHANGELOG.md` and `package.json` diff.
2. **Merge that PR.** The push to `main` triggers the workflow's `tag` job, which creates the
   annotated `vX.Y.Z` tag and the GitHub release.

The `tag` job recognises a release by the pair a release commit always leaves behind — a version in
`package.json` with no tag yet, plus a matching `## vX.Y.Z` heading in `CHANGELOG.md` — so ordinary
commits that touch `package.json` pass straight through it.

Two things to know before tightening `main`'s protection further: a PR opened with `GITHUB_TOKEN`
does not trigger `on: pull_request`, so CI does not run on the release PR (the workflow's own
check/test steps are the gate instead), and adding **required status checks** would therefore
deadlock every release PR unless the PR is opened with a PAT or GitHub App token instead.

Two conventions worth keeping, since the changelog is only as good as the commits:

- **`chore(deps): …` commits are dropped** from the changelog by changelogen unless they are
  breaking. Dependabot/Renovate noise stays out on its own.
- **Non-conventional commit messages are skipped entirely.** A change committed as `fixed the thing`
  will not appear in any release.

## Deployment

Deployed to **Cloudflare Workers** as static assets, at
[vue-starter.raz.wtf](https://vue-starter.raz.wtf).

`wrangler.jsonc` is an assets-only Worker: no `main`, so no Worker code runs and Cloudflare serves
`dist/` from its edge. Two details carry weight:

- **`not_found_handling: "single-page-application"`.** vue-router runs in history mode, so `/demo`
  matches no file on disk — without this, a hard refresh anywhere but `/` returns Cloudflare's 404.
  Real files still take precedence, which is what keeps `/mockServiceWorker.js` working; a fallback to
  `index.html` there would silently break the demo page.
- **Worker, not Pages.** Pages is in maintenance mode and cannot grow server-side code. Adding a
  `"main"` entry to `wrangler.jsonc` turns this into a full Worker with the same assets in front of
  it, so an API route later is a config change rather than a migration.
- **It is free.** [Requests to static assets are free and unlimited](https://developers.cloudflare.com/workers/platform/pricing/)
  on both plans, and an assets-only Worker serves nothing else — so the free plan's 100,000
  requests/day applies to Worker invocations you do not have. Free-plan asset limits are 20,000 files
  per version and 25 MiB per file; this build ships 15. Cost-identical to Pages.

The site answers on a **Custom Domain** (`routes` with `custom_domain: true`), which means Cloudflare
creates the DNS record and manages the certificate — there is nothing to add by hand, but the zone
must be in the same account as the Worker. `workers_dev` is off since the real domain covers it, and
`preview_urls` is then set back to `true` explicitly: since wrangler 4.44 preview URLs default to
matching `workers_dev`, so disabling the workers.dev route would otherwise take `cf:preview` with it.

CI deploys on every push to `main`, from the `deploy` job in `.github/workflows/ci.yml`. It is gated
behind `needs: ci`, so only a commit that passed lint, types, unit tests and e2e ever ships. Two
repository secrets are required:

| secret                  | where to get it                                                              |
| ----------------------- | ---------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare dashboard → My Profile → API Tokens → **Edit Cloudflare Workers** |
| `CLOUDFLARE_ACCOUNT_ID` | Workers & Pages → Account details, or `wrangler whoami`                      |

They are secrets rather than values in the workflow on purpose: this is a template, and a fork should
not inherit someone else's account ID. With no token set the deploy job logs a notice and exits
green, so forks do not get a red `main`.

The token needs zone access, not just account access — attaching a Custom Domain writes a DNS record.
The **Edit Cloudflare Workers** template covers it (`Workers Scripts:Edit`, `Workers Routes:Edit`,
`Zone:Read`, `DNS:Edit`). A token hand-scoped to account permissions only will deploy the Worker and
then fail on the route.

To deploy by hand:

```sh
pnpm exec wrangler login
pnpm run cf:deploy    # build + wrangler deploy
pnpm run cf:preview   # build + wrangler versions upload — a preview URL, production untouched
```

Note the `pnpm run`: `pnpm deploy` is a built-in pnpm command for workspace pruning and will _not_
run this script.
