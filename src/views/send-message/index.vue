<script setup>
import NewOrEditMessage from "./components/new-or-edit.vue";
import { reactive, provide, onMounted, computed } from "vue";
import Table from "@/components/table/index.vue";
import sendMessageApi from "@/api/send-message";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  requestLoading: false,
  status: 1,
  tableInfo: {
    tableHeaderStatus: false,
    tableData: false,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "تصویر", icon: "fa-duotone fa-ballot-check " },
      { id: 3, name: "شماره آیدی", icon: "fa-duotone fa-user" },
      { id: 4, name: "عنوان", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    tableRow: false,
    currentPage: 1,
  },
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  message: {
    data: null,
    actionType: null,
    loading: false,
  },
});
///////////////////////////////////
onMounted(() => {
  requestGetListMessage();
  requestGetAction();
  ////////////////////////
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "پیام رسان", link: "/sendMessage" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetListMessage = () => {
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
  };
  sendMessageApi
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
        textMain: "لیست پیام ها دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
/////////////////////////////////
const requestGetMessageById = (pushMessageId) => {
  pinia.handleRequestLoadingStatus();
  const queryParams = {
    pushMessageId,
  };
  sendMessageApi
    .getMesseageById(queryParams)
    .then((response) => {
      state.message.data = response.data;
      requestGetActionById(state.message.data.action);
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "پیام مورد نظر دریافت نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestEditMessage = (message) => {
  state.message.loading = true;
  sendMessageApi
    .editMessage(message)
    .then(() => {
      requestGetListMessage();
      state.status = 1;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "با موفقیت تغییر کرد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "پیام تغییر نکرد",
      });
    })
    .finally(() => {
      state.message.loading = false;
    });
};
/////////////////////////////////
const requestNewMessage = (message) => {
  state.message.loading = true;
  sendMessageApi
    .newMessage(message)
    .then(() => {
      requestGetListMessage();
      state.status = 1;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "با موفقیت افزوده شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "پیام ثبت نشد",
      });
    })
    .finally(() => {
      state.message.loading = false;
    });
};
/////////////////////////////////
const requestGetAction = () => {
  sendMessageApi
    .getAction()
    .then((response) => {
      state.message.actionType = response.data.map(({ title, id }) => ({
        id,
        name: title,
      }));
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "اکشن ها دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestGetActionById = (actionId) => {
  sendMessageApi
    .getActionById(actionId)
    .then((response) => {
      state.message.data.actionTitle = response.data.title;
      state.message.data.actionId = response.data.type;
      state.message.data.action = response.data.id;
      state.status = 2;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "اکشن مورد نظر دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestAddAction = (message) => {
  state.message.loading = true;
  sendMessageApi
    .addAction(message.actionTitle, message.actionId)
    .then((response) => {
      message.action = response.data;
      const {
        action,
        pushMessageTitle,
        pushMessageDescription,
        groupId,
        imageName,
      } = message;
      requestNewMessage({
        action,
        pushMessageTitle,
        pushMessageDescription,
        groupId,
        imageName,
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "اکشن ثبت نشد",
      });
    })
    .finally(() => {
      state.message.loading = false;
    });
};
/////////////////////////////////
const requestEditAction = (message) => {
  state.message.loading = true;
  sendMessageApi
    .editAction(message.actionTitle, message.action)
    .then(() => {
      requestEditMessage(message);
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "اکشن ثبت نشد",
      });
    })
    .finally(() => {
      state.message.loading = false;
    });
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetListMessage();
};
/////////////////////////////////
const requestSendMessage = (messageId) => {
  sendMessageApi
    .sendMessage({ pushMessageId: messageId })
    .then((response) => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: response.status === 1 ? "success" : "error",
        status: true,
        textHeader: response.status === 1 ? "موفق" : "خطا",
        textMain: response.message,
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "ارسال نشد",
      });
    });
};
/////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
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
/////////////////////////////////
const handleMessageHeaderTitle = computed(() => {
  switch (state.status) {
    case 1:
      return "لیست پیام ها";
    case 2:
      if (state.message.data) {
        return "تغییر پیام";
      } else {
        return "ایجاد پیام";
      }
  }
});
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-send-message page">
    <!-- ///////////////////////////////// -->
    <div class="header-send-message">
      <p class="title">{{ handleMessageHeaderTitle }}</p>
      <button
        @click="
          state.status === 1
            ? (state.status = 2)
            : ((state.status = 1), (state.message.data = null))
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
            :key="item.pollId"
          >
            <td>{{ index + 1 }}</td>
            <td class="flex justify-center mx-auto">
              <img
                @error="$event.target.src = `/assets/category.png`"
                :src="
                  item.imageName
                    ? item.imageName
                    : `/assets/category.png`
                "
                width="50"
              />
            </td>
            <td>{{ item.pushMessageId }}</td>
            <td>
              {{ item.pushMessageTitle ? item.pushMessageTitle : "نامشخص" }}
            </td>

            <td>
              <div class="flex items-center justify-center gap-x-3">
                <i
                  @click="requestGetMessageById(item.pushMessageId)"
                  class="fa-duotone fa-pen table-icon"
                ></i>
                <i
                  @click="handleDialog(item, 'moreInfo')"
                  class="fa-duotone fa-eye table-icon"
                ></i>
                <i
                  @click="requestSendMessage(item.pushMessageId)"
                  class="fa-duotone fa-paper-plane table-icon"
                ></i>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:tableSmall>
          <div
            v-for="(item, index) in state.tableInfo.tableData"
            class="table-small"
            :key="item.pollId"
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
              <div class="table-small-col">
                <img
                  @error="$event.target.src = `/assets/category.png`"
                  :src="
                    item.imageName
                      ? item.imageName
                      : `/assets/category.png`
                  "
                  width="50"
                />
              </div>
              <p class="table-small-col">{{ item.pushMessageId }}</p>
              <p class="table-small-col">
                {{ item.pushMessageTitle ? item.pushMessageTitle : "نامشخص" }}
              </p>
              <div class="table-small-col p-1">
                <div
                  class="flex items-center justify-start gap-x-3 overflow-x-auto"
                >
                  <i
                    @click="requestGetMessageById(item.pushMessageId)"
                    class="fa-duotone fa-pen table-icon"
                    v-if="!item.isAccept"
                  ></i>
                  <i
                    @click="handleDialog(item, 'moreInfo')"
                    class="fa-duotone fa-eye table-icon"
                  ></i>
                  <i
                    @click="requestSendMessage(item.pushMessageId)"
                    class="fa-duotone fa-paper-plane table-icon"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- //////////////////////////////////// -->
      <NewOrEditMessage
        @editMessage="requestEditAction"
        :loading="state.requestLoading"
        @newMessage="requestAddAction"
        v-else-if="state.status === 2"
        :message="state.message"
      />
    </transition-fade>
    <!-- ///////////////////////// -->
    <Dialog
      :headerStatus="state.dialog.name === 'moreInfo' ? true : false"
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :headerText="'اطلاعات بیشتر'"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :footerStatus="false"
      :dialogWidth="300"
    >
      <div v-if="state.dialog.name === 'moreInfo'" class="table-small">
        <div class="table-small-row font-bold">
          <p class="table-small-col">تاریخ ایجاد :</p>
          <p class="table-small-col">تعداد گروه های ارسالی :</p>
          <p class="table-small-col">تعداد کاربر های ارسالی :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">{{ state.dialog.data?.createdDate }}</p>
          <p class="table-small-col">{{ state.dialog.data?.groupCount }}</p>
          <p class="table-small-col">{{ state.dialog.data?.usersCount }}</p>
        </div>
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-send-message {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-send-message {
  @apply w-full flex items-center gap-x-2 justify-between min-h-[64px];
}
</style>
