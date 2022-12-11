import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'uno.css'
import '@unocss/reset/tailwind.css'

import DefaultLayout from './layouts/DefaultLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('DefaultLayout', DefaultLayout)
app.component('EmptyLayout', EmptyLayout)
app.mount('#app')
