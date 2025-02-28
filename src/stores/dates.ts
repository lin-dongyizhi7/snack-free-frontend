import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    consecutiveCheckInDays: 0,
  }),
  actions: {
    setConsecutiveDays(num: number) {
      this.consecutiveCheckInDays = num;
    },
  },
});
