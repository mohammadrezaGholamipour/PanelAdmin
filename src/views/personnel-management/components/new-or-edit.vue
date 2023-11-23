<script setup>
import { useForm, useField } from "vee-validate";
import { onMounted, reactive } from "vue";
import { usePinia } from "@/store/pinia";
import uploaderApi from "@/api/upload";
import * as yup from "yup";
///////////////////////////
const emit = defineEmits(["newPersonnel", "editPersonnel"]);
const props = defineProps(["personnel"]);
const pinia = usePinia();
const state = reactive({
  loading: false,
  timer: null,
  schema: yup.object({
    userName: yup
      .string()
      .required("لطفا نام خود را وارد کنید")
      .nullable("لطفا نام خود را وارد کنید"),
    userFamily: yup
      .string()
      .required("لطفا نام خانوادگی خود را وارد کنید")
      .nullable("لطفا نام خانوادگی خود را وارد کنید"),
    mobileNumber: yup
      .string()
      .matches(
        /^(((\+98|0098)-?)|0)9[0-9]{2}-?[0-9]{3}-?[0-9]{4}$/,
        "شماره تلفن صحیح نمیباشد"
      )
      .required("لطفا تلفن همراه خود را وارد کنید"),
    imageName: yup
      .string()
      .required("لطفا تصویر خود را بارگزاری کنید")
      .nullable("لطفا تصویر خود را بارگزاری کنید"),
    password: yup
      .string()
      .required("لطفا رمز عبور خود را وارد کنید")
      .nullable("لطفا رمز عبور خود را وارد کنید"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "پسورد تکرار شده اشتباه است")
      .required("لطفا رمز عبور خود را تکرار کنید"),
  }),
});
////////////////////////////////////////
onMounted(() => {
  if (props.personnel.data?.userId) {
    const {
      userName: propUserName,
      userFamily: propUserFamily,
      mobileNumber: propMobileNumber,
      imageName: propImageName,
    } = props.personnel.data;
    userName.value = propUserName;
    userFamily.value = propUserFamily;
    mobileNumber.value = propMobileNumber;
    imageName.value = `http://fadakmedia.hamrahefadak.ir/fadakmedia/image/${propImageName}`;
  }
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: userName } = useField("userName");
const { value: userFamily } = useField("userFamily");
const { value: mobileNumber } = useField("mobileNumber");
const { value: imageName } = useField("imageName");
const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");
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
const handlePersonnel = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      if (props.personnel.data?.userId) {
        values.userId = props.personnel.data.userId;
        emit("editPersonnel", values);
      } else {
        emit("newPersonnel", values);
      }
    }, onInvalidSubmit),
    1000
  );
};
/////////////////////////////
const handlePersonnelImage = (event) => {
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
  <div class="parent-new-or-edit-personnel text">
    <!-- //////////////////////////////// -->
    <div class="parent-input-personnel">
      <p>نام :</p>
      <input v-model="userName" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-personnel">
      <p>نام خانوادگی :</p>
      <input v-model="userFamily" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-personnel">
      <p>تلفن همراه :</p>
      <input v-model="mobileNumber" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div
      class="flex max-w-[365px] w-full min-w-[200px] justify-between items-center"
    >
      <p>تصویر خود را بارگزاری کنید :</p>
      <label class="uploader-image">
        <img
          :src="imageName ? imageName : '/src/assets/image/image.png'"
          @error="$event.target.src = '/src/assets/image/image.png'"
          class="rounded-md"
          width="75"
        />
        <input class="hidden" type="file" @change="handlePersonnelImage" />
        <img
          class="absolute right-[-7px] bottom-[-18px]"
          @click="handlePersonnelImage"
          src="@/assets/image/edit.svg"
          width="25"
          height="25"
        />
        <img
          class="absolute left-[-7px] bottom-[-18px]"
          src="@/assets/image/remove.svg"
          @click.prevent="imageName = ''"
          height="25"
          width="25"
        />
      </label>
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-personnel">
      <p>رمز عبور :</p>
      <input v-model="password" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->

    <div class="parent-input-personnel">
      <p>تکرار رمز عبور :</p>
      <input v-model="confirmPassword" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="flex justify-center items-end gap-2">
      <button
        :class="
          !state.loading && !props.personnel.loading
            ? 'btn-primary h-[50px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
        "
        :disabled="state.loading || props.personnel.loading"
        @click="handlePersonnel"
      >
        <transition-slide group>
          <i
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
            v-if="state.loading || props.personnel.loading"
          ></i>
          <p v-else>{{ props.personnel.data?.userId ? "تغییر" : "افزودن" }}</p>
        </transition-slide>
      </button>
    </div>
  </div>
</template>
<style scoped>
.parent-new-or-edit-personnel {
  @apply w-full h-full flex flex-col justify-start items-center gap-y-5 px-3 overflow-y-auto;
}
.parent-input-personnel {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
