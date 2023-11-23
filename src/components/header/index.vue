<script setup>
import HeaderSmall from "./components/header-small.vue";
import HeaderLarg from "./components/header-larg.vue";
import { usePinia } from "@/store/pinia";
///////////////////////
const pinia = usePinia();
////////////////////////////////////
</script>
<template>
  <header>
    <HeaderLarg v-if="pinia.state.appWidth > 999" />
    <HeaderSmall v-else />
  </header>
</template>
<style scoped>
header {
  @apply flex justify-between items-center bg-[#79B4B7] dark:bg-[#1e1e2d] text-slate-700 dark:text-white shadow-md w-full;
}
</style>
