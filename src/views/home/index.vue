<template>
  <div class="pt-4">
    <div class="header flex items-center justify-around">
      <div
        class="bg-green-300 text-zinc-950 flex items-center justify-center w-20 h-20 rounded-full cursor-pointer"
        @click="toMyPage()"
      >
        <span>我的</span>
      </div>
      <div
        class="bg-indigo-500 text-white flex items-center justify-center w-20 h-20 rounded-full cursor-pointer"
        @click="toMall()"
      >
        <span>商城</span>
      </div>
    </div>
    <div class="body mt-6">
      <calender-record></calender-record>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import CalenderRecord from "../calender/index.vue";

const router = useRouter();

const toMyPage = () => {
  router.push('/my-page');
};
const toMall = () => {
  router.push('/mall');
};
</script>

<style scoped lang="less"></style>
