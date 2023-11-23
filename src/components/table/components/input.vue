<script setup>
import { reactive, watch } from "vue";
/////////////////////////
const props = defineProps(["data"]);
const emit = defineEmits(["value"]);
const state = reactive({
  search: "",
});
///////////////////////////
watch(
  () => state.search,
  (value) => {
    emit("value", value);
  }
);
</script>
<template>
  <div class="relative" style="width: clamp(212px, 100%, 365px)">
    <input
      class="input-grey bg-white dark:bg-[#1e1e2d] m-0"
      :placeholder="props.data.placeholder"
      v-model="state.search"
      type="text"
    />
    <i
      class="fa-duotone fa-magnifying-glass text-xl absolute left-5 top-3 bottom-0 cursor-pointer hover:text-blue-500 transition-all dark:text-white"
    ></i>
  </div>
</template>
