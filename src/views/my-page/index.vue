<template>
  <div class="container mx-auto p-4 flex flex-col items-center">
    <el-button class="mb-10" @click="returnHome()" text>返回首页</el-button>
    <h1 class="text-2xl font-bold mb-4">我的主页</h1>
    <el-button class="" text @click="addNoteHandler">+ 添加笔记</el-button>
    <ul>
      <li v-for="note in notes" :key="note.sha" class="flex flex-col items-center w-full">
        <div class="flex items-center w-full">
          <div class="w-[240px] text-left">{{ note.name.split("##")[1] }}</div>
          <el-button class="w-[60px]" text @click="editNoteHandler(note)">
            编辑
          </el-button>
          <el-button class="w-[60px]" text @click="deleteNoteHandler(note)">
            删除
          </el-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

import { getNotes, deleteNote } from "../../api/notes";

const router = useRouter();
const returnHome = () => {
  router.push("/");
};

const notes = ref<any>([]);

const fetchNotes = async () => {
  notes.value = await getNotes(process.env.TARGET_FOLDER + "notes");
  console.log(notes.value);
};

const addNoteHandler = () => {
  router.push({ name: "NoteEditor" });
};

const editNoteHandler = (note: any) => {
  router.push({
    name: "NoteEditor",
    query: {
      notePath: note.path,
      noteSha: note.sha,
    },
  });
};

const deleteNoteHandler = async (note: any) => {
  await deleteNote(note.path, note.sha);
  await fetchNotes();
};

onMounted(() => {
  fetchNotes();
});
</script>

<style scoped lang="less"></style>
