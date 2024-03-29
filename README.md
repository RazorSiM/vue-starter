<div style="display: flex; gap: 0.2rem">
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/-Vite-646cff?style=flat-square&amp;logo=vite&amp;logoColor=white" alt="Vite">
  </a>
  <a href="https://v3.vuejs.org/">
    <img src="https://img.shields.io/badge/-Vue-42b883?style=flat-square&amp;logo=vue.js&amp;logoColor=white" alt="Vue">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/-TypeScript-007acc?style=flat-square&amp;logo=typescript&amp;logoColor=white" alt="TypeScript">
  </a>
  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/-PNPM-ff5c93?style=flat-square&amp;logo=pnpm&amp;logoColor=white" alt="PNPM">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=Vue.volar">
    <img src="https://img.shields.io/badge/-Volar-42b883?style=flat-square&amp;logo=vue.js&amp;logoColor=white" alt="Volar">
  </a>
  <a href="https://vitest.dev/">
    <img src="https://img.shields.io/badge/-Vitest-42b883?style=flat-square&amp;logo=vue.js&amp;logoColor=white" alt="Vitest">
  </a>
  <a href="https://www.cypress.io/">
    <img src="https://img.shields.io/badge/-Cypress-17202c?style=flat-square&amp;logo=cypress&amp;logoColor=white" alt="Cypress">
  </a>
  <a href="https://eslint.org/">
    <img src="https://img.shields.io/badge/-ESLint-4b32c3?style=flat-square&amp;logo=eslint&amp;logoColor=white" alt="ESLint">
  </a>
  <a href="https://github.com/antfu/eslint-config">
    <img src="https://img.shields.io/badge/-Antfu-42b883?style=flat-square&amp;logo=vue.js&amp;logoColor=white" alt="Antfu">
  </a>
</div>

# Vue 3 Starter

This is my take on a Vite + Vue 3 template, [deployed here](https://vue-starter-razorsim.vercel.app/). If you want to spin it locally:

```sh
degit RazorSiM/vue-starter
pnpm install
```

## What's included

Here's a list of what's included in this template. Everything has been configured to work out of the box with Eslint, Typescript and VScode.

### Features

- [Vue3](https://vuejs.org);
- [Vue Router](https://router.vuejs.org/) to handle routes;
- [Pinia](https://pinia.vuejs.org/) for state management;
- [Vueuse](https://vueuse.org/) for useful composition API utilities;
- UnoCSS for fast and super customizable styling configured with:
  - [@unocss/reset](https://github.com/unocss/unocss#style-resetting) with Tailwind settings;
  - [@unocss/preset-uno](https://github.com/unocss/unocss/tree/main/packages/preset-uno) as a base preset;
  - [@unocss/preset-icons](https://github.com/unocss/unocss/tree/main/packages/preset-icons) to use icons from [Icones](https://icones.js.org/);
  - [@unocss/preset-web-fonts](https://github.com/unocss/unocss/tree/main/packages/preset-typography) so you can grab your web fonts and set them up easily;
  - [@unocss/transformer-variant-group](https://github.com/unocss/unocss/tree/main/packages/transformer-variant-group) to use the `group` variant; ex: `hover:(bg-blue-500 text-white font-bold)`;
- [unhead](https://unhead.unjs.io/) for SEO and page metadata;
- Scaffolded an example of how you could implement a multi-layout approach;
- Scaffolded an example of how you could implement using markdown vue components with [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown/);
- Support for [Shikiji](https://shikiji.netlify.app/) for markdown syntax highlighting;

### Development Experience

- [Vite](https://vitejs.dev/) for development and production builds;
- Typescript support for `.vue` files;
- [Eslint](https://eslint.org/) with [antfu/eslint-config](https://github.com/antfu/eslint-config) for linting and formatting;
- [Lefthook](https://github.com/evilmartians/lefthook) for ez git(gud) hooks;
- [Unplugin Auto Import](https://github.com/antfu/unplugin-auto-import) to automatically import stuff in your files; No more `import { defineComponent } from 'vue'`;
- [Unplugin Vue Components](https://github.com/antfu/unplugin-vue-components) to automatically import components;
- [Unplugin Vue Macros](https://github.com/sxzz/unplugin-vue-macros) to extend Vue macros and syntax sugar;
- [Changesets](https://github.com/changesets/changesets) to manage changelogs and releases;
- Vscode will fix and format on save with Eslint;

### Testing

- [Vitest](https://vitest.dev/) for unit testing;
- [Cypress](https://www.cypress.io/) for e2e testing;

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm run build
pnpm run test:e2e
```

### Lint, fix and format with [ESLint](https://eslint.org/) and @antfu/eslint-config settings

```sh
pnpm run lint # will only check
pnpm run lint:fix # will fix and format
```
