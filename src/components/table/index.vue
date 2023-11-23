<script setup>
import Pagination from "./components/pagination.vue";
import Filter from "./components/filter.vue";
import Header from "./components/header.vue";
import Small from "./components/small.vue";
import Larg from "./components/larg.vue";
import { usePinia } from "@/store/pinia";
import { inject, ref } from "vue";
//////////////////////////////////
const emit = defineEmits(["filter", "pagination"]);
const tableFilterStatus = ref(false);
const parentState = inject("state");
const pinia = usePinia();
/////////////////////////
</script>
<template>
  <div class="parent-tables text">
    <div
      class="flex w-full relative flex-col justify-start items-center gap-y-3"
      v-if="parentState.tableInfo.tableHeaderStatus"
    >
      <Header @TableFilter="tableFilterStatus = !tableFilterStatus" />
      <Filter
        @filter="emit('filter', $event), (tableFilterStatus = false)"
        v-show="tableFilterStatus && parentState.tableInfo.tableData"
        @close="tableFilterStatus = false"
      />
    </div>
    <transition-fade group class="w-full h-full overflow-hidden">
      <!-- ////////////////////////////////////////// -->
      <Larg v-if="pinia.state.appWidth >= 1000">
        <slot name="tableLarg" />
      </Larg>
      <!-- ////////////////////////////////////////// -->
      <Small v-else>
        <slot name="tableSmall" />
      </Small>
      <!-- ////////////////////////////////////////// -->
    </transition-fade>
    <!-- ////////////////////////////////////////// -->
    <Pagination @pagination="emit('pagination', $event)" />
  </div>
</template>
<style scoped>
.parent-tables {
  @apply w-full relative flex flex-col justify-start items-center overflow-hidden bg-white dark:bg-[#1e1e2d] p-3 rounded-md  gap-y-5 shadow-sm;
}
</style>
