<template>
  <section class="refund">
    <div class="refund__wrapper">
      <div class="refund__header">
        <h3 class="refund__title">Причина возврата</h3>
        <p class="refund__description">Выберите причину</p>
      </div>

      <div class="refund__checkboxs">
        <UiCheckbox
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
        ></UiCheckbox>
      </div>

      <UiTextarea placeholder="Напишите причину возврата"></UiTextarea>

      <UiButton
        @click="clickButton"
        class="refund__btn"
        label="Оформить возврат"
      ></UiButton>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep", "closeModal"]);
const options = [
  { label: "по цене", value: "price" },
  { label: "по популярности", value: "popularity" },
  { label: "по популярности", value: "popularity" },
  { label: "по отзывам", value: "popularity" },
  { label: "Другое", value: "popularity" },
];

const clickButton = () => {
  emit("closeModal");
  emit("nextStep");
};
</script>

<style lang="scss" scoped>
.refund {
  &__wrapper {
    margin: 0 auto;
    max-width: 327px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 40px 0;
  }
  &__title {
    font-size: 32px;
    color: $surface-900;
    margin-bottom: 8px;
    font-weight: 700;
  }
  &__description {
    font-size: 14px;
    color: $surface-900;
    font-weight: 400;
  }
  &__btn {
    display: flex;
    justify-content: center;
    padding: 12px;
    background-color: $blue-500;
    color: $white;
  }
  &__checkboxs {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
