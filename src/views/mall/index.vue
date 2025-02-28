<template>
  <div class="header mb-2">
    <el-button class="mb-10" @click="returnHome()" text>返回首页</el-button>
    <div class="text-2xl font-bold text-center mb-4">商城</div>
    <div class="flex justify-center w-full">
      <div class="text-lg font-medium">
        积分: <span class="text-green-600">{{ points }}</span>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <img :src="product.image" alt="商品图片" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-1">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

import { useCounterStore } from "../../stores/dates";

const counterStore = useCounterStore();
const points = ref(0);

const router = useRouter();
const returnHome = () => {
  router.push("/");
};

onMounted(() => {
  points.value = computePoints();
});

const computePoints = () => {
  const days = counterStore.consecutiveCheckInDays;
  // 每日基础奖励
  let basePoints = 10 * days;
  let additionalPoints = 0;
  // 连续打卡奖励
  if (days >= 42) {
    additionalPoints = 800 + 200 + 100 + 50;
  } else if (days >= 21) {
    additionalPoints = 200 + 100 + 50;
  } else if (days >= 14) {
    additionalPoints = 100 + 50;
  } else if (days >= 7) {
    additionalPoints = 50;
  }

  let totalPoints = basePoints + additionalPoints;
  return totalPoints;
};

const products = ref([
  {
    id: 1,
    name: "商品名称 1",
    price: "20",
    points: "20",
    image: "./temp.jpg",
  },
  {
    id: 2,
    name: "商品名称 2",
    price: "199",
    points: "199",
    image: "./temp.jpg",
  },
  {
    id: 3,
    name: "商品名称 3",
    price: "99",
    points: "99",
    image: "./temp.jpg",
  },
  {
    id: 4,
    name: "商品名称 4",
    price: "20",
    points: "20",
    image: "./temp.jpg",
  },
  {
    id: 5,
    name: "商品名称 5",
    price: "199",
    points: "199",
    image: "./temp.jpg",
  },
  {
    id: 6,
    name: "商品名称 6",
    price: "99",
    points: "99",
    image: "./temp.jpg",
  },
  {
    id: 7,
    name: "商品名称 7",
    price: "50",
    points: "50",
    image: "./temp.jpg",
  },
  {
    id: 8,
    name: "商品名称 8",
    price: "399",
    points: "399",
    image: "./temp.jpg",
  },
  // 可以继续添加更多商品
]);
</script>

<style scoped lang="less"></style>
