<template>
  <div class="places">
    <div class="places__wrapper">
      <img
        class="places__img"
        :src="imageSrc"
        :alt="titleText"
      />
      <h4 class="places__title">{{ titleText }}</h4>
    </div>
  </div>
</template>

<script setup>
import fallbackImage from "@/assets/image/content/main-image.png";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
});

const titleText = computed(() => props.title || "Точка маршрута");
const imageSrc = computed(() => props.image || fallbackImage);
</script>

<style lang="scss" scoped>
.places {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 190px;
    width: 100%;
  }
  &__img {
    width: 100%;
    border-radius: 16px;
  }
  &__title {
    color: $surface-900;
    font-weight: 400;
    text-align: center;
  }
}

@media (max-width: 375px) {
  .places {
    &__wrapper {
      width: 190px;
    }
  }
}
</style>
