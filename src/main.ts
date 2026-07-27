import { VueQueryPlugin } from '@tanstack/vue-query'
import { createHead } from '@unhead/vue/client'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import App from './App.vue'

import 'virtual:uno.css'
import '@/assets/styles/main.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Swap routes in without a full reload when page files are added/renamed/edited.
if (import.meta.hot) handleHotUpdate(router)

// MSW runs in every environment, including the production build. /demo has no
// backend, so a dev-only mock would leave the deployed page showing a permanent
// error. Delete this function, the call below and src/mocks/ to remove mocking —
// nothing else depends on it.
async function startMockApi() {
  const { worker } = await import('./mocks/browser')

  await worker.start({
    // The worker only answers the handlers in src/mocks/handlers.ts; everything else
    // (assets, HMR, fonts) reaches the network untouched and unlogged.
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}

// Mount only once the worker is live, or the first query races it and gets a real 404.
async function bootstrap() {
  await startMockApi()

  createApp(App)
    .use(createPinia())
    .use(router)
    .use(createHead())
    .use(VueQueryPlugin, {
      queryClientConfig: {
        // 30s of "fresh": remounting a component inside that window reads the cache
        // instead of refetching. The default is 0, which surprises people.
        defaultOptions: { queries: { staleTime: 30_000 } },
      },
    })
    .mount('#app')
}

// `void` rather than top-level await: TLA would make this entry chunk async and drag
// the build target forward, and there is nothing here to await it from anyway.
void bootstrap()
