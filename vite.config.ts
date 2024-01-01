import { URL, fileURLToPath } from 'node:url'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

import Markdown from 'unplugin-vue-markdown/vite'
import Shikiji from 'markdown-it-shikiji'

import { unheadVueComposablesImports } from '@unhead/vue'

import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/],
      }),
      vueJsx(),
      VueDevTools(),
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
        async markdownItSetup(md) {
          md.use(await Shikiji({
            themes: {
              light: 'catppuccin-latte',
              dark: 'catppuccin-mocha',
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
