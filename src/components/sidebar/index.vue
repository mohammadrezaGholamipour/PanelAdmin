<script setup>
import AccountInfo from "./components/account-info.vue";
import { usePinia } from "@/store/pinia";
import Menu from "./components/menu.vue";
import { computed } from "vue";
////////////////////////////////////
const pinia = usePinia();
const handleStatusClass = computed(() => {
  return pinia.state.sideBarStatus
    ? "!min-w-[245px] !w-[245px]"
    : "overflow-hidden";
});
const handleSmallClass = computed(() => {
  return pinia.state.appWidth < 1000
    ? "fixed right-0 top-0 h-full z-[999]"
    : "";
});
////////////////////////////
document.addEventListener("click", (event) => {
  const parentMenuBtn = document.querySelector(".parent-menu-btn");
  const parentSideBar = document.querySelector(".parent-sideBar");
  ////////////////////////////////////////////////////////
  const clickOutSideParentSideBar = parentSideBar?.contains(event.target);
  const clickParentMenuBtn = parentMenuBtn?.contains(event.target);
  ////////////////////////////////////////////////////////
  if (
    !clickOutSideParentSideBar &&
    !clickParentMenuBtn &&
    pinia.state.sideBarStatus &&
    pinia.state.appWidth < 1000
  ) {
    pinia.handleSideBarStatus();
  }
});
</script>
<template>
  <div :class="['parent-sideBar ', handleStatusClass, handleSmallClass]">
    <AccountInfo :class="pinia.state.sideBarStatus ? 'active' : 'disable'" />
    <div
      :class="pinia.state.sideBarStatus ? 'active' : 'disable'"
      class="seperator"
    ></div>
    <Menu :class="pinia.state.sideBarStatus ? 'active' : 'disable'" />
  </div>
</template>

<style scoped>
.parent-sideBar {
  @apply flex flex-col justify-start items-center gap-y-5 min-w-0 w-0 py-[20px] transition-all duration-500 bg-[#79B4B7] dark:bg-[#1e1e2d] text-slate-700 dark:text-white ;
}
.active {
  transform: translateX(0px);
  transition: transform 0.7s ease-in-out;
}
.disable {
  transform: translateX(245px);
  transition: transform 0.3s ease-in-out;
}
.seperator {
  border-bottom: 1px dotted #6e6e6e;
  display: block;
  width: 100%;
  height: 0;
}
</style>
