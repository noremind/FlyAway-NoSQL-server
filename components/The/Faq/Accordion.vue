<template>
  <section class="accordion">
    <div class="accordion__wrapper">
      <div class="accordion__header" @click="toggleAccordion">
        <h3 class="accordion__title">{{ faq.question }}</h3>
        <UiIcons
          icon="chevron"
          :class="isOpenAccordion ? 'left' : 'right'"
          size="size-20"
          color="blue-500"
        ></UiIcons>
      </div>
      <div class="accordion__content" v-if="isOpenAccordion">
        <p class="accordion__description">
          {{ faq.answer }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const isOpenAccordion = ref(false);

const props = defineProps({
  faq: {
    type: Object,
    default: () => {},
  },
});
const toggleAccordion = () => {
  isOpenAccordion.value = !isOpenAccordion.value;
};
</script>

<style lang="scss" scoped>
.accordion {
  &__wrapper {
    width: 100%;
    color: $surface-900;
  }
  &__header {
    background-color: $surface-150;
    border-radius: 24px;
    padding: 12px 12px;
    display: flex;
    justify-content: space-between;
    gap: 4px;
    align-items: center;
    cursor: pointer;
  }
  &__title {
    font-size: 20px;
    font-weight: 200;
  }
  &__description {
    padding: 8px 16px;
  }
}

@media (max-width: 375px) {
  .accordion {
    &__title {
      font-size: 16px;
    }
  }
}
</style>
