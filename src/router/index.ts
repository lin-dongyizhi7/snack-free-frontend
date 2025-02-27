import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/home/login.vue";
import Home from "../views/home/index.vue";
import Record from "../views/record/index.vue";
import Mall from "../views/mall/index.vue";

import { eqLock } from "../utils/constant";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/record",
    name: "Record",
    component: Record,
    meta: { requiresAuth: true },
  },
  {
    path: "/mall",
    name: "Mall",
    component: Mall,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && (!authStore.token || !eqLock(authStore.token))) {
    next("/");
  } else {
    next();
  }
});

export default router;
