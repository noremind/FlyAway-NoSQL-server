<template>
  <div class="popular-banner" @click="checkType(banner)">
    <div class="popular-banner__wrapper">
      <img class="popular-banner__img" :src="banner.image" alt="Banner" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  banner: {
    type: Object,
    default: () => {},
  },
});
const router = useRouter();

const checkType = (banner) => {
  switch (banner.type) {
    case "our_tour":
      router.push(`/tours/${banner.link}`);
      break;
    case "our_hotel":
      router.push(`/hotels/${banner.link}`);
      break;
    case "out_partner":
      router.push(`/tours/${banner.link}`);
      break;
    case "another":
      window.open(banner.link, "_blank");
      break;
  }
};
</script>

<style lang="scss" scoped>
.popular-banner {
  &__wrapper {
    width: 100%;
    max-height: 300px;
    height: 100%;
  }
  &__img {
    border-radius: 16px;
    width: 100%;
    max-height: 300px;
    object-fit: cover;
  }
}
</style>
