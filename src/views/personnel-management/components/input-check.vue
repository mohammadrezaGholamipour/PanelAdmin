<script setup>
import { onMounted, reactive } from "vue";
//////////////////////////////
const emit = defineEmits(["updateData"]);
const props = defineProps(["data"]);
const state = reactive({
  inputCheck: [],
});
//////////////////////////////
onMounted(() => {
  state.inputCheck = props.data;
});
//////////////////////////////////////
const handleInputCheck = (inputCheck) => {
  inputCheck.status = !inputCheck.status;
  emit("updateData", inputCheck.value);
};
</script>
<template>
  <div class="parent-input-check">
    <div
      v-for="(item, index) in state.inputCheck"
      @click="handleInputCheck(item)"
      class="input-check text"
      :key="index"
    >
      <p>{{ item.label }}</p>
      <div
        class="transition-all w-[25px] h-[25px] shadow-sm flex justify-center items-center rounded-md"
        :class="item.status ? 'check-active ' : 'check-Inactive '"
      >
        <i v-if="item.status" class="fa-duotone fa-check text-white"></i>
      </div>
    </div>
  </div>
</template>
<style scoped>
.parent-input-check {
  @apply flex items-center justify-center gap-x-5;
}
.input-check {
  @apply flex items-center gap-x-2 cursor-pointer;
}
.check-Inactive {
  @apply bg-slate-300;
}
.check-active {
  @apply bg-blue-500;
}
</style>
