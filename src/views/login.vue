<script setup>
import localStorageService from "@/utils/local-storage-service";
import { useForm, ErrorMessage, useField } from "vee-validate";
import { usePinia } from "@/store/pinia";
import { useRouter } from "vue-router";
import accountApi from "@/api/acoount";
import { reactive } from "vue";
import * as yup from "yup";
///////////////////////////
const router = useRouter();
const pinia = usePinia();
///////////////////////////
const state = reactive({
  showPassword: false,
  inputPasswordType: true,
  timer: false,
  schema: yup.object({
    userName: yup
      .string()
      .required("نام کاربری خود را وارد کنید")
      .min(4, "حداقل چهار کاراکتر باید باشد"),
    password: yup
      .string()
      .required("رمز خود را وارد کنید")
      .min(4, "حداقل چهار کاراکتر باید باشد"),
  }),
});
// ////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
///////////////////////////////
const { value: userName } = useField("userName");
const { value: password } = useField("password");
////////////////////////////////////
function onInvalidSubmit({ errors }) {
  const error = Object.values(errors);
  pinia.handleNotificationData({
    ...pinia.state.notificationData,
    textMain: error[0],
    status: true,
  });
}
////////////////////////////////////
const onSubmit = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      handleAcceptLogin(values);
    }, onInvalidSubmit),
    200
  );
};
/////////////////////////////////
const handleAcceptLogin = (values) => {
  pinia.handleNotificationData({
    ...pinia.state.notificationData,
    status: false,
  });
  pinia.handleRequestLoadingStatus();
  const userlogin = {
    userName: values.userName,
    password: values.password,
  };
  /////////////////////////////
  accountApi
    .login(userlogin)
    .then((response) => {
      if (response.data) {
        localStorageService.setToken(response.data.accessToken);
        router.push("/");
      } else {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          textMain: response.message,
          status: true,
        });
      }
    })
    .catch((error) => {
      pinia.handleNotificationData({
        ...pinia.state.notificationData,
        textMain: error.message,
        status: true,
      });
    })
    .finally(() => {
      pinia.handleRequestLoadingStatus();
    });
};
</script>
<template>
  <div class="parent-login">
    <!-- /////////////////////////// -->
    <div v-if="pinia.state.appWidth >= 1000" class="logo-login">
      <img src="@/assets/image/bg-login.png" />
    </div>
    <!-- /////////////////////// -->
    <div class="inputs-login">
      <img
        v-if="pinia.state.appWidth >= 1000"
        src="@/assets/image/logo.png"
        class="mb-5"
      />
      <img v-else class="mb-5" src="@/assets/image/logo-2.png" />
      <input
        class="input max-w-[365px]"
        placeholder="نام کاربری"
        v-model="userName"
        type="text"
      />
      <transition-expand>
        <ErrorMessage v-if="userName" class="error-message" name="userName" />
      </transition-expand>
      <div
        class="relative w-full max-w-[365px] min-w-[200px] justify-center items-center"
      >
        <input
          :type="state.inputPasswordType ? 'password' : 'text'"
          placeholder="رمز عبور"
          v-model="password"
          class="input"
        />
        <transition-fade
          @click="state.inputPasswordType = !state.inputPasswordType"
          group
        >
          <i
            v-if="state.inputPasswordType"
            class="fa-duotone fa-eye text-xl absolute left-5 top-5 bottom-0"
          ></i>
          <i
            v-else
            class="fa-duotone fa-eye-slash text-xl absolute left-5 top-5 bottom-0"
          ></i>
        </transition-fade>
      </div>
      <transition-expand>
        <ErrorMessage v-if="password" class="error-message" name="password" />
      </transition-expand>
      <button @click="onSubmit" class="btn-login">وارد شدن</button>
    </div>
  </div>
</template>
<style scoped>
.parent-login {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: auto;
}
.logo-login {
  background-color: #60a449;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
}
.inputs-login {
  background-color: white;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  display: flex;
  width: 100%;
}
.error-message {
  @apply text-red-400 font-bold my-2;
}
.btn-login {
  @apply hover:bg-[#1b88c7] transition-all;
  padding: calc(0.775rem + 1px) calc(1.5rem + 1px);
  background-color: #009ef7;
  border-radius: 10px;
  max-width: 365px;
  min-width: 200px;
  margin-top: 5px;
  cursor: pointer;
  color: white;
  width: 100%;
}
</style>
