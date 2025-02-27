// src/stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("myToken") || null, // 从本地存储获取 token，如果没有则为 null
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("myToken", token); // 同时存储到本地存储
    },
    removeToken() {
      this.token = null;
      localStorage.removeItem("myToken"); // 从本地存储移除
    },
  },
});
