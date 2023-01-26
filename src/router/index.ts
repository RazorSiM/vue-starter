import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
const AboutView = () => import("@/views/AboutView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        layout: "DefaultLayout",
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
      meta: {
        layout: "EmptyLayout",
      },
    },
  ],
});

export default router;
