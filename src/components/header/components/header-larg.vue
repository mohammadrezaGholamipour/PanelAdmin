<script setup>
import BreadCrumb from "./bread-crumb.vue";
import ColorMood from "./color-mood.vue";
import MenuBtn from "./menu-btn.vue";
import Size from "./size.vue";
import Logo from "./logo.vue";
</script>
<template>
  <div class="header-larg">
    <!-- ///////////////////// -->
    <section>
      <span>
        <Logo />
        <MenuBtn />
      </span>
      <BreadCrumb class="mr-3" />
    </section>
    <!-- ///////////////////// -->
    <section>
      <Size />
      <ColorMood />
    </section>
    <!-- ///////////////////// -->
  </div>
</template>
<style scoped>
.header-larg {
  @apply flex w-full h-[74px] justify-between items-center;
}
.header-larg section {
  @apply flex justify-center h-full items-center gap-x-3;
}
.header-larg section:nth-child(2) {
  @apply pl-5;
}

.header-larg section span {
  @apply flex w-[245px] justify-evenly text-black items-center bg-[#f9f9f9] h-full;
}
</style>
