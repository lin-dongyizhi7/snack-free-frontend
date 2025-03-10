<template>
  <div class="container mx-auto p-4 flex flex-col items-center gap-y-4">
    <div class="flex items-center">
      <h3 class="w-[200px]">{{ notePath ? "编辑笔记" : "添加笔记" }}</h3>
      <el-input class="w-[240px]" v-model="name" placeholder="新增笔记名"></el-input>
    </div>
    <Editor
      v-if="!loading"
      :init-text="initialContent"
      :view="justView"
      @save="saveNote"
      @cancel="goBack"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import { getNoteContent, createNote, updateNote, deleteNote } from "../../api/notes";

import Editor from "../editor/index.vue";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();

const justView = ref(false);
const notePath = ref<string>((route.query.notePath as string) || "");
const noteSha = ref<string>((route.query.noteSha as string) || "");
const initialContent = ref<string>("");

const loading = ref(false);
const fetchInitialContent = async () => {
  loading.value = true;
  if (notePath.value) {
    initialContent.value = await getNoteContent(notePath.value);
    loading.value = false;
  }
  loading.value = false;
};

const illegalChars = /[#\\/?*:"><|]/g;

const saveNote = async (content: string) => {
  if (illegalChars.test(name.value)) {
    ElMessage.error(`名称中不能包含# \ / ? * : , . " > < | "等非法字符`);
    return;
  }
  if (notePath.value) {
    if (initName.value !== name.value) {
      const fileName = `${dayjs(Date.now()).format("YYYY-MM-DD-HH:mm:ss")}##${
        name.value
      }`;
      await createNote(fileName, content, process.env.TARGET_FOLDER);
      await deleteNote(notePath, noteSha);
    } else {
      await updateNote(notePath.value, content, noteSha.value);
    }
  } else {
    const fileName = `${dayjs(Date.now()).format("YYYY-MM-DD-HH:mm:ss")}##${name.value}`;
    await createNote(fileName, content, process.env.TARGET_FOLDER);
  }
  router.push({ name: "MyPage" });
};

const goBack = () => {
  router.push({ name: "MyPage" });
};

const name = ref("");
const initName = ref("");

onMounted(() => {
  name.value = notePath.value.split("##")[1].split('.')[0];
  initName.value = name.value;
  fetchInitialContent();
  if (notePath.value && !noteSha.value) {
    justView.value = true;
  }
});
</script>

<style scoped lang="less"></style>
