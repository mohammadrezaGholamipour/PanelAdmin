<script setup>
import { useForm, useField } from "vee-validate";
import { onMounted, reactive } from "vue";
import { usePinia } from "@/store/pinia";
import uploaderApi from "@/api/upload";
import * as yup from "yup";
///////////////////////////
const emit = defineEmits(["editeCategory", "newCategory"]);
const props = defineProps(["category", "loading"]);
const pinia = usePinia();
/////////////////////////
onMounted(() => {
  categoryTitle.value = props.category?.categoryTitle;
  imageName.value = props.category?.imageName;
  priority.value = props.category?.priority;
});
/////////////////////////
const state = reactive({
  loading: false,
  timer: null,
  schema: yup.object({
    categoryTitle: yup
      .string()
      .required("لطفا نام دسته بندی را وارد کنید")
      .nullable("لطفا نام دسته بندی را وارد کنید"),
    priority: yup
      .string()
      .required("لطفا الویت دسته بندی را وارد کنید")
      .nullable("لطفا الویت دسته بندی را وارد کنید"),
    imageName: yup
      .string()
      .required("لطفا تصویر دسته بندی را بارگزاری کنید")
      .nullable("لطفا تصویر دسته بندی را بارگزاری کنید"),
  }),
});
////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
///////////////////////////////
const { value: categoryTitle } = useField("categoryTitle");
const { value: imageName } = useField("imageName");
const { value: priority } = useField("priority");
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
////////////////////////////////////
const handleChangeOrNewCategory = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      if (props.category?.categoryId) {
        props.category.categoryTitle = categoryTitle.value;
        props.category.imageName = imageName.value;
        props.category.priority = priority.value;
        emit("editeCategory", props.category);
      } else {
        emit("newCategory", values);
      }
    }, onInvalidSubmit),
    1000
  );
};
//////////////////////////////////
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
//////////////////////////
const handleResetInputs = () => {
  if (props.category?.categoryId) {
    categoryTitle.value = props.category.categoryTitle;
    imageName.value = props.category.imageName;
    priority.value = props.category.priority;
  } else {
    categoryTitle.value = "";
    imageName.value = "";
    priority.value = "";
  }
};
</script>
<template>
  <div class="flex w-full flex-col items-start justify-start p-5 gap-10">
    <div
      class="flex gap-5 w-full justify-start rounded-md items-center flex-wrap"
    >
      <!-- ////////////////////////////// -->
      <div
        class="flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2 text"
      >
        <p>عنوان :</p>
        <input v-model="categoryTitle" class="input-grey" type="text" />
      </div>
      <div
        class="flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2 text"
      >
        <p>الویت :</p>
        <input v-model="priority" class="input-grey" type="text" />
      </div>
      <div class="flex items-center justify-center gap-x-5 text">
        <p>تصویر دسته بندی :</p>
        <label class="uploader-image">
          <!-- ///////////////////// -->
          <img
            @error="$event.target.src = '/assets/category.png'"
            class="rounded-md"
            v-if="imageName"
            :src="imageName"
            width="75"
          />
          <img v-else src="@/assets/image/image.png" width="75" />
          <input class="hidden" type="file" @change="handleCategoriesImage" />
          <!-- /////////////////////// -->
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
      <!-- ////////////////////////////// -->
    </div>
    <div class="w-full flex justify-end items-center gap-5">
      <button
        :disabled="state.loading || props.loading"
        @click="handleChangeOrNewCategory"
        :class="
          !state.loading && !props.loading
            ? 'btn-primary'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white'
        "
      >
        <transition-slide group>
          <i
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
            v-if="state.loading || props.loading"
          ></i>
          <p v-else>تایید</p>
        </transition-slide>
      </button>
      <button @click="handleResetInputs" class="btn-gray">بازنشانی</button>
    </div>
  </div>
</template>
