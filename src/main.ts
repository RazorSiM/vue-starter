import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'

import App from './App.vue'
import router from './router'

import 'virtual:uno.css'

import '@unocss/reset/tailwind-compat.css'
import '@/assets/styles/global.css'

import DefaultLayout from './layouts/DefaultLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)
app.component('DefaultLayout', DefaultLayout)
app.component('EmptyLayout', EmptyLayout)
app.mount('#app')
