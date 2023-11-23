<script setup>
import { useForm, useField } from "vee-validate";
import { onMounted, reactive, watch } from "vue";
import { usePinia } from "@/store/pinia";
import { useRouter } from "vue-router";
import uploaderApi from "@/api/upload";
import acoountApi from "@/api/acoount";
import * as yup from "yup";
/////////////////////////////////
const router = useRouter();
const pinia = usePinia();
////////////////////////
onMounted(() => {
  state.userMobileNumber = pinia.state.accountInfo?.userMobileNumber;
  imageName.value = pinia.state.accountInfo?.imageAddress;
  userFamily.value = pinia.state.accountInfo?.userFamily;
  userName.value = pinia.state.accountInfo?.userName;
  /////////////////////////////////////////////////
  pinia.handleBreadCrumb([
    { name: "صفحه اصلی", link: "/" },
    { name: "تغییر حساب کاربری", link: "/account-setting" },
  ]);
});
//////////////////////////////////////
watch(
  () => pinia.state.accountInfo,
  (value) => {
    state.userMobileNumber = value?.userMobileNumber;
    imageName.value = value?.imageAddress;
    userFamily.value = value?.userFamily;
    userName.value = value?.userName;
    state.clientProfile = "";
  }
);
/////////////////////////
const state = reactive({
  userMobileNumber: null,
  loading: false,
  timer: null,
  clientProfile: "",
  schema: yup.object({
    userName: yup
      .string()
      .required("لطفا نام خود را وارد کنید")
      .nullable("لطفا نام خود را وارد کنید"),
    userFamily: yup
      .string()
      .required("نام خانوادگی خود را وارد کنید")
      .nullable("نام خانوادگی خود را وارد کنید"),
    imageName: yup
      .string()
      .required("لطفا پروفایل خود را بارگزاری کنید")
      .nullable("لطفا پروفایل خود را بارگزاری کنید"),
  }),
});
///////////////////////////////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
/////////////////////////////////////////////////
const { value: userFamily } = useField("userFamily");
const { value: imageName } = useField("imageName");
const { value: userName } = useField("userName");
/////////////////////////////////////
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
const handleChangeAccount = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      requestEditeAccount(values);
    }, onInvalidSubmit),
    1000
  );
};
//////////////////////////////////
const handleProfile = (event) => {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      state.clientProfile = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    handleConvertProfileForUpload(event.target.files[0]);
  }
};
////////////////////////////////////////////////
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
///////////////////////////////////////////
const requestUploadProfile = (formData) => {
  state.loading = true;
  uploaderApi
    .profile(formData)
    .then((response) => {
      state.clientProfile = "";
      imageName.value = response.data;
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "پروفایل بارگزای نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
//////////////////////////////////////
const requestEditeAccount = (user) => {
  state.loading = true;
  acoountApi
    .edit(user)
    .then(() => {
      pinia.requestGetAccountInfo();
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "success",
        status: true,
        textHeader: "انجام شد",
        textMain: "تغییرات انجام شد",
      });
    })
    .catch(() => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "تغییرات انجام نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
</script>
<template>
  <div class="parent-account-setting page">
    <!-- ///////////////////////// -->
    <div class="header-account-setting">
      <p class="title">تنظیمات حساب کاربری</p>
    </div>
    <!-- ///////////////////////// -->
    <div class="main-account-setting">
      <div class="flex w-full justify-start gap-x-10 items-center">
        <p class="text w-[124px]">عکس پروفایل :</p>
        <div
          class="flex bg-[#f4f4f4] dark:bg-[#1b1b29] dark:shadow-xl rounded-md p-4 relative"
        >
          <!-- /////////////////////////////// -->
          <transition-slide group>
            <img
              class="min-w-[90px] min-h-[90px] w-[90px] h-[90px] rounded-md"
              v-if="state.clientProfile"
              :src="state.clientProfile"
            />
            <img
              v-else
              class="min-w-[90px] min-h-[90px] w-[90px] h-[90px] rounded-md"
              :src="imageName ? imageName : 'src/assets/image/account.png'"
              @error="$event.target.src = 'src/assets/image/account.png'"
            />
          </transition-slide>
          <!-- //////////////////////////////// -->
          <img
            @click="
              (state.clientProfile = 'src/assets/image/account.png'),
                (imageName = '')
            "
            class="btn-change-profile left-0"
            src="@/assets/image/remove.svg"
            height="25"
            width="25"
          />
          <!-- //////////////////////// -->
          <label class="btn-change-profile right-0">
            <input class="hidden" type="file" @change="handleProfile" />
            <img width="25" height="25" src="@/assets/image/edit.svg" />
          </label>
          <!-- ////////////////////////// -->
        </div>
      </div>
      <div
        class="flex w-full flex-wrap justify-start gap-x-10 gap-y-5 items-center"
      >
        <p class="text w-[124px]">نام کامل :</p>
        <div class="flex gap-y-5 flex-wrap">
          <input
            v-model="userName"
            class="input-grey"
            placeholder="نام"
            type="text"
          />
          <input
            placeholder="نام خانوادگی"
            v-model="userFamily"
            class="input-grey"
            type="text"
          />
        </div>
      </div>
      <div
        class="flex flex-wrap w-full justify-start gap-x-10 gap-y-5 items-center"
      >
        <p class="text w-[124px]">شماره تلفن همراه :</p>
        <input
          class="input-grey bg-[#D9D8D8] hover:cursor-not-allowed"
          :value="state.userMobileNumber"
          placeholder="تلفن همراه"
          type="text"
          disabled
        />
      </div>
      <div class="footer-account-setting">
        <button
          :disabled="state.loading"
          :class="
            !state.loading
              ? 'btn-primary'
              : '!cursor-not-allowed btn-gray bg-slate-500 text-white'
          "
          @click="handleChangeAccount"
        >
          <transition-slide group>
            <i
              v-if="state.loading"
              class="fa-duotone fa-loader animate-spin transition-all duration-300"
            ></i>
            <p v-else>تایید</p>
          </transition-slide>
        </button>
        <button @click="router.push('/')" class="btn-gray">بازگشت</button>
      </div>
    </div>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-account-setting {
  @apply flex flex-col overflow-x-auto gap-y-5 justify-start items-start;
}
.header-account-setting {
  @apply w-full flex justify-start items-center;
}
.main-account-setting {
  @apply w-full overflow-y-auto min-w-[335px] bg-white dark:bg-[#1e1e2d] flex-col rounded-md shadow-sm p-6 flex justify-start items-center gap-y-20;
}
.footer-account-setting {
  @apply w-full flex items-center justify-end gap-x-5;
}
.btn-change-profile {
  @apply absolute bottom-[-10px] cursor-pointer;
}
</style>
