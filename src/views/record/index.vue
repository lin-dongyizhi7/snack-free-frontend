<template>
  <div>
    <el-button class="mb-10" @click="returnHome()" text>返回首页</el-button>
    <div class="text-center text-blue-400 text-xl mb-10">{{ markDate }}</div>
    <el-upload
      class="upload-demo p-2"
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
    <el-form :model="form" label-width="auto" class="w-full p-2">
      <el-form-item label="记录">
        <el-input
          :rows="4"
          type="textarea"
          placeholder="记录当下"
          v-model="form.desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="心情指数">
        <el-rate
          v-model="form.heart"
          :texts="['很不开心', '不开心', '一般', '棒', '很棒']"
          :colors="['#dc2626', '#ea580c', '#16a34a']"
          :icons="icons"
          :void-icon="Cloudy"
          size="large"
          show-text
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitFiles">提交打卡</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { dayjs, ElLoading, ElMessage, type UploadUserFile, type UploadProps } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { Cloudy, PartlyCloudy, Sunny } from '@element-plus/icons-vue';

import { uploadFileToGithub } from '../../utils/request';
import { insertDay } from "../../utils/date";
import {getMarkedDays, updateMarkedDays} from "../../api/date";
import { submitFormData } from '../../api/mark';

const router = useRouter();
const returnHome = () => {
    router.push('/');
}

const route = useRoute();
const markDate = ref<string>("");

onMounted(()=>{
  markDate.value = route.query.date as string;
});

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

const form = reactive({
  desc: '',
  heart: 5
});
const icons = [Cloudy, PartlyCloudy, Sunny];
const submitForm = async () => {
  const date = new Date(markDate.value);
  const formatDate = dayjs(date).format('YYYY-MM-DD-HH:mm:ss');
  await submitFormData(form, `${process.env.TARGET_FOLDER}${formatDate}/record.json`);
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
    const formatDate = dayjs(date).format('YYYY-MM-DD-HH:mm:ss');
    await uploadFileToGithub(fileList.value, process.env.TARGET_FOLDER + formatDate + '/');
    await submitForm();
    await addDay(markDate.value);
    loadingInstance.close();
    router.push({
      name: 'History',
      query: {
        date: markDate.value
      }
    });
 }

const addDay = async (date: string) => {
  const nowDates = await getMarkedDays(process.env.TARGET_FILE);
  const newDates = insertDay(nowDates, date);
  await updateMarkedDays(newDates, process.env.TARGET_FILE);
}
</script>

<style scoped lang="less">
.upload-demo {
  margin-bottom: 20px;
}
</style>
