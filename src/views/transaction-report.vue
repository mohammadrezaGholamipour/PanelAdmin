<script setup>
import transactionReportApi from "@/api/transaction-report";
import { reactive, provide, onMounted } from "vue";
import Table from "@/components/table/index.vue";
import jalaliMoment from "jalali-moment";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    tableData: false,
    tableHeaderStatus: true,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نام کاربری", icon: "fa-duotone fa-ballot-check " },
      { id: 3, name: "تلفن همراه", icon: "fa-duotone fa-user" },
      { id: 4, name: "مبلغ", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "تاریخ ثبت", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "کد تراکنش", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "وضعیت", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    filterTable: [
      {
        placeholder: "نام کابری",
        inputType: "input",
        value: "",
        data: "",
        id: 1,
      },
      {
        placeholder: "مبلغ",
        inputType: "input",
        value: "",
        data: "",
        id: 2,
      },
      {
        placeholder: "تاریخ شروع",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 3,
      },
      {
        placeholder: "تاریخ پایان",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 4,
      },
      {
        placeholder: "کد تراکنش",
        inputType: "input",
        value: "",
        data: "",
        id: 5,
      },
    ],
    tableRow: false,
    currentPage: 1,
  },
});
///////////////////////////////////
onMounted(() => {
  requestGetTransactionReport();
  ////////////////////////
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "گزارش تراکنش ها", link: "/transactionReport" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetTransactionReport = () => {
  state.tableInfo.tableData = false;
  const [username, amount, fromDate, toDate, transactionCode] =
    state.tableInfo.filterTable.map((item) => item.value);
  const queryParams = {
    pageSize: 10,
    pageIndex: state.tableInfo.currentPage,
    ...(username && { username }),
    ...(amount && { amount }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
    ...(transactionCode && { transactionCode }),
  };
  transactionReportApi
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
        textMain: "گزارش تراکنش ها دریافت نشد",
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
  requestGetTransactionReport();
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetTransactionReport();
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-transaction-report page">
    <!-- ///////////////////////////////// -->
    <div class="header-transaction-report">
      <p class="title">گزارش تراکنش ها</p>
    </div>
    <!-- ////////////////////////////// -->
    <Table @pagination="handlePagination" @filter="handleTableFilter">
      <template v-slot:tableLarg>
        <tr v-for="(item, index) in state.tableInfo.tableData" :key="index">
          <td class="w-[100px]">{{ index + 1 }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.mobileNumber }}</td>
          <td>{{ item.amount.toLocaleString() }}</td>
          <td>
            {{ jalaliMoment(item.createDate).format("jYYYY/jMM/jDD - HH:mm") }}
          </td>
          <td>{{ item.transactionCode ?? "ندارد" }}</td>
          <td :class="item.isSuccess ? 'text-green-600' : 'text-red-500'">
            {{ item.isSuccess ? "موفق" : "ناموفق" }}
          </td>
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
            <p class="table-small-col">{{ item.userName }}</p>
            <p class="table-small-col">{{ item.mobileNumber }}</p>
            <p class="table-small-col">{{ item.amount.toLocaleString() }}</p>
            <p class="table-small-col">
              {{
                jalaliMoment(item.createDate).format("jYYYY/jMM/jDD - HH:mm")
              }}
            </p>
            <p class="table-small-col">{{ item.transactionCode ?? "ندارد" }}</p>
            <p
              :class="item.isSuccess ? 'text-green-600' : 'text-red-500'"
              class="table-small-col"
            >
              {{ item.isSuccess ? "موفق" : "ناموفق" }}
            </p>
          </div>
        </div>
      </template>
    </Table>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-transaction-report {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-transaction-report {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
