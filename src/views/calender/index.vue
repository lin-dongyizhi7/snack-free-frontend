<template>
  <div>当前连续打卡天数: {{ consecutiveDays }}</div>
  <div class="">
    <el-calendar ref="calendar" v-model="currentDate">
      <template #header="{ date }">
        <span>打卡日历</span>
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')"> 上年 </el-button>
          <el-button size="small" @click="selectDate('prev-month')"> 上月 </el-button>
          <el-button size="small" @click="selectDate('today')">今天</el-button>
          <el-button size="small" @click="selectDate('next-month')"> 下月 </el-button>
          <el-button size="small" @click="selectDate('next-year')"> 下年 </el-button>
        </el-button-group>
      </template>
      <template #date-cell="{ data }">
        <div class="calendar-cell" @click="opt(data.day)">
          {{ data.day.split("-").slice(1).join("-") }}
          <!-- 标记打卡 -->
          <div v-if="isMarked(data.day)" class="punch-mark"></div>
          <!-- 标记已达到关键天数 -->
          <div v-if="isKeyDayReached(data.day).flag" class="key-day-reached-mark">
            {{ isKeyDayReached(data.day).num }}
          </div>
          <!-- 标记未来将达到关键天数 -->
          <div v-else-if="isKeyDayUpcoming(data.day).flag" class="key-day-upcoming-mark">
            {{ isKeyDayUpcoming(data.day).num }}
          </div>
          <div v-if="isToday(data.day) && !isMarked(data.day)" class="without-mark">
            <el-button size="small" text @click="punch(data.day)"> 打卡 </el-button>
          </div>
          <div
            v-if="
              !isMarked(data.day) &&
              daysDiffToday(data.day) < 0 &&
              daysDiffToday(data.day) > -7
            "
          >
            <el-button size="small" text @click="punch(data.day)"> 补打卡 </el-button>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { CalendarDateType, CalendarInstance } from 'element-plus';

import {isToday, isPreDay, daysDiffToday} from '../../utils/date';
import {getMarkedDays} from "../../api/date";

const router = useRouter();

onMounted(async() => {
  punchedDates.value = await getMarkedDays(process.env.TARGET_FILE);
  consecutiveDays.value = getConsecutiveDays();
});

const calendar = ref<CalendarInstance>()
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

// 关键天数
const keyDays = [7, 14, 21, 30];

const currentDate = ref(null);
const punchedDates: Ref<string[]> = ref([]);

const isMarked = (date: string) => {
  return punchedDates.value.includes(date);
};

// 计算连续打卡天数
const consecutiveDays = ref(0);
const consecutiveDates: Ref<string[]> = ref([]);
const getConsecutiveDays = () => {
  const dates = punchedDates.value;
  const lastDay = dates[dates.length - 1];
  if (daysDiffToday(lastDay)<-1) return 0;
  let count = 1;
  consecutiveDates.value.push(lastDay);
  for (let i = dates.length - 2; i >= 0; i--) {
    if (isPreDay(dates[i], dates[i+1])) {
      count+=1;
      consecutiveDates.value.push(dates[i]);
    } else {
      break;
    }
  }
  return count;
};

interface FlagDate {
  flag: boolean;
  num: number
}

// 判断是否是已达到关键天数的日子
const isKeyDayReached = (date: string) : FlagDate => {
  const index = consecutiveDates.value.indexOf(date);
  if (index !== -1) {
    const dateIndex = consecutiveDays.value - index;
    return {
      flag: keyDays.some((keyDay) => dateIndex === keyDay),
      num: dateIndex,
    }
  }
  return {
    flag: false,
    num: 0
  }
};

// 判断是否是未来将达到关键天数的日子
const isKeyDayUpcoming = (date: string) : FlagDate => {
  const lastDay = consecutiveDates.value[consecutiveDays.value - 1]
  if (consecutiveDays.value === 0) {
    return {
      flag: false,
      num: 0
    }
  }
  const dateIndex = consecutiveDays.value + daysDiffToday(date) + (isToday(lastDay) ? 0 : 1);
  return {
    flag: keyDays.some((keyDay) => dateIndex === keyDay),
    num: dateIndex,
  }
};

const viewHistory = (date: string) => {
  console.log(date);
  router.push({
    name: 'History',
    query: {
      date: date
    }
  });
}
const punch = (date) => {
  console.log('打卡');
  router.push({
    name: 'Record',
    query: {
      date: date
    }
  });
};


const opt = (date: string) => {
  if (isMarked(date)) {
    viewHistory(date);
  }

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

.key-day-reached-mark {
  color: #52c41a;
}

.key-day-upcoming-mark {
  color: #aaaaaa;
}

@media (max-width: 768px) {
  .el-calendar {
    width: 100%;
  }
}
</style>
