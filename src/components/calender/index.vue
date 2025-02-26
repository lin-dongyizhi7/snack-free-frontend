<template>
  <div>
    <el-calendar v-model="currentDate">
      <template #dateCell="{ data }">
        <div class="calendar-cell">
          {{ data.day.split("-").slice(1).join("-") }}
          <div v-if="isMarked(data.day)" class="punch-mark"></div>
          <div v-else-if="isToday(data.day)" class="without-mark">
            <el-button size="mini" @click="punch(data.day)"> 打卡 </el-button>
          </div>
          <div v-else class="without-mark"></div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from "vue";

onMounted(async () => {
  punchedDates.value = ["2025-2-20", "2025-2-22", "2025-2-25"];
});

// 当前选中的日期
const currentDate = ref(null);

// 已打卡的日期数组
const punchedDates: Ref<string[]> = ref([]);

// 打卡方法
const punch = (date: string) => {
  if (!punchedDates.value.includes(date)) {
    punchedDates.value.push(date);
    // 这里可以添加与后端交互的代码，将打卡信息发送到服务器
    console.log(`已打卡：${date}`);
  }
};

const isMarked = (date: string) => {
  return punchedDates.value.includes(date);
};

// 判断是否为今天
const isToday = (date: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;
  return date === todayStr;
};
</script>

<style lang="less" scoped>
.calendar-cell {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.punch-mark {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: #52c41a;
  border-radius: 50%;
}
</style>
