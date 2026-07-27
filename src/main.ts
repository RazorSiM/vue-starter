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

createApp(App).use(createPinia()).use(router).use(createHead()).mount('#app')
