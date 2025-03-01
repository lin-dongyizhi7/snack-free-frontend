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
  <el-form :model="form" label-width="auto" class="w-full p-2">
    <el-form-item label="记录">
      <el-input
        :rows="4"
        type="textarea"
        placeholder="记录当下"
        v-model="form.desc"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="心情指数">
      <el-rate
        v-model="form.heart"
        :texts="['很不开心', '不开心', '一般', '棒', '很棒']"
        :colors="['#dc2626', '#ea580c', '#16a34a']"
        :icons="icons"
        :void-icon="Cloudy"
        disabled
        size="large"
        show-text
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Cloudy, PartlyCloudy, Sunny } from "@element-plus/icons-vue";

import { getImagesByDate, getFormData } from "../../api/mark";
import { dayjs } from "element-plus";

const router = useRouter();
const returnHome = () => {
  router.push("/");
};

const route = useRoute();
const markDate = ref<string>("");
const randomIndex = ref(97);

const form = reactive({
  desc: "",
  heart: 5,
});

const icons = [Cloudy, PartlyCloudy, Sunny];

onMounted(async () => {
  markDate.value = route.query.date as string;
  const num = Math.floor(Math.random() * 725) + 1;
  randomIndex.value = num;
  await getMarkedImages();
  await getRecordJson();
  console.log(images.value);
});

const images = ref<string[]>([]);
const getMarkedImages = async () => {
  const res = (await getImagesByDate(
    markDate.value,
    process.env.TARGET_FOLDER
  )) as string[];
  images.value = res;
};
const getRecordJson = async () => {
  const date = new Date(markDate.value);
  const formatDate = dayjs(date).format("YYYY-MM-DD");
  const res = await getFormData(`${process.env.TARGET_FOLDER}${formatDate}/record.json`);
  if (res) {
    Object.assign(form, res);
  }
};
</script>

<style scoped lang="less"></style>
