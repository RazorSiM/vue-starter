/// <reference types="vite/client" />

// unplugin-vue-markdown ships plugin option types only — it does NOT provide a global
// `*.md` module declaration, so consumers must supply it. Without this, the `.md`
// imports in src/pages/index.vue and src/pages/changelog.vue fail type-checking.
declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}
