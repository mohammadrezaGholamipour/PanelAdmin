<script setup>
import AccountInfoPopup from "./account-info-popup.vue";
import { usePinia } from "@/store/pinia";
import { ref } from "vue";
/////////////////////////
const accountInfoPopupStatus = ref(false);
const statusDialog = ref(false);
const pinia = usePinia();
//////////////////////
const handleStatusDialog = (status) => {
  statusDialog.value = false;
  if (status) pinia.requestAccountLogOut();
};
</script>
<template>
  <div class="account-info">
    <template v-if="pinia.state.accountInfo">
      <img
        @error="$event.target.src = '/assets/account.png'"
        :src="pinia.state.accountInfo.imageAddress"
        class="rounded-md"
        height="50"
        width="50"
      />
      <div class="flex justify-between w-full items-center mr-4">
        <div class="flex flex-col gap-1">
          <p style="font-weight: 600; font-size: 1.075rem">
            {{ pinia.state.accountInfo.userName }}
          </p>
          <p
            style="
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 0.85rem;
              font-weight: 500;
              overflow: hidden;
              max-width: 110px;
            "
          >
            {{ pinia.state.accountInfo.userFamily }}
          </p>
        </div>
        <i
          class="fa-duotone btn-account-info-popup fa-gear text-xl cursor-pointer duration-500 transition-[transform] hover:rotate-45"
          @click="accountInfoPopupStatus = !accountInfoPopupStatus"
        ></i>
      </div>
      <!-- ///////////////////////////////// -->
      <AccountInfoPopup
        @dialog="(statusDialog = true), (accountInfoPopupStatus = false)"
        @close="accountInfoPopupStatus = false"
        :accountInfo="pinia.state.accountInfo"
        :status="accountInfoPopupStatus"
      />
      <!-- ///////////////////////////////// -->
      <Dialog
        @dialogStatus="handleStatusDialog"
        :statusDialog="statusDialog"
        :btnCancelText="'بازگشت'"
        :btnAcceptText="'تایید'"
        :btnAcceptStatus="true"
        :btnCancelStatus="true"
        :headerText="'dialog'"
        :headerStatus="false"
        :footerStatus="true"
        :dialogWidth="300"
      >
        <p>از داشبورد خارج میشوید؟</p>
      </Dialog>
    </template>

    <!-- //////////////////////////////////////// -->
    <div v-else class="animate-pulse account-info gap-x-3 !p-0 ">
      <span class="min-w-[50px] h-[50px] bg-white rounded-md"></span>
      <div class="flex justify-between w-full items-center">
        <div class="flex flex-col space-y-3 justify-between">
          <span class="w-[100px]  rounded-md bg-white h-[5px]"></span>
          <span class="w-[100px]  rounded-md bg-white h-[5px]"></span>
          <span class="w-[100px]  rounded-md bg-white h-[5px]"></span>
        </div>
      </div>
      <span class="min-w-[20px] rounded-full bg-white min-h-[20px]"></span>
    </div>
  </div>
</template>
<style scoped>
.account-info {
  @apply w-full relative flex justify-between items-center z-[9999] px-[25px];
}
</style>
