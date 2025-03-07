import { createRouter, createWebHashHistory } from "vue-router";

import Login from "../views/home/login.vue";
import Home from "../views/home/index.vue";
import Record from "../views/record/index.vue";
import History from "../views/history/index.vue";
import MyPage from "../views/my-page/index.vue";
import NoteEditor from "../views/my-page/note-add-edit.vue";
import Mall from "../views/mall/index.vue";
import Lottery from "../views/mall/lottery.vue";

import { eqLock, updateToken } from "../utils/constant";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/",
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
    path: "/history",
    name: "History",
    component: History,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-page",
    name: "MyPage",
    component: MyPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/note-editor",
    name: "NoteEditor",
    component: NoteEditor,
    meta: { requiresAuth: true },
  },
  {
    path: "/mall",
    name: "Mall",
    component: Mall,
    meta: { requiresAuth: true },
  },
  {
    path: "/lottery",
    name: "Lottery",
    component: Lottery,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(from, to);
  const token = localStorage.getItem("myToken");
  const authStore = useAuthStore();
  if (
    to.meta.requiresAuth &&
    !token &&
    (!authStore.token || !eqLock(authStore.token))
  ) {
    next("/login");
  } else {
    if (token) updateToken(token);
    next();
  }
});

export default router;
