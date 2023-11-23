<script setup>
import NewOrEditSurvey from "./components/new-or-edit-survey.vue";
import { reactive, provide, onMounted, computed } from "vue";
import SurveyStatus from "./components/survey-status.vue";
import Table from "@/components/table/index.vue";
import listSurveyApi from "@/api/list-survey";
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
      { id: 2, name: "سوال", icon: "fa-duotone fa-ballot-check " },
      { id: 3, name: "ایجاد کننده", icon: "fa-duotone fa-user" },
      { id: 5, name: "فعال/غیرفعال", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "تایید شده/تایید نشده", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "عملیات", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    tableRow: false,
    currentPage: 1,
  },
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  votesData: null,
  surveySelected: {},
});
///////////////////////////////////
onMounted(() => {
  requestGetListSurvey();
  ////////////////////////
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "لیست نظر سنجی ها", link: "/listSurvey" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetListSurvey = () => {
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
  };
  listSurveyApi
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
        textMain: "لیست نظرسنجی ها دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
/////////////////////////////////
const requestRemoveSurvey = (pollId) => {
  pinia.handleRequestLoadingStatus();
  listSurveyApi
    .delete(pollId)
    .then(() => {
      requestGetListSurvey();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موقق",
        textMain: "نظر سنجی مورد نظر حذف شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "نظر سنجی مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestActiveDeactivePoll = (pollId) => {
  pinia.handleRequestLoadingStatus();
  listSurveyApi
    .ActiveDeactivePoll({ pollId })
    .then((response) => {
      if (response.status !== 1) {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      } else {
        requestGetListSurvey();
      }
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "عملیات مورد نظر انجام نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestSetActive = (pollId) => {
  pinia.handleRequestLoadingStatus();
  listSurveyApi
    .SetIsAccept(pollId)
    .then((response) => {
      if (response.status !== 1) {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      } else {
        requestGetListSurvey();
      }
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "عملیات مورد نظر انجام نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestEndPoll = (pollId) => {
  pinia.handleRequestLoadingStatus();
  listSurveyApi
    .endPoll(pollId)
    .then((response) => {
      if (response.status !== 1) {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: response.message,
        });
      } else {
        requestGetListSurvey();
      }
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "عملیات مورد نظر انجام نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestNewSurvey = (survey) => {
  state.requestLoading = true;
  listSurveyApi
    .new(survey)
    .then(() => {
      requestGetListSurvey();
      state.status = 1;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "نظر سنجی جدید با موفقیت افزوده شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "نظرسنجی افزوده نشد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
////////////////////////////////
const requestEditSurvey = (survey) => {
  state.requestLoading = true;
  listSurveyApi
    .edit(survey)
    .then(() => {
      requestGetListSurvey();
      state.surveySelected = {};
      state.status = 1;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "نظر سنجی جدید با موفقیت تغییر کرد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "نظرسنجی تغییر نکرد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetListSurvey();
};
/////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = (status) => {
  state.dialog.status = false;
  if (status && state.dialog.name === "remove") {
    requestRemoveSurvey(state.dialog.data.pollId);
  }
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
/////////////////////////////////
const handleListSurveyHeaderTitle = computed(() => {
  switch (state.status) {
    case 1:
      return "لیست نظر سنجی ها";
    case 2:
      return "وضعیت نظرسنجی";
    case 3:
      return "افزودن نظر سنجی";
  }
});
/////////////////////////////////
const handleSurveyStatus = (votes) => {
  state.votesData = votes;
  state.status = 2;
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-list-survey page">
    <!-- ///////////////////////////////// -->
    <div class="header-list-survey">
      <p class="title">{{ handleListSurveyHeaderTitle }}</p>
      <button
        @click="
          state.status === 1
            ? (state.status = 3)
            : ((state.status = 1), (state.surveySelected = {}))
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
            <td>{{ item.pollTitle }}</td>
            <td>{{ item.creatorName }}</td>
            <td>
              <label class="switch">
                <input
                  @click="requestActiveDeactivePoll(item.pollId)"
                  :checked="item.isActive"
                  class="switch-input"
                  type="checkbox"
                />
                <span class="slider"></span>
              </label>
            </td>
            <td>
              <button
                @click="requestSetActive(item.pollId)"
                :disabled="item.isAccept"
                :class="[
                  'btn-primary',
                  {
                    'btn-gray !cursor-not-allowed text-slate-700 bg-[#b1b1b1]':
                      item.isAccept,
                  },
                ]"
              >
                {{ item.isAccept ? "تایید شده" : "تایید" }}
              </button>
            </td>
            <td>
              <div class="flex items-center justify-center gap-x-3">
                <i
                  class="fa-duotone fa-trash table-icon"
                  @click="handleDialog(item, 'remove')"
                ></i>
                <button
                  @click="requestEndPoll(item.pollId)"
                  :disabled="!item.status"
                  v-if="item.isAccept"
                  :class="[
                    'btn-primary',
                    {
                      'btn-gray !cursor-not-allowed text-slate-700 bg-[#b1b1b1]':
                        !item.status,
                    },
                  ]"
                >
                  {{ item.status ? "اتمام" : "اتمام یافته" }}
                </button>
                <i
                  @click="(state.surveySelected = item), (state.status = 3)"
                  class="fa-duotone fa-pen table-icon"
                  v-if="!item.isAccept"
                ></i>
                <i
                  @click="handleDialog(item, 'moreInfo')"
                  class="fa-duotone fa-eye table-icon"
                ></i>
                <i
                  class="fa-duotone fa-square-poll-vertical table-icon"
                  @click="handleSurveyStatus(item.itemVotes)"
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
              <p class="table-small-col">{{ item.pollTitle }}</p>
              <p class="table-small-col">{{ item.creatorName }}</p>
              <p class="table-small-col">
                <label class="switch">
                  <input
                    @click="requestActiveDeactivePoll(item.pollId)"
                    :checked="item.isActive"
                    class="switch-input"
                    type="checkbox"
                  />
                  <span class="slider"></span>
                </label>
              </p>
              <p class="table-small-col p-0">
                <button
                  @click="requestSetActive(item.pollId)"
                  :disabled="item.isAccept"
                  :class="[
                    'btn-primary',
                    {
                      'btn-gray !cursor-not-allowed text-slate-700 bg-[#b1b1b1]':
                        item.isAccept,
                    },
                  ]"
                >
                  {{ item.isAccept ? "تایید شده" : "تایید" }}
                </button>
              </p>
              <div class="table-small-col p-1">
                <div
                  class="flex items-center justify-start gap-x-3 overflow-x-auto"
                >
                  <i class="fa-duotone fa-trash table-icon"></i>
                  <button
                    @click="requestEndPoll(item.pollId)"
                    :disabled="!item.status"
                    v-if="item.isAccept"
                    :class="[
                      'btn-primary',
                      {
                        'btn-gray !cursor-not-allowed text-slate-700 bg-[#b1b1b1]':
                          !item.status,
                      },
                    ]"
                  >
                    {{ item.status ? "اتمام" : "اتمام یافته" }}
                  </button>
                  <i
                    @click="(state.surveySelected = item), (state.status = 3)"
                    class="fa-duotone fa-pen table-icon"
                    v-if="!item.isAccept"
                  ></i>

                  <i
                    @click="handleDialog(item, 'moreInfo')"
                    class="fa-duotone fa-eye table-icon"
                  ></i>
                  <i
                    class="fa-duotone fa-square-poll-vertical table-icon"
                    @click="handleSurveyStatus(item.itemVotes)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- //////////////////////////////////// -->
      <SurveyStatus v-else-if="state.status === 2" :votes="state.votesData" />
      <!-- //////////////////////////////////// -->
      <NewOrEditSurvey
        @editSurvey="requestEditSurvey"
        :loading="state.requestLoading"
        :survey="state.surveySelected"
        v-else-if="state.status === 3"
        @newSurvey="requestNewSurvey"
      />
    </transition-fade>
    <!-- ///////////////////////// -->
    <Dialog
      :headerStatus="state.dialog.name === 'moreInfo' ? true : false"
      :footerStatus="state.dialog.name === 'remove' ? true : false"
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :headerText="'اطلاعات بیشتر'"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :dialogWidth="300"
    >
      <div v-if="state.dialog.name === 'moreInfo'" class="table-small">
        <div class="table-small-row font-bold">
          <p class="table-small-col">تاریخ ایجاد :</p>
          <p class="table-small-col">تعداد شرکت کنندگان :</p>
          <p class="table-small-col">تعداد گروه ها :</p>
        </div>
        <div class="table-small-row">
          <p class="table-small-col">{{ state.dialog.data?.createDate }}</p>
          <p class="table-small-col">{{ state.dialog.data?.totalUserCount }}</p>
          <p class="table-small-col">{{ state.dialog.data?.groupsCount }}</p>
        </div>
      </div>
      <div v-else class="flex w-full justify-center p-5">
        <p>آیا از حذف این نظرسنجی اطمینان دارید؟</p>
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-list-survey {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-list-survey {
  @apply w-full flex items-center gap-x-2 justify-between min-h-[64px];
}
</style>
