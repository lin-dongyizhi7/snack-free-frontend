<template>
  <div>
    <el-button class="mb-10" @click="returnHome()" text>返回首页</el-button>
    mall
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const returnHome = () => {
    router.push('/');
}
</script>

<style scoped lang="less"></style>
