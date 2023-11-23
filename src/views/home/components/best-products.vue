<script setup>
import { onMounted, reactive } from "vue";
///////////////////////////
const state = reactive({
  data: [
    {
      imageProduct: "/assets/image.png",
      name: "گیاه شناسی",
      category: "طب سنتی",
      type: "دیجیتال",
      status: { sale: 50, view: 20, download: 80, like: 10 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "آموزش حسابداری",
      category: "فناوری",
      type: "دیجیتال",
      status: { sale: 40, view: 50, download: 10, like: 870 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "عادت های اتمی",
      category: "کتاب",
      type: "کالا",
      status: { sale: 70, view: 0, download: 40, like: 30 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "تلویزیون",
      category: "فناوری",
      type: "کالا",
      status: { sale: 30, view: 25, download: 87, like: 12 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "کامپیوتر",
      category: "فناوری",
      type: "کالا",
      status: { sale: 25, view: 85, download: 75, like: 35 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "عرقیات گیاهی",
      category: "طب سنتی",
      type: "دیجیتال",
      status: { sale: 57, view: 25, download: 174, like: 58 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "ماشین های هیبریدی",
      category: "فناوری",
      type: "دیجیتال",
      status: { sale: 14, view: 25, download: 852, like: 14 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "مزایای گوشه گیر بودن",
      category: "کتاب",
      type: "کالا",
      status: { sale: 74, view: 0, download: 40, like: 30 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "کالی لینوکس",
      category: "فناوری",
      type: "کالا",
      status: { sale: 98, view: 52, download: 825, like: 0 },
    },
    {
      imageProduct: "/assets/image.png",
      name: "کامپیوتر",
      category: "فناوری",
      type: "کالا",
      status: { sale: 35, view: 88, download: 258, like: 14 },
    },
  ],
  bestProducts: [],
  bestTabs: [
    { name: "فروش", icon: "fa-duotone fa-face-tongue-money", type: "sale" },
    { name: "دانلود", icon: "fa-duotone fa-download", type: "download" },
    { name: "لایک", icon: "fa-duotone fa-thumbs-up", type: "like" },
    { name: "بازدید", icon: "fa-duotone fa-eye", type: "view" },
  ],
  bestTabSelected: "sale",
});
/////////////////////////////////
onMounted(() => {
  handleChangeTabBestProduct("sale");
});
/////////////////////////////////
const handleChangeTabBestProduct = (type) => {
  state.bestProducts = [];
  const data = state.data.sort((a, b) => b.status[type] - a.status[type]);
  for (let index = 0; index < 5 && index < data.length; index++) {
    state.bestProducts.push(data[index]);
  }
  state.bestTabSelected = type;
};
</script>
<template>
  <div class="parent-best-product text">
    <!-- ///////////////////////////////////// -->
    <div>
      <div
        @click="handleChangeTabBestProduct(item.type)"
        v-for="(item, index) in state.bestTabs"
        :key="index"
        :class="{
          'bg-slate-100 shadow-md animate-pulse dark:text-black':
            state.bestTabSelected === item.type,
        }"
      >
        <p>{{ item.name }}</p>
        <i :class="item.icon"></i>
      </div>
    </div>
    <!-- ///////////////////////////////////// -->
    <div>
      <template v-if="state.bestProducts.length">
        <div
          v-for="(item, index) in state.bestProducts"
          :key="index"
          class="flex w-full items-center justify-between"
          :class="{
            'border-dashed border-b': state.bestProducts.length - (index + 1),
          }"
        >
          <div class="flex items-center">
            <div
              class="w-[45px] flex items-center justify-center bg-[#f9f9f9] dark:bg-[#1b1b29] rounded-md h-[45px]"
            >
              <img :src="item.imageProduct" width="23" />
            </div>
            <div class="flex items-start p-3 justify-center flex-col gap-y-1">
              <p
                class="text-[#181C32] font-bold text text-no-wrap-best-product-right"
              >
                {{ item.name }}
              </p>
              <p
                class="dark:text-[#565674] text-[#A1A5B7] text-no-wrap-best-product-right"
              >
                {{ item.category }}
              </p>
            </div>
          </div>
          <p
            class="dark:text-[#565674] text-[#A1A5B7] text-no-wrap-best-product-left"
          >
            {{ item.type }}
          </p>
        </div>
      </template>
      <div v-else class="flex relative flex-col items-center">
        <p class="text text-xl absolute top-7 font-bold">موردی یافت نشد</p>
        <img src="@/assets/image/not-found-data.jpg" width="350" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.parent-best-product {
  @apply flex flex-col rounded-md p-4 gap-y-5 dark:bg-[#1e1e2d] bg-white shadow-sm;
  min-height: 476px;
  width: 348px;
}
.parent-best-product > div:nth-child(1) {
  @apply w-full gap-x-2 flex items-center justify-between;
}
.parent-best-product > div:nth-child(1) div {
  @apply flex items-center transition-all duration-500 gap-x-1 p-2 cursor-pointer rounded-md;
}
.parent-best-product > div:nth-child(2) {
  @apply flex w-full flex-col items-start justify-center;
}
</style>
