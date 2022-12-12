<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const counterColor = computed(() =>
  globalStore.count > 0 ? 'text-indigo-400' : 'text-pink-300',
)
const badges = [
  {
    img: 'https://img.shields.io/badge/-Vue-42b883?style=flat-square&logo=vue.js&logoColor=white',
    url: 'https://vuejs.org/',
    title: 'Vue',
  },
  {
    img: 'https://img.shields.io/badge/-Vite-646cff?style=flat-square&logo=vite&logoColor=white',
    url: 'https://vitejs.dev/',
    title: 'Vite',
  },
  {
    img: 'https://img.shields.io/badge/-TypeScript-007acc?style=flat-square&logo=typescript&logoColor=white',
    url: 'https://www.typescriptlang.org/',
    title: 'Typescript',
  },
  {
    img: 'https://img.shields.io/badge/-PNPM-ff5c93?style=flat-square&logo=pnpm&logoColor=white',
    url: 'https://pnpm.io/',
    title: 'PNPM',
  },
  {
    img: 'https://img.shields.io/badge/-Volar-42b883?style=flat-square&logo=vue.js&logoColor=white',
    url: '(https://marketplace.visualstudio.com/items?itemName=Vue.volar',
    title: 'Volar',
  },
  {
    img: 'https://img.shields.io/badge/-Vitest-42b883?style=flat-square&logo=vue.js&logoColor=white',
    url: 'https://vitest.dev/',
    title: 'Vitest',
  },
  {
    img: 'https://img.shields.io/badge/-Cypress-17202c?style=flat-square&logo=cypress&logoColor=white',
    url: 'https://www.cypress.io/',
    title: 'Cypress',
  },
  {
    img: 'https://img.shields.io/badge/-ESLint-4b32c3?style=flat-square&logo=eslint&logoColor=white',
    url: 'https://eslint.org/',
    title: 'Eslint',
  },
  {
    img: 'https://img.shields.io/badge/-Antfu-42b883?style=flat-square&logo=vue.js&logoColor=white',
    url: 'https://github.com/antfu/eslint-config',
    title: 'Antfu/eslint-config',
  },
]
</script>

