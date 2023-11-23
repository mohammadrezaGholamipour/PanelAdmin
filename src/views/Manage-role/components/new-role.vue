<script setup>
import { useForm, useField } from "vee-validate";
import { usePinia } from "@/store/pinia";
import { reactive } from "vue";
import * as yup from "yup";
///////////////////////////
const props = defineProps(["newRoleLoading"]);
const emit = defineEmits(["newRole"]);
const pinia = usePinia();
const state = reactive({
  timer: null,
  schema: yup.object({
    roleTitle: yup
      .string()
      .required("لطفا عنوان نقش را وارد کنید")
      .nullable("لطفا عنوان نقش را وارد کنید"),
    key: yup
      .string()
      .required("لطفا عنوان نقش را به لاتین وارد کنید")
      .test("is-english", "عنوان نقش به صورت لاتین صحیح نمیباشد", (value) =>
        /^[a-zA-Z\s]+$/.test(value)
      )
      .nullable("لطفا عنوان نقش را به لاتین وارد کنید"),
  }),
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: roleTitle } = useField("roleTitle");
const { value: key } = useField("key");
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
const handleNewRole = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit((values) => {
      emit("newRole", values);
    }, onInvalidSubmit),
    1000
  );
};
</script>
<template>
  <div class="parent-new-role text">
    <!-- //////////////////////////////// -->
    <div class="parent-input-role">
      <p>عنوان :</p>
      <input v-model="roleTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="parent-input-role">
      <p>عنوان به لاتین :</p>
      <input v-model="key" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="flex justify-center items-end gap-2">
      <button
        :class="
          !props.newRoleLoading
            ? 'btn-primary h-[50px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
        "
        :disabled="props.newRoleLoading"
        @click="handleNewRole"
      >
        <transition-slide group>
          <i
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
            v-if="props.newRoleLoading"
          ></i>
          <p v-else>افزودن</p>
        </transition-slide>
      </button>
    </div>
  </div>
</template>
<style scoped>
.parent-new-role {
  @apply w-full h-full flex flex-col justify-start items-center gap-y-5 px-3 overflow-y-auto;
}
.parent-input-role {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
