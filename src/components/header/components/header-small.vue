<script setup>
import BreadCrumb from "./bread-crumb.vue";
import ColorMood from "./color-mood.vue";
import MenuBtn from "./menu-btn.vue";
import Logo from "./logo.vue";
import Size from "./size.vue";
</script>
<template>
  <div class="parent-header-small">
    <!-- ////////////////////////// -->
    <section>
      <Logo />
      <MenuBtn />
    </section>
    <!-- ////////////////////////// -->
    <span></span>
    <!-- ////////////////////////// -->
    <section>
      <BreadCrumb />
      <div><Size /> <ColorMood /></div>
    </section>
    <!-- ////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-header-small {
  @apply w-full flex p-5 gap-y-3 flex-col justify-center items-center;
}
.parent-header-small > section {
  @apply flex w-full justify-between items-center;
}
.parent-header-small > section > div:nth-child(2) {
  @apply flex gap-x-3 items-center;
}
.parent-header-small > span {
  @apply w-full h-[1px] bg-[#F8F0DF];
}
</style>
