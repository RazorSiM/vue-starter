import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import DefaultLayout from './layouts/DefaultLayout.vue'

import EmptyLayout from './layouts/EmptyLayout.vue'
import router from './router'
import 'virtual:uno.css'

import '@unocss/reset/tailwind.css'
import '@/assets/styles/main.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)
app.component('DefaultLayout', DefaultLayout)
app.component('EmptyLayout', EmptyLayout)
app.mount('#app')
