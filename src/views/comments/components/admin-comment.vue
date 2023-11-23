<script setup>
import { reactive, provide, onMounted } from "vue";
import { useForm, useField } from "vee-validate";
import Table from "@/components/table/index.vue";
import { usePinia } from "@/store/pinia";
import * as yup from "yup";
/////////////////////////////////////
const props = defineProps(["adminComment", "loading"]);
const emit = defineEmits(["newComment"]);
const pinia = usePinia();
const state = reactive({
  tableInfo: {
    tableHeaderStatus: false,
    tableData: false,
    headerTable: [
      { id: 1, name: "ردیف", icon: "fa-duotone fa-arrow-down-wide-short" },
      { id: 4, name: "عنوان نظر", icon: "fa-duotone fa-mobile" },
      { id: 5, name: "متن نظر", icon: "fa-duotone fa-mobile" },
    ],
  },
  timer: null,
  schema: yup.object({
    commentTitle: yup
      .string()
      .required("لطفا عنوان نظر را وارد کنید")
      .nullable("لطفا عنوان نظر را وارد کنید"),
    commentDescription: yup
      .string()
      .required("لطفا متن نظر را وارد کنید")
      .nullable("لطفا متن نظر را وارد کنید"),
  }),
});
provide("state", state);
///////////////////////
onMounted(() => {
  state.tableInfo.tableData = props.adminComment.childComments;
});
///////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: commentDescription } = useField("commentDescription");
const { value: commentTitle } = useField("commentTitle");
////////////////////////////////////
function onInvalidSubmit({ errors }) {
  const error = Object.values(errors);
  pinia.handleNotificationData({
    ...pinia.state.notificationData,
    name: "error",
    status: true,
    textHeader: "خطا",
    textMain: error[0],
  });
}
/////////////////////////////////
const handleNewAdminComment = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      const comment = {
        commentTitle: values.commentTitle,
        commentDescription: values.commentDescription,
        itemId: props.adminComment.itemId,
        parentId: props.adminComment.commentId,
      };
      emit("newComment", comment);
    }, onInvalidSubmit),
    1000
  );
};
</script>
<template>
  <div class="parent-admin-comment">
    <div class="parent-new-admin-comment text">
      <div class="parent-input-new-admin-comment">
        <p>عنوان :</p>
        <input v-model="commentTitle" class="input-grey" type="text" />
      </div>
      <div class="parent-input-new-admin-comment">
        <p>نظر :</p>
        <input v-model="commentDescription" class="input-grey" type="text" />
      </div>
      <div class="flex justify-center items-end gap-2">
        <button
          :class="
            !props.loading
              ? 'btn-primary h-[50px]'
              : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
          "
          @click="handleNewAdminComment"
          :disabled="props.loading"
        >
          <transition-slide group>
            <i
              v-if="props.loading"
              class="fa-duotone fa-loader animate-spin transition-all duration-300"
            ></i>
            <p v-else>افزودن</p>
          </transition-slide>
        </button>
      </div>
    </div>
    <Table v-if="state.tableInfo.tableData">
      <template v-slot:tableLarg>
        <tr
          v-for="(item, index) in state.tableInfo.tableData"
          :key="item.commentId"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.commentTitle }}</td>
          <td class="cursor-pointer">
            {{ item.commentDescription }}
          </td>
        </tr>
      </template>
      <template v-slot:tableSmall>
        <div
          v-for="(item, index) in state.tableInfo.tableData"
          :key="item.commentId"
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
            <p class="table-small-col">{{ item.commentTitle }}</p>
            <p class="table-small-col">
              {{ item.commentDescription }}
            </p>
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>
<style scoped>
.parent-admin-comment {
  @apply w-full overflow-hidden flex flex-col justify-start gap-y-3;
}
.parent-new-admin-comment {
  @apply w-full flex flex-wrap justify-center items-end gap-2 p-2;
}
.parent-input-new-admin-comment {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
