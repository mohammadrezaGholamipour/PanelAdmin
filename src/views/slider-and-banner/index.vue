<script setup>
import { reactive, provide, onMounted, computed } from "vue";
import sliderAndBannerApi from "@/api/slider-and-banner";
import NewOrEdit from "./components/new-or-edit.vue";
import Table from "@/components/table/index.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "تصویر", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "عنوان", icon: "fa-duotone fa-user" },
      { id: 4, name: "نوع", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "صفحه", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "وضعیت", icon: "fa-duotone fa-mobile" },
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
  sliderOrBanner: {
    data: null,
    actionTypes: null,
    adsTypes: null,
    adsPages: null,
    loading: false,
  },
  status: 1,
});
///////////////////////////////////
onMounted(() => {
  requestGetSliderAndBanner();
  requestGetAdsTypes();
  requestGetAdsPages();
  requestGetAction();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "اسلایدر و بنر", link: "/slideAndBanner" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetSliderAndBanner = () => {
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
  };
  sliderAndBannerApi
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
        textMain: "لیست اسلاید و بنر دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
/////////////////////////////////
const requestDeleteSliderAndBanner = (id) => {
  pinia.handleRequestLoadingStatus();
  sliderAndBannerApi
    .delete(id)
    .then(() => {
      requestGetSliderAndBanner();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "با موفقیت حذف شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "ایتم مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestGetAction = () => {
  sliderAndBannerApi
    .getAction()
    .then((response) => {
      state.sliderOrBanner.actionTypes = response.data.map(({ title, id }) => ({
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
const requestGetActionById = (item) => {
  sliderAndBannerApi
    .getActionById(item.actionApp)
    .then((response) => {
      state.sliderOrBanner.data = item;
      state.sliderOrBanner.data.actionTitle = response.data.title;
      state.sliderOrBanner.data.actionType = response.data.type;
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
const requestGetAdsTypes = () => {
  sliderAndBannerApi
    .adsTypes()
    .then((response) => {
      state.sliderOrBanner.adsTypes = response.data.map(({ title, id }) => ({
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
        textMain: "نوع های اسلایدر و بنر دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestGetAdsPages = () => {
  sliderAndBannerApi
    .adsPages()
    .then((response) => {
      state.sliderOrBanner.adsPages = response.data.map(({ title, id }) => ({
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
        textMain: "صفحه های نمایش دریافت نشد",
      });
    });
};
/////////////////////////////////
const requestAddAction = (item) => {
  state.sliderOrBanner.loading = true;
  sliderAndBannerApi
    .addAction(item.actionTitle, item.actionType)
    .then((response) => {
      item.actionId = response.data;
      const {
        adsTitle,
        adsType,
        adsPage,
        isActive,
        adsImageAddress,
        actionId,
      } = item;
      actionId;
      requestNewSliderOrBanner({
        adsTitle,
        adsType,
        adsPage,
        isActive,
        adsImageAddress,
        actionId,
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
      state.sliderOrBanner.loading = false;
    });
};
/////////////////////////////////
const requestNewSliderOrBanner = (item) => {
  state.sliderOrBanner.loading = true;
  sliderAndBannerApi
    .new(item)
    .then(() => {
      state.status = 1;
      state.sliderOrBanner.data = null;
      requestGetSliderAndBanner();
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "ایتم جدید ثبت نشد",
      });
    })
    .finally(() => {
      state.sliderOrBanner.loading = false;
    });
};
const requestEditSliderOrBanner = (item) => {
  state.sliderOrBanner.loading = true;
  sliderAndBannerApi
    .edit(item)
    .then(() => {
      state.status = 1;
      state.sliderOrBanner.data = null;
      requestGetSliderAndBanner();
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "ایتم تغییر نکرد",
      });
    })
    .finally(() => {
      state.sliderOrBanner.loading = false;
    });
};
/////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetSliderAndBanner();
};
/////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = (status) => {
  if (state.dialog.name === "removeItem" && status) {
    requestDeleteSliderAndBanner(state.dialog.data.adsId);
  }
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
/////////////////////////////////
const handleHeaderTitle = computed(() => {
  switch (state.status) {
    case 1:
      return "لیست اسلایدر و بنر";
    case 2:
      if (state.sliderOrBanner.data) {
        return "تغییر دادن";
      } else {
        return "ایجاد کردن";
      }
  }
});
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-slider-and-banner page">
    <!-- ///////////////////////////////// -->
    <div class="header-slider-and-banner">
      <p class="title">{{ handleHeaderTitle }}</p>
      <button
        @click="
          state.status === 1
            ? (state.status = 2)
            : ((state.status = 1), (state.sliderOrBanner.data = null))
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
            <td>
              <img
                :src="item.adsImageAddress"
                class="mx-auto rounded-md"
                width="50"
              />
            </td>
            <td>{{ item.adsTitle ? item.adsTitle : "نامشخص" }}</td>
            <td>{{ item.adsTypeTitle }}</td>
            <td>{{ item.adsPageTitle }}</td>
            <td>{{ item.isActive ? "فعال" : "غیر فعال" }}</td>
            <td>
              <div class="flex items-center justify-center gap-x-3">
                <i
                  class="fa-duotone fa-pen table-icon"
                  @click="requestGetActionById(item)"
                ></i>
                <i
                  @click="handleDialog(item, 'removeItem')"
                  class="fa-duotone fa-trash table-icon"
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
              <div class="table-small-col">
                <img
                  :src="item.adsImageAddress"
                  class="mx-auto rounded-md"
                  width="50"
                />
              </div>
              <p class="table-small-col">
                {{ item.adsTitle ? item.adsTitle : "نامشخص" }}
              </p>
              <p class="table-small-col">{{ item.adsTypeTitle }}</p>
              <p class="table-small-col">
                {{ item.adsPageTitle }}
              </p>
              <p class="table-small-col">
                {{ item.isActive ? "فعال" : "غیر فعال" }}
              </p>
              <div class="table-small-col">
                <div class="flex items-center justify-center gap-x-3">
                  <i
                    class="fa-duotone fa-pen table-icon"
                    @click="requestGetActionById(item)"
                  ></i>
                  <i
                    @click="handleDialog(item, 'removeItem')"
                    class="fa-duotone fa-trash table-icon"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <NewOrEdit
        @editSliderOrBanner="requestEditSliderOrBanner"
        :sliderAndBanner="state.sliderOrBanner"
        @newSliderOrBanner="requestAddAction"
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
        v-if="state.dialog.name === 'removeItem'"
        class="p-4 w-full text-center"
      >
        {{ `${state.dialog.data.adsTitle} حذف شود` + " ?" }}
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-slider-and-banner {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-slider-and-banner {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
