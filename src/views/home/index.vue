<script setup>
import BestProducts from "./components/best-products.vue";
import ChartBar from "./components/chart-bar.vue";
import { usePinia } from "@/store/pinia";
import { onMounted } from "vue";
//////////////////////////////////////
const pinia = usePinia();
onMounted(() => {
  pinia.handleBreadCrumb([{ name: "صفحه اصلی", link: "/" }]);
});
</script>
<template>
  <div class="parent-home-page page">
    <ChartBar />
    <BestProducts />
  </div>
</template>
<style scoped>
.parent-home-page {
  @apply flex flex-wrap justify-start items-center content-start overflow-y-auto gap-4;
}
</style>
