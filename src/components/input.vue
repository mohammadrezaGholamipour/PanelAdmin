<script setup>
import { filterNumbers } from "@/utils/convert-number";
import { reactive, watch } from "vue";
/////////////////////////
const props = defineProps(["placeholder"]);
const emit = defineEmits(["value"]);
const state = reactive({
  value: "",
});
///////////////////////////
watch(
  () => state.value,
  (value) => {
    state.value = filterNumbers(value);
    emit("value", state.value);
  }
);
</script>
<template>
  <div class="relative w-full">
    <input
      class="input-grey w-full bg-white dark:bg-[#1e1e2d] m-0"
      :placeholder="props.placeholder"
      v-model="state.value"
      type="text"
    />
    <i
      class="fa-duotone fa-magnifying-glass text-xl absolute left-5 top-3 bottom-0 cursor-pointer hover:text-blue-500 transition-all dark:text-white"
    ></i>
  </div>
</template>
