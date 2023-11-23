<script setup>
import userManagementApi from "@/api/user-management";
import { onMounted, reactive, provide } from "vue";
import Table from "@/components/table/index.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////
const props = defineProps(["userId"]);
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نوع امتیاز", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "تعداد", icon: "fa-duotone fa-user" },
      { id: 4, name: "تاریخ ثبت", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "تبدیل شده", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "تاریخ تبدیل", icon: "fa-duotone fa-mobile" },
    ],
    tableHeaderStatus: false,
    tableRow: false,
    currentPage: 1,
    tableData: false,
  },
});
////////////////////
onMounted(() => {
  requestGetScore();
});
//////////////////
const requestGetScore = () => {
  const queryParams = {
    pageSize: 10,
    pageIndex: state.tableInfo.currentPage,
    userId: props.userId,
  };
  userManagementApi
    .getUserScores(queryParams)
    .then((response) => {
      state.tableInfo.tableData = response.data;
      state.tableInfo.tableRow = response.totalRow;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "امتیاز دریافت نشد",
      });
    });
};
/////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetScore();
};
/////////////////////////
provide("state", state);
</script>
<template>
  <Table @pagination="handlePagination">
    <template v-slot:tableLarg>
      <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.id">
        <td class="w-[100px]">{{ index + 1 }}</td>
        <td>{{ item.scoreType }}</td>
        <td>{{ item.count }}</td>
        <td>{{ item.createDate }}</td>
        <td>{{ item.isChanged ? "بله" : "خیر" }}</td>
        <td>{{ item.changeDate ? item.changeDate : "-" }}</td>
      </tr>
    </template>
    <template v-slot:tableSmall>
      <div
        v-for="(item, index) in state.tableInfo.tableData"
        class="table-small"
        :key="item.id"
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
          <p class="table-small-col">{{ index + 1 }}</p>
          <p class="table-small-col">{{ item.scoreType }}</p>
          <p class="table-small-col">{{ item.count }}</p>
          <p class="table-small-col">{{ item.createDate }}</p>
          <p class="table-small-col">{{ item.isChanged ? "بله" : "خیر" }}</p>
          <p class="table-small-col">
            {{ item.changeDate ? item.changeDate : "-" }}
          </p>
        </div>
      </div>
    </template>
  </Table>
</template>
