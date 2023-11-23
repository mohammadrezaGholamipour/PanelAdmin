<script setup>
import { onMounted, reactive, provide } from "vue";
import Table from "@/components/table/index.vue";
import listOrderApi from "@/api/list-order";
import { usePinia } from "@/store/pinia";
//////////////////////////
const props = defineProps(["factorId"]);
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 2, name: "تصویر", icon: "fa-duotone fa-ballot-check" },
      { id: 3, name: "عنوان", icon: "fa-duotone fa-user" },
      { id: 4, name: "دسته بندی", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "هزینه", icon: "fa-duotone fa-mobile" },
      { id: 6, name: "تعداد", icon: "fa-duotone fa-mobile" },
      { id: 7, name: "مبلغ کل", icon: "fa-sharp fa-regular fa-sliders" },
    ],
    tableHeaderStatus: false,
    tableData: false,
  },
});
////////////////////
onMounted(() => {
  requestGetFactorBuy(props.factorId);
});
//////////////////
const requestGetFactorBuy = (factorId) => {
  listOrderApi
    .factorBuy(factorId)
    .then((response) => {
      state.tableInfo.tableData = response.data;
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
/////////////////////////////////
provide("state", state);
</script>
<template>
  <Table>
    <template v-slot:tableLarg>
      <tr v-for="(item, index) in state.tableInfo.tableData" :key="item.factorId">
        <td class="w-[100px]">{{ index + 1 }}</td>
        <td class="m-auto flex justify-center items-center">
          <img :src="item.imageAddress" width="50" />
        </td>
        <td>{{ item.itemTitle }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.count }}</td>
        <td>{{ item.allAmount }}</td>
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
            <img :src="item.imageAddress" width="50" />
          </div>
          <p class="table-small-col">{{ item.itemTitle }}</p>
          <p class="table-small-col">{{ item.category }}</p>
          <p class="table-small-col">
            {{ `${item.amount.toLocaleString()} هزار تومان` }}
          </p>
          <p class="table-small-col">{{ item.count }}</p>
          <p class="table-small-col">
            {{ `${item.allAmount.toLocaleString()} هزار تومان` }}
          </p>
        </div>
      </div>
    </template>
  </Table>
</template>
