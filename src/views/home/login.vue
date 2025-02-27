<template>
  <div class="flex flex-col items-center justify-center p-20 gap-y-10">
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
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Check } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

import { updateToken, lock, eqLock } from "../../utils/constant";

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();

const inputValue = ref("");

const router = useRouter();

const verify = () => {
  const res = lock(inputValue.value);
  if (eqLock(res)) {
    authStore.setToken(res)
    updateToken(inputValue.value);
    router.push('/home');
  }
};
</script>

<style scoped lang="less"></style>
