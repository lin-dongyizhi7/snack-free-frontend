<template>
  <div>
    <h1>积分抽奖</h1>
    <div class="flex items-center">
      <div>剩余积分: {{ remainingPoints }}</div>
      <div>累计抽数: {{ drawCount }}</div>
    </div>
    <el-button @click="drawLottery" :disabled="remainingPoints < 50">抽奖</el-button>
    <div><canvas id="lotteryCanvas"></canvas></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPointsData, updatePointsData } from "../../api/products";

// 定义数据
const remainingPoints = ref(0);
const costPoints = ref(0);
const totalPoints = ref(0);
// 计数器
const drawCount = ref(0);

const awards = [
  { level: "一级", price: [1000, 2000], probability: 2 },
  { level: "二级", price: [500, 1000], probability: 6 },
  { level: "三级", price: [200, 500], probability: 12 },
  { level: "四级", price: [50, 200], probability: 20 },
  { level: "五级", price: [0, 50], probability: 25 },
  { level: "谢谢惠顾", price: [], probability: 35 },
];
const ctx = ref(null);
const radius = 150;
const centerX = 200;
const centerY = 200;

// 加载积分
const loadPoints = async () => {
  const res = await getPointsData(`${process.env.TARGET_FOLDER}points.json`);
  totalPoints.value = res.total;
  costPoints.value = res.cost;
  remainingPoints.value = res.remain;
  drawCount.value = res.count;
};

// 保存积分
const savePoints = async () => {
  const newData = JSON.stringify({
    total: totalPoints.value,
    cost: costPoints.value,
    remain: remainingPoints.value,
    count: drawCount.value,
  });
  await updatePointsData(`${process.env.TARGET_FOLDER}points.json`, newData);
};

const drawLottery = () => {
  if (remainingPoints.value < 50) return;
  remainingPoints.value -= 50;
  //   savePoints();
  drawCount.value++;

  let winLevel;
  // 检查是否触发保底机制
  const guaranteeCount = 10; // 假设每 10 次抽奖保底一次
  if (drawCount.value >= guaranteeCount) {
    winLevel = "二级"; // 保底级别
    drawCount.value = 0; // 重置计数器
  } else {
    const totalProbability = awards.reduce((acc, award) => acc + award.probability, 0);
    const random = Math.random() * totalProbability;
    let sum = 0;
    for (const award of awards) {
      sum += award.probability;
      if (random < sum) {
        winLevel = award.level;
        if (winLevel === "一级") {
          drawCount.value = 0; // 抽到最高级别重置计数器
        }
        break;
      }
    }
  }
  console.log("抽中了", winLevel);
  drawPieChart();
};

// 绘制扇形图
const drawPieChart = () => {
  let startAngle = 0;
  for (const award of awards) {
    const endAngle = startAngle + (award.probability / 100) * 2 * Math.PI;
    ctx.value.beginPath();
    ctx.value.moveTo(centerX, centerY);
    ctx.value.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.value.closePath();
    // 这里可以根据不同级别设置不同颜色
    ctx.value.fillStyle = "lightgray";
    ctx.value.fill();
    startAngle = endAngle;
  }
};

onMounted(async () => {
  await loadPoints();
  ctx.value = document.getElementById("lotteryCanvas").getContext("2d");
});
</script>
