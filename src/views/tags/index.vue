<script setup>
import { reactive, provide, onMounted, computed } from "vue";
import Table from "@/components/table/index.vue";
import { usePinia } from "@/store/pinia";
import tagApi from "@/api/tag";
import NewOrEdit from "./components/new-or-edit.vue";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "عنوان", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "آیدی برچسب", icon: "fa-duotone fa-user" },
      { id: 4, name: "ایجاد کننده", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "ویرایش کننده", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "استفاده شده", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "عملیات", icon: "fa-duotone fa-mobile" },
    ],
    tableHeaderStatus: false,
    tableData: false,
    tableRow: false,
    currentPage: 1,
  },
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  tag: {
    data: null,
    loading: false,
  },
  status: 1,
});
///////////////////////////////////
onMounted(() => {
  requestGetTags();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "برچسب ها", link: "/tags" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetTags = () => {
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
  };
  tagApi
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
        textMain: "لیست برچسب هادریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
/////////////////////////////////
const requestRemoveTag = (tagId) => {
  pinia.handleRequestLoadingStatus();
  tagApi
    .delete(tagId)
    .then(() => {
      requestGetTags();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "برچسب حذف شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "برچسب مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestNewTag = (tag) => {
  state.tag.loading = true;
  tagApi
    .new(tag)
    .then(() => {
      requestGetTags();
      state.status = 1;
      state.tag.data = null;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "برچسب جدید اضافه شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "برچسب جدید اضافه نشد",
      });
    })
    .finally(() => {
      state.tag.loading = false;
    });
};
/////////////////////////////////
const requestEditTag = (tag) => {
  state.tag.loading = true;
  tagApi
    .edit(tag)
    .then(() => {
      requestGetTags();
      state.status = 1;
      state.tag.data = null;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "برچسبت تغییر کرد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "برچسب تغییر نکرد",
      });
    })
    .finally(() => {
      state.tag.loading = false;
    });
};
/////////////////////////////////
const handleTagHeaderTitle = computed(() => {
  switch (state.status) {
    case 1:
      return "لیست تگ ها";
    case 2:
      if (state.tag.data) {
        return "تغییر تگ";
      } else {
        return "ایجاد تگ";
      }
  }
});
/////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = (status) => {
  if (state.dialog.name === "removeTag" && status) {
    requestRemoveTag(state.dialog.data.tagId);
  }
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetTags();
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-tags page">
    <!-- ///////////////////////////////// -->
    <div class="header-tags">
      <p class="title">{{ handleTagHeaderTitle }}</p>
      <button
        @click="
          state.status === 1
            ? (state.status = 2)
            : ((state.status = 1), (state.tag.data = null))
        "
        class="flex items-center gap-x-3 p-2 px-5 justify-center"
        :class="state.status === 1 ? 'btn-primary' : 'btn-red'"
      >
        <p>{{ state.status === 1 ? "افزودن" : "بازگشت" }}</p>
        <i
          :class="state.status === 1 ? 'fa-circle-plus' : 'fa-angles-left'"
          class="fa-duotone text-xl"
        ></i>
      </button>
    </div>
    <!-- ////////////////////////////// -->
    <transition-fade class="w-full h-full overflow-hidden flex" group>
      <Table v-if="state.status === 1" @pagination="handlePagination">
        <template v-slot:tableLarg>
          <tr
            v-for="(item, index) in state.tableInfo.tableData"
            :key="item.factorId"
          >
            <td class="w-[100px]">{{ index + 1 }}</td>
            <td>{{ item.tagTitle }}</td>
            <td>{{ item.tagId }}</td>
            <td>{{ item.creator }}</td>
            <td>{{ item.editor ? item.editor : "ویرایش نشده" }}</td>
            <td>{{ item.itemCount }}</td>
            <td>
              <div class="flex items-center justify-center gap-x-3">
                <i
                  @click="(state.tag.data = item), (state.status = 2)"
                  class="fa-duotone fa-pen table-icon"
                ></i>
                <i
                  class="fa-duotone fa-trash table-icon"
                  @click="handleDialog(item, 'removeTag')"
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
              <p class="table-small-col">{{ item.tagTitle }}</p>
              <p class="table-small-col">{{ item.tagId }}</p>
              <p class="table-small-col">{{ item.creator }}</p>
              <p class="table-small-col">
                {{ item.editor ? item.editor : "ویرایش نشده" }}
              </p>
              <p class="table-small-col">{{ item.itemCount }}</p>
              <div class="table-small-col">
                <div class="flex items-center justify-center gap-x-3">
                  <i
                    @click="(state.tag.data = item), (state.status = 2)"
                    class="fa-duotone fa-pen table-icon"
                  ></i>
                  <i
                    class="fa-duotone fa-trash table-icon"
                    @click="handleDialog(item, 'removeTag')"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <NewOrEdit
        @editTag="requestEditTag"
        @newTag="requestNewTag"
        :tag="state.tag"
        v-else
      />
    </transition-fade>
    <!-- ///////////////////////// -->
    <Dialog
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :headerText="'اطلاعات بیشتر'"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :headerStatus="false"
      :footerStatus="true"
      :dialogWidth="300"
    >
      <div
        class="p-4 w-full text-center"
        v-if="state.dialog.name === 'removeTag'"
      >
        {{ `برچسب ${state.dialog.data.tagTitle} حذف شود` + " ?" }}
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-tags {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-tags {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
