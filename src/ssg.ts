import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

import EmptyLayout from './layouts/EmptyLayout.vue'
import router from './router'

import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import '@/assets/styles/main.css'

export const createApp = ViteSSG(
  App,
  { routes: router.getRoutes() },
  ({ app }) => {
    const pinia = createPinia()
    app.use(pinia)
    app.component('DefaultLayout', DefaultLayout)
    app.component('EmptyLayout', EmptyLayout)
  },
)
