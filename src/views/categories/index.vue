<script setup>
import CategoryMain from "./components/category-main.vue";
import NewOrEdit from "./components/new-or-edit.vue";
import { computed, onMounted, reactive } from "vue";
import categoryApi from "@/api/category";
import { usePinia } from "@/store/pinia";
/////////////////////////////////
const pinia = usePinia();
const state = reactive({
  requestLoading: false,
  categorySelected: {},
  status: 1,
});
////////////////////////////
onMounted(() => {
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "لیست دسته بندی ها", link: "/categories" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
//////////////////////////////////////////
const requestDeleteCategory = (categoryId) => {
  categoryApi
    .delete(categoryId)
    .then(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "انجام شد",
        textMain: "دسته بندی مورد نظر با موفقیت حذف شد",
      });
      pinia.requestGetCategoryList();
    })
    .catch((error) => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: error?.response?.data?.message,
      });
    });
};
//////////////////////////////////////
const requestNewCategory = (category) => {
  state.requestLoading = true;
  categoryApi
    .new(category)
    .then(() => {
      pinia.requestGetCategoryList();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "انجام شد",
        textMain: "با موفقیت افزوده شد",
      });
      state.status = 1;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "انجام شد",
        textMain: "دسته بندی افزوده نشد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
/////////////////////////////////////////
const requestEditCategory = (category) => {
  state.requestLoading = true;
  categoryApi
    .edit(category)
    .then(() => {
      pinia.requestGetCategoryList();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "انجام شد",
        textMain: "با موفقیت انجام شد",
      });
      state.status = 1;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "دسته بندی تغییر نکرد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
///////////////////////////////////////////
const handlCategoryHeaderTitle = computed(() => {
  switch (state.status) {
    case 1:
      return "دسته بندی ها";
    case 2:
      return "افزودن دسته بندی";
    case 3:
      return "تغییر دسته بندی";
  }
});
// //////////////////////////
const handleChangeStatus = (data) => {
  if (state.status !== 1) {
    state.status = 1;
    return;
  }
  if (data) {
    state.categorySelected = data;
    state.status = 3;
  } else {
    state.categorySelected = {};
    state.status = 2;
  }
};
</script>
<template src="">
  <div class="parent-categories page">
    <!-- ////////////////////// -->
    <div class="header-categories">
      <p class="title">{{ handlCategoryHeaderTitle }}</p>
      <button
        class="flex items-center gap-x-3 p-2 px-5 justify-center"
        :class="state.status === 1 ? 'btn-primary' : 'btn-red'"
        @click="handleChangeStatus(null)"
      >
        <p>{{ state.status === 1 ? "افزودن" : "بازگشت" }}</p>
        <i
          :class="state.status === 1 ? 'fa-circle-plus' : 'fa-angles-left'"
          class="fa-duotone text-xl"
        ></i>
      </button>
    </div>
    <!-- ////////////////////// -->
    <transition-fade group class="w-full h-full overflow-hidden">
      <CategoryMain
        @search="pinia.requestGetCategoryList($event)"
        @deleteCategory="requestDeleteCategory"
        @selectCategory="handleChangeStatus"
        :categories="pinia.state.categories"
        v-if="state.status === 1"
      />
      <NewOrEdit
        @editeCategory="requestEditCategory"
        :category="state.categorySelected"
        @newCategory="requestNewCategory"
        :loading="state.requestLoading"
        v-else
      />
    </transition-fade>
    <!-- ////////////////////// -->
  </div>
</template>
<style scoped>
.parent-categories {
  @apply flex flex-col justify-start gap-y-3 items-start;
}
.header-categories {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px];
}
</style>
