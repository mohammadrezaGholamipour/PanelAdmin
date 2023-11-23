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
      { id: 2, name: "قیمت", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "وضعیت", icon: "fa-duotone fa-user" },
      { id: 4, name: "تاریخ واریز/برداشت", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "نوع", icon: "fa-duotone fa-mobile" },
    ],
    tableHeaderStatus: false,
    tableRow: false,
    currentPage: 1,
    tableData: false,
  },
});
////////////////////
onMounted(() => {
  requestGetWallet();
});
//////////////////
const requestGetWallet = () => {
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
    userId: props.userId,
  };
  userManagementApi
    .getUserWalletList(queryParams)
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
        textMain: "کیف پول دریافت نشد",
      });
    });
};
/////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetWallet();
};
/////////////////////////
provide("state", state);
</script>
<template>
  <Table @pagination="handlePagination">
    <template v-slot:tableLarg>
      <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.id">
        <td class="w-[100px]">{{ index + 1 }}</td>
        <td>{{ item.amount?.toLocaleString() }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.createDate }}</td>
        <td>{{ item.type }}</td>
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
          <p class="table-small-col">{{ item.amount?.toLocaleString() }}</p>
          <p class="table-small-col">{{ item.status }}</p>
          <p class="table-small-col">{{ item.createDate }}</p>
          <p class="table-small-col">{{ item.type }}</p>
        </div>
      </div>
    </template>
  </Table>
</template>
