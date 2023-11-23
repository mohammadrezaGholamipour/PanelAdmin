<script setup>
import { reactive, watch, onMounted } from "vue";
import InputCheck from "./input-check.vue";
////////////////////////////////////////
const props = defineProps(["roleSelected", "editRolePermissionLoading"]);
const emit = defineEmits(["editRolePermission"]);
const state = reactive({
  permission: [],
  selectedAll: false,
});
////////////////////////////////////////
onMounted(() => {
  handleSetPropForComponentState();
});
////////////////////////////////////////
const handleStatusPermission = (permission) => {
  const findPermission = state.permission.find(
    (item) => item.permissionId === permission.permissionId
  );
  findPermission.isSelected = !findPermission.isSelected;
};
////////////////////////////////////////
const handleSetPropForComponentState = () => {
  state.permission = props.roleSelected.permission.map(
    ({ permissionId, permissionTitle, isSelected }) => ({
      permissionId,
      permissionTitle,
      isSelected,
    })
  );
};
////////////////////////////////////////
const handleEditRolePermission = () => {
  const permissionIds = state.permission
    .filter((item) => item.isSelected === true)
    .map((item) => item.permissionId);
  emit("editRolePermission", permissionIds);
};
////////////////////////////////////////
watch(
  () => state.selectedAll,
  (value) => {
    if (value) {
      state.permission.forEach((item) => (item.isSelected = true));
    } else {
      state.permission.forEach((item) => (item.isSelected = false));
    }
  }
);
</script>
<template>
  <div class="parent-permission-list">
    <div class="main-permission-list">
      <div
        @click="handleStatusPermission(item)"
        v-for="item in state.permission"
        :key="item.permissionId"
        class="permission"
      >
        <p class="text">{{ item.permissionTitle }}</p>
        <InputCheck :data="item.isSelected" />
      </div>
    </div>
    <div class="footer-permissin-list">
      <button
        :class="
          !props.editRolePermissionLoading
            ? 'btn-primary h-[47px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[47px]'
        "
        :disabled="props.editRolePermissionLoading"
        @click="handleEditRolePermission"
      >
        <transition-slide group>
          <i
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
            v-if="props.editRolePermissionLoading"
          ></i>
          <p v-else>تغییر</p>
        </transition-slide>
      </button>
      <button
        @click="handleSetPropForComponentState()"
        class="btn-gray h-[47px]"
      >
        بازنشانی
      </button>
      <div @click="state.selectedAll = !state.selectedAll" class="permission">
        <p class="text">انتخاب همه</p>
        <InputCheck :data="state.selectedAll" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.parent-permission-list {
  @apply w-full h-full flex flex-col justify-start items-start gap-y-3;
}
.main-permission-list {
  @apply w-full h-full grid overflow-y-auto p-2;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 19px;
}
.permission {
  @apply flex items-center justify-between cursor-pointer gap-x-3 bg-slate-200 p-3 rounded-md shadow-md dark:bg-[#1e1e2d];
}
.footer-permissin-list {
  @apply w-full flex justify-start overflow-x-auto overflow-y-hidden items-center p-2 gap-x-3;
}
</style>
