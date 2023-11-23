<script setup>
import SideBar from "@/components/sidebar/index.vue";
import Header from "@/components/header/index.vue";
import Footer from "@/components/footer/index.vue";
import { usePinia } from "@/store/pinia";
import { onMounted } from "vue";
////////////////////////////////
const pinia = usePinia();
////////////////////////////////
onMounted(() => {
  pinia.requestGetCategoryList();
  pinia.requestGetAccountInfo();
  pinia.requestGetGroupList();
});
///////////////////////
</script>
<template>
  <div class="parent-layout">
    <!-- ///////////////////////// -->
    <Header />
    <!-- ///////////////////////// -->
    <main>
      <SideBar />
      <router-view v-slot="{ Component }">
        <transition-fade group class="w-full h-full overflow-hidden">
          <component :is="Component" />
        </transition-fade>
      </router-view>
    </main>
    <!-- ///////////////////////// -->
    <Footer />
    <!-- ///////////////////////// -->
  </div>
</template>

<style scoped>
.parent-layout {
  @apply bg-[#f9f9f9] relative max-w-[2000px] min-w-[350px] mx-auto dark:bg-[#151521] flex flex-col h-screen w-screen;
}
main {
  @apply grow flex overflow-hidden relative;
}
</style>
