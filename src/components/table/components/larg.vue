<script setup>
import { inject } from "vue";
////////////////////////////
const state = inject("state");
</script>
<template>
  <div class="parent-table-larg">
    <!-- ///////////////////////// -->
    <transition-slide group class="w-full h-full">
      <table v-if="state.tableInfo.tableData.length" class="table-larg">
        <thead class="sticky top-0 bg-[#009ef7] text-center z-10 text-white">
          <tr>
            <th v-for="item in state.tableInfo.headerTable" :key="item.id">
              <div class="flex items-center justify-center gap-x-2">
                <p>{{ item.name }}</p>
                <i :class="item.icon"></i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <slot />
        </tbody>
      </table>
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
        class="w-full h-full flex flex-col gap-y-2 justify-start items-center"
        v-else
      >
        <div
          class="w-full min-h-[70px] bg-slate-300 dark:bg-slate-100 rounded-md shadow-md cursor-wait animate-pulse"
        ></div>
        <div
          class="w-full min-h-[500px] rounded-md shadow-md cursor-wait animate-pulse bg-slate-300 dark:bg-slate-100"
        ></div>
      </div>
    </transition-slide>
    <!-- /////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-table-larg {
  @apply w-full h-full overflow-auto px-1;
}
.table-larg {
  @apply w-full h-auto text-center;
}
.table-larg thead th {
  padding: 13px;
}
.table-larg thead th:first-child {
  @apply rounded-r-[7px];
}
.table-larg thead th:last-child {
  @apply rounded-l-[7px];
}
</style>
