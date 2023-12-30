import { URL, fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { fromHighlighter } from 'markdown-it-shikiji/core'
import { getHighlighter } from 'shikiji'
import { unheadVueComposablesImports } from '@unhead/vue'

import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const catppuccinMocha = JSON.parse(readFileSync('./catppuccinMocha.json', 'utf-8'))
  const catppuccinLatte = JSON.parse(readFileSync('./catppuccinLatte.json', 'utf-8'))

  const highlighter = await getHighlighter({
    themes: [
      catppuccinMocha,
      catppuccinLatte,
    ],
    langs: [
      'sh',
    ],
  })

  return {
    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/],
      }),
      vueJsx(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: ['vue', 'vue-router', '@vueuse/core', unheadVueComposablesImports],
        dts: true,
        eslintrc: {
          enabled: true,
        },
      }),
      Markdown({
        markdownItSetup(md) {
          md.use(fromHighlighter(highlighter, {
            themes: {
              light: 'Catppuccin Latte',
              dark: 'Catppuccin Mocha',
            },
          }))
        },
      }),
      Components({
        dts: true,
        extensions: ['vue', 'md'],
        types: [
          {
            from: 'vue-router',
            names: ['RouterLink', 'RouterView'],
          },
        ],
      }),
      Unocss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
    },
  }
})
