<template>
  <section class="info-modal">
    <div class="info-modal__wrapper" :style="{ maxWidth: maxWidth }">
      <h3 class="info-modal__title">{{ title }}</h3>
      <p class="info-modal__description">
        {{ description }}
      </p>
      <UiButton
        @click="emit('goTo')"
        class="info-modal__btn button-primary"
        :label="btnLabel"
      ></UiButton>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits("goTo");
const props = defineProps({
  title: String,
  description: String,
  btnLabel: String,
  maxWidth: {
    type: String,
    default: "350px",
  },
  btnStatus: String,
});
</script>

<style lang="scss" scoped>
.info-modal {
  padding: 60px 0;
  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    color: $surface-900;
    width: 100%;
    margin: 0 auto;
  }
  &__description {
    text-align: center;
  }
  &__title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
  }
  &__btn {
    padding: 12px;
    width: 100%;
  }
}
</style>
