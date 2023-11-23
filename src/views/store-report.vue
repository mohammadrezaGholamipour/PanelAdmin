<script setup>
import { reactive, provide, onMounted } from "vue";
import Table from "@/components/table/index.vue";
import storeReportApi from "@/api/store-report";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    tableData: false,
    tableHeaderStatus: true,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "عنوان", icon: "fa-duotone fa-ballot-check " },
      { id: 3, name: "دسته بندی", icon: "fa-duotone fa-user" },
      { id: 4, name: "تعداد کل", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "تعداد فروخته شده", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "تعداد باقی مانده", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "تاریخ ثبت", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    filterTable: [
      {
        placeholder: "عنوان",
        inputType: "input",
        value: "",
        data: "",
        id: 1,
      },
      {
        placeholder: "تاریخ شروع",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 2,
      },
      {
        placeholder: "تاریخ پایان",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 3,
      },
    ],
    tableRow: false,
    currentPage: 1,
  },
});
///////////////////////////////////
onMounted(() => {
  requestGetStoreReport();
  ////////////////////////
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "گزارش انبار", link: "/storeReport" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetStoreReport = () => {
  state.tableInfo.tableData = false;
  const [title, fromDate, toDate] = state.tableInfo.filterTable.map(
    (item) => item.value
  );
  const queryParams = {
    pageSize: 10,
    pageIndex: state.tableInfo.currentPage,
    ...(title && { title }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };
  storeReportApi
    .get(queryParams)
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
        textMain: "گزارش فروش دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};

/////////////////////////////////
const handleTableFilter = (filters) => {
  for (const input of state.tableInfo.filterTable) {
    for (const { id, value } of filters) {
      if (input.id === id) {
        input.value = value;
        break;
      }
    }
  }
  requestGetStoreReport();
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetStoreReport();
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-store-report page">
    <!-- ///////////////////////////////// -->
    <div class="header-store-report">
      <p class="title">
        گزارش انبار (این گزارشات تنها مخصوص کالاهای فیزیکی می باشند)
      </p>
    </div>
    <!-- ////////////////////////////// -->
    <Table @pagination="handlePagination" @filter="handleTableFilter">
      <template v-slot:tableLarg>
        <tr v-for="(item, index) in state.tableInfo.tableData" :key="index">
          <td class="w-[100px]">{{ index + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.count }}</td>
          <td>{{ item.soldCount }}</td>
          <td>{{ item.count - item.soldCount }}</td>
          <td>{{ item.createDate }}</td>
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
            <p class="table-small-col">{{ index + 1 }}</p>
            <p class="table-small-col">{{ item.title }}</p>
            <p class="table-small-col">{{ item.category }}</p>
            <p class="table-small-col">{{ item.count }}</p>
            <p class="table-small-col">{{ item.soldCount }}</p>
            <p class="table-small-col">{{ item.count - item.soldCount }}</p>
            <p class="table-small-col">{{ item.createDate }}</p>
          </div>
        </div>
      </template>
    </Table>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-store-report {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-store-report {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
