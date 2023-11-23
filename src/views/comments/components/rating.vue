<script setup>
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
});
</script>
<template>
  <div class="star-rating">
    <span
      :class="{ filled: index <= rating }"
      v-for="index in 5"
      :key="index"
      class="star"
    >
      <i class="fas fa-star"></i>
    </span>
  </div>
</template>
<style scoped>
.star-rating {
  display: inline-block;
}

.star-rating .star {
  color: gray; /* Default star color */
  font-size: 18px;
  transition: color 0.3s;
}

.star-rating .star.filled {
  color: gold; /* Colored star */
}
</style>
