<script setup>
const props = defineProps(["data"]);
////////////////////////////////////
</script>
<template>
  <div class="parent-input-check">
    <div class="input-check text">
      <div
        class="transition-all w-[25px] h-[25px] shadow-sm flex justify-center items-center rounded-md"
        :class="props.data ? 'check-active ' : 'check-Inactive '"
      >
        <i class="fa-duotone fa-check text-white" v-if="props.data"></i>
      </div>
    </div>
  </div>
</template>
<style scoped>
.parent-input-check {
  @apply flex items-center justify-center;
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
