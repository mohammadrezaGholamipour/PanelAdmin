<script setup>
import AdminComment from "./components/admin-comment.vue";
import { onMounted, reactive, provide, watch } from "vue";
import Table from "@/components/table/index.vue";
import Rating from "./components/rating.vue";
import { usePinia } from "@/store/pinia";
import commentsApi from "@/api/comments";
//////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  requestLoading: false,
  tableInfo: {
    tableHeaderStatus: true,
    tableData: false,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "عنوان محتوا", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "دسته بندی", icon: "fa-duotone fa-user" },
      { id: 4, name: "عنوان نظر", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "متن نظر", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    filterTable: [
      {
        placeholder: "جستجو بر اساس عنوان نظر",
        inputType: "input",
        value: "",
        data: "",
        id: 1,
      },
      {
        placeholder: "دسته بندی",
        inputType: "dropDown",
        value: "",
        data: "",
        id: 2,
      },
      {
        placeholder: "گروه ها",
        inputType: "dropDown",
        value: "",
        data: "",
        id: 3,
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
  adminComment: false,
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
  requestGetComments();
  handleSetFilterInputData();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "نظرات", link: "/comments" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
/////////////////////////////////
const requestGetComments = () => {
  const [searchText, categoryIds, groupId] = state.tableInfo.filterTable.map(
    (item) => item.value
  );
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
    ...(searchText && { searchText }),
    ...(categoryIds && { categoryIds }),
    ...(groupId && { groupId }),
  };
  commentsApi
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
        textMain: "لیست نظر سنجی ها دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestActiveDeactiveComment = (commentId) => {
  pinia.handleRequestLoadingStatus();
  commentsApi
    .ActiveDeactiveComment(commentId)
    .then(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "با موفقیت انجام شد",
      });
      requestGetComments();
    })
    .catch((error) => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "وضعیت نظر تغییر نکرد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestDeleteComment = (commentId) => {
  pinia.handleRequestLoadingStatus();
  commentsApi
    .deleteComment(commentId)
    .then(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "با موفقیت حذف شد",
      });
      requestGetComments();
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "حذف انجام نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestNewCommentAdmin = (comment) => {
  commentsApi
    .newAdminComment(comment)
    .then(() => {
      state.status = 1;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "با موفقیت اضافه شد",
      });
      requestGetComments();
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "اضافه نشد",
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
const handleStatusDialog = (status) => {
  if (status) {
    requestDeleteComment(state.dialog.data.commentId);
  }
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
///////////////////////////////////
const handleShowAdminComment = (data) => {
  state.status = 2;
  state.adminComment = data;
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
  requestGetComments();
};
/////////////////////////////////////
const handleSetFilterInputData = () => {
  state.tableInfo.filterTable[1].data = pinia.state.filterInputData.categories;
  state.tableInfo.filterTable[2].data = pinia.state.filterInputData.groups;
};
/////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetListOrder();
};
/////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-comments page">
    <!-- /////////////////////////// -->
    <div class="header-comments">
      <p class="title">{{ state.status === 1 ? "نظرات" : "نظر مدیران" }}</p>
      <button
        class="btn-red flex items-center gap-x-3 p-2 px-5 justify-center"
        @click="(state.status = 1), (state.adminComment = null)"
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
            :key="item.commentId"
          >
            <td class="w-[100px]">{{ index + 1 }}</td>
            <td>{{ item.itemTitle }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.commentTitle }}</td>
            <td
              @click="handleDialog(item, 'commentDescription')"
              class="cursor-pointer"
            >
              {{ item.commentDescription }}
            </td>
            <td class="w-[250px]">
              <div class="flex items-center justify-center gap-x-2 flex-nowrap">
                <label class="switch">
                  <input
                    @click="requestActiveDeactiveComment(item.commentId)"
                    :checked="item.isActive"
                    class="switch-input"
                    type="checkbox"
                  />
                  <span class="slider"></span>
                </label>
                <i
                  @click="handleShowAdminComment(item)"
                  class="fa-duotone fa-pen table-icon"
                ></i>
                <transition-fade>
                  <i
                    @click="handleDialog(item, 'deleteComment')"
                    class="fa-duotone fa-trash table-icon"
                    v-if="!item.isActive"
                  ></i
                ></transition-fade>
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
              <p class="table-small-col">{{ item.itemTitle }}</p>
              <p class="table-small-col">{{ item.category }}</p>
              <p class="table-small-col">{{ item.commentTitle }}</p>
              <p
                @click="handleDialog(item, 'commentDescription')"
                class="table-small-col"
              >
                {{ item.commentDescription }}
              </p>
              <div class="table-small-col max-w-[200px] p-0">
                <div class="flex items-center justify-center gap-x-2">
                  <label class="switch">
                    <input
                      @click="requestActiveDeactiveComment(item.commentId)"
                      :checked="item.isActive"
                      class="switch-input"
                      type="checkbox"
                    />
                    <span class="slider"></span>
                  </label>
                  <i
                    @click="handleShowAdminComment(item)"
                    class="fa-duotone fa-pen table-icon"
                  ></i>
                  <transition-fade>
                    <i
                      @click="handleDialog(item, 'deleteComment')"
                      class="fa-duotone fa-trash table-icon"
                      v-if="!item.isActive"
                    ></i
                  ></transition-fade>
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
      <AdminComment
        @newComment="requestNewCommentAdmin"
        :adminComment="state.adminComment"
        :loading="state.requestLoading"
        v-else
      />
    </transition-slide>
    <!-- /////////////////////////// -->
    <Dialog
      :headerStatus="state.dialog.name === 'deleteComment' ? false : true"
      :footerStatus="state.dialog.name === 'deleteComment' ? true : false"
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :headerText="'متن نظر'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :dialogWidth="300"
    >
      <p v-if="state.dialog.name === 'commentDescription'" class="p-2">
        {{ state.dialog.data?.commentDescription }}
      </p>
      <div v-else-if="state.dialog.name === 'moreInfo'" class="table-small">
        <div class="table-small-row font-bold">
          <p class="table-small-col">نام کاربر :</p>
          <p class="table-small-col">تاریخ :</p>
          <p class="table-small-col">موبایل :</p>
          <p class="table-small-col">امتیاز :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">
            {{ state.dialog.data?.userName ?? "نامشخص" }}
          </p>
          <p class="table-small-col">{{ state.dialog.data?.createDate }}</p>
          <p class="table-small-col">{{ state.dialog.data?.mobileNumber }}</p>
          <p class="table-small-col">
            <Rating :rating="state.dialog.data?.commentRate" />
          </p>
        </div>
      </div>
      <p v-else class="p-5">آیا از حذف این نظر اطمینان دارید؟</p>
    </Dialog>
    <!-- /////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-comments {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-comments {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px];
}
</style>
