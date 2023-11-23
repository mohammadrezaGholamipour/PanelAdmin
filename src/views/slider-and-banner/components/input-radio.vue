<script setup>
import { onMounted, reactive } from "vue";
//////////////////////////////
const emit = defineEmits(["updateData"]);
const props = defineProps(["data"]);
const state = reactive({
  inputRadios: [],
});
//////////////////////////////
onMounted(() => {
  state.inputRadios = props.data;
});
//////////////////////////////////////
const handleInputRadio = (inputRadio) => {
  state.inputRadios.forEach((item) => {
    item.status = false;
  });
  inputRadio.status = true;
  emit("updateData", inputRadio.value);
};
</script>
<template>
  <div class="parent-input-radios">
    <div
      v-for="(item, index) in state.inputRadios"
      @click="handleInputRadio(item)"
      class="input-radio text"
      :key="index"
    >
      <p>{{ item.label }}</p>
      <div
        :class="
          item.status
            ? 'radio-active transition-all'
            : 'radio-Inactive transition-all'
        "
      ></div>
    </div>
  </div>
</template>
<style scoped>
.parent-input-radios {
  @apply flex items-center justify-start gap-x-5;
}
.input-radio {
  @apply flex items-center gap-x-2 cursor-pointer;
}
.radio-Inactive {
  @apply w-[22px] h-[22px] bg-slate-300 rounded-full shadow-sm;
}
.radio-active {
  @apply w-[22px] h-[22px] bg-[#F4F4F4] rounded-full shadow-sm border-blue-500 border-[6px];
}
</style>
