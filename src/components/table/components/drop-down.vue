<script setup>
import { onClickOutside } from "@vueuse/core";
import { reactive, ref, watch } from "vue";
///////////////////////////////////
const props = defineProps(["data"]);
const emit = defineEmits(["value"]);
const dropDown = ref(null);
const state = reactive({
  dropDownSelected: null,
  dropDownStatus: false,
});
/////////////////////
onClickOutside(dropDown, () => {
  state.dropDownStatus = false;
});
////////////////////////////
const handleSelectItem = (item) => {
  state.dropDownStatus = !state.dropDownStatus;
  state.dropDownSelected = item;
};
////////////////////////////
watch(
  () => state.dropDownSelected,
  (value) => {
    emit("value", value.id);
  }
);
</script>
<template>
  <div ref="dropDown" class="parent-drop-down text">
    <!-- //////////////////////// -->
    <div
      @click="state.dropDownStatus = !state.dropDownStatus"
      class="btn-drop-down"
    >
      <p>{{ state.dropDownSelected?.name ?? props.data.placeholder }}</p>
      <i
        class="fa-duotone fa-chevron-down transition-all duration-500"
        :class="{ 'rotate-180': state.dropDownStatus }"
      ></i>
    </div>
    <!-- ///////////////////////// -->
    <transition-expand>
      <div v-if="state.dropDownStatus" class="list-drop-down">
        <p
          v-for="item in props.data.data"
          @click="handleSelectItem(item)"
          class="item-drop-down"
          :key="item.id"
        >
          {{ item.name }}
        </p>
      </div>
    </transition-expand>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-drop-down {
  @apply flex flex-col items-center justify-center relative;
  min-width: 165px;
  max-width: 250px;
  width: 100%;
}
.btn-drop-down {
  @apply bg-white dark:bg-[#1e1e2d] cursor-pointer w-full rounded-md overflow-hidden flex justify-between items-center p-[13px];
}
.list-drop-down {
  @apply bg-white max-h-[147px] overflow-y-scroll dark:bg-[#1e1e2d] absolute top-14 w-full shadow-md overflow-hidden rounded-md z-[11];
}
.item-drop-down {
  @apply p-3 border-b border-solid cursor-pointer hover:bg-[#f9f9f9] transition-all hover:text-[#009ef7];
}
p.item-drop-down:last-child {
  border: none;
}
</style>
