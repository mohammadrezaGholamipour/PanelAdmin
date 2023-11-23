<script setup>
import listOrderApi from "@/api/list-order";
import { onMounted, reactive } from "vue";
import { usePinia } from "@/store/pinia";
/////////////////////////
const props = defineProps(["factorId"]);
const pinia = usePinia();
const state = reactive({
  factorData: false,
});
///////////////////////
onMounted(() => {
  requestGetFactorPrint(props.factorId);
});
///////////////////////
const requestGetFactorPrint = (factorId) => {
  const queryParams = {
    factorId,
  };
  listOrderApi
    .factorPrint(queryParams)
    .then((response) => {
      state.factorData = response.data;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "مقداری یافت نشد",
      });
    });
};
///////////////////////////////////
const handlePrintFactor = () => {
  const factor = document.querySelector(".parent-factor-print");
  const printWindow = window.open(
    "",
    "_blank",
    "left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0"
  );
  printWindow.document.open();
  printWindow.document.write(`
  <!DOCTYPE html>
<html dir="rtl" lang="fa">

  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>همراه فدک</title>
    <style>
    *{
      font-family: dana;
      margin:0;
    }
    .parent-factor-print {
      display: flex; 
      padding: 1rem; 
      flex-direction: column; 
      row-gap: 0.75rem; 
      justify-content: center; 
      align-items: center; 
      font-weight: 500; 
      color: #000000; 
      background-color: #ffffff; 
      width: 750px;
      margin: auto;
    }

    .factor-print-header {
     display: flex; 
     justify-content: space-between; 
     align-items: flex-start; 
     width: 100%; 
    }

    .factor-print-header > div {
     display: flex; 
     flex-direction: column; 
     gap: 0.75rem; 
     justify-content: center; 
     align-items: flex-start; 
    }

   .factor-print-header-child {
    display: flex; 
    flex-wrap: nowrap; 
    column-gap: 0.5rem; 
    align-items: center; 
    }

    .factor-print-main {
     display: flex; 
     justify-content: center; 
     align-items: center; 
     width: 100%; 
    }
    table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
    }
    .factor-print-main table {
     width: 100%; 
     text-align: center; 
    }

    .factor-print-main table td,th {
    padding: 0.5rem; 
    border-width: 1px; 
    border-color: #000000;  
    border:solid
    }

    .factor-print-main table tbody {
     font-weight: 500; 
    }
    </style>
  </head>

  <body>
    <div class='parent-factor-print'>
   ${factor.innerHTML}
   </div>
  </body>

  `);
  printWindow.print();
  printWindow.close();
};
</script>
<template>
  <transition-slide group class="w-full overflow-auto">
    <div
      class="w-full relative overflow-auto p-1 flex flex-col gap-y-2"
      v-if="state.factorData"
    >
      <button @click="handlePrintFactor" class="btn-red">چاپ</button>
      <div class="parent-factor-print">
        <div class="factor-print-header">
          <div>
            <img src="@/assets/image/logo.png" width="50" />
            <p>فروشگاه فدک</p>
            <div class="factor-print-header-child">
              <p>سفارش دهنده :</p>
              <p>{{ state.factorData.userFamily ?? "نامشخص" }}</p>
            </div>
            <div class="factor-print-header-child">
              <p>آدرس :</p>
              <p>{{ state.factorData.address?.address ?? "نامشخص" }}</p>
            </div>
          </div>
          <div>
            <div class="factor-print-header-child">
              <p>تاریخ :</p>
              <p>{{ state.factorData.createDate ?? "نامشخص" }}</p>
            </div>
            <div class="factor-print-header-child">
              <p>شماره فاکتور :</p>
              <p>{{ state.factorData.factorId ?? "نامشخص" }}</p>
            </div>
            <div class="factor-print-header-child">
              <p>نحوه پرداخت :</p>
              <p>{{ state.factorData.payType ?? "نامشخص" }}</p>
            </div>
            <div class="factor-print-header-child">
              <p>نوع ارسال :</p>
              <p>{{ state.factorData.sendType ?? "نامشخص" }}</p>
            </div>
            <div class="factor-print-header-child">
              <p>تلفن همراه :</p>
              <p>{{ state.factorData.userMobileNumber ?? "نامشخص" }}</p>
            </div>
          </div>
        </div>
        <div class="factor-print-main">
          <table>
            <thead>
              <tr>
                <th>شماره</th>
                <th>کد کالا</th>
                <th>نام کالا</th>
                <th>تعداد</th>
                <th>مبلغ(تومان)</th>
                <th>درصد تخفیف</th>
                <th>مبلغ پس از تخفیف</th>
                <th>مبلغ کل(تومان)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in state.factorData.factorItems"
                :key="item.itemId"
              >
                <td>{{ item.row }}</td>
                <td>{{ item.itemId }}</td>
                <td>{{ item.itemTitle }}</td>
                <td>{{ item.count }}</td>
                <td>
                  {{ item.totalAmountBeforeDeductingDiscount.toLocaleString() }}
                </td>
                <td>{{ item.discountPercent }}</td>
                <td>{{ item.totalAmountAfterDeductingDiscount }}</td>
                <td>{{ item.amount.toLocaleString() }}</td>
              </tr>
              <tr>
                <td colspan="7">
                  {{
                    `${state.factorData.lettersAmountPayable} جمع کل فاکتور به حروف : `
                  }}
                </td>
                <td>{{ state.factorData.amountPayable.toLocaleString() }}</td>
              </tr>
              <tr>
                <td colspan="7">مبلغ کسر تخفیف</td>
                <td>
                  {{ state.factorData.discountCodeAmount.toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td colspan="7">هزینه ارسال سفارش</td>
                <td>{{ state.factorData.sendAmount.toLocaleString() }}</td>
              </tr>
              <tr>
                <td colspan="7">سود شما از این خرید</td>
                <td>
                  {{ state.factorData.yourProfitFromPurchase.toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td colspan="7">مبلغ قابل پرداخت</td>
                <td>{{ state.factorData.amountPayable.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else class="p-2">درحال آماده سازی .....</div>
  </transition-slide>
</template>
<style scoped>
.parent-factor-print {
  @apply mx-auto min-w-[750px] overflow-x-auto w-[750px] max-w-[750px] flex flex-col justify-center items-center p-4 gap-y-3 font-medium bg-white text-black;
}
.factor-print-header {
  @apply w-full flex justify-between items-start;
}
.factor-print-header > div {
  @apply flex flex-col items-start justify-center gap-3;
}
.factor-print-header-child {
  @apply flex items-center flex-nowrap gap-x-2;
}
.factor-print-main {
  @apply w-full flex justify-center items-center;
}
.factor-print-main table {
  @apply w-full text-center;
}
.factor-print-main table td,
th {
  @apply p-2 border border-black;
}
.factor-print-main table tbody {
  @apply font-medium;
}
</style>
