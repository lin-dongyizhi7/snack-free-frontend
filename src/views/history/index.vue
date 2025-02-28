<template>
  <div class="flex flex-col gap-y-4 items-center mb-6" style="width: 100%">
    <el-button @click="returnHome()" text>返回首页</el-button>
    <div class="text-center text-blue-400 text-xl">
      {{ markDate }}
    </div>
    <img class="size-20" :src="`./ys-emoji/${randomIndex}.png`" />
  </div>
  <el-carousel trigger="click" :autoplay="false" height="450px">
    <el-carousel-item
      v-for="(imgUrl, index) in images"
      :key="index"
      class="bg-gray-400/20"
      style="display: flex; justify-content: center; align-items: center"
    >
      <!-- <img class="h-80" :src="imgUrl" :alt="`picture-${index}`"></img> -->
      <div class="h-[400px] w-[300px]">
        <el-image
          style="width: 100%; height: 100%"
          :src="imgUrl"
          :alt="`picture-${index}`"
          fit="contain"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="images"
          preview-teleported
          show-progress
        >
        </el-image>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import { getImagesByDate } from "../../api/mark";

const router = useRouter();
const returnHome = () => {
  router.push("/");
};

const route = useRoute();
const markDate = ref<string>("");
const randomIndex = ref(97);

onMounted(async () => {
  markDate.value = route.query.date as string;
  const num = Math.floor(Math.random() * 725) + 1;
  randomIndex.value = num;
  await getMarkedImages();
  console.log(images.value);
});

const images = ref<string[]>([]);
const getMarkedImages = async () => {
  const res = await getImagesByDate(markDate.value, process.env.TARGET_FOLDER) as string[];
  images.value = res;
};
</script>

<style scoped lang="less"></style>
