<template>
  <div class="w-full">
    <div id="vditor" ref="vditorRef"></div>
    <el-button @click="goBack" text>返回</el-button>
    <el-button v-if="!view" @click="saveNote" type="primary" text>保存</el-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const vditorRef = ref(null);
const vditorInstance = ref(null);

const props = defineProps({
  initText: {
    type: String,
    required: false,
    default: "添加新笔记",
  },
  view: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const editorContent = ref("");

onMounted(() => {
  editorContent.value = props.initText;
  vditorInstance.value = new Vditor("vditor", {
    height: 580,
    toolbar: [
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "link",
      "|",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "|",
      "quote",
      "line",
      "code",
      "inline-code",
      "insert-before",
      "insert-after",
      "|",
      "upload",
      "table",
      "undo",
      "redo",
      "fullscreen",
      "preview",
      "edit-mode",
    ],
    value: editorContent.value,
    placeholder: "添加内容...",
    readOnly: props.view,
    cache: {
      enable: false,
    },
  });
});

const emits = defineEmits(["save", "cancel"]);

const saveNote = () => {
  editorContent.value = vditorInstance.value.getValue();
  emits("save", editorContent.value);
};

const goBack = () => {
  emits("cancel");
};
</script>
<style lang="less" scoped>
:deep(.vditor-reset) {
  text-align: left;
}
</style>
