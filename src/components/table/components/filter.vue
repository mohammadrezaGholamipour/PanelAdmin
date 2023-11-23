<script setup>
import { inject, markRaw, onMounted, reactive, watch } from "vue";
import DatePicker from "./date-picker.vue";
import DropDown from "./drop-down.vue";
import Input from "./input.vue";
///////////////////////////
const emit = defineEmits(["close", "filter"]);
const parentState = inject("state");
const state = reactive({
  filterInputs: [],
  timer: null,
});
/////////////////////////////
onMounted(() => {
  handleSetFilterInputs(parentState.tableInfo.filterTable);
});
/////////////////////////////
watch(
  () => parentState.tableInfo.filterTable,
  (value) => {
    handleSetFilterInputs(value);
  },
  { deep: true }
);
/////////////////////////////
const handleSetFilterInputs = (filterTable) => {
  state.filterInputs = [];
  for (const input of filterTable) {
    const item = {
      id: input.id,
      placeholder: input.placeholder,
      data: input.data,
      component: "",
      value: input.value,
    };
    if (input.inputType === "input") {
      item.component = markRaw(Input);
    } else if (input.inputType === "dropDown") {
      item.component = markRaw(DropDown);
    } else if(input.inputType === "datePicker"){
       item.component = markRaw(DatePicker);
    }
    state.filterInputs.push(item);
  }
};
//////////////////////////////
const handleSetInputValue = (value, id) => {
  const input = state.filterInputs.find((item) => item.id === id);
  input.value = value;
};
//////////////////////////////
const handleSendValue = () => {
  clearTimeout(state.timer);
  const inputs = [];
  for (const { value, id } of state.filterInputs) {
    const item = { id, value };
    inputs.push(item);
  }
  state.timer = setTimeout(() => {
    emit("filter", inputs);
  }, 500);
};
</script>
<template>
  <div class="parent-table-filter text">
    <div class="parent-content-filter">
      <component
        @value="handleSetInputValue($event, component.id)"
        v-for="component in state.filterInputs"
        :is="component.component"
        :key="component.id"
        :data="component"
      ></component>
    </div>
    <!-- ///////////////////////////////// -->
    <div class="parent-btn-filter">
      <button @click="handleSendValue" class="btn-green">اعمال کردن</button>
      <button @click="emit('close')" class="btn-red">بستن</button>
    </div>
  </div>
</template>
<style scoped>
.parent-table-filter {
  @apply absolute top-[65px] z-[990] panel:static panel:!bg-transparent w-full flex dark:bg-[#151521] bg-[#f4f4f4] rounded-md flex-col min-w-[320px] items-center panel:flex-row justify-between gap-3;
}
.parent-content-filter {
  @apply flex bg-[#f4f4f4] w-full panel:w-[calc(100%-100px)] dark:bg-[#151521] rounded-md p-5 min-h-[95px] flex-wrap items-center gap-5 justify-start;
}
.parent-btn-filter {
  @apply flex panel:flex-col panel:w-auto panel:p-0 panel:justify-center rounded-md  flex-row items-center justify-evenly gap-3 p-2 w-full;
}
</style>
