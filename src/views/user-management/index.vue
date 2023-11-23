<script setup>
import { onMounted, reactive, provide, watch } from "vue";
import userManagementApi from "@/api/user-management";
import Table from "@/components/table/index.vue";
import Address from "./components/address.vue";
import Factor from "./components/factor.vue";
import Wallet from "./components/wallet.vue";
import Score from "./components/score.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    tableHeaderStatus: true,
    tableData: false,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نام و نام خانوادگی", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "تصویر", icon: "fa-duotone fa-user" },
      { id: 4, name: "تلفن همراه", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "فاکتورها", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "آدرس ها", icon: "fa-sharp fa-regular fa-sliders" },
      { id: 7, name: "کیف پول", icon: "fa-sharp fa-regular fa-sliders" },
      { id: 8, name: "امتیاز کابران", icon: "fa-sharp fa-regular fa-sliders" },
      { id: 9, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    filterTable: [
      {
        placeholder: "جستجو بر اساس نام",
        inputType: "input",
        value: "",
        data: "",
        id: 1,
      },
      {
        placeholder: "گروه ها",
        inputType: "dropDown",
        value: "",
        data: "",
        id: 2,
      },
    ],
    tableRow: false,
    currentPage: 1,
  },
  status: 1,
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  userId: false,
});
watch(
  () => pinia.state.filterInputData,
  () => {
    handleSetFilterInputData();
  },
  { deep: true }
);
/////////////////////////////////////
onMounted(() => {
  requestGetUser();
  handleSetFilterInputData();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "مدیریت کابران", link: "/userManagement" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
/////////////////////////////////
const requestGetUser = () => {
  const [searchText, groupIds] = state.tableInfo.filterTable.map(
    (item) => item.value
  );
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
    ...(searchText && { searchText }),
    ...(groupIds && { groupIds }),
  };
  userManagementApi
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
        textMain: "لیست کاربران دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestDeleteUser = (userId) => {
  pinia.handleRequestLoadingStatus();
  userManagementApi
    .delete(userId)
    .then(() => {
      requestGetUser();
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "کاربر مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const handleDialog = (comment, name) => {
  state.dialog.name = name;
  state.dialog.data = comment;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = (status) => {
  if (status && state.dialog.name === "deleteUser") {
    requestDeleteUser([state.dialog.data.userId]);
  }
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
/////////////////////////
const handleTableFilter = (filters) => {
  for (const input of state.tableInfo.filterTable) {
    for (const { id, value } of filters) {
      if (input.id === id) {
        input.value = value;
        break;
      }
    }
  }
  requestGetUser();
};
////////////////////////////////////////
const handleSetFilterInputData = () => {
  state.tableInfo.filterTable[1].data = pinia.state.filterInputData.groups;
};
///////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetUser();
};
////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-user-management page">
    <!-- /////////////////////////// -->
    <div class="header-user-management">
      <p class="title">مدیریت کاربران</p>
      <button
        class="btn-red flex items-center gap-x-3 p-2 px-5 justify-center"
        @click="state.status = 1"
        v-if="state.status !== 1"
      >
        <p>بازگشت</p>
        <i class="fa-duotone text-xl fa-angles-left"></i>
      </button>
    </div>
    <!--////////////////////////// -->
    <transition-slide group class="w-full overflow-hidden flex">
      <Table
        @pagination="handlePagination"
        @filter="handleTableFilter"
        v-if="state.status === 1"
      >
        <template v-slot:tableLarg>
          <tr
            v-for="(item, index) in state.tableInfo.tableData"
            :key="item.userId"
          >
            <td class="w-[100px]">{{ index + 1 }}</td>
            <td>{{ item.userName }} {{ item.userFamily }}</td>
            <td>
              <img
                class="mx-auto"
                @error="$event.target.src = `/assets/category.png`"
                :src="
                  item.imageAddress
                    ? item.imageAddress
                    : `/assets/category.png`
                "
                width="45"
              />
            </td>
            <td>{{ item.mobileNumber }}</td>
            <td>
              <i
                @click="(state.userId = item.userId), (state.status = 2)"
                class="fa-duotone fa-eye table-icon"
              ></i>
            </td>
            <td>
              <i
                @click="(state.userId = item.userId), (state.status = 3)"
                class="fa-duotone fa-eye table-icon"
              ></i>
            </td>
            <td>
              <i
                @click="(state.userId = item.userId), (state.status = 4)"
                class="fa-duotone fa-eye table-icon"
              ></i>
            </td>
            <td>
              <i
                @click="(state.userId = item.userId), (state.status = 5)"
                class="fa-duotone fa-eye table-icon"
              ></i>
            </td>
            <td>
              <div class="flex items-center justify-center gap-x-2">
                <i
                  @click="handleDialog(item, 'deleteUser')"
                  class="fa-duotone fa-trash table-icon"
                ></i>
                <i
                  @click="handleDialog(item, 'moreInfo')"
                  class="fa-duotone fa-eye table-icon"
                ></i>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:tableSmall>
          <div
            v-for="(item, index) in state.tableInfo.tableData"
            :key="item.commentId"
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
              <p class="table-small-col">
                {{ item.userName }} {{ item.userFamily }}
              </p>
              <div class="table-small-col p-0">
                <img
                  class="mx-auto"
                  @error="$event.target.src = `/assets/category.png`"
                  :src="
                    item.imageAddress
                      ? item.imageAddress
                      : `/assets/category.png`
                  "
                  width="48"
                />
              </div>
              <p class="table-small-col">{{ item.mobileNumber }}</p>
              <p class="table-small-col h-[48px] p-0">
                <i
                  @click="(state.userId = item.userId), (state.status = 2)"
                  class="fa-duotone fa-eye table-icon"
                ></i>
              </p>
              <p class="table-small-col h-[48px] p-0">
                <i
                  @click="(state.userId = item.userId), (state.status = 3)"
                  class="fa-duotone fa-eye table-icon"
                ></i>
              </p>
              <p class="table-small-col h-[48px] p-0">
                <i
                  @click="(state.userId = item.userId), (state.status = 4)"
                  class="fa-duotone fa-eye table-icon"
                ></i>
              </p>
              <p class="table-small-col h-[48px] p-0">
                <i
                  @click="(state.userId = item.userId), (state.status = 5)"
                  class="fa-duotone fa-eye table-icon"
                ></i>
              </p>
              <div class="table-small-col h-[48px] p-0">
                <div class="flex items-center justify-center gap-x-2">
                  <i
                    @click="handleDialog(item, 'deleteComment')"
                    class="fa-duotone fa-trash table-icon"
                  ></i>
                  <i
                    @click="handleDialog(item, 'moreInfo')"
                    class="fa-duotone fa-eye table-icon"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <Factor :userId="state.userId" v-if="state.status == 2" />
      <Address :userId="state.userId" v-if="state.status == 3" />
      <Wallet :userId="state.userId" v-if="state.status == 4" />
      <Score :userId="state.userId" v-if="state.status == 5" />
    </transition-slide>
    <!-- /////////////////////////// -->
    <Dialog
      :footerStatus="state.dialog.name === 'deleteUser' ? true : false"
      :headerStatus="state.dialog.name === 'deleteUser' ? false : true"
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :headerText="'متن نظر'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :dialogWidth="300"
    >
      <p
        v-if="state.dialog.name === 'deleteUser'"
        class="text-center w-full p-4"
      >
        {{
          `${state.dialog.data.userName} ${state.dialog.data.userFamily} حذف شود؟`
        }}
      </p>
      <div v-if="state.dialog.name === 'moreInfo'" class="table-small">
        <div class="table-small-row font-bold">
          <p class="table-small-col">تعداد گروه عضو شده :</p>
          <p class="table-small-col">تعداد دسته ها :</p>
          <p class="table-small-col">تعداد پیام رسان :</p>
          <p class="table-small-col">فعال :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">{{ state.dialog.data?.groupCount }}</p>
          <p class="table-small-col">{{ state.dialog.data?.categoryCount }}</p>
          <p class="table-small-col">{{ state.dialog.data?.pushId }}</p>
          <p class="table-small-col">{{ state.dialog.data?.isActive }}</p>
        </div>
      </div>
    </Dialog>
    <!-- /////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-user-management {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-user-management {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px];
}
</style>
