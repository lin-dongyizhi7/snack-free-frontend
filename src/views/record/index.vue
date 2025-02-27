<template>
  <div>
    <el-button class="mb-10" @click="returnHome()" text>返回首页</el-button>
    <div class="text-center text-blue-400 text-xl mb-10">{{ markDate }}</div>
    <el-upload
      class="upload-demo"
      ref="uploadRef"
      v-model:file-list="fileList"
      action="#"
      :multiple="true"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      list-type="picture"
      drag
    >
      <template #trigger>
        <div style="height: 150px" class="flex items-center justify-center">
          <el-button type="primary" text>选取图片</el-button>
        </div>
      </template>
      <template #tip>
        <div class="el-upload__tip">只能上传 jpg/png 文件，一次不超过50MB</div>
      </template>
    </el-upload>
    <el-button type="primary" @click="submitFiles">提交打卡</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { dayjs, ElLoading, ElMessage, type UploadUserFile, type UploadProps } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

import { uploadFileToGithub } from '../../utils/request';
import { insertDay } from "../../utils/date";
import {getMarkedDays, updateMarkedDays} from "../../api/date";

const router = useRouter();
const returnHome = () => {
    router.push('/');
}

const route = useRoute();
const markDate = ref<string>("");

onMounted(()=>{
  console.log(route.query.date);
  markDate.value = route.query.date;
})

const uploadRef = ref(null);
const fileList = ref([]);

const handleChange = (file: UploadUserFile, fileList: UploadUserFile[]) => {
  console.log(file);
  fileList.forEach((f) => {
    if (!fileList.some((item) => item.uid === f.uid)) {
      fileList.push(f);
    }
  });
};

const handleRemove = (file: UploadUserFile, fileList: UploadUserFile[]) => {
  const index = fileList.findIndex((item) => item.uid === file.uid);
  if (index > -1) {
    fileList.splice(index, 1);
  }
};

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file);
}

const submitFiles = async () => {
    if (!fileList.value.length) {
      ElMessage({
        message: '需要上传图片！',
        type: 'warning',
      });
      return;
    }
    const loadingInstance = ElLoading.service({ fullscreen: true });
    const date = new Date(markDate.value);
    const formatDate = dayjs(date).format('YYYY-MM-DD');
    console.log(fileList.value);
    await uploadFileToGithub(fileList.value, formatDate + '/');
    await addDay(markDate.value);
    loadingInstance.close();
    router.push({
      name: 'History',
      query: {
        date: markDate.value
      }
    });
 }

const addDay = async (date) => {
  const nowDates = await getMarkedDays();
  const newDates = insertDay(nowDates, date);
  await updateMarkedDays(newDates);
}
</script>

<style scoped lang="less">
.upload-demo {
  margin-bottom: 20px;
}
</style>
