import { fileURLToPath, URL } from 'node:url'

import Shiki from '@shikijs/markdown-it'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      vueDevTools(),
      UnoCSS(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          unheadVueComposablesImports,
        ],
        dts: './auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './eslintrc-auto-import.json',
        },
      }),
      Markdown({
        headEnabled: true,
        async markdownItSetup(md) {
          md.use(await Shiki({
            themes: {
              light: 'catppuccin-latte',
              dark: 'catppuccin-mocha',
            },
          }))
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
      TurboConsole(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }
})
