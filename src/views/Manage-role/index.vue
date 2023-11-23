<script setup>
import PermissionList from "./components/permission-list.vue";
import { reactive, provide, onMounted } from "vue";
import Table from "@/components/table/index.vue";
import NewRole from "./components/new-role.vue";
import manageRoleApi from "@/api/manage-role";
import { usePinia } from "@/store/pinia";
//////////////////////////
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "نقش", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "عملیات", icon: "fa-duotone fa-user" },
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
  requestLoading: false,
  roleSelected: {
    roleId: null,
    permission: null,
  },
  status: 1,
});
///////////////////////////////////
onMounted(() => {
  requestGetManageRole();
  const breadCrumb = [
    { name: "صفحه اصلی", link: "/" },
    { name: "مدیریت نقش ها", link: "/manageRole" },
  ];
  pinia.handleBreadCrumb(breadCrumb);
});
///////////////////////////////////
const requestGetManageRole = () => {
  manageRoleApi
    .get()
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
        textMain: "لیست نقش ها دریافت نشد",
      });
      state.tableInfo.tableData = [];
    });
};
///////////////////////////////////
const requestRemoveRole = (RoleId) => {
  pinia.handleRequestLoadingStatus();
  manageRoleApi
    .delete(RoleId)
    .then((response) => {
      if (response.status === 1) {
        requestGetManageRole();
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "success",
          status: true,
          textHeader: "موفق",
          textMain: "با موفقیت حذف شد",
        });
      } else {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: "نقش مورد نظر حذف نشد",
        });
      }
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "نقش مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
///////////////////////////////////
const requestGetRolePermissionsById = (RoleId) => {
  pinia.handleRequestLoadingStatus();
  manageRoleApi
    .getRolePermissionsById(RoleId)
    .then((response) => {
      state.roleSelected.permission = response.data;
      state.roleSelected.roleId = RoleId;
      state.status = 3;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "دسترسی های نقش مورد نظر دریافت نشد",
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
///////////////////////////////////
const requestNewRole = (role) => {
  state.requestLoading = true;
  manageRoleApi
    .new(role)
    .then(() => {
      requestGetManageRole();
      state.status = 1;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "نقش جدید اضافه شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "نقش جدید اضافه نشد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
///////////////////////////////////
const requestEditRolePermission = (data) => {
  state.requestLoading = true;
  manageRoleApi
    .editRolePermission({
      roleId: state.roleSelected.roleId,
      permissions: data,
    })
    .then(() => {
      state.status = 1;
      state.roleSelected.permission = null;
      state.roleSelected.roleId = null;
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "دسترسی های نقش تغییر یافت",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "دسترسی های نقش عوض نشد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
///////////////////////////////////
const handleDialog = (data, name) => {
  state.dialog.name = name;
  state.dialog.data = data;
  state.dialog.status = true;
};
///////////////////////////////////
const handleStatusDialog = (status) => {
  if (status && state.dialog.name === "removeRole") {
    requestRemoveRole(state.dialog.data.id);
  }
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = null;
    state.dialog.data = null;
  }, 500);
};
///////////////////////////////////
const handlePagination = (page) => {
  state.tableInfo.currentPage = page;
  requestGetPersonnelManagement();
};
///////////////////////////////////
provide("state", state);
</script>
<template>
  <div class="parent-manage-role page">
    <!-- ///////////////////////////////// -->
    <div class="header-manage-role">
      <p class="title">مدیریت نقش ها</p>
      <button
        @click="state.status === 1 ? (state.status = 2) : (state.status = 1)"
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
          <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>
              <div class="flex items-center justify-center gap-x-3">
                <i
                  @click="requestGetRolePermissionsById(item.id)"
                  class="fa-duotone fa-pen table-icon"
                ></i>
                <i
                  @click="handleDialog(item, 'removeRole')"
                  class="fa-duotone fa-trash table-icon"
                ></i>
              </div>
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
              <p class="table-small-col">
                {{ item.title }}
              </p>
              <div class="table-small-col">
                <div class="flex items-center justify-center gap-x-3">
                  <i
                    @click="requestGetRolePermissionsById(item.id)"
                    class="fa-duotone fa-pen table-icon"
                  ></i>
                  <i
                    @click="handleDialog(item, 'removeRole')"
                    class="fa-duotone fa-trash table-icon"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <NewRole
        :newRoleLoading="state.requestLoading"
        v-else-if="state.status === 2"
        @newRole="requestNewRole"
      />
      <PermissionList
        :editRolePermissionLoading="state.requestLoading"
        @editRolePermission="requestEditRolePermission"
        :roleSelected="state.roleSelected"
        v-else
      />
    </transition-fade>
    <!-- ///////////////////////// -->
    <Dialog
      :statusDialog="state.dialog.status"
      @dialogStatus="handleStatusDialog"
      :headerText="'سطح دسترسی'"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAcceptStatus="true"
      :btnCancelStatus="true"
      :headerStatus="false"
      :footerStatus="true"
      :dialogWidth="300"
    >
      <div
        v-if="state.dialog.name === 'removeRole'"
        class="p-4 text-center w-full"
      >
        {{ `آیا از حذف نقش ${state.dialog.data?.title} اطمینان دارید؟` }}
      </div>
    </Dialog>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-manage-role {
  @apply flex w-full flex-col justify-start gap-y-3 items-start;
}
.header-manage-role {
  @apply w-full flex items-center gap-x-2 justify-between p-[10px] min-h-[64px];
}
</style>
