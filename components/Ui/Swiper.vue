<template>
  <client-only>
    <swiper-container
      class="custom-swiper"
      :space-between="gap"
      :slides-per-view="perSlides"
      :loop="loop"
      :modules="modules"
      :navigation="{
        nextEl: nextBtnClass,
        prevEl: prevBtnClass,
      }"
      :breakpoints="breakpoints"
      :pagination="pagination"
      :autoplay="autoplay"
    >
      <slot></slot>
    </swiper-container>
  </client-only>
</template>

<script setup>
import { Navigation, Pagination, Autoplay } from "swiper/modules";
const modules = [Navigation, Pagination, Autoplay];

const props = defineProps({
  autoplay: {
    type: [Boolean, Object],
    default: false,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  perSlides: {
    type: [String, Number],
    default: "auto",
  },
  gap: {
    type: Number,
    default: 12,
  },
  nextBtnClass: {
    type: String,
    default: "",
  },
  prevBtnClass: {
    type: String,
    default: "",
  },
  breakpoints: {
    type: Object,
    default: {
      768: {},
      992: {},
    },
  },
  pagination: {
    type: [Boolean, Object],
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.custom-swiper::part(pagination) {
  position: relative;
  margin-top: 25px;
}

.custom-swiper::part(button-prev) {
  display: none !important;
}
.custom-swiper::part(button-next) {
  display: none !important;
}
</style>
