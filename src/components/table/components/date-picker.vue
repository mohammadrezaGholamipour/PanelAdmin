<script setup>
import DatePicker from "@alireza-ab/vue3-persian-datepicker";
import { ref, watch } from "vue";
////////////////////////////////////
const props = defineProps(["data"]);
const emit = defineEmits(["value"]);
const date = ref();
///////////////////////////////////
watch(
  () => date.value,
  (value) => {
    emit("value", value);
  }
);
</script>
<template>
  <DatePicker
    :placeholder="props.data.placeholder"
    display-format="jYY/jM/jD"
    format="YYYY-MM-DD"
    v-model="date"
    mode="single"
    :column="1"
    type="date"
    clearable
  />
</template>
<style>
.pdp-icon {
  @apply dark:!bg-[#1e1e2d];
  max-height: fit-content !important;
  padding: 12px !important;
}
.pdp-icon svg {
  @apply dark:fill-white;
}
.pdp-input {
  @apply dark:!bg-[#1e1e2d] dark:!text-white text-slate-600;
  height: auto !important;
}
</style>
