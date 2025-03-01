<template>
  <div class="w-full p-2">
    <el-form :model="productForm" :rules="rules" ref="formRef" label-width="80px">
      <!-- 商品名称 -->
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="productForm.name"
          :maxlength="20"
          show-word-limit
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <!-- 商品链接 -->
      <el-form-item label="商品链接" prop="link">
        <el-input v-model="productForm.link" placeholder="请输入商品链接"></el-input>
      </el-form-item>
      <!-- 商品图片上传 -->
      <el-form-item label="商品图片">
        <el-upload
          class="upload-demo p-2"
          ref="uploadRef"
          v-model:file-list="fileList"
          action="#"
          :multiple="true"
          :auto-upload="false"
          :on-change="handleChange"
          :on-remove="handleRemove"
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
      </el-form-item>
      <!-- 商品价格 -->
      <el-form-item label="商品价格" prop="price">
        <el-input-number
          :min="0"
          :max="10000"
          :controls="false"
          v-model="productForm.price"
          placeholder="请输入商品价格"
        ></el-input-number>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button text type="primary" @click="submitForm">提交</el-button>
        <el-button text @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElLoading, ElMessage, type FormInstance, type UploadUserFile } from 'element-plus';

import { addProductToGithub, type ProductData } from "../../api/products";
import { uploadFileToGithub } from "../../utils/request";
import { useProductsStore } from "../../stores/product";

const productStore = useProductsStore();

// 表单引用
const formRef = ref<FormInstance>();
// 商品表单数据
const productForm = reactive<ProductData>({
  id: -1,
  name: "",
  link: "",
  image: [],
  showImg: "",
  price: 0,
  points: 0
});

// 表单校验规则
const rules = ref({
  name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  link: [{ required: true, message: "请输入商品链接", trigger: "blur" }],
  price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
});

const uploadRef = ref(null);
const fileList = ref<UploadUserFile[]>([]);
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

const emits = defineEmits(['add']);

// 提交表单
const submitForm = async () => {
    if (!formRef.value) return;
    if (!formRef.value.validate()) {
        ElMessage.error("表单信息填写有误，请检查");
        return;
    }
    productForm.image = fileList.value.map((file)=>file.name);
    productForm.id = Date.now();
    productForm.points = productForm.price;
    const loading = ElLoading.service({fullscreen: true});
    await uploadFileToGithub(fileList.value, process.env.TARGET_FOLDER + 'products/');
    productStore.addProduct(productForm);
    const newData = JSON.stringify({product_list: productStore.products});
    await addProductToGithub(process.env.TARGET_FOLDER + 'products/products.json', newData);
    loading.close();
    emits('add');
};

// 重置表单
const resetForm = () => {
   Object.assign(productForm, {
    name: "",
    link: "",
    image: [],
    price: 0,
  });
};
</script>

<style scoped></style>
