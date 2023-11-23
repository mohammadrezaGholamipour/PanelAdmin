<script setup>
import FactorPrint from "./components/factor-print.vue";
import FactorBuy from "./components/factor-buy.vue";
import { reactive, provide, onMounted } from "vue";
import DropDown from "@/components/drop-down.vue";
import Table from "@/components/table/index.vue";
import listOrderApi from "@/api/list-order";
import Input from "@/components/input.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  statusFactorIdSelected: null,
  trackingCodeSelected: null,

  factorBuyId: null,

  tableInfo: {
    tableData: false,
    tableHeaderStatus: true,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نام کاربر", icon: "fa-duotone fa-ballot-check " },
      { id: 3, name: "شماره موبایل", icon: "fa-duotone fa-user" },
      { id: 4, name: "کد رهگیری", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "وضعیت", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "وضعیت پرداخت", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    filterTable: [
      {
        placeholder: "نام کاربر",
        inputType: "input",
        value: "",
        data: "",
        id: 1,
      },
      {
        placeholder: "شماره موبایل",
        inputType: "input",
        value: "",
        data: "",
        id: 2,
      },
      {
        placeholder: "انتخاب وضعیت",
        inputType: "dropDown",
        value: "",
        data: "",
        id: 3,
      },
      {
        placeholder: "تاریخ شروع",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 4,
      },
      {
        placeholder: "تاریخ پایان",
        inputType: "datePicker",
        value: "",
        data: "",
        id: 5,
      },
    ],
    tableRow: false,
    currentPage: 1,
  },
  status: 1,
});
///////////////////////////////////
onMounted(() => {
  requestGetListOrder();
  requestGetFactorStatus();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "لیست سفارشات", link: "/listOrder" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetListOrder = () => {
  state.tableInfo.tableData = false;
  const [userFamily, UserMobileNumber, status, fromDate, toDate] =
    state.tableInfo.filterTable.map((item) => item.value);
  const queryParams = {
    pageSize: 10,
    pageIndex: state.tableInfo.currentPage,
    ...(UserMobileNumber && { UserMobileNumber }),
    ...(userFamily && { userFamily }),
    ...(status && { status }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };
  listOrderApi
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
        textMain: "لیست سفارشات دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
////////////////////////////////////
const requestGetFactorStatus = () => {
  listOrderApi
    .statusList()
    .then((response) => {
      state.tableInfo.filterTable[2].data = response.data.map((obj) => {
        const { title, ...rest } = obj;
        return { name: title, ...rest };
      });
      state.tableInfo.filterTable[2].data.push({ name: "همه", id: 0 });
      state.tableInfo.filterTable[2].data.sort((a, b) => a.id - b.id);
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست وضعیت ها دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestChangeFactorStatus = (changeStatus) => {
  listOrderApi
    .changeStatus(changeStatus)
    .then((response) => {
      if (response.status === 1) {
        requestGetListOrder();
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "success",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      } else {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      }
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "وضعیت تغییر داده نشد",
      });
    });
};
/////////////////////////////////
const requestUpdateTrackingCode = (factorIdAndTrackingCode) => {
  listOrderApi
    .UpdateTrackingCode(factorIdAndTrackingCode)
    .then((response) => {
      if (response.status === 1) {
        requestGetListOrder();
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "success",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      } else {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      }
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "کد رهگیری قرار داده نشد",
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
const handleStatusDialog = (status) => {
  if (status) {
    if (state.dialog.name === "changeStatus" && state.statusFactorIdSelected) {
      const changeStatus = {
        orderId: state.dialog.data.factorId,
        statusId: state.statusFactorIdSelected,
      };
      requestChangeFactorStatus(changeStatus);
    } else if (
      state.dialog.name === "trackingCode" &&
      state.trackingCodeSelected
    ) {
      const factorIdAndTrackingCode = {
        factorId: state.dialog.data.factorId,
        PostalTrackingCode: state.trackingCodeSelected,
      };
      requestUpdateTrackingCode(factorIdAndTrackingCode);
    }
  }
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
    state.statusFactorIdSelected = null;
    state.trackingCodeSelected = null;
  }, 500);
};
/////////////////////////////////
const handleFactorBuy = (factor) => {
  state.factorBuyId = factor.factorId;
  state.status = 2;
};
/////////////////////////////////
const handleSetDialogTitle = (dialogName) => {
  switch (dialogName) {
    case "changeStatus":
      return "تغییر وضعیت";
    case "moreInfo":
      return "اطلاعات بیشتر";
    case "trackingCode":
      return "کد رهگیری";
    case "factorPrint":
      return "فاکتور";
  }
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
  requestGetListOrder();
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetListOrder();
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-list-order page">
    <!-- ///////////////////////////////// -->
    <div class="header-list-order">
      <p class="title">{{ state.status === 1 ? "لیست سفارشات" : "سفارشات" }}</p>
      <transition-fade>
        <button
          class="btn-red flex items-center gap-x-3 p-2 px-5 justify-center"
          @click="(state.status = 1), (state.factorBuyId = null)"
          v-if="state.status == 2"
        >
          <p>بازگشت</p>
          <i class="fa-duotone text-xl fa-angles-left"></i>
        </button>
      </transition-fade>
    </div>
    <!-- ////////////////////////////// -->
    <transition-slide group class="w-full overflow-hidden flex">
      <Table
        @pagination="handlePagination"
        @filter="handleTableFilter"
        v-if="state.status === 1"
      >
        <template v-slot:tableLarg>
          <tr
            v-for="(item, index) in state.tableInfo.tableData"
            :key="item.factorId"
          >
            <td class="w-[100px]">{{ index + 1 }}</td>
            <td>{{ item.userFamily ?? "نامشخص" }}</td>
            <td class="min-w-[140px]">{{ item.userMobileNumber }}</td>
            <td>
              <div
                class="flex w-full items-center justify-center gap-x-3 cursor-pointer"
                @click="handleDialog(item, 'trackingCode')"
              >
                {{ item.postalTrackingCode ?? "ندارد" }}
                <i
                  class="fa-duotone fa-square-sliders-vertical fa-beat-fade text-xl"
                ></i>
              </div>
            </td>
            <td
              @click="handleDialog(item, 'changeStatus')"
              class="w-[250px] min-w-[250px] cursor-pointer"
            >
              <div class="flex w-full items-center justify-center gap-x-3">
                {{ item.status }}
                <i
                  class="fa-duotone fa-square-sliders-vertical fa-beat-fade text-xl"
                ></i>
              </div>
            </td>
            <td :class="item.isSuccessPay ? 'text-green-500' : 'text-red-500'">
              {{ item.isSuccessPay ? "پرداخت شده" : "پرداخت نشده" }}
            </td>
            <td class="w-[250px]">
              <div class="flex items-center justify-center gap-x-2 flex-nowrap">
                <i
                  @click="handleDialog(item, 'moreInfo')"
                  class="fa-duotone fa-eye table-icon"
                ></i>
                <i
                  @click="handleDialog(item, 'factorPrint')"
                  class="fa-duotone fa-square-list table-icon"
                ></i>
                <i
                  class="fa-duotone fa-pen table-icon"
                  @click="handleFactorBuy(item)"
                ></i>
              </div>
            </td>
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
              <p class="table-small-col">{{ item.userFamily ?? "-" }}</p>
              <p class="table-small-col">{{ item.userMobileNumber }}</p>
              <div
                class="table-small-col flex w-full items-center justify-center gap-x-3 cursor-pointer"
                @click="handleDialog(item, 'trackingCode')"
              >
                {{ item.postalTrackingCode ?? "ندارد" }}
                <i
                  class="fa-duotone fa-square-sliders-vertical fa-beat-fade text-xl"
                ></i>
              </div>
              <div
                class="table-small-col flex items-center gap-x-2 overflow-auto"
                @click="handleDialog(item, 'changeStatus')"
              >
                {{ item.status }}
                <i class="fa-duotone fa-square-sliders-vertical text-xl"></i>
              </div>
              <p
                :class="item.isSuccessPay ? 'text-green-500' : 'text-red-500'"
                class="table-small-col"
              >
                {{ item.isSuccessPay ? "پرداخت شده" : "پرداخت نشده" }}
              </p>
              <div
                class="table-small-col flex py-0 items-center justify-center gap-x-2 flex-nowrap"
              >
                <i
                  @click="handleDialog(item, 'moreInfo')"
                  class="fa-duotone fa-eye table-icon"
                ></i>
                <i
                  @click="handleDialog(item, 'factorPrint')"
                  class="fa-duotone fa-square-list table-icon"
                ></i>
                <i
                  class="fa-duotone fa-pen table-icon"
                  @click="handleFactorBuy(item)"
                ></i>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <FactorBuy :factorId="state.factorBuyId" v-else />
    </transition-slide>
    <!-- ///////////////////////// -->
    <Dialog
      :headerText="handleSetDialogTitle(state.dialog.name)"
      :footerStatus="
        state.dialog.name === 'changeStatus' ||
        state.dialog.name === 'trackingCode'
          ? true
          : false
      "
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :headerStatus="true"
      :dialogWidth="350"
    >
      <DropDown
        @value="state.statusFactorIdSelected = $event"
        :data="state.tableInfo.filterTable[2].data"
        v-if="state.dialog.name === 'changeStatus'"
        :placeholder="state.dialog.data.status"
        class="p-2"
      />
      <div v-else-if="state.dialog.name === 'moreInfo'" class="table-small p-2">
        <div class="table-small-row font-bold">
          <p class="table-small-col">شماره فاکتور :</p>
          <p class="table-small-col">تاریخ خرید :</p>
          <p class="table-small-col">مبلغ کل :</p>
          <p class="table-small-col">تخفیف :</p>
          <p class="table-small-col">کد تخفیف :</p>
          <p class="table-small-col">نحوه پرداخت :</p>
          <p class="table-small-col">نوع ارسال :</p>
          <p class="table-small-col">آدرس :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">{{ state.dialog.data?.factorId }}</p>
          <p class="table-small-col max-w-[330px]">
            {{ state.dialog.data?.buyDate }}
          </p>
          <p class="table-small-col">
            {{ `${state.dialog.data?.allAmount.toLocaleString()} هزار تومان` }}
          </p>
          <p class="table-small-col">
            {{ state.dialog.data?.discountPercent ?? "-" }}
          </p>
          <p class="table-small-col">
            {{ state.dialog.data?.discountCode ?? "-" }}
          </p>
          <p class="table-small-col">{{ state.dialog.data?.payType }}</p>
          <p class="table-small-col">
            {{ state.dialog.data?.sendType ?? "-" }}
          </p>
          <p class="table-small-col">
            {{ state.dialog.data?.userAddress ?? "-" }}
          </p>
        </div>
      </div>
      <div class="p-3 w-full" v-else-if="state.dialog.name === 'trackingCode'">
        <Input
          :placeholder="state.dialog.data.postalTrackingCode"
          @value="state.trackingCodeSelected = $event"
        />
      </div>
      <FactorPrint
        v-if="state.dialog.name === 'factorPrint'"
        :factorId="state.dialog.data.factorId"
      />
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-list-order {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-list-order {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
