import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const AboutView = () => import('@/views/AboutView.vue')
const Changelog = () => import ('@/views/ChangelogView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: 'DefaultLayout',
        title: 'Home',
        description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
      },
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: Changelog,
      meta: {
        layout: 'DefaultLayout',
        title: 'Changelog',
        description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        layout: 'EmptyLayout',
        title: 'About',
        description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
      },
    },
  ],
})

export default router
