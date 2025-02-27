<template>
  <div v-if="!verified" class="flex flex-col items-center justify-center p-20 gap-y-10">
    输入密钥
    <el-input
      size="large"
      v-model="inputValue"
      style="max-width: 1200px"
      placeholder="Please input key"
    >
      <template #append>
        <el-button @click="verify" :icon="Check"></el-button>
      </template>
    </el-input>
  </div>
  <div v-else class="pt-12">
    <div class="header"></div>
    <div class="body">
      <calender-record></calender-record>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Check } from "@element-plus/icons-vue";

import { updateToken, lock, eqLock } from "../../utils/constant";

import CalenderRecord from "../calender/index.vue";

const verified = ref(false);
const inputValue = ref("");

const verify = () => {
  const res = lock(inputValue.value);
  console.log(res);
  if (eqLock(res)) {
    verified.value = true;
    updateToken(inputValue.value);
  }
};
</script>

<style scoped lang="less"></style>
