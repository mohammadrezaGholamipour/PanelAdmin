<script setup>
import { computed, inject } from "vue";
/////////////////////////////////////
const emit = defineEmits(["pagination"]);
const parentState = inject("state");
//////////////////////////////////////
const handleTotalPage = computed(() => {
  return Math.ceil(parentState.tableInfo.tableRow / 10);
});
////////////////////////////////////////////
const handleItem = (page, nextOrPrev) => {
  if (nextOrPrev === "prev") {
    if (parentState.tableInfo.currentPage > page && page > 1) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      parentState.tableInfo.currentPage < page &&
      page < handleTotalPage.value
    ) {
      return true;
    } else {
      return false;
    }
  }
};
////////////////////////////
const handleChangePage = (event) => {
  if (
    event.target.textContent === "بعد" &&
    parentState.tableInfo.currentPage < handleTotalPage.value
  ) {
    emit("pagination", parentState.tableInfo.currentPage + 1);
  } else if (
    event.target.textContent === "قبل" &&
    parentState.tableInfo.currentPage > 1
  ) {
    emit("pagination", parentState.tableInfo.currentPage - 1);
  } else if (Number(event.target.textContent)) {
    if (
      parentState.tableInfo.currentPage !== Number(event.target.textContent)
    ) {
      emit("pagination", Number(event.target.textContent));
    }
  }
};
</script>
<template>
  <div
    v-if="parentState.tableInfo.tableRow && handleTotalPage > 1"
    class="parent-pagination text"
  >
    <transition-slide>
      <div
        class="flex items-center gap-x-2 cursor-pointer"
        v-if="parentState.tableInfo.currentPage !== 1"
      >
        <i class="fa-duotone fa-arrow-right"></i>
        <p @click="handleChangePage">قبل</p>
      </div>
    </transition-slide>
    <div class="flex items-center gap-x-4">
      <p
        v-if="parentState.tableInfo.currentPage !== 1"
        @click="handleChangePage"
      >
        1
      </p>
      <!-- //////////////////////////////////// -->
      <div
        v-if="parentState.tableInfo.currentPage - 4 > 1"
        class="cursor-not-allowed"
      >
        .....
      </div>
      <!-- //////////////////////////////////// -->
      <p
        v-if="handleItem(parentState.tableInfo.currentPage - 3, 'prev')"
        @click="handleChangePage"
      >
        {{ parentState.tableInfo.currentPage - 3 }}
      </p>
      <p
        v-if="handleItem(parentState.tableInfo.currentPage - 2, 'prev')"
        @click="handleChangePage"
      >
        {{ parentState.tableInfo.currentPage - 2 }}
      </p>
      <p
        v-if="handleItem(parentState.tableInfo.currentPage - 1, 'prev')"
        @click="handleChangePage"
      >
        {{ parentState.tableInfo.currentPage - 1 }}
      </p>
      <!-- /////////////////////////// -->
      <p class="current-page">{{ parentState.tableInfo.currentPage }}</p>
      <!-- /////////////////////////// -->
      <p
        v-if="handleItem(parentState.tableInfo.currentPage + 1, 'next')"
        @click="handleChangePage"
      >
        {{ parentState.tableInfo.currentPage + 1 }}
      </p>
      <p
        v-if="handleItem(parentState.tableInfo.currentPage + 2, 'next')"
        @click="handleChangePage"
      >
        {{ parentState.tableInfo.currentPage + 2 }}
      </p>
      <p
        v-if="handleItem(parentState.tableInfo.currentPage + 3, 'next')"
        @click="handleChangePage"
      >
        {{ parentState.tableInfo.currentPage + 3 }}
      </p>
      <!-- /////////////////////////// -->
      <div
        v-if="parentState.tableInfo.currentPage + 4 < handleTotalPage"
        class="cursor-not-allowed"
      >
        .....
      </div>
      <!-- /////////////////////////// -->
      <p
        v-if="parentState.tableInfo.currentPage !== handleTotalPage"
        @click="handleChangePage"
      >
        {{ handleTotalPage }}
      </p>
    </div>
    <transition-slide>
      <div
        v-if="parentState.tableInfo.currentPage !== handleTotalPage"
        class="flex items-center gap-x-2 cursor-pointer"
      >
        <p @click="handleChangePage">بعد</p>
        <i class="fa-duotone fa-arrow-left"></i>
      </div>
    </transition-slide>
  </div>
</template>
<style scoped>
.parent-pagination {
  @apply flex justify-start panel:justify-center items-center w-full min-h-[65px] overflow-x-auto gap-x-4 p-2 rounded-md bg-[#f4f4f4] dark:bg-[#151521];
}
.parent-pagination p {
  @apply cursor-pointer;
}
.current-page {
  @apply px-3 py-1 dark:bg-[#1e1e2d] bg-[#009ef7] text-white shadow-md rounded-md;
}
</style>
