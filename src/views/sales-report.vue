<script setup>
import { reactive, provide, onMounted } from "vue";
import Table from "@/components/table/index.vue";
import salesReportApi from "@/api/sales-report";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  tableInfo: {
    tableData: false,
    tableHeaderStatus: true,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "عنوان", icon: "fa-duotone fa-ballot-check " },
      { id: 3, name: "شماره فاکتور", icon: "fa-duotone fa-user" },
      { id: 4, name: "خریدار", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "نوع", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "تاریخ فروش", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    filterTable: [
      {
        placeholder: "شماره فاکتور",
        inputType: "input",
        value: "",
        data: "",
        id: 1,
      },
      {
        placeholder: "عنوان محصول",
        inputType: "input",
        value: "",
        data: "",
        id: 2,
      },
      {
        placeholder: "نام خریدار",
        inputType: "input",
        value: "",
        data: "",
        id: 4,
      },
      {
        placeholder: "انتخاب نوع",
        inputType: "dropDown",
        value: "",
        data: "",
        id: 5,
      },
      {
        placeholder: "تاریخ شروع",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 6,
      },
      {
        placeholder: "تاریخ پایان",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 7,
      },
    ],
    tableRow: false,
    currentPage: 1,
  },
});
///////////////////////////////////
onMounted(() => {
  requestGetItemType();
  requestGetSalesReport();
  ////////////////////////
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "گزارش فروش", link: "/salesReport" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetSalesReport = () => {
  state.tableInfo.tableData = false;
  const [factorId, productTitle, customerUserName, productType, fromDate, toDate] =
    state.tableInfo.filterTable.map((item) => item.value);
  const queryParams = {
    pageSize: 10,
    pageIndex: state.tableInfo.currentPage,
    ...(factorId && { factorId }),
    ...(productTitle && { productTitle }),
    ...(customerUserName && { customerUserName }),
    ...(productType && { productType }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };
  salesReportApi
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
const requestGetItemType = () => {
  salesReportApi
    .itemType()
    .then((response) => {
      state.tableInfo.filterTable[3].data = response.data.map((obj) => {
        const { title, ...rest } = obj;
        return { name: title, ...rest };
      });
      state.tableInfo.filterTable[3].data.push({ name: "همه", id: 0 });
      state.tableInfo.filterTable[3].data.sort((a, b) => a.id - b.id);
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست آیتم ها دریافت نشد",
      });
    });
};
/////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
  state.dialog.status = true;
};
/////////////////////////////////
const handleStatusDialog = () => {
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
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
  requestGetSalesReport();
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetSalesReport();
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-sales-report page">
    <!-- ///////////////////////////////// -->
    <div class="header-sales-report">
      <p class="title">گزارش فروش</p>
    </div>
    <!-- ////////////////////////////// -->
    <Table
      @pagination="handlePagination"
      @filter="handleTableFilter"
    >
      <template v-slot:tableLarg>
        <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.id">
          <td class="w-[100px]">{{ index + 1 }}</td>
          <td>{{ item.productTitle }}</td>
          <td class="w-[100px]">{{ item.factorId }}</td>
          <td>{{ item.customerName ?? "نامشخص" }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.saleDate }}</td>
          <td class="w-[100px]">
            <i
              @click="handleDialog(item, 'moreInfo')"
              class="fa-duotone fa-eye table-icon"
            ></i>
          </td>
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
            <p class="table-small-col">{{ item.productTitle }}</p>
            <p class="table-small-col">{{ item.factorId }}</p>
            <p class="table-small-col">{{ item.customerName ?? "نامشخص" }}</p>
            <p class="table-small-col">{{ item.type }}</p>
            <p class="table-small-col">{{ item.saleDate }}</p>
            <i
              @click="handleDialog(item, 'moreInfo')"
              class="fa-duotone fa-eye table-icon"
            ></i>
          </div>
        </div>
      </template>
    </Table>
    <!-- ///////////////////////// -->
    <Dialog
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      headerText="اطلاعات بیشتر"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :footerStatus="false"
      :headerStatus="true"
      :dialogWidth="350"
    >
      <div v-if="state.dialog.name === 'moreInfo'" class="table-small p-2">
        <div class="table-small-row font-bold">
          <p class="table-small-col">شماه تماس :</p>
          <p class="table-small-col">مبلغ :</p>
          <p class="table-small-col">تعداد :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">
            {{ state.dialog.data?.userMobileNumber }}
          </p>
          <p class="table-small-col">
            {{ state.dialog.data?.amount.toLocaleString() }}
          </p>
          <p class="table-small-col">{{ state.dialog.data?.count }}</p>
        </div>
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-sales-report {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-sales-report {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
