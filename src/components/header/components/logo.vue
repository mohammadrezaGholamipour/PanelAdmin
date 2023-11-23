<template>
  <div class="logo">
    <img src="@/assets/image/logo.png" alt="لوگو" />
    <p>جریان فدک</p>
  </div>
</template>

<style scoped>
.logo {
  @apply flex justify-center items-center gap-x-3;
}
.logo img {
  @apply w-[40px];
}
.logo p {
  @apply font-bold mt-1.5 text-xl;
}
</style>
