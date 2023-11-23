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
      { id: 2, name: "شماره فاکتور", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "نحوه پرداخت", icon: "fa-duotone fa-user" },
      { id: 4, name: "وضعیت", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "آدرس", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "مبلغ کل", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    tableHeaderStatus: false,
    tableRow: false,
    currentPage: 1,
    tableData: false,
  },
  dialog: {
    name: null,
    data: null,
    status: false,
  },
});
////////////////////
onMounted(() => {
  requestGetFactor();
});
//////////////////
const requestGetFactor = () => {
  const queryParams = {
    pageSize: 10,
    PageIndex: state.tableInfo.currentPage,
    userId: props.userId,
  };
  userManagementApi
    .getUserFactors(queryParams)
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
        textMain: "فاکتور دریافت نشد",
      });
    });
};
/////////////////////////////////
const handleDialog = (comment, name) => {
  state.dialog.name = name;
  state.dialog.data = comment;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = () => {
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
/////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetFactor();
};
/////////////////////////
provide("state", state);
</script>
<template>
  <div class="w-full h-full flex">
    <!-- //////////////////////// -->
    <Table @pagination="handlePagination">
      <template v-slot:tableLarg>
        <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.id">
          <td class="w-[100px]">{{ index + 1 }}</td>
          <td>{{ item.factorId }}</td>
          <td>{{ item.payType }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.userAddress ? item.userAddress : "نامشخص" }}</td>
          <td>{{ `${item.allAmount?.toLocaleString()} تومان` }}</td>
          <td>
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
            <p class="table-small-col">{{ item.factorId }}</p>
            <p class="table-small-col">{{ item.payType }}</p>
            <p class="table-small-col">{{ item.status }}</p>
            <p class="table-small-col">
              {{ item.userAddress ? item.userAddress : "نامشخص" }}
            </p>
            <p class="table-small-col">
              {{ `${item.allAmount?.toLocaleString()} تومان` }}
            </p>
            <div class="table-small-col">
              <i
                @click="handleDialog(item, 'moreInfo')"
                class="fa-duotone fa-eye table-icon"
              ></i>
            </div>
          </div>
        </div>
      </template>
    </Table>
    <!-- //////////////////////// -->
    <Dialog
      :footerStatus="false"
      :headerStatus="true"
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :headerText="'متن نظر'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :dialogWidth="300"
    >
      <div v-if="state.dialog.name === 'moreInfo'" class="table-small">
        <div class="table-small-row font-bold">
          <p class="table-small-col">تاریخ خرید :</p>
          <p class="table-small-col">درصد تخفیف :</p>
          <p class="table-small-col">کد تخفیف :</p>
          <p class="table-small-col">نوع ارسال :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">{{ state.dialog.data?.buyDate }}</p>
          <p class="table-small-col">
            {{ state.dialog.data?.discountPercent }}
          </p>
          <p class="table-small-col">{{ state.dialog.data?.discountCode }}</p>
          <p class="table-small-col">
            {{ state.dialog.data?.sendType ?? "نامشخص" }}
          </p>
        </div>
      </div>
    </Dialog>
    <!-- /////////////////////////// -->
  </div>
</template>
