<script setup>
import { useRoute } from "vue-router";
import { reactive } from "vue";
////////////////////////
const route = useRoute();
const state = reactive({
  menuList: [
    {
      name: "دسته بندی ها",
      route: "/categories",
      icon: "fa-duotone fa-books",
    },
    {
      name: "نظرات",
      route: "/comments",
      icon: "fa-duotone fa-books",
    },
    {
      name: "لیست سفارشات",
      route: "/listOrder",
      icon: "fa-duotone fa-books",
    },
    {
      name: "کاربران با بیشترین خرید",
      route: "/userMostPurchase",
      icon: "fa-duotone fa-books",
    },
    {
      name: "گزارش فروش",
      route: "/salesReport",
      icon: "fa-duotone fa-books",
    },
    {
      name: "گزارش انبار",
      route: "/storeReport",
      icon: "fa-duotone fa-books",
    },
    {
      name: "گزارش تراکنش ها",
      route: "/transactionReport",
      icon: "fa-duotone fa-books",
    },
    {
      name: "لیست نظرسنجی ها",
      route: "/listSurvey",
      icon: "fa-duotone fa-books",
    },
    {
      name: "ارسال پیام",
      route: "/sendMessage",
      icon: "fa-duotone fa-books",
    },
    {
      name: "برچسب ها",
      route: "/tags",
      icon: "fa-duotone fa-books",
    },
    {
      name: "اسلایدر و بنر",
      route: "/slideAndBanner",
      icon: "fa-duotone fa-books",
    },
    {
      name: "مدیریت پرسنل",
      route: "/personnelManagement",
      icon: "fa-duotone fa-books",
    },
    {
      name: "مدیریت نقش ها",
      route: "/manageRole",
      icon: "fa-duotone fa-books",
    },
    {
      name: "مدیریت کاربران",
      route: "/userManagement",
      icon: "fa-duotone fa-books",
    },
  ],
});
</script>

<template>
  <div class="parent-menu">
    <div v-for="(item, index) in state.menuList" :key="index" class="menu-item">
      <router-link
        :class="{
          'bg-[#009ef7] text-white rounded-md ': route.path === item.route,
        }"
        class="flex gap-x-3 items-center w-full p-2"
        :to="item.route"
      >
        <i :class="item.icon"></i>
        <p class="whitespace-nowrap">{{ item.name }}</p>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.parent-menu {
  @apply w-full flex relative flex-col items-start justify-start px-[25px] overflow-y-auto overflow-hidden;
}
.menu-item {
  @apply w-full flex justify-between items-center py-1 transition-[color] hover:text-white cursor-pointer;
}
</style>
