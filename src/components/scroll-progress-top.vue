<script setup>
import { ref, onMounted, computed } from "vue";
/////////////////////////////
const parentPage = ref(null);
const progress = ref(0);
/////////////////////
onMounted(() => {
  parentPage.value = document.getElementsByClassName("route")[0];
  parentPage.value.addEventListener("scroll", handleScroll);
});
//////////////////////////
const handleScroll = () => {
  const scrollHeight =
    parentPage.value.scrollHeight - parentPage.value.clientHeight;
  const scrollTop = parentPage.value.scrollTop;
  progress.value = (scrollTop / scrollHeight) * 100;
};
//////////////////////////////////
const progressStyle = computed(() => {
  return {
    width: `${progress.value}%`,
  };
});
</script>

<template>
  <div class="scroll-progress-container" ref="scrollContainer">
    <div class="scroll-progress" :style="progressStyle"></div>
  </div>
</template>

<style scoped>
.scroll-progress-container {
  @apply animate-pulse;
  position: absolute;
  z-index: 995;
  width: 100%;
  height: 4px;
  left: 0;
  top: 0;
}

.scroll-progress {
  background: linear-gradient(to right, #0a7cff, #ff1717);
  transition: width 0.2s ease-out;
  transform-origin: left center;
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
