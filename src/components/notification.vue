<script setup>
import { computed, ref, watch } from "vue";
import { usePinia } from "@/store/pinia";
/////////////////////////////////////
const notificationStatus = ref(false);
const borderBottomWidth = ref(0);
const notificationWidth = ref(0);
let borderBottomWidthSetTimeOut;
let borderBottomWidthInterVal;
const pinia = usePinia();
////////////////////////////
watch(
  () => pinia.state.notificationData.status,
  (value) => {
    if (value) {
      setTimeout(() => {
        const observer = new ResizeObserver((entries) => {
          const { width } = entries[0].contentRect;
          notificationWidth.value = width;
        });
        observer.observe(
          document.getElementsByClassName("parent-notification")[0]
        );
        handleTimerNotification();
      }, 200);
    } else {
      notificationStatus.value = false;
      clearInterval(borderBottomWidthInterVal);
      clearTimeout(borderBottomWidthSetTimeOut);
      borderBottomWidth.value = 0;
    }
  }
);
////////////////////////////////
const handleTimerNotification = () => {
  notificationStatus.value = true;
  borderBottomWidthInterVal = setInterval(() => {
    borderBottomWidth.value +=
      notificationWidth.value / (pinia.state.notificationData.timer / 70);
  }, 70);
  borderBottomWidthSetTimeOut = setTimeout(() => {
    handleCloseNotification();
  }, pinia.state.notificationData.timer + 1000);
};
///////////////////////////////
const handleColor = computed(() => {
  switch (pinia.state.notificationData.name) {
    case "error":
      return "#EB5757";
    case "warning":
      return "#F2C94C";
    case "info":
      return "#5458F7";
    case "success":
      return "#00CC99";
  }
});
/////////////////////////////////
const handleCloseNotification = () => {
  notificationStatus.value = false;
  setTimeout(() => {
    pinia.handleNotificationData({
      ...pinia.state.notificationData,
      status: false,
    });
  }, 500);
};
</script>

<template>
  <div
    v-if="pinia.state.notificationData.status"
    :class="[
      'parent-notification',
      { '!translate-x-[0px]': notificationStatus },
    ]"
    @click="handleCloseNotification"
  >
    <div
      :style="{
        backgroundImage: `url('/assets/${pinia.state.notificationData.name}.svg')`,
        backgroundColor: handleColor,
      }"
    ></div>
    <section>
      <h4 :style="{ color: handleColor }">
        {{ pinia.state.notificationData.textHeader }}
      </h4>
      <p>{{ pinia.state.notificationData.textMain }}</p>
    </section>
    <div
      :style="{ width: `${borderBottomWidth}px`, backgroundColor: handleColor }"
    ></div>
  </div>
</template>

<style scoped>
.parent-notification {
  @apply flex gap-[1rem] shadow-2xl overflow-hidden bg-white top-0 w-full items-center duration-500 cursor-pointer p-[1rem]  rounded-l-[5px] font-[dana]  fixed right-0 translate-x-[450px] transition-all z-[994];
  width: clamp(280px, 100%, 450px);
}

.parent-notification div:nth-child(1) {
  @apply flex rounded-full min-w-[60px] h-[60px] bg-no-repeat bg-center;
}

.parent-notification > h4 {
  @apply font-bold text-[18px] md:text-[15px];
}

.parent-notification > p {
  @apply font-normal text-[15px] md:text-[12px];
}

.parent-notification div:nth-child(3) {
  @apply absolute right-0 bottom-0 h-[3px] transition-all;
  transition: width linear 0.5s;
}
</style>
