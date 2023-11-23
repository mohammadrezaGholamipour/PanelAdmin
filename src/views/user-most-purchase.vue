<script setup>
import userMostPurchaseApi from "@/api/user-most-purchase";
import { reactive, provide, onMounted } from "vue";
import Table from "@/components/table/index.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نام کاربر", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "تعداد خرید", icon: "fa-duotone fa-user" },
      { id: 4, name: "مقدار خرید(تومان)", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "شماره همراه", icon: "fa-duotone fa-mobile" },
    ],
    tableHeaderStatus: false,
    tableData: false,
  },
});
///////////////////////////////////
onMounted(() => {
  requestGetUserMostPurchase();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "کاربران با بیشترین خرید", link: "/userMostPurchase" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetUserMostPurchase = () => {
  state.tableInfo.tableData = false;
  const queryParams = {
    pageSize: 10,
    pageIndex: 1,
  };
  userMostPurchaseApi
    .get(queryParams)
    .then((response) => {
      state.tableInfo.tableData = response.data;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست کاربران دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-user-most-purchase page">
    <!-- ///////////////////////////////// -->
    <div class="header-user-most-purchase">
      <p class="title">کاربران با بیشترین خرید</p>
    </div>
    <!-- ////////////////////////////// -->
    <Table>
      <template v-slot:tableLarg>
        <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.factorId">
          <td class="w-[100px]">{{ index + 1 }}</td>
          <td>{{ item.userFamily ?? "نامشخص" }}</td>
          <td>{{ item.buyedCount }}</td>
          <td>{{ item.allAmount.toLocaleString() }}</td>
          <td>{{ item.userMobileNumber }}</td>
        </tr>
      </template>
      <template v-slot:tableSmall>
        <div
          v-for="(item, index) in state.tableInfo.tableData"
          :key="item.factorId"
          class="table-small"
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
            <p class="table-small-col">{{ item.userFamily ?? "نامشخص" }}</p>
            <p class="table-small-col">{{ item.buyedCount }}</p>
            <p class="table-small-col">{{ item.allAmount.toLocaleString() }}</p>
            <p class="table-small-col">{{ item.userMobileNumber }}</p>
          </div>
        </div>
      </template>
    </Table>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-user-most-purchase {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-user-most-purchase {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
