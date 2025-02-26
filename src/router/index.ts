import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/home/index.vue";
import Record from "../views/record/index.vue";
import Mall from "../views/mall/index.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/record",
    name: "Record",
    component: Record,
  },
  {
    path: "/mall",
    name: "Mall",
    component: Mall,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
