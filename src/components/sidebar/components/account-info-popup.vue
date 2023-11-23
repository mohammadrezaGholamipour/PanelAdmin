<script setup>
import { useRoute, useRouter } from "vue-router";
///////////////////////////////////////
const props = defineProps(["accountInfo", "status"]);
const emit = defineEmits(["close", "dialog"]);
const router = useRouter();
const route = useRoute();
// ///////////////////////////////////
document.addEventListener("click", (event) => {
  const btnAccountInfoPopup = document.querySelector(".btn-account-info-popup");
  const ParentAccountPopup = document.querySelector(".parent-account-popup");
  ////////////////////////////////////////////////////////
  const clickOutSideParentAccountPopup = ParentAccountPopup?.contains(
    event.target
  );
  const clickBtnAccountInfoPopup = btnAccountInfoPopup?.contains(event.target);
  ////////////////////////////////////////////////////////
  if (!clickOutSideParentAccountPopup && !clickBtnAccountInfoPopup) {
    emit("close");
  }
});
</script>
<template>
  <transition-slide>
    <div v-if="props.status" class="parent-account-popup">
      <div class="p-3 gap-x-3 w-full flex items-center">
        <img
          @error="$event.target.src = '/src/assets/image/account.png'"
          :src="props.accountInfo.imageAddress"
          class="rounded-md"
          width="50"
        />
        <div class="flex flex-col gap-y-2 mr-1">
          <div class="flex items-center">
            <p class="text">{{ props.accountInfo.userName }}</p>
            <span class="account-popup-badge">دسترسی کامل</span>
          </div>
          <p class="text-gray-400" style="font-weight: 500; font-size: 0.85rem">
            {{ props.accountInfo.userFamily }}
          </p>
        </div>
      </div>
      <div class="seperator"></div>
      <div
        class="px-3 flex mt-3 gap-2 flex-col justify-start items-center w-full text-slate-600"
      >
        <div
          @click="router.push('/account-setting'), emit('close')"
          :class="
            route.path === '/account-setting'
              ? 'account-popup-item text-blue-400 bg-slate-100 dark:bg-[#151521] dark:text-blue-400'
              : 'account-popup-item'
          "
        >
          <p>تنظیمات حساب کاربری</p>
          <i class="fa-duotone fa-gear"></i>
        </div>
        <div @click="emit('dialog')" class="account-popup-item text">
          <p>خروج از حساب کاربری</p>
          <i class="fa-duotone fa-portal-exit"></i>
        </div>
      </div>
    </div>
  </transition-slide>
</template>
<style scoped>
.parent-account-popup {
  @apply flex flex-col shadow-sm bg-white dark:bg-[#1e1e2d] dark:shadow-gray-600 rounded-md absolute justify-start items-center py-[13px];
  width: 250px;
  right: 75px;
  top: 60px;
}
.account-popup-badge {
  background-color: #57d694;
  border-radius: 10px;
  color: #16723e;
  margin-right: 10px;
  font-size: 0.7rem;
  padding: 3px 6px;
  font-weight: 600;
}
.seperator {
  border-bottom: 1px dashed #6e6e6e;
  display: block;
  width: 100%;
  height: 0;
}
.account-popup-item {
  @apply flex justify-between items-center p-2 w-full rounded-md cursor-pointer transition-all hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#151521];
}
</style>
