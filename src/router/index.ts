import { createRouter, createWebHistory } from "vue-router";
import About from "/@/views/About.vue";
import Home from "/@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      layout: "BaseLayout",
    },
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      layout: "EmptyLayout",
    },
  },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
