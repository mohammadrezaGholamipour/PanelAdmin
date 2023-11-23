<script setup>
import RequestLoading from "@/components/request-loading.vue";
import Notification from "@/components/notification.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
/////////////////////////
const observer = new ResizeObserver((entries) => {
  const { width: appWidth } = entries[0].contentRect;
  pinia.state.appWidth = appWidth;
});
observer.observe(document.getElementById("app"));
</script>

<template>
  <RequestLoading />
  <Notification />
  <router-view v-slot="{ Component }">
    <transition name="fade-scale">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-scale-enter {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
