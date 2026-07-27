import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import Shiki from '@shikijs/markdown-it'
import { unheadVueComposablesImports } from '@unhead/vue'
import { Unhead } from '@unhead/vue/vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vitest/config'
import VueRouter from 'vue-router/vite'

// vueDevTools and TurboConsole keep handles open that stop Vitest's Vite server
// from closing, adding a 10s "close timed out" stall to every `vitest run`.
// Both are dev-only, so skip them under test.
const isTest = process.env.VITEST === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // File-based routing. Must be registered BEFORE vue(). The plugin also sets
    // enforce: 'pre' internally, so correctness does not depend on array order,
    // but the official docs mandate this order and it documents intent.
    VueRouter({
      routesFolder: 'src/pages',
      extensions: ['.vue'],
      exclude: ['**/*.spec.*'],
      dts: 'src/typed-router.d.ts',
      importMode: 'async',
    }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    UnoCSS(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', unheadVueComposablesImports],
      // Everything exported from src/composables/ is available without an import.
      dirs: ['src/composables'],
      dts: './auto-imports.d.ts',
    }),
    Markdown({
      headEnabled: true,
      async markdownSetup(md) {
        const shiki = await Shiki({
          themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha',
          },
        })
        // @shikijs/markdown-it@4 is typed against markdown-it; unplugin-vue-markdown@32
        // passes a markdown-exit instance. They are runtime-compatible (a real .md builds
        // and still emits --shiki-dark), the types simply disagree.
        md.use(shiki as never)
      },
    }),
    Components({
      dts: true,
      collapseSamePrefixes: true,
      directoryAsNamespace: true,
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    ...(isTest ? [] : [vueDevTools(), TurboConsole()]),
    Unhead(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
})
