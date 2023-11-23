<script setup>
import { usePinia } from "@/store/pinia";
///////////////////////
const pinia = usePinia();
</script>
<template>
  <div class="bread-crumb">
    <p>داشبورد مدیریت</p>
    <ul>
      <li v-for="(item, index) in pinia.state.breadCrumb" :key="index">
        <router-link class="cursor-pointer" :to="item.link"
          >{{ item.name }}
        </router-link>
        <i
          v-if="pinia.state.breadCrumb.length - (index + 1)"
          class="fa-duotone fa-chevrons-left"
        ></i>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.bread-crumb {
  @apply flex flex-col justify-center items-start;
}
.bread-crumb p {
  @apply font-extrabold ;
}
.bread-crumb ul {
  @apply flex flex-wrap items-center gap-x-1 text-xs mt-2;
}
.bread-crumb ul li {
  @apply flex gap-x-1 items-center;
}
</style>
