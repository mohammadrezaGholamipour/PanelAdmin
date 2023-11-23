<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import imageLoader from "@/utils/imageLoader";
//////////////////////////////////////////
const emit = defineEmits(["selectCategory", "deleteCategory", "search"]);
const props = defineProps(["categories"]);
////////////////////////////////////////
const mainCategories = ref(null);
const state = reactive({
  statusDialog: false,
  status: "loading",
  category: {},
  timer: null,
  search: "",
});
///////////////////////////////
onMounted(async () => {
  if (props.categories.length) {
    await nextTick();
    const loadAllImage = await imageLoader(mainCategories);
    if (loadAllImage) {
      const allP = document.querySelectorAll(".main-categories p");
      allP.forEach((item) => {
        if (item.textContent.length > 14) {
          item.classList.add("animationForText");
        }
      });
      state.status = "list";
    }
  } else if (props.categories) {
    state.status = "empty";
  }
});
///////////////////////////////
watch(
  () => state.search,
  (value) => {
    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      emit("search", value);
    }, 1000);
  }
);
///////////////////////////////
const handleDeleteCategory = (category) => {
  state.category = category;
  state.statusDialog = true;
};
//////////////////////////////////
const handleStatusDialog = (status) => {
  if (status) {
    emit("deleteCategory", state.category.categoryId);
  }
  state.statusDialog = false;
};
//////////////////////////////////
watch(
  () => props.categories,
  async (value) => {
    if (value.length) {
      await nextTick();
      const loadAllImage = await imageLoader(mainCategories);
      if (loadAllImage) {
        const allP = document.querySelectorAll(".main-categories p");
        allP.forEach((item) => {
          if (item.textContent.length > 15) {
            item.classList.add("animationForText");
          }
        });
        state.status = "list";
      }
    } else if (value) {
      state.status = "empty";
    }
  }
);
</script>
<template>
  <div class="w-full h-full overflow-hidden">
    <!-- //////////////////////// -->
    <transition name="fade-scale">
      <div
        v-show="state.status === 'list'"
        class="main-categories"
        ref="mainCategories"
      >
        <div
          class="relative w-full max-w-[400px] min-w-[250px]"
          style="grid-column: 1 / -1"
        >
          <input
            class="input bg-white m-0 dark:bg-[#1e1e2d] dark:border-none"
            placeholder="عنوان دسته بندی را وارد کنید"
            v-model="state.search"
            type="text"
          />
          <i
            class="fa-duotone text fa-magnifying-glass text-xl absolute left-5 top-3 bottom-0 cursor-pointer hover:text-blue-500 transition-all"
          ></i>
        </div>
        <div
          v-for="(item, index) in props.categories"
          @click="emit('selectCategory', item)"
          class="category text"
          :key="index"
        >
          <img
            @error="$event.target.src = `/assets/category.png`"
            :src="item.imageName"
            class="rounded-md"
            height="66"
            width="66"
          />
          <p>{{ item.categoryTitle }}</p>
          <div class="flex w-full justify-center items-center gap-x-5">
            <i
              class="fa-duotone fa-gear text-xl text-blue-500 hover:rotate-45 cursor-pointer transition-all duration-300"
            ></i>
            <i
              class="fa-duotone fa-trash text-xl text-red-500 cursor-pointer"
              @click.stop="handleDeleteCategory(item)"
            ></i>
          </div>
        </div>
      </div>
    </transition>
    <!-- ///////////////////////////// -->
    <div
      class="flex w-full h-full relative flex-col items-center justify-start"
      v-if="state.status === 'empty'"
    >
      <div
        class="relative w-full max-w-[365px] min-w-[250px]"
        v-if="state.search"
      >
        <input
          class="input bg-white m-0 dark:bg-[#151521] dark:border-none"
          placeholder="عنوان دسته بندی را وارد کنید"
          v-model="state.search"
          type="text"
        />
        <i
          class="fa-duotone text fa-magnifying-glass text-xl absolute left-5 top-3 bottom-0 cursor-pointer hover:text-blue-500 transition-all"
        ></i>
      </div>
      <img width="350" src="@/assets/image/not-found-data.jpg" />
      <p class="text text-xl font-bold">دسته بندی یافت نشد</p>
    </div>
    <!-- ///////////////////////////// -->
    <div class="main-categories" v-if="state.status === 'loading'">
      <div v-for="item in 16" :key="item" class="category animate-pulse">
        <div
          class="w-[66px] h-[66px] rounded-md dark:bg-white bg-slate-500"
        ></div>
        <div
          class="w-full h-[20px] rounded-md dark:bg-white bg-slate-200"
        ></div>
        <div class="flex w-full justify-center items-center gap-x-5">
          <div
            class="w-[20px] h-[20px] dark:bg-white rounded-full bg-slate-200"
          ></div>
          <div
            class="w-[20px] h-[20px] dark:bg-white rounded-full bg-slate-200"
          ></div>
        </div>
      </div>
    </div>
    <!-- ////////////////////////////// -->
    <Dialog
      @dialogStatus="handleStatusDialog"
      :statusDialog="state.statusDialog"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :headerText="'dialog'"
      :headerStatus="false"
      :footerStatus="true"
      :dialogWidth="300"
    >
      <p>{{ `${state.category.categoryTitle} حذف شود؟` }}</p>
    </Dialog>
    <!-- ////////////////////////////// -->
  </div>
</template>
<style scoped>
.main-categories {
  @apply panel:!justify-items-start;
  grid-template-columns: repeat(auto-fit, minmax(176px, 1fr));
  justify-items: center;
  align-content: start;
  align-items: center;
  overflow: auto;
  grid-gap: 19px;
  display: grid;
  height: 100%;
  width: 100%;
}
.category {
  @apply flex cursor-pointer hover:shadow-md transition-all duration-500 flex-col gap-y-3 h-[182px] w-[176px] justify-center p-5 overflow-hidden items-center rounded-lg shadow-sm bg-white dark:bg-[#1e1e2d];
}
.category p {
  @apply text-[1rem] font-normal whitespace-nowrap cursor-pointer dark:text-white;
}
.animationForText {
  animation: marquee 8s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
