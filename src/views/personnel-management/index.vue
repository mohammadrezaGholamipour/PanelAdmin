<script setup>
import personnelManagementApi from "@/api/personnel-management";
import { reactive, provide, onMounted, computed } from "vue";
import InputCheck from "./components/input-check.vue";
import NewOrEdit from "./components/new-or-edit.vue";
import Table from "@/components/table/index.vue";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نام و نام خانوادگی", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "تصویر", icon: "fa-duotone fa-user" },
      { id: 4, name: "موبایل", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "نقش", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "عملیات", icon: "fa-duotone fa-mobile" },
    ],
    tableHeaderStatus: false,
    tableData: false,
    tableRow: false,
    currentPage: 1,
  },
  personnelManagement: {
    data: null,
    loading: false,
  },
  dialog: {
    name: null,
    data: null,
    status: false,
  },
  personnelRoles: null,
  status: 1,
});
///////////////////////////////////
onMounted(() => {
  requestGetPersonnelManagement();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "مدیریت پرسنل", link: "/personnelManagement" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetPersonnelManagement = () => {
  const queryParams = {
    pageSize: 10,
    pageNumber: state.tableInfo.currentPage,
  };
  personnelManagementApi
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
        textMain: "لیست پرسنل دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
/////////////////////////////////
const requestRemovePersonnel = (userId) => {
  personnelManagementApi
    .delete({ userId })
    .then(() => {
      requestGetPersonnelManagement();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "خطا",
        textMain: "پرسنل با موفقیت حذف شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: " پرسنل مورد نظر حذف نشد",
      });
    });
};
/////////////////////////////////
const requestGetPersonnelById = (userId) => {
  const queryParams = { userId };
  pinia.handleRequestLoadingStatus();
  personnelManagementApi
    .getById(queryParams)
    .then((response) => {
      state.personnelManagement.data = response.data;
      state.status = 2;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: " پرسنل مورد نظر دریافت نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
/////////////////////////////////
const requestNewPersonnel = (personnel) => {
  state.personnelManagement.loading = true;
  personnelManagementApi
    .new(personnel)
    .then(() => {
      requestGetPersonnelManagement();
      state.status = 1;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: " پرسنل مورد نظر اضافه نشد",
      });
    })
    .finally(() => {
      state.personnelManagement.loading = false;
    });
};
/////////////////////////////////
const requestEditPersonnel = (personnel) => {
  state.personnelManagement.loading = true;
  personnelManagementApi
    .edit(personnel)
    .then(() => {
      requestGetPersonnelManagement();
      state.status = 1;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "پرسنل مورد نظر تغییر نکرد",
      });
    })
    .finally(() => {
      state.personnelManagement.loading = false;
    });
};
///////////////////////////////////
const requestGetRoleById = (personnel) => {
  pinia.handleRequestLoadingStatus();
  personnelManagementApi
    .getRolesById(personnel.userId)
    .then((response) => {
      state.personnelRoles = response.data.map(({ id, title, isSelected }) => ({
        value: id,
        label: title,
        status: isSelected,
      }));
      handleDialog(personnel, "role");
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست دسترسی کاربر دریافت نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
///////////////////////////////////
const handleChangeRole = (roleId) => {
  const statusRole = state.personnelRoles.find(
    (item) => item.value == roleId
  ).status;
  (statusRole ? requestAddRole : requestRemoveRole)(
    roleId,
    state.dialog.data.userId
  );
};
///////////////////////////////////
const requestAddRole = (roleId, userId) => {
  pinia.handleRequestLoadingStatus();
  personnelManagementApi
    .addRole(roleId, userId)
    .then(() => {})
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "دسترسی کاربر اضافه نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
///////////////////////////////////
const requestRemoveRole = (roleId, userId) => {
  pinia.handleRequestLoadingStatus();
  personnelManagementApi
    .deleteRole(roleId, userId)
    .then(() => {})
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "دسترسی کاربر اضافه نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
///////////////////////////////////
const handleHeaderTitle = computed(() => {
  switch (state.status) {
    case 1:
      return "لیست پرسنل";
    case 2:
      if (state.personnelManagement.data) {
        return "تغییر پرسنل";
      } else {
        return "ایجاد پرسنل";
      }
  }
});
////////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = (status) => {
  if (state.dialog.name === "removePersonnel" && status) {
    requestRemovePersonnel(state.dialog.data.userId);
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
  requestGetPersonnelManagement();
};
/////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-personnel-management page">
    <!-- ///////////////////////////////// -->
    <div class="header-personnel-management">
      <p class="title">{{ handleHeaderTitle }}</p>
      <button
        @click="
          state.status === 1
            ? (state.status = 2)
            : ((state.status = 1), (state.personnelManagement.data = null))
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
            :key="item.userId"
          >
            <td class="w-[100px]">{{ index + 1 }}</td>
            <td>{{ item.userName }} {{ item.userFamily }}</td>
            <td>
              <img
                class="rounded-md mx-auto"
                :src="item.imageName"
                width="50"
              />
            </td>
            <td>{{ item.mobileNumber }}</td>
            <td>{{ item.roles ? item.roles : "نامشخص" }}</td>
            <td>
              <div class="flex items-center justify-center gap-x-3">
                <i
                  @click="requestGetPersonnelById(item.userId)"
                  class="fa-duotone fa-pen table-icon"
                ></i>
                <i
                  @click="handleDialog(item, 'removePersonnel')"
                  class="fa-duotone fa-trash table-icon"
                ></i>
                <i
                  class="fa-duotone fa-bolt table-icon"
                  @click="requestGetRoleById(item)"
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
              <p class="table-small-col">
                {{ item.userName }} {{ item.userFamily }}
              </p>
              <div class="table-small-col">
                <img
                  class="rounded-md mx-auto"
                  :src="item.imageName"
                  width="50"
                />
              </div>
              <p class="table-small-col">{{ item.mobileNumber }}</p>
              <p class="table-small-col">
                {{ item.roles ? item.roles : "نامشخص" }}
              </p>
              <div class="table-small-col">
                <div class="flex items-center justify-center gap-x-3">
                  <i
                    @click="requestGetPersonnelById(item.userId)"
                    class="fa-duotone fa-pen table-icon"
                  ></i>
                  <i
                    @click="handleDialog(item, 'removePersonnel')"
                    class="fa-duotone fa-trash table-icon"
                  ></i>
                  <i
                    class="fa-duotone fa-bolt table-icon"
                    @click="requestGetRoleById(item)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <NewOrEdit
        v-else
        :personnel="state.personnelManagement"
        @editPersonnel="requestEditPersonnel"
        @newPersonnel="requestNewPersonnel"
      />
    </transition-fade>
    <!-- ///////////////////////// -->
    <Dialog
      :headerStatus="state.dialog.name === 'role' ? true : false"
      :footerStatus="state.dialog.name === 'role' ? false : true"
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :headerText="'سطح دسترسی'"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :dialogWidth="300"
    >
      <div
        v-if="state.dialog.name === 'removePersonnel'"
        class="p-4 w-full text-center"
      >
        {{
          `پرسنل ${state.dialog.data?.userName} ${state.dialog.data?.userFamily} حذف شود` +
          "?"
        }}
      </div>
      <div v-if="state.dialog.name === 'role'" class="p-4 w-full text-center">
        <InputCheck
          @updateData="handleChangeRole"
          :data="state.personnelRoles"
        />
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-personnel-management {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-personnel-management {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
