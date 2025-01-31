# Vue 3 Starter

This is a comprehensive Vite + Vue 3 template, [deployed here](https://vue-starter-razorsim.vercel.app/). Follow the steps below to set it up locally:

```sh
npx degit RazorSiM/vue-starter
pnpm install
```

## What's Included

This template is configured to work seamlessly with ESLint, TypeScript, and VSCode. Below is a detailed list of the included features and tools.

### Features

- **[Vue 3](https://vuejs.org)**: The progressive JavaScript framework.
- **SSG** build through the `pnpm generate` command, using [vite-ssg](https://github.com/antfu-collective/vite-ssg).
- **[Vue Router](https://router.vuejs.org)**: For handling routes.
- **[Pinia](https://pinia.vuejs.org)**: State management library.
- **[VueUse](https://vueuse.org)**: Collection of essential Vue Composition Utilities.
- **UnoCSS**: Fast and highly customizable utility-first CSS framework.
  - **[@unocss/reset](https://github.com/unocss/unocss#style-resetting)**: Tailwind settings for style resetting.
  - **[@unocss/preset-uno](https://github.com/unocss/unocss/tree/main/packages/preset-uno)**: Base preset.
  - **[@unocss/preset-icons](https://github.com/unocss/unocss/tree/main/packages/preset-icons)**: Use icons from [Icones](https://icones.js.org/).
  - **[@unocss/preset-web-fonts](https://github.com/unocss/unocss/tree/main/packages/preset-typography)**: Easily set up web fonts.
  - **[@unocss/transformer-variant-group](https://github.com/unocss/unocss/tree/main/packages/transformer-variant-group)**: Use the `group` variant (e.g., `hover:(bg-blue-500 text-white font-bold)`).
- **[Unhead](https://unhead.unjs.io)**: For SEO and page metadata.
- **Multi-Layout Support**: Example implementation of a multi-layout approach.
- **Markdown Vue Components**: Example implementation using [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown).
- **[Shikiji](https://shikiji.netlify.app)**: Markdown syntax highlighting support.

### Development Experience

- **[Vite](https://vitejs.dev)**: For development and production builds.
- **TypeScript**: Full support for `.vue` files.
- **[ESLint](https://eslint.org)**: Configured with [antfu/eslint-config](https://github.com/antfu/eslint-config) for linting and formatting.
- **[Lefthook](https://github.com/evilmartians/lefthook)**: Easy git hooks.
- **[Unplugin Auto Import](https://github.com/unplugin/unplugin-auto-import)**: Automatically import utilities in your files.
- **[Unplugin Vue Components](https://github.com/unplugin/unplugin-vue-components)**: Automatically import Vue components.
- **[Unplugin Vue Markdown](https://github.com/unplugin/unplugin-vue-markdown)**: Vue components in Markdown files.
- **[Unplugin Turbo Console](https://github.com/unplugin/unplugin-turbo-console)**: Turbo charge your console.
- **VSCode Integration**: Auto-fix and format on save with ESLint.

### Testing

- **[Vitest](https://vitest.dev)**: For unit testing.
- **[Playwright](https://playwright.dev)**: For end-to-end testing.

## Recommended IDE Setup

- **[VSCode](https://code.visualstudio.com)**: Recommended IDE.
- **[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)**: Vue language support.

## Customize Configuration

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

### Run Unit Tests with [Vitest](https://vitest.dev)

```sh
pnpm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
pnpm run test:e2e
```

This runs the end-to-end tests against the Vite development server. It is much faster than the production build.

For CI environments, test the production build:

```sh
pnpm run build
pnpm run test:e2e
```

### Lint, Fix, and Format with [ESLint](https://eslint.org) and @antfu/eslint-config settings

```sh
pnpm run lint # Check only
pnpm run lint:fix # Fix and format
```
