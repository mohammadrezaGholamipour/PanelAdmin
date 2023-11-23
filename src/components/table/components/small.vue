<script setup>
import { inject } from "vue";
////////////////////////////
const state = inject("state");
</script>
<template>
  <transition-slide group class="parent-table-small">
    <slot v-if="state.tableInfo.tableData.length" />
    <!-- ////////////////////////////// -->
    <div
      class="w-full flex relative flex-col items-center justify-center"
      v-else-if="state.tableInfo.tableData"
    >
      <p class="text text-xl absolute top-7 font-bold">چیزی پیدا نشد!</p>
      <img width="350" src="@/assets/image/not-found-data.jpg" />
    </div>
    <!-- ////////////////////////////// -->
    <div
      v-else
      class="w-full overflow-auto h-full flex flex-col gap-y-2 px-1 justify-start items-center"
    >
      <div
        class="w-full min-h-[312px] rounded-md shadow-md cursor-wait animate-pulse bg-slate-300 dark:bg-slate-100"
        v-for="item in 5"
        :key="item"
      ></div>
    </div>
  </transition-slide>
</template>
<style scoped>
.parent-table-small {
  @apply flex w-full h-full  overflow-y-auto flex-col px-1 pb-1 justify-start gap-y-3 items-center;
}
</style>