<template>
  <div class="flex gap-2">
    <a
      v-for="badge in badges" :key="badge.title" :href="badge.url" target="_blank"
      class="hover:(scale-105) transition"
    >
      <img :src="badge.img" :alt="badge.title" class="rounded">
    </a>
  </div>
  <div class="prose text-xl dark:prose-light">
    <h1>Vite Starter for Vue 👑</h1>
    <h2>Batteries included!</h2>

    <p>This is my personal take on a Vite + Vue 3 template. If you want to try it:</p>
    <pre><code>degit RazorSiM/vue-starter
  pnpm install</code></pre>
    <h2>What's included</h2>
    <p>
      Here's a list of what's included in this template. Everything has been configured to work out of the box with
      Eslint, Typescript and VScode.
    </p>
    <h3 id="features">
      Features
    </h3>
    <ul>
      <li><a target="_blank" href="https://vuejs.org">Vue3</a>;</li>
      <li><a target="_blank" href="https://router.vuejs.org/">Vue Router</a> to handle routes;</li>
      <li><a target="_blank" href="https://pinia.vuejs.org/">Pinia</a> for state management;</li>
      <li><a target="_blank" href="https://vueuse.org/">Vueuse</a> for useful composition API utilities;</li>
      <li>
        UnoCSS for fast and super customizable styling configured with:<ul>
          <li><a target="_blank" href="https://github.com/unocss/unocss#style-resetting">@unocss/reset</a> with Tailwind settings;</li>
          <li><a target="_blank" href="https://github.com/unocss/unocss/tree/main/packages/preset-uno">@unocss/preset-uno</a> as a base preset;</li>
          <li><a target="_blank" href="https://github.com/unocss/unocss/tree/main/packages/preset-icons">@unocss/preset-icons</a> to use icons from <a target="_blank" href="https://icones.js.org/">Icones</a>;</li>
          <li><a target="_blank" href="https://github.com/unocss/unocss/tree/main/packages/preset-typography">@unocss/preset-web-fonts</a> so you can grab your web fonts and set them up easily;</li>
          <li><a target="_blank" href="https://github.com/unocss/unocss/tree/main/packages/transformer-variant-group">@unocss/transformer-variant-group</a> to use the <code>group</code> variant; ex: <code>hover:(bg-blue-500 text-white font-bold)</code>;</li>
        </ul>
      </li>
      <li>Scaffolded an example on how you could implement a multi-layout approach</li>
    </ul>
    <h3 id="development-experience">
      Development Experience
    </h3>
    <ul>
      <li><a target="_blank" href="https://vitejs.dev/">Vite</a> for development and production builds;</li>
      <li>Typescript support for <code>.vue</code> files;</li>
      <li><a target="_blank" href="https://eslint.org/">Eslint</a> with <a target="_blank" href="https://github.com/antfu/eslint-config">antfu/eslint-config</a> for linting and formatting;</li>
      <li><a target="_blank" href="https://github.com/evilmartians/lefthook">Lefthook</a> for ez git(gud) hooks;</li>
      <li><a target="_blank" href="https://github.com/antfu/unplugin-auto-import">Unplugin Auto Import</a> to automatically import stuff in your files; No more <code>import { defineComponent } from &#39;vue&#39;</code>;</li>
      <li><a target="_blank" href="https://github.com/antfu/unplugin-vue-components">Unplugin Vue Components</a> to automatically import components;</li>
      <li><a target="_blank" href="https://github.com/sxzz/unplugin-vue-macros">Unplugin Vue Macros</a> to extend Vue macros and syntax sugar;</li>
      <li>Vscode will fix and format on save with Eslint;</li>
    </ul>
    <h3 id="testing">
      Testing
    </h3>
    <ul>
      <li><a target="_blank" href="https://vitest.dev/">Vitest</a> for unit testing;</li>
      <li><a target="_blank" href="https://www.cypress.io/">Cypress</a> for e2e testing;</li>
    </ul>
    <h2 id="recommended-ide-setup">
      Recommended IDE Setup
    </h2>
    <p><a target="_blank" href="https://code.visualstudio.com/">VSCode</a> + <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=Vue.volar">Volar</a> (and disable Vetur) + <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin">TypeScript Vue Plugin (Volar)</a>.</p>
    <h2 id="type-support-for-vue-imports-in-ts">
      Type Support for <code>.vue</code> Imports in TS
    </h2>
    <p>TypeScript cannot handle type information for <code>.vue</code> imports by default, so we replace the <code>tsc</code> CLI with <code>vue-tsc</code> for type checking. In editors, we need <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin">TypeScript Vue Plugin (Volar)</a> to make the TypeScript language service aware of <code>.vue</code> types.</p>
    <p>If the standalone TypeScript plugin doesn&#39;t feel fast enough to you, Volar has also implemented a <a target="_blank" href="https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669">Take Over Mode</a> that is more performant. You can enable it by the following steps:</p>
    <ol>
      <li>
        Disable the built-in TypeScript Extension<ol>
          <li>Run <code>Extensions: Show Built-in Extensions</code> from VSCode&#39;s command palette</li>
          <li>Find <code>TypeScript and JavaScript Language Features</code>, right click and select <code>Disable (Workspace)</code></li>
        </ol>
      </li>
      <li>Reload the VSCode window by running <code>Developer: Reload Window</code> from the command palette.</li>
    </ol>
    <h2 id="customize-configuration">
      Customize configuration
    </h2>
    <p>See <a target="_blank" href="https://vitejs.dev/config/">Vite Configuration Reference</a>.</p>
    <h2 id="project-setup">
      Project Setup
    </h2>
    <p><code>pnpm install</code></p>
    <h3 id="compile-and-hot-reload-for-development">
      Compile and Hot-Reload for Development
    </h3>
    <p><code>pnpm run dev</code></p>
    <h3 id="type-check-compile-and-minify-for-production">
      Type-Check, Compile and Minify for Production
    </h3>
    <p><code>pnpm run build</code></p>
    <h3 id="run-unit-tests-with-vitest">
      Run Unit Tests with <a target="_blank" href="https://vitest.dev/">Vitest</a>
    </h3>
    <p><code>pnpm run test:unit</code></p>
    <h3 id="run-end-to-end-tests-with-cypress">
      Run End-to-End Tests with <a target="_blank" href="https://www.cypress.io/">Cypress</a>
    </h3>
    <p><code>pnpm run test:e2e:dev</code></p>
    <p>
      This runs the end-to-end tests against the Vite development server.
      It is much faster than the production build.
    </p>
    <p>But it&#39;s still recommended to test the production build with <code>test:e2e</code> before deploying (e.g. in CI environments):</p>
    <pre><code>pnpm run build
pnpm run test:e2e
</code></pre>
    <h3 id="lint-fix-and-format-with-eslint-and-antfueslint-config-settings">
      Lint, fix and format with <a target="_blank" href="https://eslint.org/">ESLint</a> and @antfu/eslint-config settings
    </h3>
    <p><code>pnpm run lint</code></p>
  </div>
  <div class="mb-5">
    Example of how you can use Pinia as your store manager:
  </div>
  <div class="mb-2">
    Counter value is
    <span class="font-bold" :class="counterColor">{{ globalStore.count }}</span>
  </div>
  <div class="flex space-x-5">
    <BaseButton color="warning" label="Decrease Counter by 1" @click="globalStore.decreaseCounter()" />
    <BaseButton color="primary" label="Increase Counter by 1" @click="globalStore.incrementCounter()" />
  </div>
</template>
