<script setup>
import { useForm, useField } from "vee-validate";
import { onMounted, reactive } from "vue";
import { usePinia } from "@/store/pinia";
import * as yup from "yup";
///////////////////////////
const emit = defineEmits(["newTag", "editTag"]);
const props = defineProps(["tag"]);
const pinia = usePinia();
const state = reactive({
  timer: null,
  schema: yup.object({
    tagTitle: yup
      .string()
      .required("عنوان برچسب را وارد کنید")
      .nullable("عنوان برچسب را وارد کنید"),
  }),
});
////////////////////////////////////////
onMounted(() => {
  if (props.tag.data?.tagId) tagTitle.value = props.tag.data.tagTitle;
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: tagTitle } = useField("tagTitle");
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
const handleTag = () => {
  clearTimeout(state.timer);
  state.timer = setTimeout(
    handleSubmit(() => {
      if (props.tag.data?.tagId) {
        const tag = {
          tagItemId: props.tag.data.tagId,
          tagItemTitle: tagTitle.value,
        };
        emit("editTag", tag);
      } else {
        emit("newTag", tagTitle.value);
      }
    }, onInvalidSubmit),
    1000
  );
};
</script>
<template>
  <div class="parent-tag text">
    <!-- //////////////////////////////// -->
    <div class="parent-input-tag">
      <p>عنوان برچسب:</p>
      <input v-model="tagTitle" class="input-grey" type="text" />
    </div>
    <!-- //////////////////////////////// -->
    <div class="flex justify-center items-end gap-2">
      <button
        :class="
          !props.tag.loading
            ? 'btn-primary h-[50px]'
            : '!cursor-not-allowed btn-gray bg-slate-500 text-white h-[50px]'
        "
        :disabled="props.tag.loading"
        @click="handleTag"
      >
        <transition-slide group>
          <i
            v-if="props.tag.loading"
            class="fa-duotone fa-loader animate-spin transition-all duration-300"
          ></i>
          <p v-else>{{ props.tag.data?.tagId ? "تغییر برچسب" : "افزودن" }}</p>
        </transition-slide>
      </button>
    </div>
  </div>
</template>
<style scoped>
.parent-tag {
  @apply w-full h-full flex flex-col justify-start items-center gap-y-5 px-3 overflow-y-auto;
}
.parent-input-tag {
  @apply flex max-w-[365px] w-full min-w-[200px] items-start flex-col justify-center gap-y-2;
}
</style>
