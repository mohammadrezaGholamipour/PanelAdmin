<script setup>
import { ref } from "vue";
//////////////////////////
const isFullscreen = ref(false);
////////////////////////////////
const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
};
/////////////////////////////
const enterFullscreen = () => {
  const element = document.getElementById("app");
  if (element?.requestFullscreen) {
    element.requestFullscreen();
  } else if (element?.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element?.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element?.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
  isFullscreen.value = true;
};
//////////////////////////
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  isFullscreen.value = false;
};
</script>

<template>
  <i
    :class="isFullscreen ? 'fa-compress-arrows' : 'fa-arrows-maximize'"
    class="fa-duotone text-xl cursor-pointer"
    @click="toggleFullscreen"
  ></i>
</template>
