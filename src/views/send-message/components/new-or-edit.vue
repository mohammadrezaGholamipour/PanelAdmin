<script setup>
import { useForm, useField } from "vee-validate";
import { onMounted, reactive } from "vue";
import { usePinia } from "@/store/pinia";
import uploaderApi from "@/api/upload";
import DropDown from "./drop-down.vue";
import * as yup from "yup";
///////////////////////////
const emit = defineEmits(["newMessage", "editMessage"]);
const props = defineProps(["message"]);
const pinia = usePinia();
const state = reactive({
  loading: false,
  timer: null,
  schema: yup.object({
    pushMessageTitle: yup
      .string()
      .required("لطفا عنوان پیام را وارد کنید")
      .nullable("لطفا عنوان پیام را وارد کنید"),
    pushMessageDescription: yup
      .string()
      .required("لطفا متن پیام را وارد کنید")
      .nullable("لطفا متن پیام را وارد کنید"),
    actionTitle: yup
      .string()
      .required("لطفا عنوان عملیات را وارد کنید")
      .nullable("لطفا عنوان عملیات را وارد کنید"),
    actionId: yup
      .number()
      .required("لطفا نوع عملیات را وارد کنید")
      .nullable("لطفا نوع عملیات را وارد کنید"),
    imageName: yup.string(),
  }),
});
////////////////////////////////////////
onMounted(() => {
  if (props.message.data?.pushMessageId) {
    const {
      pushMessageTitle: propPushMessageTitle,
      pushMessageDescription: propPushMessageDescription,
      imageName: propImageName,
      actionTitle: propActionTitle,
      actionId: propActionId,
      action: propAction,
    } = props.message.data;
    pushMessageTitle.value = propPushMessageTitle;
    pushMessageDescription.value = propPushMessageDescription;
    imageName.value = propImageName;
    actionTitle.value = propActionTitle;
    actionId.value = propActionId;
    action.value = propAction;
  }
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: pushMessageTitle } = useField("pushMessageTitle");
const { value: pushMessageDescription } = useField("pushMessageDescription");
const { value: actionTitle } = useField("actionTitle");
const { value: imageName } = useField("imageName");
const { value: actionId } = useField("actionId");
const { value: action } = useField("action");
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
const handleMessage = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      values.groupId = [];
      for (const item of pinia.state.groups) {
        values.groupId.push(item.groupId);
      }
      if (props.message.data?.pushMessageId) {
        values.pushMessageId = props.message.data.pushMessageId;
        emit("editMessage", values);
      } else {
        emit("newMessage", values);
      }
    }, onInvalidSubmit),
    1000
  );
};
/////////////////////////////
const handleCategoriesImage = (event) => {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      imageName.value = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    handleConvertProfileForUpload(event.target.files[0]);
  }
};
/////////////////////////////////////
const handleConvertProfileForUpload = (file) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  const formData = new FormData();
  reader.onload = () => {
    formData.append(
      "file",
      new Blob([reader.result], { type: file.type }),
      file.name
    );
    requestUploadProfile(formData);
  };
};
///////////////////////////////
const requestUploadProfile = (formData) => {
  state.loading = true;
  uploaderApi
    .profile(formData)
    .then((response) => {
      imageName.value = response.data;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "پروفایل بارگزاری نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
</script>
<template>
  <div class="parent-new-or-edit-message text">
    <!-- //////////////////////////////// -->
    <div class="parent-input-message">
      <p>عنوان پیام :</p>
      <input v-model="pushMessageTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-message">
      <p>متن پیام :</p>
      <input v-model="pushMessageDescription" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-message">
      <p>عنوان عملیات :</p>
      <input v-model="actionTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-message">
      <p>نوع عملیات :</p>
    </div>
    <DropDown
      :selected="props.message.data?.actionId"
      :data="props.message.actionType"
      @value="actionId = $event"
    />
    <!-- //////////////////////////////// -->
    <div
      class="flex max-w-[365px] w-full min-w-[200px] justify-between items-center"
    >
      <p>تصویر پیام :</p>
      <label class="uploader-image">
        <img
          :src="imageName ? imageName : '/src/assets/image/image.png'"
          @error="$event.target.src = '/src/assets/image/image.png'"
          class="rounded-md"
          width="75"
        />
        <input class="hidden" type="file" @change="handleCategoriesImage" />
        <img
          class="absolute right-[-7px] bottom-[-18px]"
          @click="handleCategoriesImage"
          src="@/assets/image/edit.svg"
          width="25"
          height="25"
        />
        <img
          class="absolute left-[-7px] bottom-[-18px]"
          src="@/assets/image/remove.svg"
          @click.prevent="imageName = ''"
          width="25"
          height="25"
        />
      </label>
    </div>
    <!-- //////////////////////////////// -->
    <div class="flex justify-center items-end gap-2">
      <button
        :class="
          !state.loading && !props.message.loading
            ? 'btn-primary h-[50px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
        "
        :disabled="state.loading || props.message.loading"
        @click="handleMessage"
      >
        <transition-slide group>
          <i
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
            v-if="state.loading || props.message.loading"
          ></i>
          <p v-else>افزودن</p>
        </transition-slide>
      </button>
    </div>
  </div>
</template>
<style scoped>
.parent-new-or-edit-message {
  @apply w-full h-full flex flex-col justify-start items-center gap-y-5 px-3 overflow-y-auto;
}
.parent-input-message {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
