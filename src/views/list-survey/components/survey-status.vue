<script setup>
import { reactive, provide, onMounted } from "vue";
import Table from "@/components/table/index.vue";
/////////////////////////////////////
const props = defineProps(["votes"]);
const state = reactive({
  tableInfo: {
    tableHeaderStatus: false,
    tableData: false,
    headerTable: [
      { id: 1, name: "گزینه ها", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 4, name: "درصد پاسخ", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "تعداد کاربر", icon: "fa-duotone fa-mobile" },
    ],
  },
});
provide("state", state);
///////////////////////
onMounted(() => {
  state.tableInfo.tableData = props.votes;
});
///////////////////////
</script>
<template>
  <div class="parent-survey-status">
    <Table v-if="state.tableInfo.tableData">
      <template v-slot:tableLarg>
        <tr v-for="(item, index) in state.tableInfo.tableData" :key="index">
          <td>{{ item.pollItemTitle ? item.pollItemTitle : "نامشخص" }}</td>
          <td>{{ item.percent }}</td>
          <td>{{ item.userCount }}</td>
        </tr>
      </template>
      <template v-slot:tableSmall>
        <div
          v-for="(item, index) in state.tableInfo.tableData"
          class="table-small"
          :key="index"
        >
          <div class="table-small-row font-bold">
            <p
              v-for="header in state.tableInfo.headerTable"
              class="table-small-col"
              :key="header.id"
            >
              {{ header.name }} :
            </p>
          </div>
          <div class="table-small-row">
            <p class="table-small-col">
              {{ item.pollItemTitle ? item.pollItemTitle : "نامشخص" }}
            </p>
            <p class="table-small-col">{{ item.percent }}</p>
            <p class="table-small-col">
              {{ item.userCount }}
            </p>
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>
<style scoped>
.parent-survey-status {
  @apply w-full overflow-hidden flex flex-col justify-start gap-y-3;
}
</style>
