<script setup>
import { onMounted, reactive, watch } from "vue";
import { Chart, registerables } from "chart.js";
import { usePinia } from "@/store/pinia";
import { BarChart } from "vue-chart-3";
/////////////////////////////////
Chart.register(...registerables);
const pinia = usePinia();
////////////////////////
onMounted(() => {
  responsiveChart(pinia.state.appWidth);
  colorMood(window.localStorage.colorMode === "dark" ? true : false);
  /////////////////////////
  state.data.datasets[0].data = [
    500000, 700000, 400000, 800000, 900000, 450000, 670000, 837000, 153000,
    689000, 1000000, 800000,
  ];
});
/////////////////////////
window.addEventListener("storage", (event) => {
  const color = event.target.localStorage.colorMode === "dark" ? true : false;
  colorMood(color);
});
////////////////////////
watch(
  () => pinia.state.appWidth,
  (value) => {
    responsiveChart(value);
  }
);
////////////////////////
const colorMood = (colorMoodStatus) => {
  if (colorMoodStatus) {
    state.options.scales.y.grid.color = "#6f6d6d";
    state.options.scales.x.ticks.color = "#ffffff";
    state.options.scales.y.ticks.color = "#ffffff";
  } else {
    state.options.scales.y.grid.color = "#e0e0e0";
    state.options.scales.x.ticks.color = "#737171";
    state.options.scales.y.ticks.color = "#737171";
  }
};
/////////////////////////////////
const responsiveChart = (value) => {
  if (value < 835) {
    state.options.scales.x.ticks.font.size = 11;
    state.data.datasets[0].barThickness = 15;
    state.options.indexAxis = "y";
  } else {
    state.options.scales.x.ticks.font.size = 14;
    state.data.datasets[0].barThickness = 25;
    state.options.indexAxis = "x";
  }
};
////////////////////////
const state = reactive({
  data: {
    labels: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#fd5c65",
          "#fd9644",
          "#26de80",
          "#2cccba",
          "#44abf1",
          "#4b7aec",
          "#a55fea",
          "#e94394",
          "#d63031",
          "#ee5a23",
          "#ffc412",
          "#fd5c65",
        ],
        barThickness: 15,
        borderRadius: 5,
      },
    ],
  },
  options: {
    indexAxis: "y",
    ////////////////////////
    animation: {
      from: 1,
      duration: 2000,
      easing: "easeOutElastic",
      delay: 0,
    },
    ////////////////////////
    plugins: {
      legend: {
        display: false,
      },
      ////////////////////////
      tooltip: {
        titleFont: {
          family: "dana",
          size: 15,
        },
        bodyFont: {
          family: "dana",
          size: 13,
        },
        titleMarginBottom: 10,
        displayColors: false,
        titleAlign: "center",
        bodyAlign: "center",
        padding: 10,
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.formattedValue || "";
            return value.toLocaleString() + " تومان";
          },
        },
      },
      ////////////////////////
    },
    scales: {
      x: {
        position: "bottom",
        ticks: {
          padding: 15,
          font: {
            family: "dana",
            weight: "bold",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
        callback: (value, index, values) => {
          return state.data.labels[values.length - 1 - index];
        },
      },
      ////////////////////////
      y: {
        grid: {
          borderDash: [2, 2],
        },
        ticks: {
          padding: 15,
          font: {
            family: "dana",
            weight: "bold",
            size: 14,
          },
        },
      },
      ////////////////////////
    },
  },
});
</script>
<template>
  <div class="parent-chart-bar">
    <p class="title">گزارش میزان فروش به صورت نمودار</p>
    <BarChart class="w-full" :chartData="state.data" :options="state.options" />
  </div>
</template>
<style scoped>
.parent-chart-bar {
  @apply flex flex-col w-full min-w-[320px] items-start justify-center rounded-md p-4 gap-y-5 dark:bg-[#1e1e2d] bg-white shadow-sm;
}
</style>
