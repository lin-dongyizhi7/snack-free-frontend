<template>
  <div class="container mx-auto p-4 flex flex-col items-center">
    <h3 class="mb-1">{{ notePath ? "编辑笔记" : "添加笔记" }}</h3>
    <Editor v-if="!loading" :init-text="initialContent" @save="saveNote" @cancel="goBack" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getNoteContent, createNote, updateNote } from "../../api/notes";

import Editor from "../editor/index.vue";

const route = useRoute();
const router = useRouter();

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
};

const saveNote = async (content: string) => {
  if (notePath.value) {
    await updateNote(notePath.value, content, noteSha.value);
  } else {
    const fileName = `note_${Date.now()}.txt`;
    await createNote(fileName, content, process.env.TARGET_FOLDER);
  }
  router.push({ name: "MyPage" });
};

const goBack = () => {
  router.push({ name: "MyPage" });
};

onMounted(() => {
  fetchInitialContent();
});
</script>

<style scoped lang="less"></style>
