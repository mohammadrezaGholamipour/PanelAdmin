<script setup>
import { inject } from "vue";
/////////////////////////////
const emit = defineEmits(["TableFilter"]);
const parentState = inject("state");
</script>
<template>
  <div
    v-if="parentState.tableInfo.tableData"
    class="header-table"
  >
    <div class="relative" style="width: clamp(212px, 100%, 365px)">
      <input
        class="input-grey dark:bg-[#151521] m-0"
        placeholder="عنوان را وارد کنید"
        type="text"
      />
      <i
        class="fa-duotone fa-magnifying-glass text-xl absolute left-5 top-3 bottom-0 cursor-pointer hover:text-blue-500 transition-all dark:text-white"
      ></i>
    </div>
    <button @click="emit('TableFilter')" class="btn-primary p-3">
      <p>فیلتر ها</p>
    </button>
  </div>
</template>

<style scoped>
.header-table {
  @apply flex w-full panel:justify-end justify-center items-center gap-3;
}
</style>
