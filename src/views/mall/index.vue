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
  <div class="opts flex w-full items-center justify-center">
    <!-- 添加商品按钮 -->
    <el-button type="primary" text @click="openDrawer">添加商品</el-button>
    <el-button type="primary" text @click="toggleManageMode">{{
      !isManageMode ? "管理商品" : "退出管理"
    }}</el-button>
    <el-text class="w-[30px]" v-if="isManageMode">{{ selectedProducts.length }}</el-text>
    <el-button
      type="danger"
      text
      @click="deleteSelectedProducts"
      v-if="isManageMode"
      :disabled="selectedProducts.length === 0"
      >删除</el-button
    >
  </div>
  <!-- 抽屉组件 -->
  <el-drawer
    v-model="drawerVisible"
    :show-close="false"
    direction="btt"
    size="80%"
    title="添加新商品"
  >
    <template #default>
      <add-view @add="addProduct"></add-view>
    </template>
  </el-drawer>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="product in productStore.products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <template v-if="isManageMode">
          <!-- 修改复选框绑定 -->
          <el-checkbox
            :checked="selectedProducts.includes(product)"
            @change="handleCheckboxChange(product)"
          ></el-checkbox>
        </template>
        <a :href="product.link" target="_blank">
          <img :src="product.showImg" alt="商品图片" class="w-full h-48 object-cover" />
        </a>
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
import { useProductsStore } from "../../stores/product";
import { addProductToGithub, getProductList } from "../../api/products";
import { ElLoading, ElMessage } from "element-plus";
// import { product_list } from "./products";

import addView from "./add-product.vue";

const productStore = useProductsStore();
const counterStore = useCounterStore();
const points = ref(0);

const router = useRouter();
const returnHome = () => {
  router.push("/");
};

onMounted(() => {
  points.value = computePoints();
  init();
});

const init = async () => {
  const res = await getProductList(`${process.env.TARGET_FOLDER}products`);
  if (res.length) {
    productStore.setProducts(res);
  }
};

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

const drawerVisible = ref(false);

const openDrawer = () => {
  drawerVisible.value = true;
};

// 添加新商品
const addProduct = async () => {
  drawerVisible.value = false;
  const loading = ElLoading.service({ fullscreen: true });
  await init();
  loading.close();
  ElMessage.success("商品添加成功");
};

// 是否处于管理模式
const isManageMode = ref(false);
const selectedProducts = ref<any[]>([]);

// 切换管理模式
const toggleManageMode = () => {
  isManageMode.value = !isManageMode.value;
  if (!isManageMode.value) {
    // 退出管理模式时清空选中商品
    selectedProducts.value = [];
  }
};

// 处理复选框状态变化
const handleCheckboxChange = (product: any) => {
  const index = selectedProducts.value.findIndex((p) => p.id === product.id);
  if (index !== -1) {
    // 如果已选中，则取消选中
    selectedProducts.value.splice(index, 1);
  } else {
    // 如果未选中，则添加到选中列表
    selectedProducts.value.push(product);
  }
};

// 删除选中的商品
const deleteSelectedProducts = async () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning("请选择要删除的商品");
    return;
  }
  productStore.removeProducts(selectedProducts.value);
  isManageMode.value = false;
  selectedProducts.value = [];
  const loading = ElLoading.service({ fullscreen: true });
  const newData = JSON.stringify({ product_list: productStore.products });
  await addProductToGithub(process.env.TARGET_FOLDER + "products/products.json", newData);
  loading.close();
  ElMessage.success("商品删除成功");
};
</script>

<style scoped lang="less"></style>
