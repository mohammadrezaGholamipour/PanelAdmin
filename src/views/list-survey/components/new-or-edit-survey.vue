<script setup>
import { useForm, useField } from "vee-validate";
import InputRadio from "./input-radio.vue";
import { usePinia } from "@/store/pinia";
import { onMounted, reactive } from "vue";
import * as yup from "yup";
///////////////////////////
const emit = defineEmits(["newSurvey", "editSurvey"]);
const props = defineProps(["loading", "survey"]);
const pinia = usePinia();
const state = reactive({
  timer: null,
  schema: yup.object({
    pollTitle: yup
      .string()
      .required("لطفا عنوان نظر سنجی را وارد کنید")
      .nullable("لطفا عنوان نظر سنجی را وارد کنید"),
    pollItem: yup
      .array()
      .of(yup.object())
      .min(1, "حداقل یک گزینه برای نظر سنجی باید وارد کنید"),
    isActive: yup
      .boolean()
      .required("لطفا وضعیت نظر سنجی را مشخص کنید")
      .default(false),
  }),
  pollItem: [],
});
////////////////////////////////////////
onMounted(() => {
  if (props.survey?.pollId) {
    const {
      pollTitle: PropsPollTitle,
      itemVotes: PropsPollItem,
      isActive: PropsIsActive,
    } = props.survey;
    pollTitle.value = PropsPollTitle;
    state.pollItem = PropsPollItem;
    isActive.value = PropsIsActive;
    state.pollItem = PropsPollItem.map(({ pollItemTitle }) => ({
      title: pollItemTitle,
      isAnswer: true,
    }));
  }
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: pollItem } = useField("pollItem");
const { value: pollTitle } = useField("pollTitle");
const { value: isActive } = useField("isActive");
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
const handleNewSurvey = () => {
  pollItem.value = state.pollItem.filter((item) => item.title);
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      values.userGroupIds = [];
      for (const group of pinia.state.groups) {
        values.userGroupIds.push(group.groupId);
      }
      if (props.survey?.pollId) {
        values.pollId = props.survey.pollId;
        emit("editSurvey", values);
      } else {
        emit("newSurvey", values);
      }
    }, onInvalidSubmit),
    1000
  );
};
</script>
<template>
  <div class="parent-new-survey text">
    <!-- //////////////////////////////// -->
    <div class="parent-input-new-survey">
      <p>عنوان نظر سنجی :</p>
      <input v-model="pollTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-new-survey">
      <div class="flex items-center justify-between w-full gap-x-3">
        <p>گزینه نظر سنجی :</p>
        <div class="flex items-center gap-x-2">
          <p>افزودن</p>
          <i
            class="fa-solid fa-circle-plus text-xl cursor-pointer text-blue-600"
            @click="state.pollItem.push({ title: '', isAnswer: true })"
          ></i>
        </div>
      </div>
      <transition-fade
        class="w-full flex flex-col items-start justify-start gap-y-5"
        group
      >
        <div
          class="flex items-center gap-x-3 w-full"
          v-for="(item, index) in state.pollItem"
          :key="index"
        >
          <input v-model="item.title" class="input-grey" type="text" />
          <i
            @click="state.pollItem.splice(index, 1)"
            class="fa-duotone fa-trash table-icon"
          ></i>
        </div>

        <div
          class="w-full flex relative flex-col items-center justify-center"
          v-if="!state.pollItem.length"
        >
          <p class="text text-xl absolute top-7 font-bold">
            لیست گزینه های خالی میباشد
          </p>
          <img width="350" src="@/assets/image/not-found-data.jpg" />
        </div>
      </transition-fade>
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-new-survey">
      <p>وضعیت نظر سنجی :</p>
      <InputRadio
        :data="[
          {
            id: 1,
            value: true,
            label: 'فعال',
            status: isActive ? true : false,
          },
          {
            id: 2,
            value: false,
            label: 'غیر فعال',
            status: !isActive ? true : false,
          },
        ]"
        @updateData="isActive = $event"
      />
    </div>
    <!-- //////////////////////////////// -->
    <div class="flex justify-center items-end gap-2">
      <button
        :class="
          !props.loading
            ? 'btn-primary h-[50px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
        "
        :disabled="props.loading"
        @click="handleNewSurvey"
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
</template>
<style scoped>
.parent-new-survey {
  @apply w-full h-full flex flex-col justify-start items-center gap-y-5 px-3 overflow-y-auto;
}
.parent-input-new-survey {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
