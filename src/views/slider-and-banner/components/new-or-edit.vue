<script setup>
import { useForm, useField } from "vee-validate";
import InputRadio from "./input-radio.vue";
import { onMounted, reactive } from "vue";
import { usePinia } from "@/store/pinia";
import uploaderApi from "@/api/upload";
import DropDown from "./drop-down.vue";
import * as yup from "yup";
///////////////////////////
const emit = defineEmits(["newSliderOrBanner", "editSliderOrBanner"]);
const props = defineProps(["sliderAndBanner"]);
const pinia = usePinia();
const state = reactive({
  loading: false,
  timer: null,
  schema: yup.object({
    adsTitle: yup
      .string()
      .required("لطفا عنوان را وارد کنید")
      .nullable("لطفا عنوان را وارد کنید"),
    adsType: yup
      .number()
      .required("لطفا نوع ایتم را مشخص کنید")
      .nullable("لطفا نوع ایتم را مشخص کنید"),
    adsPage: yup
      .number()
      .required("لطفا صفحه نمایش را انتخاب کنید")
      .nullable("لطفا صفحه نمایش را انتخاب کنید"),
    isActive: yup.boolean(),
    adsImageAddress: yup
      .string()
      .required("لطفا تصویر مورد نظر را بارگزاری کنید")
      .nullable("لطفا تصویر مورد نظر را بارگزاری کنید"),
    actionTitle: yup
      .string()
      .required("لطفا عنوان عملیات را وارد کنید")
      .nullable("لطفا عنوان عملیات را وارد کنید"),
    actionType: yup
      .number()
      .required("لطفا نوع عملیات را وارد کنید")
      .nullable("لطفا نوع عملیات را وارد کنید"),
  }),
});
////////////////////////////////////////
onMounted(() => {
  if (props.sliderAndBanner.data?.adsId) {
    const {
      adsTitle: propAdsTitle,
      adsType: propAdsType,
      adsPage: propAdsPage,
      adsImageAddress: PropImage,
      isActive: propIsActive,
      actionTitle: propActionTitle,
      actionType: propActionType,
    } = props.sliderAndBanner.data;
    adsTitle.value = propAdsTitle;
    adsType.value = propAdsType;
    adsPage.value = propAdsPage;
    adsImageAddress.value = PropImage;
    isActive.value = propIsActive;
    actionTitle.value = propActionTitle;
    actionType.value = propActionType;
  }
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: adsTitle } = useField("adsTitle");
const { value: adsType } = useField("adsType");
const { value: adsPage } = useField("adsPage");
const { value: adsImageAddress } = useField("adsImageAddress");
const { value: isActive } = useField("isActive");
const { value: actionTitle } = useField("actionTitle");
const { value: actionType } = useField("actionType");
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
      if (props.sliderAndBanner.data?.adsId) {
        values.adsId = props.sliderAndBanner.data.adsId;
        values.actionId = props.sliderAndBanner.data.actionApp;
        emit("editSliderOrBanner", values);
      } else {
        emit("newSliderOrBanner", values);
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
      adsImageAddress.value = e.target.result;
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
      adsImageAddress.value = response.data;
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
  <div class="parent-new-or-edit-sliderOrBanner text">
    <!-- //////////////////////////////// -->
    <div class="parent-input-sliderOrBanner">
      <p>عنوان :</p>
      <input v-model="adsTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-sliderOrBanner">
      <p>نوع آیتم :</p>
    </div>
    <DropDown
      :selected="props.sliderAndBanner.data?.adsType"
      :data="props.sliderAndBanner.adsTypes"
      @value="adsType = $event"
    />
    <!-- //////////////////////////////// -->
    <div class="parent-input-sliderOrBanner">
      <p>صفحه نمایش :</p>
    </div>
    <DropDown
      :selected="props.sliderAndBanner.data?.adsPage"
      :data="props.sliderAndBanner.adsPages"
      @value="adsPage = $event"
    />
    <!-- //////////////////////////////// -->
    <div
      class="flex max-w-[365px] w-full min-w-[200px] justify-between items-center"
    >
      <p>وضعیت :</p>
      <InputRadio
        :data="[
          {
            id: 1,
            value: true,
            label: 'فعال',
            status: props.sliderAndBanner.data?.isActive ? true : false,
          },
          {
            id: 2,
            value: false,
            label: 'غیر فعال',
            status: !props.sliderAndBanner.data?.isActive ? true : false,
          },
        ]"
        @updateData="isActive = $event"
      />
    </div>
    <!-- //////////////////////////////// -->
    <div
      class="flex max-w-[365px] w-full min-w-[200px] justify-between items-center"
    >
      <p>تصویر پیام :</p>
      <label class="uploader-image">
        <img
          @error="$event.target.src = '/src/assets/image/image.png'"
          :src="
            adsImageAddress ? adsImageAddress : '/src/assets/image/image.png'
          "
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
          @click.prevent="adsImageAddress = ''"
          width="25"
          height="25"
        />
      </label>
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-sliderOrBanner">
      <p>عنوان عملیات :</p>
      <input v-model="actionTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-sliderOrBanner">
      <p>نوع عملیات :</p>
    </div>
    <DropDown
      :selected="props.sliderAndBanner.data?.actionType"
      :data="props.sliderAndBanner.actionTypes"
      @value="actionType = $event"
    />
    <!-- //////////////////////////////// -->
    <div class="flex justify-center items-end gap-2">
      <button
        :class="
          !state.loading && !props.sliderAndBanner.loading
            ? 'btn-primary h-[50px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
        "
        :disabled="state.loading || props.sliderAndBanner.loading"
        @click="handleMessage"
      >
        <transition-slide group>
          <i
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
            v-if="state.loading || props.sliderAndBanner.loading"
          ></i>
          <p v-else>
            {{ props.sliderAndBanner.data?.adsId ? "تغییر" : "افزودن" }}
          </p>
        </transition-slide>
      </button>
    </div>
  </div>
</template>
<style scoped>
.parent-new-or-edit-sliderOrBanner {
  @apply w-full h-full flex flex-col justify-start items-center gap-y-5 px-3 overflow-y-auto;
}
.parent-input-sliderOrBanner {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
