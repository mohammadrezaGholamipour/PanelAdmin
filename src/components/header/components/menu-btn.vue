<script setup>
import { usePinia } from "@/store/pinia";
////////////////////////////////////
const pinia = usePinia();
///////////////////////
</script>
<template>
  <div class="parent-menu-btn">
    <i
      :class="pinia.state.sideBarStatus ? 'fa-sidebar' : 'fa-sidebar-flip'"
      class="fa-duotone text-2xl cursor-pointer"
      v-if="pinia.state.appWidth > 999"
      @click="pinia.handleSideBarStatus"
    ></i>
    <i
      :class="
        pinia.state.sideBarStatus
          ? 'fa-sharp fa-light fa-xmark'
          : 'fa-duotone fa-navicon'
      "
      class="text-2xl cursor-pointer"
      @click="pinia.handleSideBarStatus"
      v-else
    ></i>
  </div>
</template>

<style scoped>
.parent-menu-btn {
  @apply flex justify-center items-center;
}
</style>
